import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

/* ✅ Imagen robusta (fallback + lazy + mantiene proporción) */
function SmartImage({
  src,
  alt,
  className = "",
  fallback = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1600&h=900&fit=crop&auto=format&q=80",
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
      className={className}
    />
  );
}

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

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 min-h-[82px] flex flex-col justify-between hover:bg-white/[0.04] transition-all">
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
  image,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all shadow-[0_18px_55px_rgba(0,0,0,0.32)] hover:shadow-[0_24px_65px_rgba(0,0,0,0.38)]">
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

      {image && (
        <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/20">
          <div className="relative w-full aspect-[3/2]">
            <SmartImage
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onExplore}
          className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 hover:opacity-95 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
        >
          Explorar demo
        </button>

        <button
          onClick={onSecondary}
          className="px-6 py-3 rounded-xl font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all hover:border-emerald-400/30"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}

function BenefitCard({ title, desc, image }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all hover:scale-[1.02] transform">
      {image && (
        <div className="mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto border border-white/10 bg-black/20">
            <SmartImage
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-emerald-300">{title}</h3>
      <p className="text-white/70">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc, image }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 font-bold text-lg mb-4">
        {number}
      </div>
      {image && (
        <div className="mb-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto border border-white/10 bg-black/20">
            <SmartImage
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70">{desc}</p>
    </div>
  );
}

function ImageFeature({ image, title, desc, reverse = false }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div
        className={`rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="relative w-full aspect-video">
          <SmartImage
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className={`${reverse ? "lg:order-1" : "lg:order-2"}`}>
        <h3 className="text-2xl font-bold mb-3 text-emerald-300">{title}</h3>
        <p className="text-white/80 text-lg leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const indicators = useMemo(
    () => [
      { label: "Dispositivos", value: "Teléfonos, Laptops y más" },
      { label: "Métricas", value: "CO₂, Agua, RAEE" },
      { label: "Escenarios", value: "Uso, Reparación, Reciclaje" },
      { label: "Resultados", value: "Comparativos educativos" },
    ],
    []
  );

  const benefits = useMemo(
    () => [
      {
        title: "Aprendizaje práctico",
        desc: "Simula escenarios reales y comprende las consecuencias ambientales de diferentes decisiones sobre tus dispositivos electrónicos.",
        image:
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop&auto=format&q=80",
      },
      {
        title: "Datos comparativos",
        desc: "Compara múltiples opciones de uso, reparación y disposición para tomar decisiones más informadas y responsables.",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&auto=format&q=80",
      },
      {
        title: "Impacto ambiental",
        desc: "Visualiza cómo tus elecciones afectan recursos como agua, emisiones de CO₂ y generación de residuos electrónicos (RAEE).",
        image:
          "https://images.unsplash.com/photo-1542605510286-296f9fe6f26b?w=200&h=200&fit=crop&auto=format&q=80",
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        number: "1",
        title: "Elige tu dispositivo",
        desc: "Selecciona un teléfono, laptop u otro dispositivo electrónico para comenzar la simulación.",
        image:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop&auto=format&q=80",
      },
      {
        number: "2",
        title: "Simula decisiones",
        desc: "Prueba diferentes escenarios: uso prolongado, reparación, reciclaje o disposición final.",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop&auto=format&q=80",
      },
      {
        number: "3",
        title: "Compara resultados",
        desc: "Visualiza y compara el impacto ambiental de cada decisión con datos claros y educativos.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop&auto=format&q=80",
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        image:
          "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1200&h=675&fit=crop&auto=format&q=80",
        title: "Interfaz intuitiva",
        desc: "Nuestra plataforma está diseñada para ser fácil de usar, permitiéndote enfocarte en aprender sin distracciones técnicas.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=675&fit=crop&auto=format&q=80",
        title: "Datos en tiempo real",
        desc: "Obtén resultados instantáneos y compara diferentes escenarios para entender mejor el impacto de tus decisiones.",
      },
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

      {/* ✅ HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-emerald-200/90 font-semibold flex items-center justify-center gap-2 mb-2">
            <span className="animate-pulse">✨</span>
            SimuVidaTech • Aprende sobre RAEE de forma interactiva
          </div>

          <h1 className="mt-2 text-5xl sm:text-6xl md:text-[64px] font-extrabold leading-[0.98] tracking-tight">
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Compara decisiones
            </span>{" "}
            y descubre el impacto{" "}
            <span className="text-emerald-300">ambiental</span> de tus dispositivos
          </h1>

          {/* ✅ Imagen eco + tecnología */}
          <div className="mt-8">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20">
              <div className="relative w-full aspect-[16/7]">
                <SmartImage
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&h=700&fit=crop&auto=format&q=80"
                  alt="Reciclaje electrónico y tecnología responsable"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* overlay sutil para que siempre combine con el fondo */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-neutral-950/10 to-transparent" />
              </div>
            </div>
            <p className="mt-3 text-xs text-white/45">
              Tecnología responsable • educación ambiental aplicada
            </p>
          </div>

          {/* ✅ SECCIÓN MEJORADA (texto + chips + botones + indicadores) */}
          <div className="mt-8 max-w-3xl mx-auto">
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              <span className="text-emerald-200 font-semibold">SimuVidaTech</span>{" "}
              te permite simular escenarios de uso y disposición de dispositivos
              electrónicos y comparar su impacto ambiental con datos claros.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Chip active icon="🌱" label="Impacto ambiental" />
              <Chip icon="⚡" label="Eficiencia energética" />
              <Chip icon="🔄" label="Economía circular" />
              <Chip icon="📱" label="Dispositivos reales" />
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch justify-center gap-3">
              <button
                onClick={() => navigate("/demo/telefono")}
                className="sm:min-w-[280px] px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 hover:opacity-95 transition-all shadow-lg shadow-emerald-500/25"
              >
                Comenzar simulación gratis
              </button>

              <button
                onClick={() => navigate("/about")}
                className="sm:min-w-[220px] px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all hover:border-emerald-400/30"
              >
                Cómo funciona
              </button>

              {authenticated && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="sm:min-w-[160px] px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  🏠 Panel
                </button>
              )}
            </div>

            <div className="mt-4 text-xs text-white/45">
              Resultados estimados con fines educativos • datos basados en estudios
              ambientales.
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {indicators.map((it) => (
                <div
                  key={it.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all"
                >
                  <div className="text-[11px] tracking-wide uppercase text-white/45">
                    {it.label}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white/90 leading-snug">
                    {it.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Preview */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Así funciona <span className="text-emerald-300">SimuVidaTech</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Una interfaz intuitiva diseñada para que explores y aprendas sin
              complicaciones
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl mb-6 bg-black/20">
            <div className="relative w-full aspect-[16/9]">
              <SmartImage
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&auto=format&q=80"
                alt="Dashboard SimuVidaTech"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-white/50">
            <p>
              Interfaz simulada • Los datos reales se generan al ejecutar la
              simulación
            </p>
          </div>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Beneficios */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué usar <span className="text-emerald-300">SimuVidaTech</span>?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Una herramienta educativa diseñada para estudiantes y profesionales
              que quieren entender mejor el impacto ambiental de la tecnología
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((item, idx) => (
              <BenefitCard
                key={idx}
                title={item.title}
                desc={item.desc}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Features */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Características <span className="text-emerald-300">destacadas</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Descubre lo que hace especial a nuestra plataforma
            </p>
          </div>

          <div className="space-y-12">
            {features.map((feature, idx) => (
              <ImageFeature
                key={idx}
                image={feature.image}
                title={feature.title}
                desc={feature.desc}
                reverse={idx % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Pasos */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-emerald-300">3 pasos</span> para empezar
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Comienza a simular en menos de un minuto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, idx) => (
              <StepCard
                key={idx}
                number={item.number}
                title={item.title}
                desc={item.desc}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Categorías */}
      <section className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Explora por categoría</h2>
          <p className="text-white/70">
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
            image="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&h=800&fit=crop&auto=format&q=80"
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
            image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop&auto=format&q=80"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative max-w-6xl mx-auto px-6 py-8 mt-12 border-t border-white/10">
        <div className="text-center text-white/50 text-sm">
          <p className="font-semibold text-white/70">SimuVidaTech</p>
          <p className="mt-1">Herramienta educativa para conciencia ambiental</p>
          <p className="mt-2 text-xs">
            Resultados con fines educativos • Datos basados en estudios ambientales
          </p>
        </div>
      </footer>
    </div>
  );
}
