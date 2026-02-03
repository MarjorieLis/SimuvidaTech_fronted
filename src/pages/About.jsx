import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Chip({ active = false, icon, label }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all",
        active
          ? "bg-emerald-500/10 border-emerald-400/25 text-emerald-200 hover:bg-emerald-500/15"
          : "bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <span className="text-base">{icon}</span>
      {label}
    </span>
  );
}

function StepCard({ n, title, desc, bullets }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.32)] hover:bg-white/[0.04] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-white/45">
            Paso {n}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-white/90">{title}</h3>
        </div>

        <div className="h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-white/[0.02] grid place-items-center text-white/80 text-sm font-semibold">
          {n}
        </div>
      </div>

      <p className="mt-3 text-sm text-white/70 leading-relaxed">{desc}</p>

      {bullets?.length ? (
        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-white/70">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all">
      <div className="text-[11px] tracking-wide uppercase text-white/45">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white/90 leading-snug">
        {value}
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  const mini = useMemo(
    () => [
      { label: "Objetivo", value: "Entender el ciclo de vida (RAEE) con evidencia" },
      { label: "Qué comparas", value: "Uso • reparación • reciclaje/donación" },
      { label: "Qué obtienes", value: "Resultados + recomendaciones + resumen" },
      { label: "Para qué sirve", value: "Informe, exposición o constancia" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo (mismo del Home) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.06),transparent_62%)]" />
        <div className="absolute inset-0 opacity-12 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.88)_100%)]" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 pt-14 pb-12">
        {/* Header estilo Home */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-emerald-200/90 font-semibold flex items-center justify-center gap-2 mb-2">
            <span className="animate-pulse">✨</span>
            SimuVidaTech • Cómo funciona (2 min)
          </div>

          <h1 className="mt-2 text-5xl sm:text-6xl md:text-[64px] font-extrabold leading-[0.98] tracking-tight">
            Un flujo claro para{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              simular
            </span>
            ,{" "}
            <span className="text-emerald-300">comparar</span> y{" "}
            <span className="text-emerald-300">documentar</span> decisiones.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
            El objetivo es entender el ciclo de vida del dispositivo y sustentar
            conclusiones con escenarios comparables (CO₂, agua y RAEE).
          </p>

          {/* Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Chip icon="🌿" label="CO₂" />
            <Chip active icon="💧" label="Agua" />
            <Chip icon="♻️" label="RAEE" />
            <Chip icon="📊" label="Comparativos" />
          </div>

          {/* ✅ Solo un botón (no repetitivo) */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
            >
              ← Volver al inicio
            </button>
          </div>

          <div className="mt-3 text-xs text-white/45">
            Resultados estimados con fines educativos • no sustituyen medición real.
          </div>

          {/* Mini indicadores (para conectar con Home) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {mini.map((m) => (
              <MiniCard key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Steps */}
        <section className="mt-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <StepCard
            n="1"
            title="Selecciona un dispositivo"
            desc="Empieza con un teléfono o laptop en demo. Si tienes cuenta, puedes cargar tu dispositivo real."
            bullets={["Referencia general", "Condiciones iniciales", "Base para comparar"]}
          />
          <StepCard
            n="2"
            title="Define decisiones del escenario"
            desc="Configura vida útil, reparación y fin de vida. Cada combinación representa un escenario distinto."
            bullets={["Uso y vida útil", "Reparación", "Reciclaje o donación"]}
          />
          <StepCard
            n="3"
            title="Compara resultados"
            desc="Observa qué cambia cuando modificas una decisión y justifica tu elección con datos."
            bullets={["Comparación clara", "Cambios por escenario", "Argumentación"]}
          />
          <StepCard
            n="4"
            title="Documenta el análisis"
            desc="Usa el resumen como evidencia para tu informe o exposición. Si aplica, genera constancia."
            bullets={["Resumen del proceso", "Conclusiones", "Evidencia académica"]}
          />
        </section>

        {/* CTA final suave (sin botón extra) */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-white/90 font-semibold">
              Tip: vuelve al inicio y empieza con una demo cuando quieras.
            </div>
            <div className="mt-1 text-sm text-white/70">
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
