import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox, Text } from '@react-three/drei';
import { useCognitiveAssistant } from '../../hooks/useCognitiveAssistant';

/* ─── Hotspot interactivo ───────────────────────────────────────────────── */
const Hotspot = ({ position, label, info, onSelect }) => (
    <Html position={position} center distanceFactor={6}>
        <button
            onClick={(e) => { e.stopPropagation(); onSelect(label, info); }}
            className="group relative flex items-center justify-center p-2"
        >
            <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500 border border-white shadow-lg" />
        </button>
    </Html>
);

const AccessibleLaptop = ({
    color = '#b0b8c1',
    modelName = '',
    isPro = false,
    isUltra = false,
    screenGlow = '#0d2340',
    form = 'ultrabook',
}) => {
    const { notifyPart } = useCognitiveAssistant();
    const laptopRef = useRef();

    // Dimensiones según tipo
    const isGaming = form === 'gaming';
    const BW = isGaming ? 3.8 : 3.4;
    const BD = isGaming ? 2.6 : 2.3;
    const BH = isGaming ? 0.28 : isUltra ? 0.22 : 0.13;
    const SW = BW;
    const SH = isPro ? 2.4 : 2.15;
    const ST = 0.05;

    useFrame(() => {
        if (laptopRef.current) laptopRef.current.rotation.y += 0.006;
    });

    return (
        <group ref={laptopRef} position={[0, -0.3, 0]} rotation={[-0.15, 0, 0]}>

            {/* ═══ BASE ═══════════════════════════════════════════════════ */}
            <RoundedBox args={[BW, BH, BD]} radius={0.06} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color={color} metalness={0.88} roughness={0.12} envMapIntensity={1.2} />
            </RoundedBox>

            {/* Zona oscura del teclado */}
            <mesh position={[0, BH / 2 + 0.002, -0.15]}>
                <planeGeometry args={[BW - 0.25, BD * 0.55]} />
                <meshStandardMaterial color="#111113" roughness={0.8} />
            </mesh>

            {/* Teclado — bloques simplificados que parecen filas de teclas */}
            {[0.42, 0.28, 0.14, 0.0].map((z, rowIdx) => (
                <mesh key={rowIdx} position={[0, BH / 2 + 0.006, -z - 0.12]}>
                    <boxGeometry args={[BW - 0.45, 0.008, 0.08]} />
                    <meshStandardMaterial color="#1a1a1e" metalness={0.2} roughness={0.7} />
                </mesh>
            ))}

            {/* Barra espaciadora */}
            <mesh position={[0, BH / 2 + 0.006, 0.38]}>
                <boxGeometry args={[1.2, 0.008, 0.06]} />
                <meshStandardMaterial color="#1a1a1e" metalness={0.2} roughness={0.7} />
            </mesh>

            {/* Trackpad */}
            <RoundedBox args={[0.9, 0.004, 0.6]} radius={0.02} smoothness={2} position={[0, BH / 2 + 0.003, 0.72]}>
                <meshStandardMaterial color="#1e1e22" roughness={0.05} metalness={0.3} />
            </RoundedBox>

            {/* Puertos laterales */}
            {[-1, 1].map((side) => (
                <mesh key={side} position={[side * (BW / 2 + 0.001), 0, -0.3]}>
                    <boxGeometry args={[0.008, BH * 0.35, 0.1]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
                </mesh>
            ))}

            {/* ═══ PANTALLA ═══════════════════════════════════════════════ */}
            <group position={[0, BH / 2, -BD / 2 + 0.04]} rotation={[-Math.PI / 1.55, 0, 0]}>
                {/* Tapa exterior */}
                <RoundedBox args={[SW, SH, ST]} radius={0.05} smoothness={4} castShadow>
                    <meshStandardMaterial color={color} metalness={0.88} roughness={0.12} envMapIntensity={1.2} />
                </RoundedBox>

                {/* Bisel interior */}
                <mesh position={[0, 0, ST / 2 + 0.002]}>
                    <boxGeometry args={[SW - 0.04, SH - 0.04, 0.003]} />
                    <meshStandardMaterial color="#0a0a0d" roughness={0.9} />
                </mesh>

                {/* Panel de pantalla */}
                <mesh position={[0, 0, ST / 2 + 0.005]}>
                    <planeGeometry args={[SW - 0.2, SH - 0.2]} />
                    <meshStandardMaterial color="#030810" roughness={0.0} metalness={0.0} transparent opacity={0.95} />
                </mesh>

                {/* Brillo de pantalla encendida */}
                <mesh position={[0, 0, ST / 2 + 0.008]}>
                    <planeGeometry args={[SW - 0.22, SH - 0.22]} />
                    <meshStandardMaterial color="#080e18" emissive={screenGlow} emissiveIntensity={0.6} transparent opacity={0.85} />
                </mesh>

                {/* Nombre del modelo en pantalla */}
                {modelName && (
                    <Text position={[0, 0.15, ST / 2 + 0.012]} fontSize={0.12} color="#6ee7b7" anchorX="center" anchorY="middle" maxWidth={SW - 0.5}>
                        {modelName}
                    </Text>
                )}
                <Text position={[0, -0.15, ST / 2 + 0.012]} fontSize={0.08} color="#ffffff30" anchorX="center" anchorY="middle">
                    SimuVidaTech
                </Text>

                {/* Logo en tapa trasera */}
                <mesh position={[0, 0.1, -ST / 2 - 0.002]}>
                    <circleGeometry args={[isGaming ? 0.3 : 0.2, 32]} />
                    <meshStandardMaterial
                        color={isGaming ? "#00ff44" : "white"}
                        emissive={isGaming ? "#00ff44" : "white"}
                        emissiveIntensity={isGaming ? 1.5 : 0.5}
                        transparent opacity={0.9}
                    />
                </mesh>

                {/* Líneas decorativas tipo gaming */}
                {isGaming && (
                    <>
                        <mesh position={[-SW / 2 + 0.08, 0, -ST / 2 - 0.002]}>
                            <boxGeometry args={[0.02, SH * 0.6, 0.001]} />
                            <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={2} />
                        </mesh>
                        <mesh position={[SW / 2 - 0.08, 0, -ST / 2 - 0.002]}>
                            <boxGeometry args={[0.02, SH * 0.6, 0.001]} />
                            <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={2} />
                        </mesh>
                    </>
                )}

                {/* Cámara web */}
                <mesh position={[0, SH / 2 - 0.07, ST / 2 + 0.003]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={0.9} />
                </mesh>

                <Hotspot position={[0, 0, 0.3]} label="Monitor" info={`Pantalla para ${modelName}. Consume ~40W en brillo máximo.`} onSelect={notifyPart} />
            </group>

            {/* ═══ BISAGRA ════════════════════════════════════════════════ */}
            <mesh position={[0, BH / 2 + 0.01, -BD / 2 + 0.04]}>
                <cylinderGeometry args={[0.035, 0.035, BW - 0.5, 16, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#666" metalness={0.95} roughness={0.05} />
            </mesh>

            <Hotspot position={[0, BH / 2 + 0.5, 0.5]} label="Procesador" info="Contiene Tierras Raras. Su reciclaje recupera hasta 98% del cobre." onSelect={notifyPart} />
        </group>
    );
};

export default AccessibleLaptop;
