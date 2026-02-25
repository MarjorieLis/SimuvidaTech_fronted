import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCubes, FaUsers, FaMobileAlt, FaLaptop, FaChartBar, FaUser,
  FaArrowLeft, FaQrcode, FaCheckCircle, FaClock
} from "react-icons/fa";
import api from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { lazy, Suspense } from "react";
const QrScanner = lazy(() => import("./QrScanner"));

function Card({ className = "", children, ...props }) {
  return (
    <div
      {...props}
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
        "hover:bg-white/[0.06] transition",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ButtonGhost({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2",
        "px-4 py-2 rounded-full text-sm font-semibold",
        "bg-white/[0.04] border border-white/10 text-white/80",
        "hover:bg-white/[0.06] hover:text-white transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  // Estado para almacenar las estadísticas procesadas
  const [stats, setStats] = useState({
    totalDevices: 0,
    totalUsers: 0,
    phoneCount: 0,
    laptopCount: 0,
    topPhones: [],
    topLaptops: [],
    decisionesUso: [],
    decisionesFinVida: [],
  });

  // Estado para listados completos (vistas de detalle)
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);

  // Control de vista interna: dashboard principal, dispositivos o usuarios
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // QR Verification
  const [qrToken, setQrToken] = useState("");
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const navigate = useNavigate();

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Carga concurrente — cada endpoint se maneja independientemente
        const [devicesRes, usersRes, decisionsRes] = await Promise.allSettled([
          api.get("/devices/admin"),
          api.get("/users/stats"),
          api.get("/decisions/admin"),
        ]);

        const devicesList = devicesRes.status === 'fulfilled' ? (devicesRes.value.data || []) : [];
        const totalDevices = devicesList.length;

        // Conteo de dispositivos por tipo
        const phoneCount = devicesList.filter((d) => d.type === "telefono").length;
        const laptopCount = devicesList.filter((d) => d.type === "laptop").length;

        // Objetos para agrupar y contar modelos
        const phoneModels = {};
        const laptopModels = {};

        devicesList.forEach((device) => {
          const model = (device.model || "").toLowerCase().trim();
          if (!model) return;

          if (device.type === "telefono") phoneModels[model] = (phoneModels[model] || 0) + 1;
          else laptopModels[model] = (laptopModels[model] || 0) + 1;
        });

        const topPhones = Object.entries(phoneModels)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([model, count]) => ({ name: model, value: count }));

        const topLaptops = Object.entries(laptopModels)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([model, count]) => ({ name: model, value: count }));

        const decisionsData = decisionsRes.status === 'fulfilled' ? (decisionsRes.value.data || {}) : {};
        const { decisionesUso = [], decisionesFinVida = [] } = decisionsData;

        // Actualiza estado con todas las estadísticas procesadas
        setStats({
          totalDevices,
          totalUsers: usersRes.status === 'fulfilled' ? (usersRes.value.data?.totalUsers || 0) : 0,
          phoneCount,
          laptopCount,
          topPhones,
          topLaptops,
          decisionesUso,
          decisionesFinVida,
        });
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();

    // Cargar entregas pendientes
    const fetchPendingDeliveries = async () => {
      try {
        const res = await api.get("/deliveries/pending");
        setPendingDeliveries(res.data || []);
      } catch (err) {
        console.log("No se pudieron cargar entregas pendientes");
      }
    };
    fetchPendingDeliveries();
  }, []);

  // Funciones para cambiar vista y cargar datos específicos
  const showAllDevices = async () => {
    try {
      const response = await api.get("/devices/admin");
      setDevices(response.data || []);
      setView("devices");
    } catch (err) {
      console.error("Error al cargar dispositivos:", err);
    }
  };

  const showPhones = async () => {
    try {
      const response = await api.get("/devices/admin");
      const phones = (response.data || []).filter((d) => d.type === "telefono");
      setDevices(phones);
      setView("devices");
    } catch (err) {
      console.error("Error al cargar teléfonos:", err);
    }
  };

  const showLaptops = async () => {
    try {
      const response = await api.get("/devices/admin");
      const laptops = (response.data || []).filter((d) => d.type === "laptop");
      setDevices(laptops);
      setView("devices");
    } catch (err) {
      console.error("Error al cargar laptops:", err);
    }
  };

  const showAllUsers = async () => {
    try {
      const response = await api.get("/users/admin");
      setUsers(response.data || []);
      setView("users");
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const goBackToDashboard = () => setView("dashboard");

  // Navegar a verificación de QR
  const handleVerifyQR = () => {
    const token = qrToken.trim();
    if (!token) return;
    // Si el usuario pegó una URL completa, extraer el token
    const match = token.match(/verify\/([a-f0-9]+)/i);
    const finalToken = match ? match[1] : token;
    navigate(`/admin/verify/${finalToken}`);
  };

  // Pantalla de carga mientras se obtienen datos
  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4">Cargando panel de administración...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="relative sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <div>
            <p className="text-xs text-emerald-200/80 font-medium">Administración</p>
            <h1 className="text-lg sm:text-2xl font-semibold">
              {view === "devices" ? "Dispositivos" : view === "users" ? "Usuarios" : "Dashboard Administrador"}
            </h1>
          </div>

          <ButtonGhost onClick={() => navigate("/")}>
            <FaArrowLeft className="text-sm" /> Inicio
          </ButtonGhost>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        {view === "dashboard" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card onClick={showAllDevices} className="p-6 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white/60">Total dispositivos</p>
                    <p className="text-4xl font-semibold mt-3">{stats.totalDevices}</p>
                    <p className="text-white/45 text-sm mt-2">Ver todos los registros</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 flex items-center justify-center">
                    <FaCubes className="text-xl text-emerald-300" />
                  </div>
                </div>
              </Card>

              <Card onClick={showAllUsers} className="p-6 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white/60">Usuarios registrados</p>
                    <p className="text-4xl font-semibold mt-3">{stats.totalUsers}</p>
                    <p className="text-white/45 text-sm mt-2">Ver listado de usuarios</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl border border-violet-400/20 bg-violet-500/10 flex items-center justify-center">
                    <FaUsers className="text-xl text-violet-300" />
                  </div>
                </div>
              </Card>

              <Card onClick={showPhones} className="p-6 cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white/60">Teléfonos</p>
                    <p className="text-4xl font-semibold mt-3">{stats.phoneCount}</p>
                    <p className="text-white/45 text-sm mt-2">Filtrar por teléfonos</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 flex items-center justify-center">
                    <FaMobileAlt className="text-xl text-cyan-300" />
                  </div>
                </div>
              </Card>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card onClick={showLaptops} className="p-6 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white/60">Laptops</p>
                      <p className="text-4xl font-semibold mt-3">{stats.laptopCount}</p>
                      <p className="text-white/45 text-sm mt-2">Filtrar por laptops</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 flex items-center justify-center">
                      <FaLaptop className="text-xl text-fuchsia-300" />
                    </div>
                  </div>
                </Card>

                <Card onClick={showAllDevices} className="p-6 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white/60">Explorar registros</p>
                      <p className="text-2xl font-semibold mt-3">Dispositivos y métricas</p>
                      <p className="text-white/45 text-sm mt-2">
                        Accede al listado completo para ver detalles.
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.06] flex items-center justify-center">
                      <FaChartBar className="text-xl text-white/70" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* ═══ SECCIÓN QR ═══ */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl border border-amber-400/20 bg-amber-500/10 flex items-center justify-center">
                  <FaQrcode className="text-lg text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Verificación de entregas QR</h3>
                  <p className="text-white/50 text-xs">Escanea o pega el código del QR para verificar la entrega</p>
                </div>
              </div>

              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  value={qrToken}
                  onChange={(e) => setQrToken(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyQR()}
                  placeholder="Pega aquí el token o la URL del QR..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition text-sm"
                />
                <button
                  onClick={handleVerifyQR}
                  disabled={!qrToken.trim()}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition ${qrToken.trim()
                    ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                >
                  <FaQrcode /> Verificar
                </button>
                <button
                  onClick={() => setShowScanner(true)}
                  className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-200 hover:bg-amber-500/30 transition"
                >
                  📸 Escanear QR
                </button>
              </div>

              {pendingDeliveries.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                    <FaClock className="text-amber-400" /> Entregas pendientes de verificación
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pendingDeliveries.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => navigate(`/admin/verify/${d.token}`)}
                        className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 hover:bg-white/[0.06] cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FaMobileAlt className="text-xs text-cyan-400" />
                          <span className="font-medium text-sm truncate">{d.device_model || 'Dispositivo'}</span>
                        </div>
                        <p className="text-xs text-white/50 truncate">Usuario: {d.user_name || d.user_email}</p>
                        <p className="text-xs text-amber-300/70 mt-1">
                          {new Date(d.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Modelos de teléfonos más registrados</h3>
                <div className="h-[280px] min-h-[280px] w-full min-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topPhones.length > 0 ? stats.topPhones : [{ name: 'Sin datos', value: 0 }]}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" />
                      <YAxis stroke="rgba(255,255,255,0.55)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "12px",
                          color: "white",
                        }}
                        itemStyle={{ color: "#a7f3d0" }}
                        labelStyle={{ color: "rgba(255,255,255,0.85)" }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Modelos de laptops más registrados</h3>
                <div className="h-[280px] min-h-[280px] w-full min-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topLaptops.length > 0 ? stats.topLaptops : [{ name: 'Sin datos', value: 0 }]}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" />
                      <YAxis stroke="rgba(255,255,255,0.55)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "12px",
                          color: "white",
                        }}
                        itemStyle={{ color: "#a7f3d0" }}
                        labelStyle={{ color: "rgba(255,255,255,0.85)" }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Decisiones en etapa de uso</h3>
                <div className="h-[280px] min-h-[280px] w-full min-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.decisionesUso.length > 0 ? stats.decisionesUso : [{ name: 'Sin datos', value: 0 }]}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" />
                      <YAxis stroke="rgba(255,255,255,0.55)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "12px",
                          color: "white",
                        }}
                        itemStyle={{ color: "#a7f3d0" }}
                        labelStyle={{ color: "rgba(255,255,255,0.85)" }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Decisiones en etapa de fin de vida</h3>
                <div className="h-[280px] min-h-[280px] w-full min-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.decisionesFinVida.length > 0 ? stats.decisionesFinVida : [{ name: 'Sin datos', value: 0 }]}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" />
                      <YAxis stroke="rgba(255,255,255,0.55)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "12px",
                          color: "white",
                        }}
                        itemStyle={{ color: "#a7f3d0" }}
                        labelStyle={{ color: "rgba(255,255,255,0.85)" }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </>
        ) : view === "devices" ? (
          <>
            <ButtonGhost onClick={goBackToDashboard} className="mb-6">
              <FaArrowLeft className="text-sm" /> Volver al dashboard
            </ButtonGhost>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className="p-5 cursor-pointer"
                  onClick={() => navigate(`/admin/device/${device.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {device.type === "telefono" ? (
                        <FaMobileAlt className="text-blue-400" />
                      ) : (
                        <FaLaptop className="text-purple-400" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{device.model}</h3>
                      <p className="text-white/60 text-sm">
                        {device.year || "Sin año"} • {device.type}
                      </p>
                      <p className="text-white/50 text-xs mt-1 truncate">Usuario: {device.user_email}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">
                      CO₂: {parseFloat(device.co2_impact || 0).toFixed(2)} kg
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                      Agua: {parseFloat(device.water_impact || 0).toFixed(2)} L
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-amber-400/20">
                      RAEE: {parseFloat(device.raee_impact || 0).toFixed(2)} kg
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-white/50">{new Date(device.created_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <ButtonGhost onClick={goBackToDashboard} className="mb-6">
              <FaArrowLeft className="text-sm" /> Volver al dashboard
            </ButtonGhost>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {users.map((user) => (
                <Card key={user.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      <FaUser className="text-emerald-400" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{user.name}</h3>
                      <p className="text-white/60 text-sm truncate">{user.email}</p>
                      <p className="text-white/50 text-xs mt-1">
                        Rol: {user.role === "admin" ? "Administrador" : "Usuario"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-white/50">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 text-center text-white/45 text-sm">© 2026 SimuVidaTech — Panel de administración</div>
      </div>

      {/* Modal del escáner QR */}
      {showScanner && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-3 text-sm">Cargando escáner...</p>
            </div>
          </div>
        }>
          <QrScanner
            onScan={(scannedText) => {
              setShowScanner(false);
              // Extraer token de la URL escaneada
              const match = scannedText.match(/verify\/([a-f0-9]+)/i);
              const token = match ? match[1] : scannedText.trim();
              navigate(`/admin/verify/${token}`);
            }}
            onClose={() => setShowScanner(false)}
          />
        </Suspense>
      )}
    </div>
  );
}