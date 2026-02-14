import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { useCognitiveAssistant } from '../../hooks/useCognitiveAssistant';

const CameraLens = ({ position }) => (
    <mesh position={position}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#111" roughness={0} metalness={1} />
    </mesh>
);

const Hotspot = ({ position, label, info, onSelect }) => {
    return (
        <Html position={position} center distanceFactor={6}>
            <button
                onClick={(e) => { e.stopPropagation(); onSelect(label, info); }}
                className="group relative flex items-center justify-center p-2"
            >
                <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border border-white shadow-lg"></span>
            </button>
        </Html>
    );
};

const AccessiblePhone = ({
    color = '#262626',
    modelName = '',
    cameraCount = 1,
    isUltra = false,
    roughness = 0.5,
    metalness = 0.5
}) => {
    const { notifyPart } = useCognitiveAssistant();
    const phoneRef = useRef();

    // Escala dinamica segun si es "Ultra"
    const scale = isUltra ? [1.1, 1.1, 1] : [1, 1, 1];
    const bodyArgs = isUltra ? [2.0, 3.8, 0.22] : [1.8, 3.5, 0.2];

    useFrame((state) => {
        if (phoneRef.current) {
            phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group ref={phoneRef} scale={scale}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Cuerpo del telefono */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={bodyArgs} />
                    <meshStandardMaterial
                        color={color}
                        roughness={roughness}
                        metalness={metalness}
                    />

                    {/* Modulo de Camaras Dinamico (Parte trasera/visible segun rotacion o transparencia) */}
                    {/* Aqui lo ponemos en la superficie frontal para que el usuario lo vea al "generarse" */}
                    <group position={[-0.4, 1.2, 0.11]}>
                        {Array.from({ length: cameraCount }).map((_, i) => (
                            <CameraLens key={i} position={[(i % 2) * 0.35, -Math.floor(i / 2) * 0.35, 0]} />
                        ))}
                    </group>

                    <Hotspot
                        position={[0, 1.2, 0.15]}
                        label="Módulo de Cámaras"
                        info={`Sistema de ${cameraCount} lentes. Utiliza metales preciosos para los sensores.`}
                        onSelect={notifyPart}
                    />
                    <Hotspot
                        position={[0, -1.0, 0.15]}
                        label="Batería de Alta Densidad"
                        info="Litio ionizado. Componente con mayor huella de carbono en la producción."
                        onSelect={notifyPart}
                    />
                </mesh>

                {/* Pantalla */}
                <mesh position={[0, 0, 0.12]}>
                    <planeGeometry args={[bodyArgs[0] - 0.2, bodyArgs[1] - 0.2]} />
                    <meshStandardMaterial color="#050505" />
                </mesh>
            </Float>
        </group>
    );
};

export default AccessiblePhone;
