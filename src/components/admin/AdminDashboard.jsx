import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDevices: 0,
    totalUsers: 0,
    pendingDevices: 0,
    phoneCount: 0,
    laptopCount: 0,
    topPhones: [],
    topLaptops: [],
    decisionesUso: [],       // ← Añadido
    decisionesFinVida: []    // ← Añadido
  });
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'devices' | 'users'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [devicesRes, usersRes, decisionsRes] = await Promise.all([
          api.get('/devices/admin'),
          api.get('/users/stats'),
          api.get('/decisions/admin') // ← Nueva llamada
        ]);

        const devices = devicesRes.data;
        const totalDevices = devices.length;
        const phoneCount = devices.filter(d => d.type === 'telefono').length;
        const laptopCount = devices.filter(d => d.type === 'laptop').length;
        const pendingDevices = devices.filter(d => !d.reviewed).length;

        const phoneModels = {};
        const laptopModels = {};

        devices.forEach(device => {
          const model = device.model.toLowerCase().trim();
          if (device.type === 'telefono') {
            phoneModels[model] = (phoneModels[model] || 0) + 1;
          } else {
            laptopModels[model] = (laptopModels[model] || 0) + 1;
          }
        });

        const topPhones = Object.entries(phoneModels)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([model, count]) => ({ name: model, value: count }));

        const topLaptops = Object.entries(laptopModels)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([model, count]) => ({ name: model, value: count }));

        const { decisionesUso, decisionesFinVida } = decisionsRes.data; // ← Extraer

        setStats({
          totalDevices,
          totalUsers: usersRes.data.totalUsers,
          pendingDevices,
          phoneCount,
          laptopCount,
          topPhones,
          topLaptops,
          decisionesUso,        // ← Asignar
          decisionesFinVida     // ← Asignar
        });
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const showAllDevices = async () => {
    try {
      const response = await api.get('/devices/admin');
      setDevices(response.data);
      setView('devices');
    } catch (err) {
      console.error('Error al cargar dispositivos:', err);
    }
  };

  const showPhones = async () => {
    try {
      const response = await api.get('/devices/admin');
      const phones = response.data.filter(d => d.type === 'telefono');
      setDevices(phones);
      setView('devices');
    } catch (err) {
      console.error('Error al cargar teléfonos:', err);
    }
  };

  const showLaptops = async () => {
    try {
      const response = await api.get('/devices/admin');
      const laptops = response.data.filter(d => d.type === 'laptop');
      setDevices(laptops);
      setView('devices');
    } catch (err) {
      console.error('Error al cargar laptops:', err);
    }
  };

  const showPendingDevices = async () => {
    try {
      const response = await api.get('/devices/admin');
      const pending = response.data.filter(d => !d.reviewed);
      setDevices(pending);
      setView('devices');
    } catch (err) {
      console.error('Error al cargar dispositivos pendientes:', err);
    }
  };

  const showAllUsers = async () => {
    try {
      const response = await api.get('/users/admin');
      setUsers(response.data);
      setView('users');
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const goBackToDashboard = () => {
    setView('dashboard');
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Cargando panel de administración...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Encabezado fijo */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {view === 'devices' ? 'Dispositivos' : 
             view === 'users' ? 'Usuarios' : 'Dashboard Administrador'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {view === 'dashboard' ? (
          <>
            {/* Tarjetas interactivas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div
                onClick={showAllDevices}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition"
              >
                <h3 className="text-emerald-200 font-medium">Total Dispositivos</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalDevices}</p>
              </div>

              <div
                onClick={showAllUsers}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition"
              >
                <h3 className="text-emerald-200 font-medium">Usuarios Registrados</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>

              <div
                onClick={showPhones}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition"
              >
                <h3 className="text-emerald-200 font-medium">Teléfonos</h3>
                <p className="text-3xl font-bold mt-2 text-blue-300">{stats.phoneCount}</p>
              </div>

              <div
                onClick={showLaptops}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition"
              >
                <h3 className="text-emerald-200 font-medium">Laptops</h3>
                <p className="text-3xl font-bold mt-2 text-purple-300">{stats.laptopCount}</p>
              </div>
            </div>

            {/* Gráficos de modelos más registrados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="font-semibold mb-4">Modelos de teléfonos más registrados</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topPhones}>
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

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="font-semibold mb-4">Modelos de laptops más registrados</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topLaptops}>
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

            {/* ✅ GRÁFICOS DE DECISIONES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="font-semibold mb-4">Decisiones en etapa de uso</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.decisionesUso}>
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

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="font-semibold mb-4">Decisiones en etapa de fin de vida</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.decisionesFinVida}>
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
          </>
        ) : view === 'devices' ? (
          /* Vista de dispositivos */
          <>
            <button
              onClick={goBackToDashboard}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              ← Volver al dashboard
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {devices.map(device => (
                <div
                  key={device.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition"
                  onClick={() => navigate(`/admin/device/${device.id}`)}
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
                    {device.reviewed && (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">
                        Aprobado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Vista de usuarios */
          <>
            <button
              onClick={goBackToDashboard}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              ← Volver al dashboard
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {users.map(user => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-white/60 text-sm">{user.email}</p>
                      <p className="text-white/50 text-xs mt-1">
                        Rol: {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-white/50">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Panel de administración
        </div>
      </div>
    </div>
  );
}