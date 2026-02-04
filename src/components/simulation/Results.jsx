// src/components/simulation/Results.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ✅ Función robusta para obtener el nombre del usuario desde localStorage */
const getUserNameFromStorage = () => {
  try {
    const possibleKeys = ["user", "userData", "profile", "authUser"];
    for (const key of possibleKeys) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item);
          if (parsed.name) return parsed.name;
          if (parsed.nombre) return parsed.nombre;
          if (parsed.fullName) return parsed.fullName;
        } catch (e) {
          if (typeof item === "string" && item.trim()) return item;
        }
      }
    }
    return "Usuario registrado";
  } catch (err) {
    console.warn("Error al leer el nombre del usuario:", err);
    return "Usuario registrado";
  }
};

/* ✅ UI helpers (mismo estilo del Home/Dashboard) */
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

function ButtonPrimary({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 w-full",
        "rounded-xl font-semibold py-3 px-6",
        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-neutral-950",
        "hover:from-emerald-400 hover:to-emerald-500",
        "shadow-lg shadow-emerald-500/25 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
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

export default function Results() {
  const [device, setDevice] = useState(null);
  const [impact, setImpact] = useState({ CO2: 0, agua: 0, residuos: 0, score: 0 });
  const [decisionData, setDecisionData] = useState({ uso: "No registrada", finVida: "No registrada" });

  // ✅ certificado dentro de la página
  const [certData, setCertData] = useState(null);

  // ✅ refs separados: uno para scroll, otro para capturar PDF
  const certScrollRef = useRef(null);
  const certCaptureRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

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
          else if (decision === "donar") score += 12;

          setImpact({
            CO2: Math.round(initialImpact?.CO2 || initialImpact?.co2 || 0),
            agua: Math.round(initialImpact?.agua || initialImpact?.water || 0),
            residuos: Math.round(initialImpact?.residuos || initialImpact?.raee || 0),
            score: Math.max(20, Math.min(100, Math.round(score))),
          });

          setDecisionData({ uso: years, finVida: decision });
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        navigate("/dashboard");
      }
    };
    loadData();
  }, [id, navigate, location.state, years, decision, initialImpact]);

  const finVidaNormalized = useMemo(
    () => (decisionData.finVida || "").toLowerCase().trim(),
    [decisionData.finVida]
  );

  const showPuntoVerde = finVidaNormalized === "reciclar" || finVidaNormalized === "donar";

  const getRecommendations = () => {
    switch (finVidaNormalized) {
      case "tirar":
        return [
          "💡 Considera donar tu dispositivo. ¡Puede seguir siendo útil!",
          "♻️ Busca puntos de reciclaje autorizados en tu ciudad.",
          "🔋 Retira la batería antes de desechar. Es un residuo peligroso.",
        ];
      case "donar":
        return [
          "✅ ¡Excelente decisión! Donar extiende la vida útil del dispositivo.",
          "📍 Entrega tu dispositivo en el Punto Verde UIDE - Campus Loja.",
          "📱 Asegúrate de borrar todos tus datos antes de entregarlo.",
        ];
      case "reciclar":
        return [
          "✅ ¡Excelente decisión! El reciclaje reduce hasta el 80% de emisiones.",
          "📱 Guarda tus datos en la nube antes de entregar el dispositivo.",
          "Comparte esta acción en redes para inspirar a otros.",
        ];
      case "reparar":
        return [
          "🛠️ Reparar extiende la vida útil y reduce la demanda de nuevos recursos.",
          "🔧 Busca técnicos certificados para una reparación segura.",
          "❤️ C reparación evita residuos electrónicos innecesarios.",
        ];
      default:
        return [];
    }
  };

  // ✅✅✅ MEJORA: Informe PDF ocupa A4 completo + multi-página (sin deformar)
  const handleDownloadPDF = async () => {
    if (!device) return;

    const recommendations = getRecommendations();

    // A4 en pixeles aprox (96dpi)
    const A4_W = 794;
    const A4_H = 1123;

    const pdfContent = document.createElement("div");

    // “Lienzo” A4 real
    pdfContent.style.width = `${A4_W}px`;
    pdfContent.style.minHeight = `${A4_H}px`;
    pdfContent.style.padding = "52px";
    pdfContent.style.boxSizing = "border-box";
    pdfContent.style.fontFamily = "Inter, Arial, sans-serif";
    pdfContent.style.background = "#ffffff";
    pdfContent.style.color = "#0f172a";

    // oculto fuera de la pantalla
    pdfContent.style.position = "fixed";
    pdfContent.style.left = "-10000px";
    pdfContent.style.top = "0";
    pdfContent.style.borderRadius = "0";

    const badge = (label, value) => `
      <div style="
        display:inline-flex; gap:10px; align-items:center;
        padding:10px 14px; border-radius:999px;
        border:1px solid #e5e7eb; background:#f8fafc;
        font-size:12px; white-space:nowrap;">
        <span style="color:#0f766e; font-weight:800;">${label}</span>
        <span style="color:#0f172a; font-weight:800;">${value}</span>
      </div>
    `;

    pdfContent.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:18px;
        padding:18px 18px 14px; border-radius:16px;
        background:linear-gradient(135deg,#ecfdf5,#cffafe);
        border:1px solid #d1fae5;">
        <div style="flex:1;">
          <div style="font-size:12px; letter-spacing:1.6px; text-transform:uppercase; color:#065f46; font-weight:800;">
            SimuVidaTech
          </div>
          <div style="margin-top:6px; font-size:28px; font-weight:900; color:#064e3b;">
            Informe de Impacto Ambiental
          </div>
          <div style="margin-top:6px; font-size:13px; color:#334155;">
            Resultados estimados • Uso educativo
          </div>
        </div>
        <div style="text-align:right; min-width:180px;">
          <div style="font-size:12px; color:#0f766e; font-weight:800;">Puntuación ecológica</div>
          <div style="margin-top:6px; font-size:34px; font-weight:900; color:#047857; line-height:1;">
            ${impact.score}<span style="font-size:16px; color:#64748b;">/100</span>
          </div>
        </div>
      </div>

      <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
        ${badge("CO₂", `${impact.CO2} kg`)}
        ${badge("Agua", `${impact.agua} L`)}
        ${badge("RAEE", `${impact.residuos} kg`)}
        ${badge("Fin de vida", `${decisionData.finVida}`)}
      </div>

      <div style="margin-top:18px; display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
        <div style="border:1px solid #e5e7eb; border-radius:16px; padding:16px;">
          <div style="font-size:13px; font-weight:900; color:#064e3b; margin-bottom:10px;">Dispositivo</div>
          <div style="font-size:13px; line-height:1.8;">
            <div><b>Tipo:</b> ${device.type}</div>
            <div><b>Modelo:</b> ${device.model}</div>
            <div><b>Año:</b> ${device.year || "No especificado"}</div>
          </div>
        </div>

        <div style="border:1px solid #e5e7eb; border-radius:16px; padding:16px;">
          <div style="font-size:13px; font-weight:900; color:#064e3b; margin-bottom:10px;">Decisiones</div>
          <div style="font-size:13px; line-height:1.8;">
            <div><b>Uso:</b> ${decisionData.uso}</div>
            <div><b>Fin de vida:</b> ${decisionData.finVida}</div>
          </div>
        </div>
      </div>

      <div style="margin-top:14px; border:1px solid #e5e7eb; border-radius:16px; padding:16px;">
        <div style="font-size:13px; font-weight:900; color:#064e3b; margin-bottom:10px;">Recomendaciones</div>
        ${
          recommendations.length
            ? `<ul style="margin:0; padding-left:18px; font-size:13px; color:#0f172a; line-height:1.8;">
                ${recommendations.map((r) => `<li style="margin:6px 0;">${r}</li>`).join("")}
              </ul>`
            : `<div style="font-size:13px; color:#64748b;">No hay recomendaciones disponibles para este escenario.</div>`
        }
      </div>

      <div style="margin-top:18px; text-align:center; font-size:12px; color:#64748b;">
        © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
      </div>
    `;

    document.body.appendChild(pdfContent);

    try {
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210;
      const pageH = 297;

      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      // 1 página
      if (imgH <= pageH) {
        pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
      } else {
        // multi-página sin deformar
        let heightLeft = imgH;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
        heightLeft -= pageH;

        while (heightLeft > 0) {
          pdf.addPage();
          position -= pageH;
          pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
          heightLeft -= pageH;
        }
      }

      const cleanModel = device.model.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      pdf.save(`simuvidatech_${device.type}_${cleanModel}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("❌ Error al generar el PDF. Intenta nuevamente.");
    } finally {
      document.body.removeChild(pdfContent);
    }
  };

  // ✅ Generar certificado dentro de la misma vista
  const handleConfirmCommitment = () => {
    if (!device) return;

    const userName = getUserNameFromStorage();
    const now = new Date();

    setCertData({
      userName,
      device: `${device.type} - ${device.model}`,
      dateTime: now.toLocaleString("es-EC"),
      place: "UIDE – Campus Loja (Piloto)",
      code: `UIDE-RAEE-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate()
      ).padStart(2, "0")}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
    });

    setTimeout(() => {
      certScrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleDownloadCertificatePDF = async () => {
    if (!certCaptureRef.current || !device) return;

    try {
      const canvas = await html2canvas(certCaptureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");

      const pageW = 297;
      const pageH = 210;
      const margin = 4;

      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;

      const imgW = maxW;
      const imgH = (canvas.height * imgW) / canvas.width;

      const finalH = imgH > maxH ? maxH : imgH;
      const finalW = imgH > maxH ? (canvas.width * finalH) / canvas.height : imgW;

      const x = (pageW - finalW) / 2;
      const y = (pageH - finalH) / 2;

      pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
      pdf.save(`certificado_raee_${device.model.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Error certificado PDF:", err);
      alert("❌ No se pudo generar el certificado. Intenta nuevamente.");
    }
  };

  if (!device) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
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
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-emerald-200/90 font-medium">Simulación completada</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <span className="text-2xl">📊</span> Resultados finales
            </h1>
            <p className="mt-2 text-white/65 max-w-2xl">
              Tu {device.type} <strong>{device.model}</strong> ha sido evaluado.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Pill className="border-emerald-400/20 bg-emerald-500/10 text-emerald-200">
                🌿 CO₂: <b className="text-white/90">{impact.CO2}</b> kg
              </Pill>
              <Pill className="border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
                💧 Agua: <b className="text-white/90">{impact.agua}</b> L
              </Pill>
              <Pill className="border-lime-400/20 bg-lime-500/10 text-lime-200">
                ♻️ RAEE: <b className="text-white/90">{impact.residuos}</b> kg
              </Pill>
            </div>
          </div>

          <ButtonGhost onClick={() => navigate("/dashboard")}>← Volver al Dashboard</ButtonGhost>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* izquierda */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">🎯 Tus decisiones</h2>

            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4">
                <h3 className="font-medium text-emerald-200">Etapa 3: Uso</h3>
                <p className="mt-2 text-white/85">{decisionData.uso}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4">
                <h3 className="font-medium text-emerald-200">Etapa 5: Fin de vida</h3>
                <p className="mt-2 text-white/85">{decisionData.finVida}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-3">💡 Recomendaciones personalizadas</h3>
              <ul className="text-sm space-y-2 text-white/75">
                {getRecommendations().map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <ButtonPrimary onClick={handleDownloadPDF}>📄 Descargar informe completo</ButtonPrimary>
              <p className="mt-2 text-xs text-white/45">Resultados estimados con fines educativos.</p>
            </div>

            {/* Punto verde */}
            {showPuntoVerde && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-xl font-semibold mb-4">📍 Punto Verde UIDE – Campus Loja</h3>

                <div className="mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
                  <p className="font-semibold text-emerald-200">✅ ¡Tu decisión tiene impacto real!</p>
                  <p className="text-sm text-white/70 mt-1">Entrega tu dispositivo en nuestro punto verde institucional.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h4 className="font-semibold text-emerald-200 mb-2">✅ Aceptamos</h4>
                    <ul className="text-sm text-white/70 space-y-1">
                      <li>• Laptops y computadoras</li>
                      <li>• Teléfonos móviles</li>
                      <li>• Cargadores y cables</li>
                      <li>• Periféricos (teclados, mouse)</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h4 className="font-semibold text-red-200 mb-2">❌ No aceptamos</h4>
                    <ul className="text-sm text-white/70 space-y-1">
                      <li>• Baterías sueltas</li>
                      <li>• Electrodomésticos grandes</li>
                      <li>• Pantallas rotas (solo campañas especiales)</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <h4 className="font-semibold text-white mb-1">🕒 Horarios piloto</h4>
                  <p className="text-sm text-white/70">Lunes a viernes: 8:00 – 17:00</p>
                  <p className="text-sm text-white/70">Ubicación: Edificio Central, Planta Baja</p>
                </div>

                <a
                  href="https://www.google.com/maps?q=-3.9721021  ,-79.1991272"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl font-semibold
                    bg-white/[0.04] border border-white/10 text-white/80 hover:bg-white/[0.06] hover:text-white transition"
                >
                  🗺️ Cómo llegar a UIDE – Campus Loja
                </a>

                <div className="mt-6">
                  <ButtonPrimary onClick={handleConfirmCommitment}>✅ Declarar mi intención de entregar</ButtonPrimary>
                </div>

                {/* ✅ Certificado integrado (tal cual lo tienes) */}
                {certData && (
                  <div ref={certScrollRef} className="mt-6">
                    <div ref={certCaptureRef} className="bg-white rounded-3xl p-0 overflow-hidden">
                      <div className="relative mx-auto w-full bg-white overflow-hidden">
                        <div className="absolute inset-0 rounded-2xl border-[6px] border-emerald-600/20" />
                        <div className="absolute inset-[14px] rounded-xl border border-slate-300" />

                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="select-none text-[96px] md:text-[140px] font-black tracking-[0.18em] text-slate-200/30">
                            UIDE
                          </div>
                        </div>

                        <div className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-emerald-500/10 blur-2xl" />

                        <div className="relative h-full min-h-[690px] p-8 md:p-10 flex flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                                <span className="text-xl">🎓</span>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 leading-snug">
                                  Universidad Internacional del Ecuador
                                </p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-500 leading-snug">
                                  UIDE • Campus Loja
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Código</p>
                              <p className="mt-1 font-mono text-sm text-emerald-700">{certData.code}</p>
                              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold">
                                ♻️ Programa RAEE
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 text-center">
                            <div className="mx-auto h-1 w-20 bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-full" />
                            <h4 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-wide text-slate-900">
                              CERTIFICADO DE COMPROMISO RAEE
                            </h4>
                            <p className="mt-2 text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
                              Se otorga la presente constancia como declaración de{" "}
                              <span className="font-semibold text-slate-900">intención de entrega</span> para
                              disposición responsable de residuos electrónicos.
                            </p>
                          </div>

                          <div className="mt-7 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Otorgado a</p>
                                <div className="mt-2 border-b border-slate-300 pb-2">
                                  <p className="text-lg font-semibold text-slate-900 leading-snug break-words">
                                    {certData.userName}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Dispositivo</p>
                                <div className="mt-2 border-b border-slate-300 pb-2">
                                  <p className="text-lg font-semibold text-slate-900 leading-snug break-words">
                                    {certData.device}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Fecha y hora</p>
                                <div className="mt-2 border-b border-slate-300 pb-2">
                                  <p className="text-base font-semibold text-slate-900 leading-snug break-words">
                                    {certData.dateTime}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Lugar</p>
                                <div className="mt-2 border-b border-slate-300 pb-2">
                                  <p className="text-base font-semibold text-slate-900 leading-snug break-words">
                                    {certData.place}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                              <div className="md:col-span-2 grid grid-cols-2 gap-6">
                                <div className="text-center"></div>
                                <div className="text-center"></div>
                              </div>

                              <div className="flex md:justify-end justify-center">
                                <div className="h-24 w-24 rounded-full border-[5px] border-emerald-600/25 bg-emerald-50 flex items-center justify-center relative">
                                  <div className="h-16 w-16 rounded-full border border-emerald-600/25 bg-white flex items-center justify-center">
                                    <span className="text-2xl">🌿</span>
                                  </div>
                                  <div className="absolute -bottom-3 text-[10px] tracking-[0.18em] uppercase text-emerald-800 font-semibold">
                                    validado
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* sin footer */}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                      <ButtonPrimary onClick={handleDownloadCertificatePDF}>📄 Descargar certificado (PDF)</ButtonPrimary>

                      <button
                        onClick={() => window.print()}
                        className="w-full h-11 px-5 rounded-2xl font-semibold bg-white/[0.04] border border-white/10
                          text-white/80 hover:bg-white/[0.06] hover:text-white transition"
                      >
                        🖨️ Imprimir
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/[0.04]">
                  <h4 className="font-semibold text-white mb-2">📣 ¡Únete a nuestra campaña!</h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    ¿Tienes más dispositivos para donar? <br />
                    <b className="text-white">UIDE organiza campañas mensuales</b> de recolección RAEE. <br />
                    Sigue nuestras redes para enterarte de la próxima fecha.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* derecha */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">📈 Impacto ambiental final</h2>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="h-64 min-h-[16rem]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "CO₂", value: impact.CO2 },
                      { name: "Agua", value: impact.agua },
                      { name: "Residuos", value: impact.residuos },
                    ]}
                  >
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" />
                    <YAxis stroke="rgba(255,255,255,0.55)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                      itemStyle={{ color: "#a7f3d0" }}
                      labelStyle={{ color: "rgba(255,255,255,0.85)" }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Puntuación ecológica</span>
                <span className="text-2xl font-bold text-emerald-200">
                  {impact.score}
                  <span className="text-lg text-white/45">/100</span>
                </span>
              </div>

              <div className="mt-3 w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full"
                  style={{ width: `${impact.score}%` }}
                />
              </div>

              <p className="mt-4 text-sm text-white/55">Comparado con el promedio de dispositivos similares.</p>
            </div>
          </Card>
        </div>

        <div className="mt-10 text-center text-white/45 text-sm">
          © 2026 SimuVidaTech — Educar para proteger nuestro planeta.
        </div>
      </div>
    </div>
  );
}
