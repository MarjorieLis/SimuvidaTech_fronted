import { useNavigate } from "react-router-dom";

function StepCard({ step, title, desc, bullets }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 font-semibold">
          {step}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>

          {bullets?.length ? (
            <ul className="mt-4 space-y-2">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-white/70"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo consistente */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.65)]" />
            Cómo funciona
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            Cómo funciona SimuVidaTech
          </h1>

          <p className="mt-4 text-white/70 leading-relaxed">
            SimuVidaTech es una herramienta educativa que permite{" "}
            <span className="text-white/85 font-medium">
              simular escenarios
            </span>{" "}
            para analizar el impacto ambiental de dispositivos tecnológicos y
            comprender cómo distintas decisiones influyen en su ciclo de vida.
          </p>

          <div className="mt-7 flex justify-center">
            <button
  onClick={() => navigate(-1)}
  className="px-6 py-3 rounded-xl font-semibold border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition"
>
  Volver
</button>

          </div>

          <p className="mt-4 text-xs text-white/50">
            Los resultados presentados corresponden a{" "}
            <span className="text-white/70">estimaciones con fines educativos</span>.
          </p>
        </div>

        {/* Pasos */}
        <section className="mt-12 grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <StepCard
            step="1"
            title="Elige un dispositivo"
            desc="Selecciona un teléfono o laptop desde una simulación demo o utiliza un dispositivo personalizado como punto de partida."
            bullets={[
              "Tipo de dispositivo",
              "Modelo o referencia general",
              "Condiciones iniciales de uso",
            ]}
          />

          <StepCard
            step="2"
            title="Configura decisiones clave"
            desc="Define qué ocurre con el dispositivo a lo largo del tiempo, representando distintos escenarios posibles."
            bullets={[
              "Extensión o reducción de la vida útil",
              "Consumo y eficiencia energética",
              "Opciones de fin de vida (reciclaje, donación, reemplazo)",
            ]}
          />

          <StepCard
            step="3"
            title="Analiza el impacto ambiental"
            desc="El sistema procesa la información y presenta resultados estimados que permiten comparar escenarios."
            bullets={[
              "Comparación entre decisiones",
              "Identificación de opciones más sostenibles",
              "Análisis orientado al aprendizaje",
            ]}
          />

          <StepCard
            step="4"
            title="Guarda y documenta resultados"
            desc="Las simulaciones pueden ser guardadas para su posterior revisión y uso en trabajos o proyectos académicos."
            bullets={[
              "Historial de simulaciones",
              "Comparación de dispositivos",
              "Resumen claro para informes o exposiciones",
            ]}
          />
        </section>
      </main>

      {/* Footer simple */}
      <footer className="relative max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <div className="text-center">
          <p className="text-sm text-white/60">
            SimuVidaTech • Simulación educativa de impacto ambiental
          </p>
          <p className="text-xs text-white/35 mt-2">
            Enfoque académico orientado a la comprensión y toma de decisiones responsables.
          </p>
        </div>
      </footer>
    </div>
  );
}
