// src/components/devices/MyDevices.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MyDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await api.get('/devices/mine');
        setDevices(response.data);
      } catch (err) {
        console.error('Error al cargar dispositivos:', err);
        setError('No se pudieron cargar tus dispositivos');
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const filteredDevices = filter === 'all' 
    ? devices 
    : devices.filter(d => d.type === filter);

  // Función para eliminar un dispositivo
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este dispositivo?")) {
      return;
    }

    try {
      await api.delete(`/devices/${id}`);
      setDevices(devices.filter(d => d.id !== id));
      alert('✅ Dispositivo eliminado correctamente.');
    } catch (err) {
      console.error('Error al eliminar dispositivo:', err);
      alert('❌ No se pudo eliminar el dispositivo. Intenta nuevamente.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Cargando tus dispositivos...</p>
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
            <p className="text-sm text-emerald-200/90 font-medium">Tus dispositivos</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <span className="text-2xl">📱</span> Mis dispositivos
            </h1>
            <p className="mt-2 text-white/65">
              Aquí están todos los dispositivos que has registrado.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'all'
                ? 'bg-emerald-500 text-neutral-950'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Todos ({devices.length})
          </button>
          <button
            onClick={() => setFilter('telefono')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'telefono'
                ? 'bg-emerald-500 text-neutral-950'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Teléfonos ({devices.filter(d => d.type === 'telefono').length})
          </button>
          <button
            onClick={() => setFilter('laptop')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'laptop'
                ? 'bg-emerald-500 text-neutral-950'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Laptops ({devices.filter(d => d.type === 'laptop').length})
          </button>
        </div>

        {/* Lista de dispositivos */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-200">
            {error}
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            No has registrado ningún dispositivo {filter !== 'all' ? `de tipo ${filter}` : ''}.
            <br />
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-emerald-300 hover:underline"
            >
              Ir al Dashboard para subir uno
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDevices.map(device => (
              <div
                key={device.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {device.type === 'telefono' ? '📱' : '💻'}
                    </span>
                    <div>
                      <h3 className="font-semibold">{device.model}</h3>
                      <p className="text-white/60 text-sm">
                        {device.year || 'Sin año'} • {device.type}
                      </p>
                      <p className="text-white/50 text-xs mt-1 truncate">
                        {device.materials || 'Materiales no especificados'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/simulation/${device.id}`)}
                      className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-500/20 hover:text-emerald-100 transition"
                    >
                      Ver simulación
                    </button>
                    {/* ✅ Botón de eliminar */}
                    <button
                      onClick={() => handleDelete(device.id)}
                      className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-300 border border-red-400/20 hover:bg-red-500/20 hover:text-red-100 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-white/50">
                    {new Date(device.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Tus dispositivos
        </div>
      </div>
    </div>
  );
}