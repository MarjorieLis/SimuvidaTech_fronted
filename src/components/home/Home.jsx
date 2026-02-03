// src/components/home/Home.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 hover:bg-white/[0.055] transition shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
    </div>
  );
}

function DeviceCard({
  icon,
  title,
  subtitle,
  meta,
  onExplore,
  onUpload,
  authenticated,
  onRegister,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <button
        onClick={onExplore}
        className="w-full text-left p-6 hover:bg-white/[0.05] transition relative"
      >
        {/* brillo sutil */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition pointer-events-none bg-[radial-gradient(600px_circle_at_20%_10%,rgba(16,185,129,0.10),transparent_50%)]" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-2xl">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-tight">{title}</h2>
            <p className="mt-1 text-sm text-white/70 leading-relaxed">{subtitle}</p>
            {meta ? (
              <p className="mt-3 text-xs text-white/55">{meta}</p>
            ) : null}
          </div>
        </div>

        <div className="relative mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
          Explorar demo <span className="text-white/40">→</span>
        </div>
      </button>

      <div className="px-6 pb-6">
        {authenticated ? (
          <button
            onClick={onUpload}
            className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-200 text-sm font-semibold py-3 transition"
          >
            Subir mi dispositivo
          </button>
        ) : (
          <button
            onClick={onRegister}
            className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold py-3 transition"
          >
            Crea tu cuenta para guardar resultados
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const indicators = useMemo(
    () => [
      { label: 'Simulación', value: 'Ciclo de vida completo' },
      { label: 'Resultado', value: 'Impacto + recomendaciones' },
      { label: 'Comparación', value: 'Escenarios y alternativas' },
      { label: 'Exportable', value: 'Reportes claros' },
    ],
    []
  );

  const handleExplore = (type) => navigate(`/demo/${type}`);

  const handleUpload = (type) => {
    if (authenticated) navigate(`/upload/${type}`);
    else navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo más limpio pero “bonito” */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge (sin “piloto”) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.65)]" />
            Simulador educativo de RAEE • UIDE
          </div>

          {/* brillo detrás del título */}
          <div className="relative mt-6">
            <div className="absolute -inset-x-10 -top-8 h-24 blur-3xl opacity-40 bg-[radial-gradient(closest-side,rgba(16,185,129,0.35),transparent)]" />
            <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight">
              SimuVidaTech
            </h1>
          </div>

          <p className="mt-5 text-lg md:text-2xl text-white/75 leading-relaxed">
            Visualiza el impacto ambiental de un teléfono o laptop, prueba decisiones de fin de vida
            y genera un reporte claro para tu proyecto o clase.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(authenticated ? '/dashboard' : '/register')}
              className="px-7 py-3.5 rounded-xl font-semibold bg-emerald-500 text-neutral-950 hover:opacity-95 transition shadow-lg shadow-emerald-500/20"
            >
              {authenticated ? 'Ir al panel' : 'Crear cuenta gratis'}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition"
            >
              Ver cómo funciona
            </button>
          </div>

          {/* Indicadores */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {indicators.map((it) => (
              <div
                key={it.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <div className="text-xs text-white/55">{it.label}</div>
                <div className="mt-1 text-sm font-semibold text-white/90">
                  {it.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALOR */}
      <section className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold">¿Qué puedes hacer aquí?</h2>
            <p className="mt-3 text-white/70 leading-relaxed">
              No es solo ver números: es entender el ciclo de vida y justificar decisiones sostenibles.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <Feature
              title="Simular el ciclo de vida"
              desc="Desde fabricación hasta disposición final, con variables ajustables según el caso."
            />
            <Feature
              title="Comparar escenarios"
              desc="Reusar, reparar, reciclar o donar: compara impacto y argumenta tu elección."
            />
            <Feature
              title="Generar un reporte"
              desc="Guarda resultados y arma un resumen listo para presentar o adjuntar a un informe."
            />
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Explora por categoría</h2>
          <p className="mt-3 text-white/70">
            Usa una demo rápida o sube tu propio dispositivo para un análisis más cercano a la realidad.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <DeviceCard
            icon="📱"
            title="Teléfonos"
            subtitle="Demo lista para probar decisiones de uso, reparación y fin de vida."
            meta="Ideal para prácticas rápidas y comparaciones."
            authenticated={authenticated}
            onExplore={() => handleExplore('telefono')}
            onUpload={() => handleUpload('telefono')}
            onRegister={() => navigate('/register')}
          />

          <DeviceCard
            icon="💻"
            title="Laptops"
            subtitle="Analiza consumo, vida útil y opciones de disposición responsable."
            meta="Incluye enfoque en eficiencia energética."
            authenticated={authenticated}
            onExplore={() => handleExplore('laptop')}
            onUpload={() => handleUpload('laptop')}
            onRegister={() => navigate('/register')}
          />
        </div>

        {/* CTA final */}
        {!authenticated && (
          <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <h3 className="text-xl font-bold text-center">
              Guarda tus resultados y arma tu evidencia
            </h3>
            <p className="mt-3 text-white/70 text-center">
              Crea una cuenta para mantener tus simulaciones, comparar dispositivos y exportar reportes.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold">Historial de simulaciones</p>
                <p className="mt-1 text-xs text-white/60">Todo lo que pruebas queda guardado.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold">Comparación rápida</p>
                <p className="mt-1 text-xs text-white/60">Contrasta escenarios en minutos.</p>
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold bg-emerald-500 text-neutral-950 hover:opacity-95 transition shadow-lg shadow-emerald-500/20"
              >
                Crear cuenta gratis
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-white/45">
              Si ya tienes cuenta, inicia sesión para subir tu dispositivo.
            </p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="relative max-w-6xl mx-auto px-4 py-10 border-t border-white/10">
        <div className="text-center">
          <p className="text-sm text-white/60">SimuVidaTech • Tecnología con criterio ambiental</p>
          <p className="text-xs text-white/35 mt-2">
            Diseñado para aprendizaje, reportes y decisiones responsables.
          </p>
        </div>
      </footer>
    </div>
  );
}
