// src/components/admin/AdminVerifyDelivery.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaCheck, FaMobileAlt, FaLaptop, FaUser, FaCalendarAlt,
    FaCubes, FaShieldAlt, FaCheckCircle, FaExclamationTriangle,
    FaArrowLeft, FaSpinner, FaClock, FaRecycle
} from "react-icons/fa";
import api from "../../services/api";

function Card({ className = "", children }) {
    return (
        <div
            className={[
                "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
                "shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

function Pill({ className = "", children }) {
    return (
        <span
            className={[
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
                "bg-white/[0.04] border-white/10 text-white/70",
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}

export default function AdminVerifyDelivery() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    // Cargar datos de la entrega al montar
    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const res = await api.get(`/deliveries/verify/${token}`);
                setDelivery(res.data);
                if (res.data.status === 'verified') {
                    setConfirmed(true);
                }
            } catch (err) {
                console.error("Error al cargar entrega:", err);
                if (err.response?.status === 404) {
                    setError("Entrega no encontrada. El código QR puede ser inválido o haber expirado.");
                } else if (err.response?.status === 403) {
                    setError("Acceso denegado. Solo administradores pueden verificar entregas.");
                } else {
                    setError("Error al cargar los datos de la entrega.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDelivery();
    }, [token]);

    // Confirmar recepción
    const handleConfirm = async () => {
        if (confirming || confirmed) return;
        setConfirming(true);
        try {
            const res = await api.put(`/deliveries/verify/${token}`);
            setDelivery(res.data.delivery);
            setConfirmed(true);
        } catch (err) {
            console.error("Error al confirmar:", err);
            if (err.response?.status === 400) {
                setError("Esta entrega ya fue verificada anteriormente.");
                setConfirmed(true);
            } else {
                alert("Error al confirmar la recepción. Intenta nuevamente.");
            }
        } finally {
            setConfirming(false);
        }
    };

    // Estado de carga
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <p className="mt-4 text-white/70">Verificando código QR...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error && !delivery) {
        return (
            <div className="max-w-lg mx-auto mt-16">
                <Card className="p-8 text-center">
                    <FaExclamationTriangle className="text-4xl text-amber-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No se pudo verificar</h2>
                    <p className="text-white/60 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
              bg-white/[0.06] border border-white/10 text-white/80 hover:bg-white/[0.1] transition"
                    >
                        <FaArrowLeft className="text-sm" /> Volver al Dashboard
                    </button>
                </Card>
            </div>
        );
    }

    const DeviceIcon = delivery?.device_type === 'laptop' ? FaLaptop : FaMobileAlt;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm text-emerald-200/90 font-medium flex items-center gap-2">
                        <FaShieldAlt className="text-base" /> Verificación de entrega RAEE
                    </p>
                    <h1 className="mt-1 text-2xl md:text-3xl font-semibold">
                        {confirmed ? "Entrega verificada" : "Confirmar recepción"}
                    </h1>
                </div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 rounded-full text-sm font-semibold
            bg-white/[0.04] border border-white/10 text-white/80
            hover:bg-white/[0.06] hover:text-white transition"
                >
                    <FaArrowLeft className="inline mr-1 text-xs" /> Dashboard
                </button>
            </div>

            {/* Estado actual */}
            <div className={`mb-6 rounded-2xl border p-4 flex items-center gap-3 ${confirmed
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-amber-400/30 bg-amber-500/10"
                }`}>
                {confirmed ? (
                    <>
                        <FaCheckCircle className="text-2xl text-emerald-400 shrink-0" />
                        <div>
                            <p className="font-semibold text-emerald-200">✅ Recepción confirmada</p>
                            <p className="text-sm text-white/60">
                                Verificado el {delivery?.verified_at
                                    ? new Date(delivery.verified_at).toLocaleString("es-EC")
                                    : "ahora"}
                                {delivery?.verified_by_name && ` por ${delivery.verified_by_name}`}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <FaClock className="text-2xl text-amber-400 shrink-0" />
                        <div>
                            <p className="font-semibold text-amber-200">⏳ Pendiente de verificación</p>
                            <p className="text-sm text-white/60">
                                Verifica físicamente el dispositivo antes de confirmar.
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Datos del dispositivo y usuario */}
            <Card className="p-8 mb-6">
                <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                    <FaCubes className="text-emerald-300" /> Datos de la entrega
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dispositivo */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold text-emerald-200 mb-3 flex items-center gap-2">
                            <DeviceIcon className="text-base" /> Dispositivo
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">Tipo</span>
                                <span className="text-white/90 font-medium capitalize">{delivery?.device_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Modelo</span>
                                <span className="text-white/90 font-medium">{delivery?.device_model}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Año</span>
                                <span className="text-white/90 font-medium">{delivery?.device_year || "N/A"}</span>
                            </div>
                            {delivery?.materials && (
                                <div className="flex justify-between">
                                    <span className="text-white/50">Materiales</span>
                                    <span className="text-white/90 font-medium text-right max-w-[60%]">{delivery.materials}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Usuario */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold text-cyan-200 mb-3 flex items-center gap-2">
                            <FaUser className="text-base" /> Usuario
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">Nombre</span>
                                <span className="text-white/90 font-medium">{delivery?.user_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Email</span>
                                <span className="text-white/90 font-medium">{delivery?.user_email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Fecha de solicitud</span>
                                <span className="text-white/90 font-medium">
                                    {delivery?.created_at
                                        ? new Date(delivery.created_at).toLocaleString("es-EC")
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pills de info */}
                <div className="mt-5 flex flex-wrap gap-2">
                    <Pill className="border-emerald-400/20 bg-emerald-500/10 text-emerald-200">
                        <FaRecycle className="text-xs" /> Programa RAEE
                    </Pill>
                    <Pill className="border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
                        <FaCalendarAlt className="text-xs" />
                        {delivery?.created_at
                            ? new Date(delivery.created_at).toLocaleDateString("es-EC")
                            : ""}
                    </Pill>
                    <Pill className={
                        confirmed
                            ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                            : "border-amber-400/20 bg-amber-500/10 text-amber-200"
                    }>
                        {confirmed ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                        {confirmed ? "Verificado" : "Pendiente"}
                    </Pill>
                </div>
            </Card>

            {/* Botón de confirmación */}
            {!confirmed && (
                <Card className="p-8">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaShieldAlt className="text-emerald-300" /> Verificación física
                    </h2>
                    <p className="text-sm text-white/60 mb-6">
                        Confirma que has verificado físicamente el dispositivo y que coincide con los datos mostrados arriba.
                    </p>
                    <button
                        onClick={handleConfirm}
                        disabled={confirming}
                        className={`w-full inline-flex items-center justify-center gap-2
              rounded-xl font-semibold py-3.5 px-6 transition
              ${confirming
                                ? "bg-white/10 text-white/50 cursor-wait"
                                : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25"
                            }`}
                    >
                        {confirming ? (
                            <>
                                <FaSpinner className="text-base animate-spin" /> Confirmando...
                            </>
                        ) : (
                            <>
                                <FaCheck className="text-base" /> Confirmar recepción del dispositivo
                            </>
                        )}
                    </button>
                </Card>
            )}

            {/* Confirmación exitosa */}
            {confirmed && (
                <Card className="p-8 text-center border-emerald-400/20 bg-emerald-500/5">
                    <FaCheckCircle className="text-5xl text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">¡Recepción confirmada!</h2>
                    <p className="text-white/60 mb-2">
                        El dispositivo <strong className="text-white/90">{delivery?.device_model}</strong> de{" "}
                        <strong className="text-white/90">{delivery?.user_name}</strong> ha sido recibido.
                    </p>
                    <p className="text-sm text-white/50">
                        El usuario recibirá su certificado oficial automáticamente.
                    </p>
                </Card>
            )}
        </div>
    );
}
