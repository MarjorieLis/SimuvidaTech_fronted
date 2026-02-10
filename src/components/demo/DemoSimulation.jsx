import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaMobileAlt, 
  FaLaptop, 
  FaChartBar, 
  FaLightbulb, 
  FaRecycle, 
  FaBatteryFull, 
  FaGlobe, 
  FaHandshake, 
  FaBox, 
  FaHeart,
  FaCheckCircle,  
  FaCloud,        
  FaShareAlt,     
  FaLock          
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DemoSimulation() {
  const { type } = useParams(); 
  const navigate = useNavigate();
  
  // Estado: etapa actual del ciclo de vida (1-5)
  const [currentStage, setCurrentStage] = useState(1);
  
  // Estado: decisiones del usuario en etapas interactivas
  const [decisionUso, setDecisionUso] = useState('2 años'); // Etapa 3: duracion de uso
  const [decisionFin, setDecisionFin] = useState('reciclar'); // Etapa 5: fin de vida
  
  // Estado: impacto ambiental calculado (CO₂, agua, residuos + puntuacion)
  const [impact, setImpact] = useState({ CO2: 0, agua: 0, residuos: 0, score: 0 });

  // Datos predefinidos para cada tipo de dispositivo (base para calculos)
  const deviceData = {
    telefono: {
      name: "Samsung Galaxy A14",
      extraction: "50 kg de minerales extraídos",
      manufacturing: "80 L de agua usados en fábrica",
      transport: "12,000 km de transporte global",
      baseCO2: 150,
      baseAgua: 100,
      baseResiduos: 10
    },
    laptop: {
      name: "MacBook Air M2",
      extraction: "200 kg de minerales extraídos",
      manufacturing: "300 L de agua usados en fábrica",
      transport: "15,000 km de transporte global",
      baseCO2: 300,
      baseAgua: 200,
      baseResiduos: 20
    }
  };

  // Selecciona datos segun parametro de URL 
  const device = deviceData[type] || deviceData.telefono;

  // Calcula impacto ambiental en tiempo real segun decisiones del usuario
  useEffect(() => {
    let score = 70; 
    
    // Ajusta puntuacion segun duracion de uso
    if (decisionUso === "1 año") score -= 20;
    else if (decisionUso === "3+ años") score += 10;

    // Ajusta puntuacion segun decision de fin de vida
    if (decisionFin === "reciclar") score += 15;
    else if (decisionFin === "desechar") score -= 30;

    // Limita puntuacion entre 20 y 100
    const finalScore = Math.max(20, Math.min(100, score));
    
    // Calcula impacto proporcional al score (menor score = mayor impacto)
    setImpact({
      CO2: Math.round(device.baseCO2 * (120 - finalScore) / 70),
      agua: Math.round(device.baseAgua * (120 - finalScore) / 70),
      residuos: Math.round(device.baseResiduos * (120 - finalScore) / 70),
      score: finalScore
    });
  }, [decisionUso, decisionFin, type]); // Recalcula al cambiar decisiones o tipo

  // Definicion de etapas del ciclo de vida
  const stages = [
    { id: 1, title: "1. Extracción", content: device.extraction },
    { id: 2, title: "2. Fabricación", content: device.manufacturing },
    { id: 3, title: "3. Uso", content: "¿Cuánto tiempo usarás este dispositivo?" },
    { id: 4, title: "4. Transporte", content: device.transport },
    { id: 5, title: "5. Fin de vida", content: "¿Qué harás cuando ya no lo uses?" }
  ];

  // Etapa actual seleccionada
  const current = stages[currentStage - 1];

  // Navegacion entre etapas
  const handlePrev = () => {
    if (currentStage > 1) setCurrentStage(currentStage - 1);
  };

  const handleNext = () => {
    if (currentStage < 5) {
      setCurrentStage(currentStage + 1);
    } else {
      // Al completar simulacion, muestra mensaje y redirige
      alert("¡Simulación completada!\n\nPuedes explorar todos los detalles sin necesidad de registrarte.\n\n¿Quieres subir tu propio dispositivo? ¡Regístrate!");
    }
  };

  // Renderiza contenido especifico segun etapa actual
  const renderStageContent = () => {
    // Etapa 3: Selector de duracion de uso
    if (currentStage === 3) {
      return (
        <div className="space-y-3 mt-4">
          {["1 año", "2 años", "3+ años"].map((opt) => (
            <button
              key={opt}
              onClick={() => setDecisionUso(opt)}
              className={`w-full text-left p-3 rounded-xl transition ${
                decisionUso === opt
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                  : "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    
    // Etapa 5: Selector de fin de vida
    if (currentStage === 5) {
      return (
        <div className="space-y-3 mt-4">
          {[
            { value: "desechar", label: "Desechar" },
            { value: "donar", label: "Donar" },
            { value: "reciclar", label: "Reciclar" }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDecisionFin(opt.value)}
              className={`w-full text-left p-3 rounded-xl transition ${
                decisionFin === opt.value
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                  : "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }
    
    // Etapas 1, 2 y 4: texto informativo estatico
    return <p className="mt-4 text-white/70">{current.content}</p>;
  };

  // Genera recomendaciones personalizadas segun decision de fin de vida
  const getRecommendations = () => {
    if (decisionFin === 'desechar') {
      return [
        { icon: <FaLightbulb className="text-yellow-300" />, text: "Considera donar tu dispositivo. ¡Puede seguir siendo útil!" },
        { icon: <FaRecycle className="text-cyan-300" />, text: "Busca puntos de reciclaje autorizados en tu ciudad." },
        { icon: <FaBatteryFull className="text-amber-300" />, text: "Retira la batería antes de desechar. Es un residuo peligroso." }
      ];
    } else if (decisionFin === 'reciclar') {
      return [
        { icon: <FaCheckCircle className="text-emerald-300" />, text: "¡Excelente decisión! El reciclaje reduce el 80% de emisiones." },
        { icon: <FaCloud className="text-blue-300" />, text: "Guarda tus datos en la nube antes de entregar el dispositivo." },
        { icon: <FaShareAlt className="text-purple-300" />, text: "Comparte esta acción en redes para inspirar a otros." }
      ];
    }
    return [
      { icon: <FaHandshake className="text-emerald-300" />, text: "La donación extiende la vida útil del dispositivo." },
      { icon: <FaLock className="text-red-300" />, text: "Asegúrate de borrar todos tus datos personales antes de donar." },
      { icon: <FaHeart className="text-pink-300" />, text: "Muchas organizaciones aceptan dispositivos usados para educación." }
    ];
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-emerald-200/90 font-medium">Simulación demo</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-2">
              {type === 'telefono' ? (
                <>
                  <FaMobileAlt className="text-blue-400" /> Simulación: Teléfono
                </>
              ) : (
                <>
                  <FaLaptop className="text-purple-400" /> Simulación: Laptop
                </>
              )}
            </h1>
            <p className="mt-2 text-white/65">
              Dispositivo: <strong>{device.name}</strong>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver al inicio
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{current.title}</h2>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-200 border border-emerald-400/20">
                Etapa {currentStage} de 5
              </span>
            </div>

            {renderStageContent()}

            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStage === 1}
                className="px-4 py-2 rounded-lg text-white/70 disabled:opacity-30"
              >
                ← Anterior
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded-lg font-medium"
              >
                {currentStage < 5 ? "Siguiente →" : "Ver resultados"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FaChartBar className="text-emerald-300" /> Impacto ambiental
            </h2>

            {currentStage >= 3 && (
              <>
                <div className="mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">Puntuación ecológica</span>
                    <span className="text-emerald-300">{impact.score}/100</span>
                  </div>
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" 
                      style={{ width: `${impact.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">CO₂</span>
                    <span className="text-emerald-300">{impact.CO2} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Agua</span>
                    <span className="text-emerald-300">{impact.agua} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Residuos</span>
                    <span className="text-emerald-300">{impact.residuos} kg</span>
                  </div>
                </div>

                {currentStage === 5 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <FaLightbulb className="text-yellow-300" /> Recomendaciones:
                    </h3>
                    <ul className="text-sm space-y-3">
                      {getRecommendations().map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/10">
                          <span className="mt-1 flex-shrink-0">{rec.icon}</span>
                          <span className="text-white/85">{rec.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="h-48 min-h-[12rem] w-full min-w-[300px] mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'CO₂', value: impact.CO2 },
                      { name: 'Agua', value: impact.agua },
                      { name: 'Residuos', value: impact.residuos }
                    ]}>
                      <XAxis dataKey="name" stroke="#4ade80" />
                      <YAxis stroke="#4ade80" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#0e7490' }}
                        itemStyle={{ color: '#4ade80' }}
                      />
                      <Bar dataKey="value" fill="#0e7490" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}