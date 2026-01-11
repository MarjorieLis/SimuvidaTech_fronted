// src/components/upload/UploadLaptop.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadLaptop() {
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [materials, setMaterials] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('✅ Laptop registrada. Ahora puedes simularla.');
      navigate('/simulation');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-eco-light py-8 px-4">
      {/* Encabezado */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-6 mb-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">💻 Subir laptop</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-eco-green transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* Formulario */}
      <main className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Información del dispositivo</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <input
                type="text"
                placeholder="Ej: MacBook Air M2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:outline-none"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Año de fabricación</label>
              <input
                type="number"
                placeholder="Ej: 2022"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:outline-none"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materiales visibles</label>
              <input
                type="text"
                placeholder="Ej: aluminio, plástico, vidrio"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:outline-none"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-eco-green hover:bg-emerald-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Subir laptop'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </footer>
    </div>
  );
}