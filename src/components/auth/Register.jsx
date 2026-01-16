// src/components/auth/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-white/80">{label}</label>
      {children}
      {hint ? <p className="text-xs text-white/50">{hint}</p> : null}
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const userData = { name, email, password };
      if (isAdminMode) {
        userData.adminCode = adminCode;
      }
      await api.post("/auth/register", userData);
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl bg-neutral-950/50 border border-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none transition " +
    "focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20";

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      {/* LADO IZQ */}
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

      {/* CARD */}
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
            <span className="text-xl">📝</span>
          </div>

          <p className="mt-1 text-sm text-white/60">Regístrate en menos de un minuto.</p>

          {errorMsg ? (
            <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMsg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Field label="Nombre completo">
              <input
                type="text"
                placeholder="Tu nombre"
                className={inputBase}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field label="Correo electrónico">
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className={inputBase}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Contraseña" hint="Usa letras + números para mayor seguridad.">
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputBase} pr-14`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    px-3 py-1.5 rounded-lg text-xs
                    bg-white/5 border border-white/10 text-white/70
                    hover:text-white hover:bg-white/10 transition"
                >
                  {show ? "Ocultar" : "Ver"}
                </button>
              </div>
            </Field>

            {/* ✅ Campo para código de administrador */}
            {isAdminMode && (
              <Field label="Código de administrador">
                <input
                  type="password"
                  placeholder="Ingresa el código secreto"
                  className={inputBase}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
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
                shadow-lg shadow-emerald-500/20
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {/* ✅ Botón para alternar modo admin */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="text-sm text-emerald-300 hover:text-emerald-200 hover:underline"
            >
              {isAdminMode ? "← Registrarse como usuario normal" : "¿Eres administrador?"}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-white/60">
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