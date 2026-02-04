// src/components/admin/AdminUsers.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ✅ UI helpers */
function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ButtonGhost({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2",
        "px-4 py-2 rounded-full text-sm font-semibold",
        "bg-white/[0.04] border border-white/10 text-white/80",
        "hover:bg-white/[0.06] hover:text-white transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Pill({ className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
        "bg-white/[0.04] border-white/10 text-white/70",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await api.get("/users/admin");
        setUsers(response.data || []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4">Cargando usuarios...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo igual al sistema */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Header sticky */}
      <div className="relative sticky top-0 z-50 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <div>
            <p className="text-xs text-emerald-200/80 font-medium">Administración</p>
            <h1 className="text-lg sm:text-xl font-semibold">Todos los usuarios</h1>
          </div>

          <div className="flex items-center gap-2">
            <ButtonGhost onClick={() => navigate("/dashboard")}>← Dashboard</ButtonGhost>
            <ButtonGhost onClick={() => navigate("/admin")}>← Admin</ButtonGhost>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <Pill className="border-white/10 bg-white/[0.04] text-white/70">👥 {users.length} usuarios</Pill>
            <Pill className="border-emerald-400/20 bg-emerald-500/10 text-emerald-200">✅ Activos</Pill>
          </div>
        </div>

        {users.length === 0 ? (
          <Card className="p-10 text-center text-white/60">No hay usuarios registrados.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user) => (
              <Card key={user.id} className="p-5 hover:bg-white/[0.06] transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👤</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <p className="text-white/60 text-sm truncate">{user.email}</p>
                    <p className="text-white/50 text-xs mt-1">
                      Rol: {user.role === "admin" ? "Administrador" : "Usuario"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-white/50">{new Date(user.created_at).toLocaleDateString()}</span>
                  <span
                    className={[
                      "px-2 py-1 rounded-full text-xs border",
                      user.role === "admin"
                        ? "bg-violet-500/10 text-violet-200 border-violet-400/20"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
                    ].join(" ")}
                  >
                    {user.role === "admin" ? "🛡️ Admin" : "✅ Usuario"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10 text-center text-white/45 text-sm">© 2026 SimuVidaTech — Panel de administración</div>
      </div>
    </div>
  );
}
