// src/components/home/Home.jsx
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

export default function Home() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleExplore = (type) => {
    // ✅ Siempre redirige a la simulación DEMO (pública)
    navigate(`/demo/${type}`);
  };

  const handleUpload = (type) => {
    // Solo usuarios logueados pueden subir su dispositivo
    if (authenticated) {
      navigate(`/upload/${type}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo premium */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-3">
            <span className="text-3xl">🌱</span>
            SimuVidaTech
          </h1>
          <p className="text-xl text-white/70 mb-12">
            Descubre el impacto ambiental de tus dispositivos electrónicos y toma decisiones más sostenibles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Card Teléfonos */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleExplore('telefono')}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 
                  border border-emerald-500/30 p-6 text-left hover:from-emerald-800/60 hover:to-cyan-800/60 
                  transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📱</span>
                  <h2 className="text-2xl font-semibold">Explorar teléfonos</h2>
                </div>
                <p className="text-white/70 text-sm">
                  Simulación demo: ciclo de vida y decisiones ecológicas.
                </p>
                <div className="absolute -bottom-1 -right-1 w-16 h-16 rounded-full bg-emerald-500/20 blur-xl group-hover:w-24 group-hover:h-24 transition-all" />
              </button>

              {authenticated && (
                <button
                  onClick={() => handleUpload('telefono')}
                  className="text-center text-sm text-emerald-300 hover:underline"
                >
                  Subir mi teléfono
                </button>
              )}
            </div>

            {/* Card Laptops */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleExplore('laptop')}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 
                  border border-emerald-500/30 p-6 text-left hover:from-emerald-800/60 hover:to-cyan-800/60 
                  transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💻</span>
                  <h2 className="text-2xl font-semibold">Explorar laptops</h2>
                </div>
                <p className="text-white/70 text-sm">
                  Simulación demo: análisis de impacto y fin de vida responsable.
                </p>
                <div className="absolute -bottom-1 -right-1 w-16 h-16 rounded-full bg-emerald-500/20 blur-xl group-hover:w-24 group-hover:h-24 transition-all" />
              </button>

              {authenticated && (
                <button
                  onClick={() => handleUpload('laptop')}
                  className="text-center text-sm text-emerald-300 hover:underline"
                >
                  Subir mi laptop
                </button>
              )}
            </div>
          </div>

          {!authenticated && (
            <p className="mt-10 text-white/60 text-sm">
              ¿Quieres guardar tus resultados?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-emerald-300 hover:underline"
              >
                Regístrate gratis
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center text-white/45 text-sm">
        © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
      </div>
    </div>
  );
}