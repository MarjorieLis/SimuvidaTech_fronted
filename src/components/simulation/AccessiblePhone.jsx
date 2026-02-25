import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox, Text } from '@react-three/drei';
import { useCognitiveAssistant } from '../../hooks/useCognitiveAssistant';

/* ─── Componentes reutilizables ──────────────────────────────────────────── */
const CameraLens = ({ position, size = 0.12 }) => (
    <group position={position}>
        <mesh><cylinderGeometry args={[size, size, 0.04, 32]} /><meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} /></mesh>
        <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[size * 0.7, size * 0.7, 0.02, 32]} /><meshStandardMaterial color="#0a0a2e" metalness={0} roughness={0} transparent opacity={0.85} /></mesh>
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[size * 0.4, size * 0.4, 0.005, 32]} /><meshStandardMaterial color="#4488ff" emissive="#2244aa" emissiveIntensity={0.5} transparent opacity={0.6} /></mesh>
    </group>
);

const Flash = ({ position }) => (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
        <meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={0.8} />
    </mesh>
);

/* ─── Módulos de cámara por marca/estilo ──────────────────────────────── */

// Apple: cuadrado con lentes en triángulo/cuadrado
const AppleCameraModule = ({ count, isUltra }) => {
    const s = isUltra ? 0.75 : 0.6;
    const positions = count >= 4
        ? [[0, 0, 0], [0.22, 0, 0], [0, -0.22, 0], [0.22, -0.22, 0]]
        : count >= 3
            ? [[0, 0, 0], [0.22, 0, 0], [0.11, -0.22, 0]]
            : count >= 2
                ? [[0, 0.08, 0], [0, -0.14, 0]]
                : [[0, 0, 0]];
    return (
        <group>
            <RoundedBox args={[s, s, 0.03]} radius={0.08} smoothness={4}>
                <meshStandardMaterial color="#111" metalness={0.95} roughness={0.05} />
            </RoundedBox>
            {positions.map((pos, i) => <CameraLens key={i} position={pos} size={0.11} />)}
            <Flash position={[s / 2 - 0.08, s / 2 - 0.08, 0.018]} />
        </group>
    );
};

// Samsung S: lentes individuales sin isla (estilo S24)
const SamsungCameraModule = ({ count }) => {
    const positions = count >= 4
        ? [[0, 0.45, 0], [0, 0.15, 0], [0, -0.15, 0], [0, -0.45, 0]]
        : count >= 3
            ? [[0, 0.3, 0], [0, 0, 0], [0, -0.3, 0]]
            : [[0, 0.12, 0], [0, -0.12, 0]];
    return (
        <group>
            {positions.map((pos, i) => (
                <group key={i} position={pos}>
                    <mesh><cylinderGeometry args={[0.16, 0.16, 0.04, 32]} /><meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} /></mesh>
                    <CameraLens position={[0, 0, 0]} size={0.1} />
                </group>
            ))}
            <Flash position={[0.25, -0.15, 0.018]} />
        </group>
    );
};

// Google Pixel: barra horizontal
const PixelCameraModule = ({ count, W }) => (
    <group>
        <RoundedBox args={[W * 0.85, 0.35, 0.04]} radius={0.06} smoothness={4}>
            <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
            <CameraLens key={i} position={[(i - 1) * 0.25, 0, 0]} size={0.1} />
        ))}
        <Flash position={[0.45, 0, 0.02]} />
    </group>
);

// Xiaomi/Genérico: isla rectangular vertical
const GenericCameraModule = ({ count }) => {
    const h = count >= 3 ? 0.9 : 0.6;
    const positions = count >= 4
        ? [[0, 0.25, 0], [0, 0, 0], [0, -0.25, 0], [0.2, 0.12, 0]]
        : count >= 3
            ? [[0, 0.2, 0], [0, -0.05, 0], [0, -0.3, 0]]
            : [[0, 0.1, 0], [0, -0.15, 0]];
    return (
        <group>
            <RoundedBox args={[0.45, h, 0.03]} radius={0.07} smoothness={4}>
                <meshStandardMaterial color="#111" metalness={0.95} roughness={0.05} />
            </RoundedBox>
            {positions.map((pos, i) => <CameraLens key={i} position={pos} size={0.09} />)}
            <Flash position={[0.12, h / 2 - 0.1, 0.018]} />
        </group>
    );
};

