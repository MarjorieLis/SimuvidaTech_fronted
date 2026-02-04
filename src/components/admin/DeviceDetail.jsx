// src/components/admin/DeviceDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../services/api";

/* ✅ UI helpers */
function Card({ className = "", children }) {
  return (
    <div
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

function Metric({ title, value, subtitle, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-500/10 border-emerald-400/20 text-emerald-200",
    cyan: "bg-cyan-500/10 border-cyan-400/20 text-cyan-200",
    amber: "bg-amber-500/10 border-amber-400/20 text-amber-200",
  };

  return (
    <div className={["rounded-2xl border p-4", tones[tone] || tones.emerald].join(" ")}>
      <p className="text-xs uppercase tracking-[0.18em] text-white/55">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/55">{subtitle}</p>
    </div>
  );
}

export default function DeviceDetail() {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await api.get(`/devices/${id}`);
        setDevice(response.data);
      } catch (err) {
        console.error("Error al cargar dispositivo:", err);
        setError("No se pudo cargar el dispositivo");
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4">Cargando dispositivo...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => navigate("/admin")}
            className="mt-4 px-4 py-2 bg-emerald-500 text-neutral-950 rounded-lg hover:bg-emerald-600 transition"
          >
            Volver a dispositivos
          </button>
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

      {/* Header */}
      <div className="relative sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-emerald-200/80 font-medium">Administración</p>
            <h1 className="text-lg sm:text-xl font-semibold truncate">Detalles del dispositivo</h1>
          </div>

          <div className="flex items-center gap-2">
            <ButtonGhost
              onClick={() => {
                const from = location.state?.from;
                if (from === "phones") navigate("/admin/phones");
                else if (from === "laptops") navigate("/admin/laptops");
                else if (from === "all") navigate("/admin/panel");
                else navigate("/admin");
              }}
            >
              ← Volver
            </ButtonGhost>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-5xl mx-auto px-4 py-10">
        <Card className="p-7">
          {/* Header del card */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{device.type === "telefono" ? "📱" : "💻"}</span>
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl font-semibold truncate">{device.model}</h2>
                <p className="text-white/60 mt-1">
                  {device.year || "Sin año"} • {device.type}
                </p>
                <p className="text-white/50 text-sm mt-1 truncate">Usuario: {device.user_email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill className="border-white/10 bg-white/[0.04] text-white/70">
                🗓️ {new Date(device.created_at).toLocaleDateString()}
              </Pill>
              <Pill
                className={[
                  "border",
                  device.reviewed
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                    : "border-amber-400/20 bg-amber-500/10 text-amber-200",
                ].join(" ")}
              >
                {device.reviewed ? "✅ Aprobado" : "⏳ Pendiente"}
              </Pill>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Métricas */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric
              title="Impacto CO₂"
              value={`${parseFloat(device.co2_impact || 0).toFixed(2)} kg`}
              subtitle="Emisiones estimadas"
              tone="emerald"
            />
            <Metric
              title="Consumo de agua"
              value={`${parseFloat(device.water_impact || 0).toFixed(2)} L`}
              subtitle="Agua utilizada en producción"
              tone="cyan"
            />
            <Metric
              title="Residuos RAEE"
              value={`${parseFloat(device.raee_impact || 0).toFixed(2)} kg`}
              subtitle="Residuos electrónicos"
              tone="amber"
            />
          </div>

          {/* Materiales */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Materiales utilizados</h3>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white/75">
              {device.materials || "No especificados"}
            </div>
          </div>

          {/* Extra info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">Registro</p>
              <p className="mt-2 text-sm text-white/70">
                Creado el {new Date(device.created_at).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">Identificador</p>
              <p className="mt-2 text-sm text-white/70">ID: {device.id}</p>
            </div>
          </div>
        </Card>

        <div className="mt-10 text-center text-white/45 text-sm">© 2026 SimuVidaTech — Panel de administración</div>
      </div>
    </div>
  );
}
