// src/components/admin/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminPanel() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const response = await api.get('/devices/admin');
        setDevices(response.data);
      } catch (err) {
        console.error('Error al cargar dispositivos:', err);
        setError('No se pudieron cargar los dispositivos');
      } finally {
        setLoading(false);
      }
    };
    fetchAllDevices();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Cargando dispositivos...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Encabezado con botón de regreso */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Todos los dispositivos</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-200 mb-6">
            {error}
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            No hay dispositivos registrados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <div
                key={device.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {device.type === 'telefono' ? '📱' : '💻'}
                  </span>
                  <div>
                    <h3 className="font-semibold">{device.model}</h3>
                    <p className="text-white/60 text-sm">
                      {device.year || 'Sin año'} • {device.type}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      Usuario: {device.user_email}
                    </p>
                  </div>
                </div>

                {/* Impacto ambiental */}
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-300 border border-green-400/20">
                    CO₂: {parseFloat(device.co2_impact || 0).toFixed(2)} kg
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-300 border border-blue-400/20">
                    Agua: {parseFloat(device.water_impact || 0).toFixed(2)} L
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-400/20">
                    RAEE: {parseFloat(device.raee_impact || 0).toFixed(2)} kg
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-white/50">
                    {new Date(device.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Botón de detalles */}
                <button
                  onClick={() => navigate(`/admin/device/${device.id}`)}
                  className="mt-4 w-full px-3 py-2 bg-emerald-500 text-neutral-950 font-medium rounded-lg hover:bg-emerald-600 transition"
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Panel de administración
        </div>
      </div>
    </div>
  );
}