// Huawei/Honor: isla circular grande
const HuaweiCameraModule = ({ count }) => {
    const r = count >= 4 ? 0.42 : 0.36;
    const positions = count >= 4
        ? [[0, 0.14, 0], [0.14, -0.05, 0], [-0.14, -0.05, 0], [0, -0.18, 0]]
        : count >= 3
            ? [[0, 0.13, 0], [-0.13, -0.1, 0], [0.13, -0.1, 0]]
            : [[0, 0.08, 0], [0, -0.12, 0]];
    return (
        <group>
            <mesh><cylinderGeometry args={[r, r, 0.035, 32]} /><meshStandardMaterial color="#111" metalness={0.95} roughness={0.05} /></mesh>
            {positions.map((pos, i) => <CameraLens key={i} position={pos} size={0.09} />)}
            <Flash position={[0, -r + 0.08, 0.02]} />
        </group>
    );
};

// OnePlus: isla rectangular con esquinas redondeadas
const OnePlusCameraModule = ({ count }) => {
    const h = count >= 3 ? 0.85 : 0.6;
    const positions = count >= 4
        ? [[0, 0.25, 0], [0, 0, 0], [0, -0.25, 0], [0, -0.42, 0]]
        : count >= 3
            ? [[0, 0.22, 0], [0, -0.02, 0], [0, -0.26, 0]]
            : [[0, 0.12, 0], [0, -0.12, 0]];
    return (
        <group>
            <RoundedBox args={[0.48, h, 0.03]} radius={0.12} smoothness={4}>
                <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
            </RoundedBox>
            {positions.map((pos, i) => <CameraLens key={i} position={pos} size={0.1} />)}
            <Flash position={[0.15, h / 2 - 0.1, 0.018]} />
        </group>
    );
};

// Motorola: isla circular centrada en parte superior
const MotoCameraModule = ({ count }) => {
    const r = count >= 3 ? 0.38 : 0.3;
    const positions = count >= 3
        ? [[0, 0.1, 0], [-0.1, -0.12, 0], [0.1, -0.12, 0]]
        : [[0, 0.08, 0], [0, -0.12, 0]];
    return (
        <group>
            <mesh><cylinderGeometry args={[r, r, 0.03, 32]} /><meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} /></mesh>
            {positions.map((pos, i) => <CameraLens key={i} position={pos} size={0.09} />)}
            <Flash position={[0, -r + 0.06, 0.018]} />
        </group>
    );
};

/* ─── Teléfono Flip ──────────────────────────────────────────────────────── */
const FlipPhone = ({ color, metalness, roughness, cameras, modelName }) => (
    <group>
        <RoundedBox args={[1.0, 1.1, 0.09]} radius={0.1} smoothness={4} position={[0, 0.58, 0]} castShadow>
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </RoundedBox>
        <mesh position={[0, 0.58, 0.05]}><planeGeometry args={[0.88, 0.95]} /><meshStandardMaterial color="#020408" roughness={0.02} /></mesh>
        <mesh position={[0, 0.58, 0.055]}><planeGeometry args={[0.8, 0.87]} /><meshStandardMaterial color="#0a1520" emissive="#0a2535" emissiveIntensity={0.5} transparent opacity={0.9} /></mesh>
        {modelName && <Text position={[0, 0.58, 0.06]} fontSize={0.06} color="#6ee7b7" anchorX="center" anchorY="middle">{modelName}</Text>}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 1.05, 16]} /><meshStandardMaterial color="#888" metalness={0.95} roughness={0.05} /></mesh>
        <RoundedBox args={[1.0, 1.1, 0.09]} radius={0.1} smoothness={4} position={[0, -0.58, 0]} castShadow>
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </RoundedBox>
        <group position={[-0.15, -0.35, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
            {Array.from({ length: Math.min(cameras, 2) }).map((_, i) => <CameraLens key={i} position={[i * 0.28, 0, 0]} />)}
        </group>
    </group>
);

/* ─── Teléfono Fold ──────────────────────────────────────────────────────── */
const FoldPhone = ({ color, metalness, roughness, modelName }) => (
    <group scale={[0.8, 0.8, 0.8]}>
        <RoundedBox args={[1.0, 2.2, 0.12]} radius={0.12} smoothness={4} castShadow>
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </RoundedBox>
        <mesh position={[0, 0, 0.07]}><planeGeometry args={[0.88, 2.0]} /><meshStandardMaterial color="#020408" roughness={0.02} /></mesh>
        <mesh position={[0, 0, 0.075]}><planeGeometry args={[0.8, 1.9]} /><meshStandardMaterial color="#0a1520" emissive="#0a2535" emissiveIntensity={0.4} transparent opacity={0.9} /></mesh>
        {modelName && <Text position={[0, 0, 0.08]} fontSize={0.07} color="#6ee7b7" anchorX="center" anchorY="middle">{modelName}</Text>}
        <RoundedBox args={[1.05, 2.2, 0.06]} radius={0.1} smoothness={4} position={[-1.1, 0, -0.03]} castShadow>
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </RoundedBox>
        <mesh position={[-1.1, 0, 0.005]}><planeGeometry args={[0.93, 2.0]} /><meshStandardMaterial color="#0a1520" emissive="#0a2535" emissiveIntensity={0.3} transparent opacity={0.85} /></mesh>
        <mesh position={[-0.52, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 2.2, 16]} /><meshStandardMaterial color="#666" metalness={0.95} roughness={0.05} /></mesh>
    </group>
);

/* ─── Determinar tipo de módulo de cámara según marca ──────────────────── */
const getBrand = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('iphone') || n.includes('apple')) return 'apple';
    if (n.includes('samsung') || n.includes('galaxy')) return 'samsung';
    if (n.includes('pixel') || n.includes('google')) return 'pixel';
    if (n.includes('huawei') || n.includes('honor')) return 'huawei';
    if (n.includes('oneplus')) return 'oneplus';
    if (n.includes('motorola') || n.includes('moto ') || n.includes('razr')) return 'moto';
    if (n.includes('xiaomi') || n.includes('redmi') || n.includes('poco')) return 'xiaomi';
    if (n.includes('oppo') || n.includes('vivo') || n.includes('realme')) return 'xiaomi';
    return 'generic';
};

