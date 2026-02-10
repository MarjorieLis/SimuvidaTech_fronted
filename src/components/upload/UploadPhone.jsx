import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMobileAlt, FaArrowLeft, FaSyncAlt, FaInfoCircle } from "react-icons/fa";
import api from "../../services/api";

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-white/80 flex items-center gap-1">
        <FaInfoCircle className="text-xs text-emerald-400" />
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-white/45">{hint}</p> : null}
    </div>
  );
}

export default function UploadPhone() {
  // Estado para los campos del formulario
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [materials, setMaterials] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Envía datos del dispositivo al backend
      const res = await api.post("/devices", {
        type: "telefono",
        model,
        year: parseInt(year),
        materials,
      });

      const deviceId = res.data?.id;

      // Validación: asegura que el servidor devolvió un ID válido
      if (!deviceId) {
        throw new Error("No se recibió el id del dispositivo.");
      }

      // Navega a la simulación con el ID del dispositivo recién creado
      navigate(`/simulation/${deviceId}`);
    } catch (err) {
      console.error("Error al registrar teléfono:", err);
      // Muestra mensaje de error específico del servidor o genérico
      setErrorMsg(
        err.response?.data?.error || 
        err.message || 
        "No se pudo guardar el teléfono"
      );
    } finally {
      setLoading(false);
    }
  };

  // Limpia todos los campos del formulario y el mensaje de error
  const handleClear = () => {
    setModel("");
    setYear("");
    setMaterials("");
    setErrorMsg("");
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
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-emerald-200/90 font-medium">Registro del dispositivo</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <FaMobileAlt className="text-2xl text-blue-400" /> Subir teléfono
            </h1>
            <p className="mt-2 text-white/65">
              Completa los campos para registrar tu dispositivo y continuar con la simulación.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm
              bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
            aria-label="Volver al Dashboard"
          >
            <FaArrowLeft className="text-sm" /> Volver al Dashboard
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Información del dispositivo</h2>
              <p className="mt-1 text-sm text-white/60">Paso 1 de 3</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-200 border border-emerald-400/20">
              Teléfono
            </span>
          </div>

          {errorMsg ? (
            <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2">
              <FaInfoCircle className="mt-0.5 flex-shrink-0 text-red-300" />
              {errorMsg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Modelo" hint="Ej: Samsung Galaxy A14">
              <input
                type="text"
                className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-3
                  text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-emerald-400/40"
                placeholder="Samsung Galaxy A14"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                aria-required="true"
              />
            </Field>

            <Field label="Año de fabricación" hint="Ej: 2023">
              <input
                type="number"
                className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-3
                  text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-emerald-400/40"
                placeholder="2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1990"
                max="2100"
                required
                aria-required="true"
              />
            </Field>

            <Field label="Materiales visibles" hint="Separados por comas. Ej: vidrio, aluminio, plástico">
              <input
                type="text"
                className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-3
                  text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-emerald-400/40"
                placeholder="vidrio, aluminio, plástico"
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
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600
                  text-neutral-950 font-semibold py-3 px-6 hover:from-emerald-400 hover:to-emerald-500
                  shadow-lg shadow-emerald-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
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
                onClick={handleClear}
                className="sm:w-40 rounded-xl bg-white/5 border border-white/10 text-white/80
                  hover:bg-white/10 hover:text-white transition py-3 flex items-center justify-center gap-2"
                aria-label="Limpiar formulario"
              >
                <FaSyncAlt className="text-base" /> Limpiar
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}