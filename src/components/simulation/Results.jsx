import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ✅ Función robusta para obtener el nombre del usuario desde localStorage
const getUserNameFromStorage = () => {
  try {
    const possibleKeys = ['user', 'userData', 'profile', 'authUser'];
    for (const key of possibleKeys) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item);
          if (parsed.name) return parsed.name;
          if (parsed.nombre) return parsed.nombre;
          if (parsed.fullName) return parsed.fullName;
        } catch (e) {
          if (typeof item === 'string' && item.trim()) {
            return item;
          }
        }
      }
    }
    return 'Usuario registrado';
  } catch (err) {
    console.warn('Error al leer el nombre del usuario:', err);
    return 'Usuario registrado';
  }
};

export default function Results() {
  const [device, setDevice] = useState(null);
  const [impact, setImpact] = useState({ CO2: 0, agua: 0, residuos: 0, score: 0 });
  const [decisionData, setDecisionData] = useState({ uso: 'No registrada', finVida: 'No registrada' });
  const [isCertificadoVisible, setIsCertificadoVisible] = useState(false); // Estado para controlar la visibilidad del certificado
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Extraer estado enviado desde Simulation.jsx
  const { years, decision, impact: initialImpact } = location.state || {};

  useEffect(() => {
    const loadData = async () => {
      try {
        const deviceRes = await api.get(`/devices/${id}`);
        setDevice(deviceRes.data);

        if (years !== undefined && decision) {
          let score = 100;
          if (years === "1 año") score -= 20;
          else if (years === "2 años") score -= 10;

          if (decision === "tirar") score -= 30;
          else if (decision === "reparar") score += 10;
          else if (decision === "reciclar") score += 15;

          setImpact({
            CO2: Math.round(initialImpact?.CO2 || initialImpact?.co2 || 0),
            agua: Math.round(initialImpact?.agua || initialImpact?.water || 0),
            residuos: Math.round(initialImpact?.residuos || initialImpact?.raee || 0),
            score: Math.max(20, Math.min(100, Math.round(score)))
          });

          setDecisionData({
            uso: years,
            finVida: decision
          });
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        navigate('/dashboard');
      }
    };
    loadData();
  }, [id, navigate, location.state]);

  const getRecommendations = () => {
    const finVida = (decisionData.finVida || '').toLowerCase().trim();

    switch (finVida) {
      case "tirar":
        return [
          "💡 Considera donar tu dispositivo. ¡Puede seguir siendo útil!",
          "♻️ Busca puntos de reciclaje autorizados en tu ciudad.",
          "🔋 Retira la batería antes de desechar. Es un residuo peligroso."
        ];
      case "donar":
        return [
          "✅ ¡Excelente decisión! Donar extiende la vida útil del dispositivo.",
          "📍 Entrega tu dispositivo en el Punto Verde UIDE - Campus Loja.",
          "📱 Asegúrate de borrar todos tus datos antes de entregarlo."
        ];
      case "reciclar":
        return [
          "✅ ¡Excelente decisión! El reciclaje reduce hasta el 80% de emisiones.",
          "📱 Guarda tus datos en la nube antes de entregar el dispositivo.",
          "🌍 Comparte esta acción en redes para inspirar a otros."
        ];
      case "reparar":
        return [
          "🛠️ Reparar extiende la vida útil y reduce la demanda de nuevos recursos.",
          "🔧 Busca técnicos certificados para una reparación segura.",
          "❤️ Cada reparación evita ~50 kg de residuos electrónicos."
        ];
      default:
        return [];
    }
  };

  const handleDownloadPDF = async () => {
    if (!device) return;

    const pdfContent = document.createElement('div');
    pdfContent.style.width = '800px';
    pdfContent.style.padding = '40px';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.color = 'black';
    pdfContent.style.fontSize = '14px';

    pdfContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #047857; font-size: 28px;">SimuVidaTech</h1>
        <p style="font-size: 16px; color: #1f2937;">Informe de Impacto Ambiental</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 2px solid #047857; padding-bottom: 8px;">Dispositivo</h2>
        <p><strong>Tipo:</strong> ${device.type}</p>
        <p><strong>Modelo:</strong> ${device.model}</p>
        <p><strong>Año:</strong> ${device.year || 'No especificado'}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 2px solid #047857; padding-bottom: 8px;">Decisiones Tomadas</h2>
        <p><strong>Uso:</strong> ${decisionData.uso}</p>
        <p><strong>Fin de vida:</strong> ${decisionData.finVida}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="color: #047857; border-bottom: 2px solid #047857; padding-bottom: 8px;">Impacto Ambiental</h2>
        <p><strong>CO₂:</strong> ${impact.CO2} kg</p>
        <p><strong>Agua:</strong> ${impact.agua} L</p>
        <p><strong>Residuos:</strong> ${impact.residuos} kg</p>
        <p><strong>Puntuación ecológica:</strong> ${impact.score}/100</p>
      </div>

      <div>
        <h2 style="color: #047857; border-bottom: 2px solid #047857; padding-bottom: 8px;">Recomendaciones</h2>
        <ul style="padding-left: 20px;">
          ${getRecommendations().map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
        © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
      </div>
    `;

    document.body.appendChild(pdfContent);

    try {
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cleanModel = device.model.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      pdf.save(`simuvidatech_${device.type}_${cleanModel}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('❌ Error al generar el PDF. Intenta nuevamente.');
    } finally {
      document.body.removeChild(pdfContent);
    }
  };

  const handleConfirmCommitment = () => {
    const userName = getUserNameFromStorage();
    const certContent = `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; background: white; color: black;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #047857; font-size: 28px;">CERTIFICADO DE COMPROMISO DE DISPOSICIÓN RESPONSABLE DE RAEE</h1>
          <p style="font-size: 16px; color: #1f2937;">Universidad Internacional del Ecuador – UIDE</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p><strong>Nombre del usuario:</strong> ${userName}</p>
          <p><strong>Dispositivo:</strong> ${device.type} - ${device.model}</p>
          <p><strong>Fecha y hora de compromiso:</strong> ${new Date().toLocaleString('es-EC')}</p>
          <p><strong>Lugar:</strong> UIDE – Campus Loja (Piloto)</p>
        </div>
        
        <div style="background: #fef9f7; border-left: 4px solid #dc2626; padding: 16px; margin: 24px 0; font-size: 14px; color: #991b1b;">
          ⚠️ <strong>Nota importante:</strong> Este certificado confirma tu <strong>intención de entregar</strong> el dispositivo en el Punto Verde UIDE.  
          La entrega física es responsabilidad del usuario y no es verificada por el sistema.
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="background: #047857; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
            🖨️ Imprimir certificado de compromiso
          </button>
        </div>
      </div>
    `;

    const certWindow = window.open('', '_blank', 'width=800,height=600');
    certWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificado UIDE</title>
          <style>
            body { margin: 0; padding: 20px; background: #f8fafc; }
            @media print {
              body { background: white; }
            }
          </style>
        </head>
        <body>${certContent}</body>
      </html>
    `);
    certWindow.document.close();
    setIsCertificadoVisible(true); // Activamos la visibilidad del certificado
  };

  if (!device) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute -top-32 -left-28 h-[26rem] w-[26rem] rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-[26rem] w-[26rem] rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-emerald-200/90 font-medium">Simulación completada</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <span className="text-2xl">📊</span> Resultados finales
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Tu {device.type} <strong>{device.model}</strong> ha sido evaluado.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            ← Volver al Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel izquierdo: decisiones y recomendaciones */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">🎯 Tus decisiones</h2>

            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                <h3 className="font-medium text-emerald-200">Etapa 3: Uso</h3>
                <p className="mt-2 text-white/80">{decisionData.uso}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                <h3 className="font-medium text-emerald-200">Etapa 5: Fin de vida</h3>
                <p className="mt-2 text-white/80">{decisionData.finVida}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3">💡 Recomendaciones personalizadas</h3>
              <ul className="text-sm space-y-2">
                {getRecommendations().map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón PDF */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={handleDownloadPDF}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950 font-semibold py-3 px-6 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 transition"
              >
                📄 Descargar informe completo
              </button>
            </div>

            {/* ✅ PUNTO VERDE UIDE - CON DIRECCIÓN EXACTA */}
            {(decisionData.finVida === 'reciclar' || decisionData.finVida === 'donar') && (
              <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4">📍 Punto Verde UIDE – Campus Loja</h3>

                <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg">
                  <p className="font-medium text-emerald-300">✅ ¡Tu decisión tiene impacto real!</p>
                  <p>Elige entregar tu dispositivo en nuestro punto verde institucional.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-emerald-300 mb-2">✅ Aceptamos:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Laptops y computadoras</li>
                      <li>• Teléfonos móviles</li>
                      <li>• Cargadores y cables</li>
                      <li>• Periféricos (teclados, mouse)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-300 mb-2">❌ No aceptamos:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Baterías sueltas</li>
                      <li>• Electrodomésticos grandes</li>
                      <li>• Pantallas rotas (solo en campañas especiales)</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
                  <h4 className="font-semibold text-blue-300 mb-1">🕒 Horarios piloto:</h4>
                  <p className="text-sm">Lunes a viernes: 8:00 – 17:00</p>
                  <p className="text-sm">Ubicación: Edificio Central, Planta Baja</p>
                </div>

                <a
                  href="https://www.google.com/maps?q=-3.9721021,-79.1991272"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-neutral-950 rounded-lg hover:bg-emerald-600 transition"
                >
                  🗺️ Cómo llegar a UIDE – Campus Loja
                </a>
              </div>
            )}

            {/* ✅ BOTÓN DE COMPROMISO (NO DE ENTREGA FÍSICA) */}
            {(decisionData.finVida === 'reciclar' || decisionData.finVida === 'donar') && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={handleConfirmCommitment}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
                >
                  ✅ Declarar mi intención de entregar en Punto Verde UIDE
                </button>
              </div>
            )}

            {/* ✅ CAMPAÑA DE DONACIÓN INSTITUCIONAL */}
            {(decisionData.finVida === 'reciclar' || decisionData.finVida === 'donar') && (
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30">
                <h3 className="font-semibold text-purple-300 mb-2">📣 ¡Únete a nuestra campaña!</h3>
                <p className="text-sm">
                  ¿Tienes más dispositivos para donar?  
                  <br />
                  <strong>UIDE organiza campañas mensuales</strong> de recolección de RAEE.  
                  <br />
                  Sigue nuestras redes para enterarte de la próxima fecha.
                </p>
              </div>
            )}
          </div>

          {/* Panel derecho: impacto final */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">📈 Impacto ambiental final</h2>

            <div className="h-64 min-h-[16rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'CO₂', value: impact.CO2 },
                  { name: 'Agua', value: impact.agua },
                  { name: 'Residuos', value: impact.residuos }
                ]}>
                  <XAxis dataKey="name" stroke="#4ade80" />
                  <YAxis stroke="#4ade80" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#0e7490' }}
                    itemStyle={{ color: '#4ade80' }}
                  />
                  <Bar dataKey="value" fill="#0e7490" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Puntuación ecológica</span>
                <span className="text-2xl font-bold text-emerald-300">{impact.score}<span className="text-lg">/100</span></span>
              </div>
              <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" 
                  style={{ width: `${impact.score}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 text-sm text-white/60">
              <p>Comparado con el promedio de dispositivos similares.</p>
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