/* ═══════════════════════════════════════════════════════════════════════════ */
const AccessiblePhone = ({
    color = '#252525', modelName = '', cameraCount = 2,
    isUltra = false, roughness = 0.15, metalness = 0.8,
    form = 'standard',
}) => {
    const { notifyPart } = useCognitiveAssistant();
    const phoneRef = useRef();
    const brand = getBrand(modelName);

    const isMini = form === 'mini';
    const isFlip = form === 'flip';
    const isFold = form === 'fold';
    const isUltraForm = isUltra || form === 'ultra';

    // Proporciones por combinación marca+variante
    const W = isMini ? 0.88 : isUltraForm ? 1.25 : brand === 'pixel' ? 1.0 : 1.1;
    const H = isMini ? 1.9 : isUltraForm ? 2.6 : brand === 'pixel' ? 2.3 : 2.4;
    const D = isMini ? 0.08 : isUltraForm ? 0.13 : 0.1;
    const R = brand === 'samsung' ? 0.18 : brand === 'pixel' ? 0.16 : brand === 'huawei' ? 0.15 : brand === 'oneplus' ? 0.14 : 0.12;

    useFrame(() => { if (phoneRef.current) phoneRef.current.rotation.y += 0.008; });

    if (isFlip) return <group ref={phoneRef}><FlipPhone color={color} metalness={metalness} roughness={roughness} cameras={cameraCount} modelName={modelName} /></group>;
    if (isFold) return <group ref={phoneRef}><FoldPhone color={color} metalness={metalness} roughness={roughness} modelName={modelName} /></group>;

    // Posición del módulo de cámara según marca
    const camModulePos = brand === 'pixel'
        ? [0, H / 2 - 0.25, -D / 2 - 0.02]
        : brand === 'samsung'
            ? [-W / 2 + 0.25, H / 2 - 0.65, -D / 2 - 0.02]
            : brand === 'huawei'
                ? [-W / 2 + 0.42, H / 2 - 0.5, -D / 2 - 0.02]
                : brand === 'moto'
                    ? [0, H / 2 - 0.45, -D / 2 - 0.02]
                    : brand === 'oneplus'
                        ? [-W / 2 + 0.35, H / 2 - 0.55, -D / 2 - 0.02]
                        : [-W / 2 + 0.38, H / 2 - 0.48, -D / 2 - 0.02];

    return (
        <group ref={phoneRef}>
            {/* Cuerpo */}
            <RoundedBox args={[W, H, D]} radius={R} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} envMapIntensity={1.5} />
            </RoundedBox>

            {/* Pantalla */}
            <RoundedBox args={[W - 0.06, H - 0.1, 0.005]} radius={R - 0.03} smoothness={4} position={[0, 0, D / 2 + 0.003]}>
                <meshStandardMaterial color="#020408" roughness={0.02} />
            </RoundedBox>
            <mesh position={[0, -0.05, D / 2 + 0.007]}>
                <planeGeometry args={[W - 0.12, H - 0.2]} />
                <meshStandardMaterial color="#080e18" emissive="#0a2540" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>

            {/* Nombre del modelo en pantalla */}
            {modelName && (
                <Text position={[0, 0.15, D / 2 + 0.012]} fontSize={0.07} color="#6ee7b7" anchorX="center" anchorY="middle" maxWidth={W - 0.2}>
                    {modelName}
                </Text>
            )}
            {/* Logo marca */}
            <Text position={[0, -0.15, D / 2 + 0.012]} fontSize={0.05} color="#ffffff40" anchorX="center" anchorY="middle">
                {brand === 'apple' ? '🍎' : brand === 'samsung' ? 'Samsung' : brand === 'pixel' ? 'Google' : brand === 'huawei' ? 'Honor' : brand === 'oneplus' ? 'OnePlus' : brand === 'moto' ? 'Moto' : brand === 'xiaomi' ? 'Xiaomi' : '📱'}
            </Text>

            {/* Notch / Dynamic Island / Pinhole según marca */}
            {brand === 'apple' ? (
                <mesh position={[0, H / 2 - 0.13, D / 2 + 0.009]}>
                    <capsuleGeometry args={[0.035, 0.1, 4, 16]} /><meshStandardMaterial color="#050505" />
                </mesh>
            ) : (brand === 'samsung' || brand === 'huawei' || brand === 'oneplus' || brand === 'moto') ? (
                <mesh position={[0, H / 2 - 0.1, D / 2 + 0.009]}>
                    <sphereGeometry args={[0.03, 16, 16]} /><meshStandardMaterial color="#050505" />
                </mesh>
            ) : null}

            {/* Módulo de cámaras (distinto por marca) */}
            <group position={camModulePos} rotation={brand === 'pixel' ? [0, 0, 0] : [Math.PI / 2, 0, 0]}>
                {brand === 'apple' && <AppleCameraModule count={cameraCount} isUltra={isUltraForm} />}
                {brand === 'samsung' && <SamsungCameraModule count={cameraCount} />}
                {brand === 'pixel' && <PixelCameraModule count={cameraCount} W={W} />}
                {brand === 'huawei' && <HuaweiCameraModule count={cameraCount} />}
                {brand === 'oneplus' && <OnePlusCameraModule count={cameraCount} />}
                {brand === 'moto' && <MotoCameraModule count={cameraCount} />}
                {brand === 'xiaomi' && <GenericCameraModule count={cameraCount} />}
                {brand === 'generic' && <GenericCameraModule count={cameraCount} />}
            </group>

            {/* Botones laterales */}
            <mesh position={[W / 2 + 0.008, 0.2, 0]}><boxGeometry args={[0.015, 0.25, 0.06]} /><meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[-W / 2 - 0.008, 0.35, 0]}><boxGeometry args={[0.015, 0.18, 0.06]} /><meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[-W / 2 - 0.008, 0.1, 0]}><boxGeometry args={[0.015, 0.18, 0.06]} /><meshStandardMaterial color="#1c1c1c" metalness={0.8} roughness={0.2} /></mesh>

            {/* Puerto de carga */}
            <mesh position={[0, -H / 2 + 0.04, D / 2]}><boxGeometry args={[0.12, 0.02, 0.005]} /><meshStandardMaterial color="#0a0a0a" metalness={0.8} /></mesh>

            {/* Hotspots */}
            <Html position={[0, H / 2 - 0.5, D / 2 + 0.3]} center distanceFactor={6}>
                <button onClick={() => notifyPart("Cámaras", `${cameraCount} lentes con sensores de metales preciosos.`)} className="group relative flex items-center justify-center p-2">
                    <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                </button>
            </Html>
            <Html position={[0, -H / 2 + 0.5, D / 2 + 0.3]} center distanceFactor={6}>
                <button onClick={() => notifyPart("Batería", "Litio ionizado. Mayor huella de carbono.")} className="group relative flex items-center justify-center p-2">
                    <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                </button>
            </Html>
        </group>
    );
};

export default AccessiblePhone;
