// src/components/simulation/Decisions.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

export default function Decisions() {
  const [stage, setStage] = useState(1); // Etapa actual
  const [decision, setDecision] = useState('');
  const [impact, setImpact] = useState({ CO2: 0, agua: 0, residuos: 0, score: 0 });
  const navigate = useNavigate();
  const { id } = useParams();

  // Simular impacto según decisión
  useEffect(() => {
    if (!decision) return;

    let baseCO2 = 150;
    let baseAgua = 100;
    let baseResiduos = 10;
    let score = 100;

    switch (stage) {
      case 1: // Uso
        if (decision === "1 año") {
          score = 60;
        } else if (decision === "2 años") {
          score = 75;
        } else if (decision === "3+ años") {
          score = 90;
        }
        break;
      case 2: // Fin de vida
        if (decision === "reparar") {
          score = 85;
        } else if (decision === "reciclar") {
          score = 95;
        } else if (decision === "desechar") {
          score = 40;
        }
        break;
      case 3: // Impacto final
        score = 100 - (baseCO2 / 150) * 50;
        break;
    }

    setImpact({
      CO2: Math.round(baseCO2 * (100 - score) / 50),
      agua: Math.round(baseAgua * (100 - score) / 50),
      residuos: Math.round(baseResiduos * (100 - score) / 50),
      score: Math.round(score)
    });

  }, [stage, decision]);

  const handleNext = async () => {
    try {
      await api.post(`/devices/${id}/decisions`, { stage, decision });
      if (stage < 3) {
        setStage(stage + 1);
        setDecision(''); // Reiniciar decisión
      } else {
        navigate(`/results/${id}`);
      }
    } catch (err) {
      console.error('Error al guardar decisión:', err);
    }
  };

  const stages = [
    {
      title: "Etapa 1: Uso",
      description: "¿Cuánto tiempo planeas usar este dispositivo?",
      options: [
        { value: "1 año", label: "1 año" },
        { value: "2 años", label: "2 años" },
        { value: "3+ años", label: "3+ años" },
      ]
    },
    {
      title: "Etapa 2: Fin de vida",
      description: "¿Qué harás cuando ya no lo uses?",
      options: [
        { value: "reparar", label: "Repararlo" },
        { value: "reciclar", label: "Reciclarlo" },
        { value: "desechar", label: "Desecharlo" },
      ]
    },
    {
      title: "Etapa 3: Impacto final",
      description: "¡Haz clic para ver el impacto total!",
      options: []
    }
  ];

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
              <span className="text-2xl">🌍</span> Decisiones del ciclo de vida
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Tu dispositivo está listo para la simulación. Toma decisiones en cada etapa.
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
          {/* Panel de decisiones */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">{stages[stage-1].title}</h2>
            <p className="mb-6 text-white/60">{stages[stage-1].description}</p>

            <div className="space-y-3">
              {stages[stage-1].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDecision(option.value)}
                  className={`w-full text-left p-4 rounded-xl transition ${
                    decision === option.value
                      ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                      : "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleNext}
                disabled={!decision}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 font-semibold py-3 px-6 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {stage < 3 ? "Siguiente →" : "Ver resultados →"}
              </button>
            </div>
          </div>

          {/* Gráfico de impacto actual */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">📊 Impacto actual</h2>
            <div className="h-64">
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
                  Carga de uso...
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