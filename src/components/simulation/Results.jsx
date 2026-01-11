// src/components/simulation/Results.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

export default function Results() {
  const [device, setDevice] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [impact, setImpact] = useState({ CO2: 0, agua: 0, residuos: 0, score: 0 });
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar dispositivo y decisiones
  useEffect(() => {
    const loadData = async () => {
      try {
        const deviceRes = await api.get(`/devices/${id}`);
        setDevice(deviceRes.data);

        const decisionsRes = await api.get(`/devices/${id}/decisions`);
        setDecisions(decisionsRes.data);

        // Calcular impacto final
        let baseCO2 = deviceRes.data.type === 'telefono' ? 150 : 300;
        let baseAgua = deviceRes.data.type === 'telefono' ? 100 : 200;
        let baseResiduos = deviceRes.data.type === 'telefono' ? 10 : 20;

        let CO2 = baseCO2;
        let agua = baseAgua;
        let residuos = baseResiduos;
        let score = 100;

        // Ajustar por uso
        const usoDecision = decisionsRes.data.find(d => d.stage === 1)?.decision;
        if (usoDecision === "1 año") {
          CO2 *= 1.2; agua *= 1.2; residuos *= 1.2; score -= 20;
        } else if (usoDecision === "2 años") {
          CO2 *= 1.1; agua *= 1.1; residuos *= 1.1; score -= 10;
        }

        // Ajustar por fin de vida
        const finDecision = decisionsRes.data.find(d => d.stage === 2)?.decision;
        if (finDecision === "desechar") {
          CO2 *= 1.3; agua *= 1.3; residuos *= 1.3; score -= 30;
        } else if (finDecision === "reparar") {
          CO2 *= 0.9; agua *= 0.9; residuos *= 0.9; score += 10;
        } else if (finDecision === "reciclar") {
          CO2 *= 0.8; agua *= 0.8; residuos *= 0.8; score += 15;
        }

        setImpact({
          CO2: Math.round(CO2),
          agua: Math.round(agua),
          residuos: Math.round(residuos),
          score: Math.max(20, Math.min(100, Math.round(score)))
        });

      } catch (err) {
        console.error('Error al cargar datos:', err);
        navigate('/dashboard');
      }
    };
    loadData();
  }, [id, navigate]);

  // Generar recomendaciones personalizadas
  const getRecommendations = () => {
    const finDecision = decisions.find(d => d.stage === 2)?.decision;
    if (!finDecision) return [];

    switch (finDecision) {
      case "desechar":
        return [
          "💡 Considera donar tu dispositivo. ¡Puede seguir siendo útil!",
          "♻️ Busca puntos de reciclaje autorizados en tu ciudad.",
          "🔋 Retira la batería antes de desechar. Es un residuo peligroso."
        ];
      case "reciclar":
        return [
          "✅ ¡Excelente decisión! El reciclaje reduce hasta el 80% de emisiones.",
          "📱 Guarda tus datos en la nube antes de entregar el dispositivo.",
          "🌍 Comparte esta acción en redes para inspirar a otros."
        ];
      case "reparar":
        return [
          "🛠️ Reparar extiende la vida útil y reduce la demanda de nuevos recursos.",
          "🔧 Busca técnicos certificados para una reparación segura.",
          "❤️ Cada reparación evita ~50 kg de residuos electrónicos."
        ];
      default:
        return [];
    }
  };

  if (!device) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Cargando resultados...</p>
      </div>
    </div>
  );

  const usoDecision = decisions.find(d => d.stage === 1)?.decision || "No registrada";
  const finDecision = decisions.find(d => d.stage === 2)?.decision || "No registrada";

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
            <p className="text-sm text-emerald-200/90 font-medium">Simulación completada</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <span className="text-2xl">📊</span> Resultados finales
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Tu {device.type} <strong>{device.model}</strong> ha sido evaluado.
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
          {/* Panel izquierdo: decisiones y recomendaciones */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">🎯 Tus decisiones</h2>
            
            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                <h3 className="font-medium text-emerald-200">Etapa 3: Uso</h3>
                <p className="mt-2 text-white/80">{usoDecision}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                <h3 className="font-medium text-emerald-200">Etapa 5: Fin de vida</h3>
                <p className="mt-2 text-white/80">{finDecision}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3">💡 Recomendaciones personalizadas</h3>
              <ul className="text-sm space-y-2">
                {getRecommendations().map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón PDF (futuro) */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => alert("Próximamente: Descarga de PDF")}
                className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                📄 Descargar informe completo
              </button>
            </div>
          </div>

          {/* Panel derecho: impacto final */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">📈 Impacto ambiental final</h2>
            
            <div className="h-64">
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

            <div className="mt-6">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Puntuación ecológica</span>
                <span className="text-2xl font-bold text-emerald-300">{impact.score}<span className="text-lg">/100</span></span>
              </div>
              <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" 
                  style={{ width: `${impact.score}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 text-sm text-white/60">
              <p>Comparado con el promedio de dispositivos similares.</p>
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