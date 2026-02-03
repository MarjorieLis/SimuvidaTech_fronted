import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
  { id: 'extraccion', name: 'Extracción', icon: '⛏️' },
  { id: 'fabricacion', name: 'Fabricación', icon: '🏭' },
  { id: 'uso', name: 'Uso', icon: '📱' },
  { id: 'transporte', name: 'Transporte', icon: '🚚' },
  { id: 'finVida', name: 'Fin de vida', icon: '♻️' }
];

export default function Simulation() {
  const [device, setDevice] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [yearsOfUse, setYearsOfUse] = useState(3);
  const [endOfLifeDecision, setEndOfLifeDecision] = useState('');
  const [impact, setImpact] = useState({ co2: 0, water: 0, raee: 0 });
  const { id } = useParams();
  const navigate = useNavigate();

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
  }, [id]);

  // ✅ CORRECCIÓN CLAVE: manejar valores nulos y evitar NaN
  const calculateImpact = (years, decision) => {
    const baseCo2 = device?.co2_impact != null ? parseFloat(device.co2_impact) : 50;
    const baseWater = device?.water_impact != null ? parseFloat(device.water_impact) : 1000;
    const baseRaee = device?.raee_impact != null ? parseFloat(device.raee_impact) : 2;

    const co2 = parseFloat((baseCo2 * (5 / years)).toFixed(2)) || 0;
    const water = parseFloat((baseWater * (5 / years)).toFixed(2)) || 0;
    const raee = decision === 'reciclar' 
      ? baseRaee * 0.2 
      : decision === 'donar' 
        ? baseRaee * 0.5 
        : decision === 'reparar'
          ? baseRaee * 0.3
          : baseRaee;

    setImpact({ co2, water, raee });
  };

  const handleNext = () => {
    if (currentStage === 2) {
      calculateImpact(yearsOfUse, endOfLifeDecision || 'reciclar');
    }
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePrev = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleFinish = () => {
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

  if (!device) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 to-cyan-900/10 p-4">
      {/* ✅ STEPPER INTERACTIVO */}
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
              <span className="text-2xl">{stage.icon}</span>
              <span className="text-sm mt-1">{stage.name}</span>
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
            <h2 className="text-2xl font-bold mb-6">{stages[currentStage].name}</h2>
            
            {currentStage === 2 && (
              <div className="space-y-4">
                <p className="text-white/80">¿Cuántos años usarás este dispositivo?</p>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={yearsOfUse}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setYearsOfUse(val);
                    calculateImpact(val, endOfLifeDecision || 'reciclar');
                  }}
                  className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-3xl font-bold text-emerald-300">{yearsOfUse} años</div>
              </div>
            )}

            {currentStage === 4 && (
              <div className="space-y-4">
                <p className="text-white/80">¿Qué harás al final de su vida útil?</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'tirar', label: 'Tirar', icon: '🗑️', color: 'bg-red-500/20' },
                    { id: 'donar', label: 'Donar', icon: '🎁', color: 'bg-yellow-500/20' },
                    { id: 'reparar', label: 'Reparar', icon: '🔧', color: 'bg-blue-500/20' },
                    { id: 'reciclar', label: 'Reciclar', icon: '♻️', color: 'bg-green-500/20' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        const cleanDecision = option.id.trim().toLowerCase();
                        setEndOfLifeDecision(cleanDecision);
                        calculateImpact(yearsOfUse, cleanDecision);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center
                        ${endOfLifeDecision === option.id.toLowerCase()
                          ? 'border-emerald-500 bg-emerald-500/30'
                          : 'border-white/20 hover:border-white/40'
                        } ${option.color}`}
                    >
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <div className="text-sm font-medium text-center">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStage !== 2 && currentStage !== 4 && (
              <div className="text-white/70 py-8">
                {stages[currentStage].name} del dispositivo
              </div>
            )}

            {currentStage >= 2 && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10" style={{ minHeight: '80px' }}>
                <h3 className="font-semibold mb-2">Impacto ambiental estimado</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-green-500/10 p-2 rounded">CO₂: {impact.co2} kg</div>
                  <div className="bg-blue-500/10 p-2 rounded">Agua: {impact.water} L</div>
                  <div className="bg-yellow-500/10 p-2 rounded">RAEE: {(Number(impact.raee) || 0).toFixed(2)} kg</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStage === 0}
            className={`px-6 py-2 rounded-lg ${
              currentStage === 0
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Anterior
          </button>
          
          {currentStage === stages.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={!endOfLifeDecision}
              className={`px-6 py-2 rounded-lg font-medium ${
                endOfLifeDecision
                  ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-600'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              Ver resultados
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-emerald-500 text-neutral-950 rounded-lg hover:bg-emerald-600 font-medium"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}