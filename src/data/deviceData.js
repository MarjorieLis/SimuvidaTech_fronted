// src/data/deviceData.js
const BASE_DATA = {
  telefono: {
    name: "Teléfono promedio",
    baseCO2: 150,
    baseAgua: 100,
    baseResiduos: 10,
    extraction: "50 kg de minerales extraídos",
    manufacturing: "80 L de agua usados en fábrica",
    transport: "12,000 km de transporte global"
  },
  laptop: {
    name: "Laptop promedio",
    baseCO2: 300,
    baseAgua: 200,
    baseResiduos: 20,
    extraction: "200 kg de minerales extraídos",
    manufacturing: "300 L de agua usados en fábrica",
    transport: "15,000 km de transporte global"
  }
};

export const getAdjustedImpact = (type, year) => {
  const now = new Date().getFullYear(); // 2026
  const base = BASE_DATA[type];

  if (!base || !year) {
    return { ...base, score: 70 };
  }

  const yearsDiff = now - parseInt(year, 10);
  let efficiencyFactor = 1.0 + Math.min(0.5, yearsDiff * 0.05);

  const CO2 = Math.round(base.baseCO2 * efficiencyFactor);
  const agua = Math.round(base.baseAgua * efficiencyFactor);
  const residuos = Math.round(base.baseResiduos * efficiencyFactor);
  const score = Math.max(20, Math.min(100, 100 - (CO2 / base.baseCO2) * 50));

  return {
    ...base,
    CO2,
    agua,
    residuos,
    score: Math.round(score)
  };
};

export const deviceData = BASE_DATA;