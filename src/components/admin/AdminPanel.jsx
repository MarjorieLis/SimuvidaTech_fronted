// src/components/admin/AdminPanel.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ✅ UI helpers (igual al resto del sistema) */
function Card({ className = "", children, ...props }) {
  return (
    <div
      {...props}
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
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

function ButtonPrimary({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 w-full",
        "rounded-xl font-semibold py-2.5 px-4",
        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950",
        "hover:from-emerald-400 hover:to-emerald-500",
        "shadow-lg shadow-emerald-500/25 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Pill({ className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
        "bg-white/[0.04] border-white/10 text-white/70",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function AdminPanel() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const response = await api.get("/devices/admin");
        setDevices(response.data || []);
      } catch (err) {
        console.error("Error al cargar dispositivos:", err);
        setError("No se pudieron cargar los dispositivos");
      } finally {
        setLoading(false);
      }
    };
    fetchAllDevices();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4">Cargando dispositivos...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo igual al sistema */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Header sticky */}
      <div className="relative sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <div>
            <p className="text-xs text-emerald-200/80 font-medium">Administración</p>
            <h1 className="text-lg sm:text-xl font-semibold">Todos los dispositivos</h1>
          </div>

          <div className="flex items-center gap-2">
            <ButtonGhost onClick={() => navigate("/dashboard")}>← Dashboard</ButtonGhost>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <Pill className="border-white/10 bg-white/[0.04] text-white/70">📦 {devices.length} registros</Pill>
            <Pill className="border-amber-400/20 bg-amber-500/10 text-amber-200">
              ⏳ {(devices || []).filter((d) => !d.reviewed).length} pendientes
            </Pill>
          </div>

          <ButtonGhost onClick={() => navigate("/admin")}>Ir al Dashboard Admin</ButtonGhost>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        ) : devices.length === 0 ? (
          <Card className="p-10 text-center text-white/60">
            No hay dispositivos registrados.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {devices.map((device) => (
              <Card key={device.id} className="p-5 hover:bg-white/[0.06] transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{device.type === "telefono" ? "📱" : "💻"}</span>
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
                  <span className="text-xs text-white/50">
                    {new Date(device.created_at).toLocaleDateString()}
                  </span>
                  <span
                    className={[
                      "px-2 py-1 rounded-full text-xs border",
                      device.reviewed
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/20"
                        : "bg-amber-500/10 text-amber-200 border-amber-400/20",
                    ].join(" ")}
                  >
                    {device.reviewed ? "Aprobado" : "Pendiente"}
                  </span>
                </div>

                <div className="mt-4">
                  <ButtonPrimary
                    onClick={() => navigate(`/admin/device/${device.id}`, { state: { from: "all" } })}
                  >
                    Ver detalles
                  </ButtonPrimary>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10 text-center text-white/45 text-sm">© 2026 SimuVidaTech — Panel de administración</div>
      </div>
    </div>
  );
}
