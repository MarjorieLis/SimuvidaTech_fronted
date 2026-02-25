import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

/**
 * ThreeScene — Escena 3D mejorada con iluminación realista,
 * entorno HDR para reflexiones metálicas, y controles de órbita manuales.
 */
const ThreeScene = ({ children }) => {
    return (
        <div className="w-full h-full min-h-[350px] relative rounded-3xl overflow-hidden bg-[#060c14] border border-white/8 shadow-inner">
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 2.2, 5], fov: 40 }}
                gl={{ antialias: true, alpha: false }}
            >
                {/* Iluminación ambiental */}
                <ambientLight intensity={0.45} color="#c8d8f0" />

                {/* Luz principal (key light) */}
                <directionalLight
                    position={[4, 8, 5]}
                    intensity={2.5}
                    color="#ffffff"
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    shadow-bias={-0.001}
                />

                {/* Luz de relleno (fill light) desde la izquierda */}
                <directionalLight
                    position={[-5, 3, 2]}
                    intensity={0.8}
                    color="#a0c8ff"
                />

                {/* Luz de contorno (rim light) desde atrás */}
                <directionalLight
                    position={[0, -2, -6]}
                    intensity={1.2}
                    color="#40e0a0"
                />

                {/* Entorno HDR para reflexiones */}
                <Environment preset="city" environmentIntensity={0.9} />

                {/* Sombra de contacto en el suelo */}
                <ContactShadows
                    position={[0, -2.8, 0]}
                    opacity={0.55}
                    scale={10}
                    blur={2.5}
                    far={5}
                    color="#000000"
                />

                <Suspense fallback={null}>
                    {children}
                </Suspense>

                {/* Controles de órbita — el usuario puede explorar el modelo */}
                <OrbitControls
                    enablePan={false}
                    minDistance={2.5}
                    maxDistance={9}
                    autoRotate={false}
                    enableDamping
                    dampingFactor={0.06}
                    makeDefault
                />
            </Canvas>

            {/* Etiqueta informativa */}
            <div className="absolute top-3 right-3 pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-semibold bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                    Vista 3D · Arrastra para explorar
                </span>
            </div>
        </div>
    );
};

export default ThreeScene;
