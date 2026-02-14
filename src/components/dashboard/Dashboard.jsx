// Pantalla principal del usuario: permite elegir tipo de dispositivo para analizar impacto ambiental

import { useNavigate } from "react-router-dom";
import { FaGlobe, FaLeaf, FaTint, FaRecycle, FaMobileAlt, FaLaptop, FaEye } from "react-icons/fa";
import ThreeScene from "../simulation/ThreeScene";
import AccessiblePhone from "../simulation/AccessiblePhone";
import AccessibilityInsight from "../simulation/AccessibilityInsight";
import React from 'react';

// Componente reutilizable para tarjetas de subida de dispositivos
function UploadCard({ title, description, emoji, tag, onClick, image, is3D }) {
  // Detecta si es telefono para ajustar el modo de visualizacion de la imagen
  const isPhone = title?.toLowerCase().includes("tel");
  const [show3D, setShow3D] = React.useState(false);

  return (
    <button
      onClick={onClick}
      type="button"
      className="group relative text-left w-full rounded-3xl p-6 md:p-7
        border border-white/10 bg-white/[0.04] backdrop-blur-xl
        shadow-[0_18px_60px_rgba(0,0,0,0.35)]
        hover:bg-white/[0.06] hover:border-emerald-400/25
        transition-all duration-200 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(16,185,129,0.18),transparent_35%,rgba(34,211,238,0.14))]" />
      </div>

      {image ? (
        <div
          className="relative mb-5 rounded-2xl overflow-hidden border border-white/10 bg-black/30 h-40 md:h-44"
          onMouseEnter={() => is3D && setShow3D(true)}
          onMouseLeave={() => is3D && setShow3D(false)}
        >
          {show3D ? (
            <ThreeScene>
              <AccessiblePhone />
            </ThreeScene>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              <img
                src={image}
                alt={title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className={[
                  "w-full h-full transition duration-300",
                  isPhone
                    ? "object-contain p-3 md:p-4 group-hover:scale-[1.01]"
                    : "object-cover group-hover:scale-[1.03]",
                ].join(" ")}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d1?w=1400&h=700&fit=crop&auto=format&q=80    ";
                }}
              />
            </>
          )}

          <div
            className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
            bg-black/40 border border-white/10 text-white/80 backdrop-blur z-10"
          >
            <span className="text-base">{emoji}</span>
            {is3D ? (show3D ? "Exploración 3D Activa" : "Hover para Explorar 3D") : "Subida rápida"}
          </div>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="h-12 w-12 shrink-0 rounded-2xl grid place-items-center
              bg-emerald-500/12 border border-emerald-400/20 text-2xl"
          >
            {emoji}
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/65 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {tag ? (
          <span
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium
            bg-emerald-500/10 text-emerald-200 border border-emerald-400/20"
          >
            {tag}
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        <span
          className="inline-flex items-center justify-center gap-2
            h-11 px-5 rounded-2xl font-semibold text-neutral-950
            bg-gradient-to-r from-emerald-500 to-emerald-600
            group-hover:from-emerald-400 group-hover:to-emerald-500
            shadow-lg shadow-emerald-500/25 transition"
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
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <section
          className="mb-12 rounded-3xl p-10
          bg-gradient-to-br from-white/10 to-white/5
          border border-emerald-400/20
          backdrop-blur-xl text-center"
        >
          <div
            className="mx-auto mb-5 h-16 w-16 rounded-2xl flex items-center justify-center
            bg-emerald-500/15 border border-emerald-400/30 text-3xl"
          >
            <FaGlobe className="text-emerald-300" />
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
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 flex items-center gap-1">
                <FaLeaf className="text-base" /> CO₂
              </span>
              <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-400/20 flex items-center gap-1">
                <FaTint className="text-base" /> Agua
              </span>
              <span className="px-3 py-1.5 rounded-full bg-lime-500/10 text-lime-200 border border-lime-400/20 flex items-center gap-1">
                <FaRecycle className="text-base" /> RAEE
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadCard
            title="Teléfonos"
            description="Explora tu teléfono en 3D con asistencia cognitiva."
            emoji={<FaMobileAlt className="text-blue-400" />}
            tag="Exploración Accesible"
            is3D={true}
            onClick={() => navigate("/upload/telefono")}
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&h=800&fit=crop&auto=format&q=80    "
          />

          <UploadCard
            title="Laptops"
            description="Sube tu laptop y descubre cómo reducir su huella."
            emoji={<FaLaptop className="text-purple-400" />}
            tag="Recomendado"
            onClick={() => navigate("/upload/laptop")}
            image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1400&h=800&fit=crop&auto=format&q=80    "
          />
        </div>

        <AccessibilityInsight />

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/my-devices")}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
          >
            <FaEye className="text-base" /> Ver mis dispositivos registrados
          </button>
        </div>

        <div className="mt-12 text-center text-white/50 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}
