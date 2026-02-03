import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

function Chip({ active = false, icon, label }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border",
        active
          ? "bg-emerald-500/10 border-emerald-400/25 text-emerald-200"
          : "bg-white/[0.02] border-white/10 text-white/70",
      ].join(" ")}
    >
      <span className="text-base">{icon}</span>
      {label}
    </span>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 min-h-[82px] flex flex-col justify-between">
      <div className="text-[11px] tracking-wide uppercase text-white/45">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white/90 leading-snug">
        {value}
      </div>
    </div>
  );
}

function DeviceCard({
  icon,
  title,
  subtitle,
  tag,
  onExplore,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-2xl">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="mt-1.5 text-sm text-white/70 leading-relaxed">
            {subtitle}
          </p>

          {tag ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              {tag}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onExplore}
          className="px-6 py-3 rounded-xl font-semibold bg-emerald-500 text-neutral-950 hover:opacity-95 transition shadow-lg shadow-emerald-500/15"
        >
          Explorar demo
        </button>

        <button
          onClick={onSecondary}
          className="px-6 py-3 rounded-xl font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const indicators = useMemo(
    () => [
      { label: "Flujo", value: "Dispositivo → decisiones → comparación" },
      { label: "Enfoque", value: "Aprendizaje y criterio ambiental" },
      { label: "Uso", value: "Ideal para clase e informes" },
      { label: "Salida", value: "Resumen claro del escenario" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo suave */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.06),transparent_62%)]" />
        <div className="absolute inset-0 opacity-12 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.88)_100%)]" />
      </div>

      {/* HERO centrado */}
      <section className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-emerald-200/90 font-semibold">
            SimuVidaTech • Simulación educativa RAEE
          </div>

          <h1 className="mt-4 text-5xl sm:text-6xl md:text-[64px] font-extrabold leading-[0.98] tracking-tight">
            Toma <span className="text-emerald-300">mejores decisiones</span>{" "}
            con <span className="text-emerald-300">escenarios</span> comparables
            y un <span className="text-emerald-300">resumen</span> listo.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
            Elige un dispositivo, prueba decisiones de uso y fin de vida, y
            observa cómo cambia el escenario.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Chip icon="🌿" label="CO₂" />
              <Chip active icon="💧" label="Agua" />
              <Chip icon="♻️" label="RAEE" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/demo/telefono")}
                className="px-7 py-3.5 rounded-xl font-semibold bg-emerald-500 text-neutral-950 hover:opacity-95 transition shadow-lg shadow-emerald-500/15"
              >
                Probar simulación
              </button>

              <button
                onClick={() => navigate("/about")}
                className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
              >
                Ver cómo funciona
              </button>

              {authenticated && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
                >
                  Ir al panel
                </button>
              )}
            </div>

            <div className="text-xs text-white/45">
              Resultados estimados con fines educativos.
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {indicators.map((it) => (
              <StatPill key={it.label} label={it.label} value={it.value} />
            ))}
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Categorías centradas */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Explora por categoría</h2>
          <p className="mt-3 text-white/70">
            Empieza con una demo. Si tienes cuenta, podrás subir tu dispositivo
            para personalizar el análisis.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <DeviceCard
            icon="📱"
            title="Teléfonos"
            subtitle="Simula decisiones de uso, reparación y fin de vida de forma rápida."
            tag="Prácticas y comparaciones"
            onExplore={() => navigate("/demo/telefono")}
            secondaryLabel={
              authenticated ? "Subir mi dispositivo" : "Iniciar sesión para subir"
            }
            onSecondary={() =>
              authenticated ? navigate("/upload/telefono") : navigate("/login")
            }
          />

          <DeviceCard
            icon="💻"
            title="Laptops"
            subtitle="Evalúa consumo, vida útil y opciones responsables de disposición."
            tag="Enfoque de eficiencia"
            onExplore={() => navigate("/demo/laptop")}
            secondaryLabel={
              authenticated ? "Subir mi dispositivo" : "Iniciar sesión para subir"
            }
            onSecondary={() =>
              authenticated ? navigate("/upload/laptop") : navigate("/login")
            }
          />
        </div>
      </section>
    </div>
  );
}
