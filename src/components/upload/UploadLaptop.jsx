import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLaptop, FaArrowLeft, FaSyncAlt, FaInfoCircle, FaRobot } from "react-icons/fa";
import api from "../../services/api";
import { useEffect, useMemo } from 'react';
import ThreeScene from "../simulation/ThreeScene";
import AccessibleLaptop from "../simulation/AccessibleLaptop";
import { getAIModelConfig, getModelsByBrand, getModelYear } from "../../services/AIModelSelector";
import { useCognitiveAssistant } from "../../hooks/useCognitiveAssistant";

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-white/80 flex items-center gap-1">
        <FaInfoCircle className="text-xs text-emerald-400" />
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-white/50">{hint}</p> : null}
    </div>
  );
}

export default function UploadLaptop() {
  // Estado para los campos del formulario
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [materials, setMaterials] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { speak } = useCognitiveAssistant();

  // Obtener configuracion de IA basada en el modelo
  const aiConfig = useMemo(() => getAIModelConfig(model, 'laptop'), [model]);

  // Obtener sugerencias de modelos basadas en lo que el usuario escribe
  const suggestedModels = useMemo(() => getModelsByBrand(model, 'laptop'), [model]);

  // Auto-rellenar año y materiales al detectar modelo conocido
  useEffect(() => {
    if (model.length > 4) {
      const autoYear = getModelYear(model);
      if (autoYear && !year) setYear(String(autoYear));
    }
  }, [model]);

  // Narracion de deteccion IA y Autocompletado (Accesibilidad)
  useEffect(() => {
    if (model.length > 5) {
      const timer = setTimeout(() => {
        speak(aiConfig.description);

        // Solo autocompletamos si el modelo existe
        if (aiConfig.exists && aiConfig.materials) {
          setMaterials(aiConfig.materials);
          speak(`Sincronizando materiales para esta laptop.`);
        } else if (!aiConfig.exists) {
          speak("Modelo de laptop no reconocido. Asegúrate de que el nombre sea correcto.");
        }
      }, 800);
      return () => clearTimeout(timer);
    } else if (model.length === 0) {
      // Limpiar materiales si el modelo se borra completamente
      setMaterials("");
    }
  }, [model, aiConfig.exists, aiConfig.description, aiConfig.materials, speak]);

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Envía datos del dispositivo al backend
      const response = await api.post("/devices", {
        type: "laptop",
        model,
        year: parseInt(year),
        materials,
      });

      // Validación adicional: asegura que el servidor devolvió un ID válido
      if (!response.data || !response.data.id) {
        throw new Error("El servidor no devolvió un ID válido");
      }

      // Guarda ID temporalmente para la simulación
      localStorage.setItem("currentDeviceId", response.data.id);

      // Navega a la simulación con el ID del dispositivo recién creado
      navigate(`/simulation/${response.data.id}`);
    } catch (err) {
      console.error("Error al registrar laptop:", err);
      setLoading(false);
      // Muestra mensaje de error específico del servidor o genérico
      setErrorMsg(
        err.response?.data?.error ||
        err.message ||
        "No se pudo registrar la laptop. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-emerald-200/90 font-medium">Carga de dispositivo</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <FaLaptop className="text-2xl text-blue-400" /> Subir laptop
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Registra tu dispositivo para calcular su impacto y simular decisiones de uso, reparación o reciclaje.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
            type="button"
            aria-label="Volver al Dashboard"
          >
            <FaArrowLeft className="text-sm" /> Volver al Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_30px_80px_-50px_rgba(0,0,0,0.9)] p-8 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Información del dispositivo</h2>
                <p className="mt-1 text-sm text-white/60">
                  Completa los campos para registrar tu laptop.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-200 border border-emerald-400/20">
                Paso 1 de 3
              </span>
            </div>

            {errorMsg ? (
              <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2">
                <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                {errorMsg}
              </div>
            ) : null}

            {!aiConfig.exists && model.length > 5 && (
              <div className="mb-5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 flex items-center gap-2 animate-pulse">
                <FaInfoCircle className="text-amber-400" />
                <span>Advertencia: La IA no reconoce la <b>{model}</b> como un modelo verificado.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Field label="Modelo" hint="Escribe el nombre — detectamos el año automáticamente">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: Apple MacBook Air (M3, 2024)"
                    className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-emerald-400/40"
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    required
                    aria-required="true"
                    autoComplete="off"
                  />

                  {showSuggestions && suggestedModels.length > 0 && (
                    <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-2xl">
                      {suggestedModels.map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full px-4 py-2.5 text-left hover:bg-cyan-500/20 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between gap-2"
                          onClick={() => {
                            setModel(m.name);
                            if (m.year) setYear(String(m.year));
                            if (m.materials) setMaterials(m.materials);
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="text-xs text-white">{m.name}</span>
                          {m.year && <span className="text-[10px] text-cyan-400/80 font-mono shrink-0 bg-cyan-500/10 px-1.5 py-0.5 rounded">{m.year}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Año de fabricación" hint={year ? "✓ Detectado automáticamente" : "Se completa al elegir el modelo"}>
                <input
                  type="number"
                  placeholder="Se detecta automáticamente"
                  className={`w-full rounded-xl bg-neutral-950/40 border px-4 py-3 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-emerald-400/40 ${year ? 'border-cyan-400/50 bg-cyan-500/5' : 'border-white/10'
                    }`}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1990"
                  max="2100"
                  required
                  aria-required="true"
                />
              </Field>

              <Field
                label="Materiales visibles"
                hint="Separados por comas. Ej: aluminio, plástico, vidrio"
              >
                <input
                  type="text"
                  placeholder="aluminio, plástico, vidrio"
                  className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-emerald-400/40"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  required
                  aria-required="true"
                />
              </Field>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 font-semibold py-3 px-6 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <FaSyncAlt className="animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      Guardar y continuar <span className="hidden sm:inline">→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModel("");
                    setYear("");
                    setMaterials("");
                  }}
                  className="w-full sm:w-auto rounded-xl py-3 px-6 bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
                  aria-label="Limpiar formulario"
                >
                  <FaSyncAlt className="text-base" /> Limpiar
                </button>
              </div>
            </form>
          </div>

          {/* Columna Derecha: Previsualizacion IA 3D */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center flex-1 min-h-[400px]">
              <div className="flex items-center gap-2 mb-4 w-full px-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <FaRobot />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-cyan-300">Generador IA de Laptop</h3>
                <div className="ml-auto flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse delay-75" />
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse delay-150" />
                </div>
              </div>

              <div className="w-full h-full flex-1">
                <ThreeScene>
                  <AccessibleLaptop
                    color={aiConfig.color}
                    modelName={model || 'Laptop'}
                    isPro={aiConfig.isPro}
                    isUltra={aiConfig.isUltra}
                    form={aiConfig.form}
                    screenGlow={aiConfig.screenGlow}
                  />
                </ThreeScene>
              </div>

              <div className="mt-4 w-full bg-black/40 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-white/50 mb-1 uppercase font-bold tracking-tighter">Respuesta IA:</p>
                <p className="text-sm text-cyan-100 italic leading-relaxed">
                  {model.length > 2 ? aiConfig.description : "Identificando arquitectura del equipo..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}