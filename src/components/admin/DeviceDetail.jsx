// src/components/admin/DeviceDetail.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function DeviceDetail() {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await api.get('/devices/admin');
        const deviceData = response.data.find(d => d.id == id);
        
        if (!deviceData) {
          setError('Dispositivo no encontrado');
          return;
        }
        
        setDevice(deviceData);
      } catch (err) {
        console.error('Error al cargar dispositivo:', err);
        setError('No se pudo cargar el dispositivo');
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Cargando dispositivo...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-red-200">{error}</p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-neutral-950 rounded-lg hover:bg-emerald-600 transition"
        >
          Volver a dispositivos
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Encabezado */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Detalles del dispositivo</h1>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver a dispositivos
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">
              {device.type === 'telefono' ? '📱' : '💻'}
            </span>
            <div>
              <h2 className="text-2xl font-bold">{device.model}</h2>
              <p className="text-white/60">{device.year || 'Sin año'} • {device.type}</p>
              <p className="text-white/50 text-sm mt-1">Usuario: {device.user_email}</p>
            </div>
          </div>

          {/* Impacto ambiental detallado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4">
              <h3 className="font-semibold text-green-300 mb-2">Impacto CO₂</h3>
              <p className="text-2xl font-bold">{parseFloat(device.co2_impact || 0).toFixed(2)} kg</p>
              <p className="text-white/60 text-sm mt-1">Emisiones de carbono</p>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4">
              <h3 className="font-semibold text-blue-300 mb-2">Consumo de agua</h3>
              <p className="text-2xl font-bold">{parseFloat(device.water_impact || 0).toFixed(2)} L</p>
              <p className="text-white/60 text-sm mt-1">Agua utilizada en producción</p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-300 mb-2">Residuos RAEE</h3>
              <p className="text-2xl font-bold">{parseFloat(device.raee_impact || 0).toFixed(2)} kg</p>
              <p className="text-white/60 text-sm mt-1">Residuos electrónicos</p>
            </div>
          </div>

          {/* Materiales */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Materiales utilizados</h3>
            <p className="bg-white/5 border border-white/10 rounded-lg p-3">
              {device.materials || 'No especificados'}
            </p>
          </div>

          {/* Fecha de registro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Fecha de registro</h3>
              <p className="text-white/60">{new Date(device.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Panel de administración
        </div>
      </div>
    </div>
  );
}