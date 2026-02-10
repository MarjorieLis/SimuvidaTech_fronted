import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import { login } from "../../utils/auth";

function Field({ label, children, hint }) {
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

export default function Register() {
  // Estado para los campos basicos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estado específico para modo administrador
  const [adminCode, setAdminCode] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false); // Control de modo admin
  
  // Estado de UI
  const [show, setShow] = useState(false); // Visibilidad de contraseña
  const [loading, setLoading] = useState(false); // Estado de carga
  const [errorMsg, setErrorMsg] = useState(""); // Mensaje de error

  // Estado para validación de contraseña
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    hasLetters: false,
    hasNumbers: false,
    hasSpecial: false
  });

  const navigate = useNavigate();

  // Validación en tiempo real de la contraseña
  const validatePassword = (value) => {
    const requirements = {
      length: value.length >= 6 && value.length <= 8,
      hasLetters: /[a-zA-Z]/.test(value),
      hasNumbers: /[0-9]/.test(value),
      hasSpecial: /[^a-zA-Z0-9]/.test(value)
    };
    
    setPasswordRequirements(requirements);
    return requirements;
  };

  // Manejador del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    
    // Validación de contraseña
    const requirements = validatePassword(password);
    if (!requirements.length) {
      setErrorMsg("La contraseña debe tener entre 6 y 8 caracteres");
      setLoading(false);
      return;
    }
    
    if (!requirements.hasLetters || !requirements.hasNumbers) {
      setErrorMsg("La contraseña debe contener letras y números");
      setLoading(false);
      return;
    }
    
    try {
      // Prepara datos del usuario (incluye adminCode si esta en modo admin)
      const userData = { name, email, password };
      if (isAdminMode) {
        userData.adminCode = adminCode;
      }
      
      // Llamada a API para registro
      await api.post("/auth/register", userData);
      
      // Redirige al login tras registro exitoso
      navigate("/login");
    } catch (err) {
      // Muestra mensaje de error del servidor o genérico
      setErrorMsg(err.response?.data?.error || "No se pudo registrar");
    } finally {
      setLoading(false); 
    }
  };

  // Clases CSS reutilizables para inputs del formulario
  const inputBase =
    "w-full rounded-xl bg-neutral-950/50 border border-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none transition " +
    "focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20";

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <section className="hidden lg:block">
        <div className="max-w-md">
          <p className="text-emerald-200/90 text-sm font-medium">Crear cuenta</p>

          <h1 className="mt-2 text-4xl xl:text-5xl font-semibold leading-tight">
            Empieza a medir el{" "}
            <span className="text-emerald-400">impacto</span> de tus{" "}
            <span className="text-emerald-300">decisiones tecnológicas</span>.
          </h1>

          <p className="mt-4 text-white/70">
            Con tu cuenta podrás guardar simulaciones, comparar resultados y generar reportes.
          </p>
        </div>
      </section>

      <section className="w-full">
        <div
          className="relative max-w-md mx-auto rounded-2xl p-7
          bg-gradient-to-br from-white/10 to-white/5
          backdrop-blur-xl
          border border-emerald-400/20
          shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_30px_80px_-40px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Crear cuenta</h2>
            <FaUser className="text-xl text-emerald-300" />
          </div>

          <p className="mt-1 text-sm text-white/60">Regístrate en menos de un minuto.</p>

          {errorMsg ? (
            <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2">
              <FaTimesCircle className="mt-0.5 flex-shrink-0 text-red-300" />
              {errorMsg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Field label="Nombre completo" hint="Tu nombre completo">
              <input
                type="text"
                placeholder="Tu nombre"
                className={inputBase}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
              />
            </Field>

            <Field label="Correo electrónico" hint="Ej: tu@correo.com">
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className={inputBase}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
              />
            </Field>

            <Field label="Contraseña" hint="Mínimo 6–8 caracteres. Usa letras + números para mayor seguridad.">
              <div className="relative">
                <input
                  type={show ? "text" : "password"} 
                  placeholder="••••••••"
                  className={`${inputBase} pr-14`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                  minLength={6}
                  maxLength={8}
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    px-3 py-1.5 rounded-lg text-xs
                    bg-white/5 border border-white/10 text-white/70
                    hover:text-white hover:bg-white/10 transition"
                  aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {show ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                </button>
              </div>
    
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${passwordRequirements.length ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-white/60">
                    6-8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasLetters ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-white/60">
                    Letras
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumbers ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-white/60">
                    Números
                  </span>
                </div>
              </div>
            </Field>

            {isAdminMode && (
              <Field label="Código de administrador" hint="Código secreto proporcionado por el administrador">
                <input
                  type="password"
                  placeholder="Ingresa el código secreto"
                  className={inputBase}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                  aria-required="true"
                />
              </Field>
            )}

            <button
              type="submit"
              disabled={loading} 
              className="w-full rounded-xl py-3 font-semibold text-neutral-950
                bg-gradient-to-r from-emerald-500 to-emerald-600
                hover:from-emerald-400 hover:to-emerald-500
                transition-all duration-200
                shadow-lg shadow-emerald-500/25
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </div>
              ) : (
                "Registrar cuenta"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="text-sm text-emerald-300 hover:text-emerald-200 hover:underline flex items-center justify-center gap-1"
            >
              {isAdminMode ? (
                <>
                  <FaArrowLeft className="text-xs" /> Registrarse como usuario normal
                </>
              ) : (
                "¿Eres administrador?"
              )}
            </button>
          </div>

          <p className="mt-5 text-center text-white/60">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-emerald-200 hover:text-emerald-100 underline underline-offset-4"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}