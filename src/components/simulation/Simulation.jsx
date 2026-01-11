// src/components/simulation/Simulation.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { getAdjustedImpact } from '../../data/deviceData';

export default function Simulation() {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [impact, setImpact] = useState({ CO2: 0, agua: 0, residuos: 0, score: 0 });
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar dispositivo desde backend
  useEffect(() => {
    const loadDevice = async () => {
      try {
        if (!id) {
          navigate('/dashboard');
          return;
        }
        const response = await api.get(`/devices/${id}`);
        setDevice(response.data);
        simulateImpact(response.data);
      } catch (err) {
        console.error('Error al cargar dispositivo:', err);
        setError('No se pudo cargar el dispositivo');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDevice();
  }, [id, navigate]);

  // ✅ LÓGICA CORREGIDA: Usa getAdjustedImpact con manejo seguro de year
  const simulateImpact = (device) => {
    // Asegúrate de que year sea un número o null
    const year = device.year ? parseInt(device.year, 10) : null;
    const impactData = getAdjustedImpact(device.type, year);
    setImpact(impactData);
  };

  const handleSimulate = async () => {
    // Aquí irá la lógica de decisiones del usuario
    alert('✅ Simulación completada. ¡Mira tu impacto!');
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Cargando simulación...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-red-200">{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-neutral-950 rounded-lg"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );

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
              <span className="text-2xl">🌍</span> Impacto ecológico
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Tu {device.type} <strong>{device.model}</strong> está listo para la simulación.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              ← Volver al Dashboard
            </button>
            {/* ✅ Botón nuevo: Volver a mis dispositivos */}
            <button
              onClick={() => navigate('/my-devices')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 hover:bg-emerald-500/20 hover:text-emerald-100 transition"
            >
              ← Mis dispositivos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de impacto */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">📊 Resultados ambientales</h2>
            
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-emerald-200">Puntuación ecológica</span>
                  <span className="text-2xl font-bold text-emerald-300">{impact.score}<span className="text-lg">/100</span></span>
                </div>
                <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" 
                    style={{ width: `${impact.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
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
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => navigate(`/simulation/${id}/decisions`)}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 font-semibold py-3 px-6 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 transition"
              >
                Simular decisiones →
              </button>
            </div>
          </div>

          {/* Gráfico */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">📈 Impacto por categoría</h2>
            <div className="h-64 min-h-[16rem]"> {/* ✅ Añadido min-h para evitar error Recharts */}
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
          </div>
        </div>

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}