import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { useCognitiveAssistant } from '../../hooks/useCognitiveAssistant';

const Hotspot = ({ position, label, info, onSelect }) => {
    return (
        <Html position={position} center distanceFactor={6}>
            <button
                onClick={(e) => { e.stopPropagation(); onSelect(label, info); }}
                className="group relative flex items-center justify-center p-2"
            >
                <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500 border border-white shadow-lg"></span>
            </button>
        </Html>
    );
};

const AccessibleLaptop = ({
    color = '#475569',
    modelName = '',
    isPro = false,
    isUltra = false // Usado para laptops Gaming/Gruesas
}) => {
    const { notifyPart } = useCognitiveAssistant();
    const laptopRef = useRef();

    // Dimensiones dinamicas
    const bodyThickness = isUltra ? 0.3 : 0.15;
    const screenThickness = isPro ? 0.05 : 0.1;

    useFrame((state) => {
        if (laptopRef.current) {
            laptopRef.current.rotation.x = -Math.PI / 10 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <group ref={laptopRef} position={[0, -0.5, 0]}>
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
                {/* Pantalla Superior */}
                <mesh position={[0, 1.1, -0.6]} rotation={[-Math.PI / 1.6, 0, 0]}>
                    <boxGeometry args={[3.2, 2.2, screenThickness]} />
                    <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />

                    {/* Logo simulado */}
                    <mesh position={[0, 0, screenThickness / 2 + 0.01]}>
                        <circleGeometry args={[0.2, 32]} />
                        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
                    </mesh>

                    <Hotspot
                        position={[0, 0, 0.1]}
                        label="Monitor Retina/IPS"
                        info={`Pantalla optimizada para ${modelName}. Consume 40W de energía en brillo máximo.`}
                        onSelect={notifyPart}
                    />
                </mesh>

                {/* Base / Teclado */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[3.2, bodyThickness, 2.2]} />
                    <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />

                    {/* Area de teclado */}
                    <mesh position={[0, bodyThickness / 2 + 0.01, -0.2]}>
                        <planeGeometry args={[2.8, 1.2]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>

                    <Hotspot
                        position={[0, 0.1, 0.5]}
                        label="Procesador y Almacenamiento"
                        info="Contiene Tierras Raras. Su reciclaje recupera hasta 98% del cobre."
                        onSelect={notifyPart}
                    />
                </mesh>
            </Float>
        </group>
    );
};

export default AccessibleLaptop;
