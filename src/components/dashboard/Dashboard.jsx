// src/components/dashboard/Dashboard.jsx
import { useNavigate } from "react-router-dom";

function Card({ title, description, emoji, tag, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl p-6
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/10
        backdrop-blur-xl
        shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_30px_80px_-50px_rgba(0,0,0,0.9)]
        hover:border-emerald-400/30 hover:bg-white/10
        transition-all duration-200"
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center
              bg-emerald-500/10 border border-emerald-400/25
              text-2xl"
          >
            {emoji}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-white/60">{description}</p>
          </div>
        </div>

        {tag && (
          <span
            className="px-3 py-1 rounded-full text-xs
            bg-emerald-500/10 text-emerald-200 border border-emerald-400/20"
          >
            {tag}
          </span>
        )}
      </div>

      <div className="mt-6">
        <span
          className="inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-xl font-semibold text-neutral-950
            bg-gradient-to-r from-emerald-500 to-emerald-600
            group-hover:from-emerald-400 group-hover:to-emerald-500
            shadow-lg shadow-emerald-500/25
            transition-all duration-200"
        >
          Subir {title.toLowerCase()}
          <span className="opacity-70 group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </span>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* HERO centrado + icono con lógica */}
        <section
          className="mb-12 rounded-3xl p-10
          bg-gradient-to-br from-white/10 to-white/5
          border border-emerald-400/20
          backdrop-blur-xl text-center"
        >
          <div className="mx-auto mb-5 h-16 w-16 rounded-2xl flex items-center justify-center
            bg-emerald-500/15 border border-emerald-400/30 text-3xl">
            🌍
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
            Bienvenido/a
          </h1>

          <p className="mt-4 text-lg text-white/70 max-w-3xl mx-auto">
            Elige un tipo de dispositivo para iniciar tu simulación y analizar su{" "}
            <span className="text-emerald-200">impacto ambiental</span> de forma
            responsable.
          </p>
        </section>

        {/* PANEL */}
        <section className="mb-8 rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-emerald-200/90 font-medium">
                Panel principal
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                ¿Qué dispositivo vas a analizar hoy?
              </h2>
            </div>

            <div className="flex gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-400/20">
                🌿 CO₂
              </span>
              <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-400/20">
                💧 Agua
              </span>
              <span className="px-3 py-1.5 rounded-full bg-lime-500/10 text-lime-200 border border-lime-400/20">
                ♻️ RAEE
              </span>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Teléfonos"
            description="Sube tu teléfono y descubre su impacto ambiental."
            emoji="📱"
            tag="Más común"
            onClick={() => navigate("/upload/telefono")}
          />

          <Card
            title="Laptops"
            description="Sube tu laptop y descubre cómo reducir su huella."
            emoji="💻"
            tag="Recomendado"
            onClick={() => navigate("/upload/laptop")}
          />
        </div>

        {/* ✅ Botón para ver mis dispositivos */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/my-devices")}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            👁️ Ver mis dispositivos registrados
          </button>
        </div>

        {/* Footer interno */}
        <div className="mt-12 text-center text-white/50 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}