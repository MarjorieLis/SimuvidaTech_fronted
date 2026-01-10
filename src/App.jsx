// src/App.jsx
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

export default function App() {
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/login" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🌱</span>
            <span className="tracking-wide">SimuVidaTech</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={[
                "px-4 py-1.5 rounded-full text-sm transition",
                isLogin
                  ? "text-white bg-white/5 border border-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              Iniciar sesión
            </Link>

            <Link
              to="/register"
              className={[
                "px-4 py-1.5 rounded-full text-sm transition border",
                isRegister
                  ? "bg-emerald-500/25 text-emerald-100 border-emerald-400/35"
                  : "bg-emerald-500/15 text-emerald-200 border-emerald-400/25 hover:bg-emerald-500/25",
              ].join(" ")}
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 relative overflow-hidden">
        {/* Fondo premium */}
        <div className="absolute inset-0">
          {/* Degradado suave general */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />

          {/* Spotlights */}
          <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
          <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Patrón punteado fino */}
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />

          {/* Viñeta (oscurece bordes para look pro) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
        </div>

        {/* Contenido */}
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-neutral-950/60 backdrop-blur-xl py-5">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/60 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </footer>
    </div>
  );
}
