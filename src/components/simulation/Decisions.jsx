// src/components/simulation/Decisions.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { getAdjustedImpact } from '../../data/deviceData';

export default function Decisions() {
  const [stage, setStage] = useState(1); // 1 a 5
  const [decisionUso, setDecisionUso] = useState('3+ años');
  const [decisionFin, setDecisionFin] = useState('reciclar');
  const [device, setDevice] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar dispositivo
  useEffect(() => {
    const loadDevice = async () => {
      try {
        const response = await api.get(`/devices/${id}`);
        setDevice(response.data);
      } catch (err) {
        console.error('Error al cargar dispositivo:', err);
        navigate('/dashboard');
      }
    };
    loadDevice();
  }, [id, navigate]);

  // Calcular impacto en tiempo real
  const impact = useMemo(() => {
    if (!device) return { CO2: 0, agua: 0, residuos: 0, score: 0 };

    const baseImpact = getAdjustedImpact(device.type, device.year);
    let { CO2, agua, residuos, score } = baseImpact;

    // Ajustar por uso
    if (decisionUso === "1 año") {
      CO2 *= 1.2; agua *= 1.2; residuos *= 1.2; score = Math.max(20, score - 20);
    } else if (decisionUso === "2 años") {
      CO2 *= 1.1; agua *= 1.1; residuos *= 1.1; score = Math.max(20, score - 10);
    }

    // Ajustar por fin de vida
    if (decisionFin === "desechar") {
      CO2 *= 1.3; agua *= 1.3; residuos *= 1.3; score = Math.max(20, score - 30);
    } else if (decisionFin === "reparar") {
      CO2 *= 0.9; agua *= 0.9; residuos *= 0.9; score = Math.min(100, score + 10);
    } else if (decisionFin === "reciclar") {
      CO2 *= 0.8; agua *= 0.8; residuos *= 0.8; score = Math.min(100, score + 15);
    }

    return {
      CO2: Math.round(CO2),
      agua: Math.round(agua),
      residuos: Math.round(residuos),
      score: Math.round(score)
    };
  }, [device, decisionUso, decisionFin]);

  const handleNext = async () => {
    if (stage === 3 || stage === 5) {
      // Guardar decisión solo en etapas interactivas
      const decision = stage === 3 ? decisionUso : decisionFin;
      try {
        await api.post(`/devices/${id}/decisions`, {
          stage: stage === 3 ? 1 : 2, // Mapeo: etapa 3 → stage 1, etapa 5 → stage 2
          decision
        });
      } catch (err) {
        console.error('Error al guardar decisión:', err);
        alert('❌ No se pudo guardar tu decisión.');
        return;
      }
    }

    if (stage < 5) {
      setStage(stage + 1);
    } else {
      navigate(`/results/${id}`);
    }
  };

  const stages = [
    {
      id: 1,
      title: "1. Extracción",
      description: device?.type === 'telefono' 
        ? "50 kg de minerales extraídos (litio, cobalto, cobre)"
        : "200 kg de minerales extraídos (aluminio, plástico, circuitos)"
    },
    {
      id: 2,
      title: "2. Fabricación",
      description: device?.type === 'telefono'
        ? "80 L de agua usados en fábrica"
        : "300 L de agua usados en fábrica"
    },
    {
      id: 3,
      title: "3. Uso",
      description: "¿Cuánto tiempo usaste o planeas usar este dispositivo?",
      options: [
        { value: "1 año", label: "1 año" },
        { value: "2 años", label: "2 años" },
        { value: "3+ años", label: "3+ años" },
      ]
    },
    {
      id: 4,
      title: "4. Transporte",
      description: device?.type === 'telefono'
        ? "12,000 km de transporte global"
        : "15,000 km de transporte global"
    },
    {
      id: 5,
      title: "5. Fin de vida",
      description: "¿Qué harás cuando ya no lo uses?",
      options: [
        { value: "desechar", label: "Desechar" },
        { value: "reparar", label: "Reparar" },
        { value: "reciclar", label: "Reciclar" },
      ]
    }
  ];

  const current = stages[stage - 1];

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo premium */}
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
            <p className="text-sm text-emerald-200/90 font-medium">Simulación ambiental</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <span className="text-2xl">🌍</span> Ciclo de vida
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Tu {device?.type} <strong>{device?.model}</strong> en sus 5 etapas.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver al Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de etapas */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{current.title}</h2>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-200 border border-emerald-400/20">
                Etapa {stage} de 5
              </span>
            </div>

            <p className="mb-6 text-white/60">{current.description}</p>

            {/* Opciones solo en etapas interactivas */}
            {current.options && (
              <div className="space-y-3 mt-4">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (stage === 3) setDecisionUso(opt.value);
                      else if (stage === 5) setDecisionFin(opt.value);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition ${
                      (stage === 3 && decisionUso === opt.value) ||
                      (stage === 5 && decisionFin === opt.value)
                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                        : "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Navegación */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStage(prev => Math.max(1, prev - 1))}
                disabled={stage === 1}
                className="px-4 py-2 rounded-lg text-white/70 disabled:opacity-30"
              >
                ← Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (stage === 3 && !decisionUso) ||
                  (stage === 5 && !decisionFin)
                }
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded-lg font-medium"
              >
                {stage < 5 ? "Siguiente →" : "Ver resultados"}
              </button>
            </div>
          </div>

          {/* Gráfico de impacto */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">📊 Impacto actual</h2>
            <div className="h-64 min-h-[16rem]">
              {impact.score > 0 ? (
                <>
                  <div className="mb-4">
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
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  Cargando...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}