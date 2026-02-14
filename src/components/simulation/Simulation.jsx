import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaIndustry, FaMobileAlt, FaTruck, FaRecycle,
  FaTrash, FaHandshake, FaWrench, FaChartBar
} from 'react-icons/fa';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeScene from './ThreeScene';
import AccessiblePhone from './AccessiblePhone';
import { useCognitiveAssistant } from '../../hooks/useCognitiveAssistant';

export default function Simulation() {
  // Estado del dispositivo y parámetros de simulación
  const [device, setDevice] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [yearsOfUse, setYearsOfUse] = useState(3);
  const [endOfLifeDecision, setEndOfLifeDecision] = useState('');
  const [impact, setImpact] = useState({ co2: 0, water: 0, raee: 0 });

  const { id } = useParams();
  const navigate = useNavigate();
  const { speak } = useCognitiveAssistant();

  // Narrador de etapas (Accesibilidad Cognitiva)
  useEffect(() => {
    if (device) {
      const stage = stages[currentStage];
      const message = `Etapa de ${stage.name}. ${currentStage === 0 ? "Aquí se extraen los minerales necesarios para tu dispositivo." :
          currentStage === 1 ? "En esta fase se ensamblan los componentes." :
            currentStage === 2 ? "Selecciona el tiempo de uso para calcular el impacto." :
              currentStage === 3 ? "Tu dispositivo viaja por todo el mundo hasta llegar a ti." :
                "Elige qué pasará con el dispositivo al final."
        }`;
      speak(message);
    }
  }, [currentStage, device]);

  // Definición de etapas del ciclo de vida con iconos de FontAwesome
  const stages = [
    { id: 'extraccion', name: 'Extracción', icon: <FaIndustry className="text-2xl text-emerald-400" /> },
    { id: 'fabricacion', name: 'Fabricación', icon: <FaIndustry className="text-2xl text-cyan-400" /> },
    { id: 'uso', name: 'Uso', icon: <FaMobileAlt className="text-2xl text-blue-400" /> },
    { id: 'transporte', name: 'Transporte', icon: <FaTruck className="text-2xl text-amber-400" /> },
    { id: 'finVida', name: 'Fin de vida', icon: <FaRecycle className="text-2xl text-green-400" /> }
  ];

  // Carga los datos del dispositivo al montar el componente
  useEffect(() => {
    const loadDevice = async () => {
      try {
        const res = await api.get(`/devices/${id}`);
        setDevice(res.data);
        calculateImpact(3, 'reciclar');
      } catch (err) {
        console.error('Error al cargar dispositivo:', err);
        navigate('/my-devices');
      }
    };
    loadDevice();
  }, [id, navigate]);

  // Calcula el impacto ambiental basado en años de uso y decisión de fin de vida
  // Maneja valores nulos para evitar NaN en los cálculos
  const calculateImpact = (years, decision) => {
    // Valores base con manejo de nulos y conversión segura
    const baseCo2 = device?.co2_impact != null ? parseFloat(device.co2_impact) : 50;
    const baseWater = device?.water_impact != null ? parseFloat(device.water_impact) : 1000;
    const baseRaee = device?.raee_impact != null ? parseFloat(device.raee_impact) : 2;

    // Cálculo de CO2 y agua: inversamente proporcional a los años de uso
    const co2 = parseFloat((baseCo2 * (5 / years)).toFixed(2)) || 0;
    const water = parseFloat((baseWater * (5 / years)).toFixed(2)) || 0;

    // Cálculo de RAEE: varía según la decisión de fin de vida
    const raee = decision === 'reciclar'
      ? baseRaee * 0.2
      : decision === 'donar'
        ? baseRaee * 0.5
        : decision === 'reparar'
          ? baseRaee * 0.3
          : baseRaee; // 'tirar' mantiene el impacto completo

    setImpact({ co2, water, raee });
  };

  // Avanza a la siguiente etapa de la simulación
  const handleNext = () => {
    // Recalcula impacto al salir de la etapa de uso (etapa 2)
    if (currentStage === 2) {
      calculateImpact(yearsOfUse, endOfLifeDecision || 'reciclar');
    }
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  // Retrocede a la etapa anterior
  const handlePrev = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  // Finaliza la simulación y navega a resultados con los datos calculados
  const handleFinish = () => {
    // Convierte años numéricos a texto legible para la vista de resultados
    const usoText = yearsOfUse === 1 ? "1 año" :
      yearsOfUse === 2 ? "2 años" :
        "3+ años";

    navigate(`/simulation/${id}/results`, {
      state: {
        years: usoText,
        decision: endOfLifeDecision,
        impact: {
          CO2: impact.co2,
          agua: impact.water,
          residuos: impact.raee
        }
      }
    });
  };

  // Pantalla de carga mientras se obtienen datos del dispositivo
  if (!device) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 to-cyan-900/10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-white">Cargando simulación...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 to-cyan-900/10 p-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between mb-2">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index === currentStage ? 1.2 : 1,
                opacity: index <= currentStage ? 1 : 0.5,
                color: index <= currentStage ? '#4ade80' : '#64748b'
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                if (index < currentStage) {
                  setCurrentStage(index);
                }
              }}
            >
              {stage.icon}
              <span className="text-sm mt-1 font-medium">{stage.name}</span>
            </motion.div>
          ))}
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
              <FaChartBar className="text-emerald-400" />
              {stages[currentStage].name}
            </h2>

            {currentStage === 2 && (
              <div className="space-y-4">
                <p className="text-white/80">¿Cuántos años usarás este dispositivo?</p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={yearsOfUse}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setYearsOfUse(val);
                    calculateImpact(val, endOfLifeDecision || 'reciclar');
                  }}
                  className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-3xl font-bold text-emerald-300">{yearsOfUse} año{yearsOfUse > 1 ? 's' : ''}</div>
              </div>
            )}

            {currentStage === 4 && (
              <div className="space-y-4">
                <p className="text-white/80">¿Qué harás al final de su vida útil?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'tirar', label: 'Desechar', icon: <FaTrash className="text-3xl" />, color: 'bg-red-500/20' },
                    { id: 'donar', label: 'Donar', icon: <FaHandshake className="text-3xl" />, color: 'bg-yellow-500/20' },
                    { id: 'reparar', label: 'Reparar', icon: <FaWrench className="text-3xl" />, color: 'bg-blue-500/20' },
                    { id: 'reciclar', label: 'Reciclar', icon: <FaRecycle className="text-3xl" />, color: 'bg-green-500/20' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        const cleanDecision = option.id.trim().toLowerCase();
                        setEndOfLifeDecision(cleanDecision);
                        calculateImpact(yearsOfUse, cleanDecision);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center
                        ${endOfLifeDecision === option.id
                          ? 'border-emerald-500 bg-emerald-500/30'
                          : 'border-white/20 hover:border-white/40'
                        } ${option.color}`}
                    >
                      {option.icon}
                      <div className="text-sm font-medium text-center mt-1">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStage !== 2 && currentStage !== 4 && (
              <div className="space-y-6">
                {/* Visualización 3D para Extracción y Fabricación */}
                {(currentStage === 0 || currentStage === 1) && (
                  <div className="h-64 sm:h-80 w-full mb-6 relative">
                    <ThreeScene>
                      <AccessiblePhone />
                    </ThreeScene>
                    <div className="absolute top-2 left-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30 text-[11px] font-bold text-emerald-300 animate-pulse">
                      VISTA TÉCNICA 3D
                    </div>
                  </div>
                )}

                <div className="text-white/70 py-4">
                  <p className="text-lg font-medium text-emerald-200 mb-2">
                    {currentStage === 0 && "Extracción de minerales y materias primas"}
                    {currentStage === 1 && "Proceso de fabricación y ensamblaje"}
                    {currentStage === 3 && "Transporte global hasta el punto de venta"}
                  </p>
                  <p className="text-sm italic leading-relaxed max-w-md mx-auto">
                    {currentStage === 0 && "Se requieren materiales como oro, litio y cobalto, cuya obtención tiene un alto costo ambiental y social."}
                    {currentStage === 1 && "El ensamblaje consume grandes cantidades de energía eléctrica y agua para la limpieza de componentes."}
                    {currentStage === 3 && "El transporte de mercancías contribuye significativamente a las emisiones globales de CO2 por el uso de combustibles fósiles."}
                  </p>
                </div>
              </div>
            )}

            {currentStage >= 2 && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10" style={{ minHeight: '80px' }}>
                <h3 className="font-semibold mb-2 flex items-center justify-center gap-1">
                  <FaChartBar className="text-emerald-400" />
                  Impacto ambiental estimado
                </h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-green-500/10 p-2 rounded text-xs">
                    <div className="font-medium">CO₂</div>
                    <div>{impact.co2.toFixed(1)} kg</div>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded text-xs">
                    <div className="font-medium">Agua</div>
                    <div>{impact.water.toLocaleString()} L</div>
                  </div>
                  <div className="bg-amber-500/10 p-2 rounded text-xs">
                    <div className="font-medium">RAEE</div>
                    <div>{impact.raee.toFixed(2)} kg</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStage === 0}
            className={`px-6 py-2 rounded-lg font-medium ${currentStage === 0
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30'
              }`}
          >
            ← Anterior
          </button>

          {currentStage === stages.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={!endOfLifeDecision}
              className={`px-6 py-2 rounded-lg font-medium ${endOfLifeDecision
                  ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-600'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
            >
              Ver resultados →
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-emerald-500 text-neutral-950 rounded-lg hover:bg-emerald-600 font-medium"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}