import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';

/**
 * ThreeScene Component
 * Entorno 3D optimizado: Iluminacion suave, sin parpadeos y controles limitados 
 * para reducir la fatiga sensorial.
 */
const ThreeScene = ({ children }) => {
    return (
        <div className="w-full h-full min-h-[350px] relative rounded-3xl overflow-hidden bg-neutral-900/40 border border-white/5 shadow-inner">
            <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Stage
                        intensity={0.4}
                        environment="studio"
                        shadows="contact"
                        adjustCamera={true}
                    >
                        {children}
                    </Stage>

                    <OrbitControls
                        enablePan={false}
                        minDistance={3}
                        maxDistance={8}
                        autoRotate={false}
                        makeDefault
                    />
                </Suspense>
            </Canvas>

            <div className="absolute top-4 right-4 pointer-events-none opacity-40">
                <span className="text-[10px] uppercase tracking-tighter text-white font-medium">
                    Entorno de Exploración de Bajo Ruido
                </span>
            </div>
        </div>
    );
};

export default ThreeScene;
