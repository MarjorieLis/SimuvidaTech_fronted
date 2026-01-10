// src/App.jsx
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import { isAuthenticated, getUser, logout } from "./utils/auth";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const user = getUser();

  const isRegister = location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            to={authenticated ? "/dashboard" : "/login"}
            className="flex items-center gap-2 font-semibold"
          >
            <span className="text-xl">🌱</span>
            <span className="tracking-wide">SimuVidaTech</span>
          </Link>

          {/* ACCIONES NAV */}
          <div className="flex items-center gap-2">
            {!authenticated ? (
              <>
                {/* ✅ Solo Registrarse (sin botón Iniciar sesión) */}
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
              </>
            ) : (
              <>
                <span className="hidden sm:block text-sm text-white/70">
                  Hola{user?.name ? `, ${user.name}` : ""}
                </span>

                <Link
                  to="/dashboard"
                  className="px-4 py-1.5 rounded-full text-sm transition
                    bg-white/5 border border-white/10 text-white/80
                    hover:text-white hover:bg-white/10"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full text-sm transition
                    bg-red-500/10 border border-red-400/30 text-red-300
                    hover:bg-red-500/20 hover:text-red-200"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 relative overflow-hidden">
        {/* Fondo premium */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
          <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
          <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/login"
              element={
                authenticated ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />

            <Route
              path="/register"
              element={
                authenticated ? <Navigate to="/dashboard" replace /> : <Register />
              }
            />

            <Route
              path="/dashboard"
              element={
                authenticated ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </main>

      {/* FOOTER (solo público) */}
      {!authenticated && (
        <footer className="border-t border-white/10 bg-neutral-950/60 backdrop-blur-xl py-5">
          <div className="max-w-6xl mx-auto px-4 text-center text-white/60 text-sm">
            © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
          </div>
        </footer>
      )}
    </div>
  );
}
