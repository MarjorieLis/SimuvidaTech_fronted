import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScanner({ onScan, onClose }) {
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                scanner.stop().then(() => {
                    onScan(decodedText);
                }).catch(() => { });
            },
            () => { } // ignore scan errors
        ).catch((err) => {
            setError("No se pudo acceder a la cámara. Verifica los permisos.");
            console.error("Camera error:", err);
        });

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-3xl border border-white/10 p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        📸 Escanear código QR
                    </h3>
                    <button
                        onClick={() => {
                            if (scannerRef.current?.isScanning) {
                                scannerRef.current.stop().catch(() => { });
                            }
                            onClose();
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-300 text-sm mb-3">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-sm hover:bg-white/20 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            id="qr-reader"
                            ref={containerRef}
                            className="rounded-2xl overflow-hidden"
                            style={{ width: '100%' }}
                        />
                        <p className="mt-3 text-center text-xs text-white/50">
                            Apunta la cámara al código QR del usuario
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
