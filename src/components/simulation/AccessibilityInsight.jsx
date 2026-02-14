import React from 'react';
import { FaUniversalAccess, FaBrain, FaWaveSquare } from 'react-icons/fa';

const AccessibilityInsight = () => {
    return (
        <div className="mt-8 p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                    <FaUniversalAccess className="text-xl" />
                </div>
                <div>
                    <h3 className="text-xl font-bold italic">Diseño para la Neurodiversidad</h3>
                    <p className="text-sm text-white/50">Accesibilidad Cognitiva en Entornos 3D</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                        <FaBrain />
                        <span>Reducción de Carga Cognitiva</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                        Nuestros entornos 3D utilizan **iluminación de bajo contraste** y **fondos neutros** para evitar la sobreestimulación sensorial.
                        Implementamos el principio de *revelación progresiva*, donde la información técnica se entrega a demanda y mediante múltiples canales.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                        <FaWaveSquare />
                        <span>Sistemas de Asistecia Dual</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                        Combinamos **guías visuales pulsantes** (anchors) con **asistencia auditiva (TTS)**.
                        Esto permite que el usuario comprenda la complejidad técnica del hardware sin depender exclusivamente del procesamiento de texto denso, facilitando la exploración autónoma.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityInsight;
