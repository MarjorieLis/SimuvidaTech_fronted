/**
 * AIModelSelector — Base de datos de dispositivos con propiedades visuales 3D
 */

// Helper para crear entradas rápido
const p = (name, year, color, cameras, form, metal, rough, materials) =>
    ({ name, year, color, cameras, form, metal, rough, materials });
const l = (name, year, color, form, isPro, isUltra, metal, rough, materials, screenGlow) =>
    ({ name, year, color, form, isPro, isUltra, metal, rough, materials, screenGlow: screenGlow || '#1a2a5e' });

const PHONE_DB = [
    // Apple iPhone
    p("Apple iPhone SE (2020)", 2020, "#e5e5ea", 1, "mini", 0.8, 0.15, "aluminio, vidrio, litio"),
    p("Apple iPhone SE (2022)", 2022, "#ffffff", 1, "mini", 0.8, 0.15, "aluminio, vidrio, litio"),
    p("Apple iPhone 11", 2019, "#1c1c1e", 2, "standard", 0.75, 0.2, "aluminio, vidrio, litio"),
    p("Apple iPhone 11 Pro", 2019, "#4a4a4d", 3, "standard", 0.85, 0.1, "acero inoxidable, vidrio, litio"),
    p("Apple iPhone 11 Pro Max", 2019, "#3a3a2e", 3, "ultra", 0.85, 0.1, "acero inoxidable, vidrio, litio"),
    p("Apple iPhone 12", 2020, "#1c1c1e", 2, "standard", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 12 mini", 2020, "#6e3a4f", 2, "mini", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 12 Pro", 2020, "#c0bfb8", 3, "standard", 0.9, 0.08, "acero inoxidable, vidrio cerámico, litio"),
    p("Apple iPhone 12 Pro Max", 2020, "#3a3a2e", 3, "ultra", 0.9, 0.08, "acero inoxidable, vidrio cerámico, litio"),
    p("Apple iPhone 13", 2021, "#394c3f", 2, "standard", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 13 mini", 2021, "#f2d4bb", 2, "mini", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 13 Pro", 2021, "#4e8d7c", 3, "standard", 0.9, 0.07, "acero inoxidable, vidrio cerámico, litio"),
    p("Apple iPhone 13 Pro Max", 2021, "#1a1a1e", 3, "ultra", 0.9, 0.07, "acero inoxidable, vidrio cerámico, litio"),
    p("Apple iPhone 14", 2022, "#f9d4c8", 2, "standard", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 14 Plus", 2022, "#3d4b5e", 2, "standard", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 14 Pro", 2022, "#4a4b3e", 3, "standard", 0.9, 0.07, "titanio, vidrio cerámico, litio"),
    p("Apple iPhone 14 Pro Max", 2022, "#2d2c2e", 3, "ultra", 0.9, 0.07, "titanio, vidrio cerámico, litio"),
    p("Apple iPhone 15", 2023, "#e2c4b5", 2, "standard", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 15 Plus", 2023, "#3d5a6e", 2, "standard", 0.85, 0.1, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 15 Pro", 2023, "#4a3728", 3, "standard", 0.92, 0.06, "titanio, vidrio cerámico, litio"),
    p("Apple iPhone 15 Pro Max", 2023, "#c9bcab", 4, "ultra", 0.92, 0.06, "titanio, vidrio cerámico, litio"),
    p("Apple iPhone 16", 2024, "#2e3f3b", 2, "standard", 0.87, 0.09, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 16 Plus", 2024, "#5b3a5e", 2, "standard", 0.87, 0.09, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 16 Pro", 2024, "#3a2c20", 4, "standard", 0.93, 0.05, "titanio grado 5, vidrio cerámico, litio"),
    p("Apple iPhone 16 Pro Max", 2024, "#cdc2b3", 4, "ultra", 0.93, 0.05, "titanio grado 5, vidrio cerámico, litio"),
    p("Apple iPhone 17", 2025, "#1a1a20", 2, "standard", 0.88, 0.08, "aluminio, vidrio cerámico, litio"),
    p("Apple iPhone 17 Pro", 2025, "#2a2018", 4, "standard", 0.94, 0.04, "titanio grado 5, vidrio cerámico, litio"),
    p("Apple iPhone 17 Pro Max", 2025, "#d0c5b0", 4, "ultra", 0.94, 0.04, "titanio grado 5, vidrio cerámico, litio"),
    // Samsung Galaxy S
    p("Samsung Galaxy S20", 2020, "#a0a8b0", 3, "standard", 0.8, 0.2, "aluminio, Gorilla Glass 6, litio"),
    p("Samsung Galaxy S20 Ultra", 2020, "#1a1a2e", 4, "ultra", 0.85, 0.15, "aluminio, Gorilla Glass 6, litio"),
    p("Samsung Galaxy S21", 2021, "#c8b8e0", 3, "standard", 0.8, 0.2, "aluminio, Gorilla Glass Victus, litio"),
    p("Samsung Galaxy S21 FE", 2022, "#3d5a8c", 3, "standard", 0.75, 0.25, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy S21 Ultra", 2021, "#1a1a2e", 4, "ultra", 0.85, 0.15, "aluminio, Gorilla Glass Victus, litio"),
    p("Samsung Galaxy S22", 2022, "#e8d5c0", 3, "standard", 0.82, 0.18, "aluminio, Gorilla Glass Victus+, litio"),
    p("Samsung Galaxy S22 Ultra", 2022, "#1a2030", 4, "ultra", 0.88, 0.12, "aluminio, Gorilla Glass Victus+, litio"),
    p("Samsung Galaxy S23", 2023, "#c5bcf0", 3, "standard", 0.82, 0.18, "aluminio, Gorilla Glass Victus 2, litio"),
    p("Samsung Galaxy S23+", 2023, "#3a4a5e", 3, "standard", 0.82, 0.18, "aluminio, Gorilla Glass Victus 2, litio"),
    p("Samsung Galaxy S23 Ultra", 2023, "#1a1a1a", 4, "ultra", 0.9, 0.1, "titanio, Gorilla Glass Victus 2, litio"),
    p("Samsung Galaxy S24", 2024, "#2d4a3e", 3, "standard", 0.83, 0.17, "titanio, Gorilla Glass Armor, litio"),
    p("Samsung Galaxy S24+", 2024, "#1f2d3d", 3, "standard", 0.83, 0.17, "titanio, Gorilla Glass Armor, litio"),
    p("Samsung Galaxy S24 Ultra", 2024, "#2c2c2c", 4, "ultra", 0.92, 0.08, "titanio grado 4, Gorilla Glass Armor, litio"),
    p("Samsung Galaxy S25", 2025, "#3d6b8c", 3, "standard", 0.85, 0.15, "titanio, Gorilla Glass Armor 2, litio"),
    p("Samsung Galaxy S25+", 2025, "#2a3a4e", 3, "standard", 0.85, 0.15, "titanio, Gorilla Glass Armor 2, litio"),
    p("Samsung Galaxy S25 Ultra", 2025, "#1e1e1e", 4, "ultra", 0.93, 0.07, "titanio grado 5, Gorilla Glass Armor 2, litio"),
    // Samsung Galaxy A
    p("Samsung Galaxy A10", 2019, "#2a3a4a", 1, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A12", 2020, "#2a3444", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A13", 2022, "#1e2a3e", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A14", 2023, "#2d3a4a", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A15", 2024, "#1a2940", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A20", 2019, "#1a1a2e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A21s", 2020, "#1a3040", 4, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A25", 2024, "#1e4080", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A30", 2019, "#2a3a4a", 2, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A32", 2021, "#3a2a5e", 4, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A33", 2022, "#2a4a3e", 4, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A34", 2023, "#3a3a5e", 3, "standard", 0.5, 0.5, "aluminio, vidrio, litio"),
    p("Samsung Galaxy A35", 2024, "#3d5c6e", 3, "standard", 0.5, 0.5, "aluminio, vidrio Gorilla Glass, litio"),
    p("Samsung Galaxy A50", 2019, "#2a2a4a", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A51", 2019, "#2e3a5e", 4, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A52", 2021, "#3a4a6e", 4, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A53", 2022, "#2a4a5e", 4, "standard", 0.5, 0.5, "aluminio, vidrio, litio"),
    p("Samsung Galaxy A54", 2023, "#2a4a5e", 3, "standard", 0.55, 0.45, "aluminio, vidrio, litio"),
    p("Samsung Galaxy A55", 2024, "#4a3560", 3, "standard", 0.6, 0.4, "aluminio, vidrio Gorilla, litio"),
    p("Samsung Galaxy A70", 2019, "#1a2a3a", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A71", 2020, "#2a3a5e", 4, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A72", 2021, "#3a4a6e", 4, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("Samsung Galaxy A73", 2022, "#4a5a7e", 4, "standard", 0.5, 0.5, "aluminio, vidrio, litio"),
    // Samsung Z
    p("Samsung Galaxy Z Fold 3", 2021, "#1a1a2e", 3, "fold", 0.85, 0.15, "aluminio, Gorilla Glass Victus, litio"),
    p("Samsung Galaxy Z Fold 4", 2022, "#2a2a3e", 3, "fold", 0.87, 0.13, "aluminio, Gorilla Glass Victus+, litio"),
    p("Samsung Galaxy Z Fold 5", 2023, "#1a1a2e", 3, "fold", 0.88, 0.12, "titanio, Gorilla Glass Victus 2, litio"),
    p("Samsung Galaxy Z Fold 6", 2024, "#c0ad8a", 3, "fold", 0.9, 0.1, "titanio, Gorilla Glass Armor, litio"),
    p("Samsung Galaxy Z Flip 3", 2021, "#6e5a8e", 2, "flip", 0.82, 0.18, "aluminio, Gorilla Glass Victus, litio"),
    p("Samsung Galaxy Z Flip 4", 2022, "#3a5a6e", 2, "flip", 0.84, 0.16, "aluminio, Gorilla Glass Victus+, litio"),
    p("Samsung Galaxy Z Flip 5", 2023, "#8b4a8e", 2, "flip", 0.85, 0.15, "aluminio, Gorilla Glass Flexion, litio"),
    p("Samsung Galaxy Z Flip 6", 2024, "#6e8a3e", 2, "flip", 0.87, 0.13, "aluminio, Gorilla Glass Flexion, litio"),
    // Xiaomi
    p("Xiaomi Redmi Note 10", 2021, "#2a3a50", 4, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Xiaomi Redmi Note 11", 2022, "#2a4060", 4, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Xiaomi Redmi Note 12", 2023, "#1e3a5e", 3, "standard", 0.45, 0.55, "policarbonato, vidrio Gorilla, litio"),
    p("Xiaomi Redmi Note 13", 2024, "#2a2040", 3, "standard", 0.5, 0.5, "aluminio, vidrio AGC, litio"),
    p("Xiaomi Redmi Note 13 Pro", 2024, "#1a1a3e", 3, "standard", 0.6, 0.4, "aluminio, vidrio Gorilla, litio"),
    p("Xiaomi Redmi Note 13 Pro+", 2024, "#2a1a4e", 4, "standard", 0.65, 0.35, "aluminio, vidrio Gorilla, litio"),
    p("Xiaomi Redmi 12", 2023, "#3a4a5e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Xiaomi Redmi 13C", 2024, "#2a3a4e", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Xiaomi 13", 2023, "#1a1a1a", 3, "standard", 0.8, 0.2, "vidrio Gorilla Victus, aluminio, litio"),
    p("Xiaomi 13 Pro", 2023, "#f0f0f0", 3, "standard", 0.85, 0.15, "cerámica, vidrio Gorilla, litio"),
    p("Xiaomi 13T", 2023, "#2a3a4a", 3, "standard", 0.75, 0.25, "aluminio, vidrio Gorilla, litio"),
    p("Xiaomi 14", 2024, "#1a1a1a", 3, "standard", 0.82, 0.18, "titanio, Gorilla Glass Victus 2, litio"),
    p("Xiaomi 14 Ultra", 2024, "#2a2016", 4, "ultra", 0.88, 0.12, "titanio, cerámica nano, litio"),
    p("Xiaomi 14T Pro", 2024, "#1a2a3a", 3, "standard", 0.78, 0.22, "aluminio, vidrio Gorilla, litio"),
    p("Xiaomi Poco X5 Pro", 2023, "#1a2a3a", 3, "standard", 0.6, 0.4, "policarbonato, vidrio, litio"),
    p("Xiaomi Poco X6 Pro", 2024, "#1a2a1a", 3, "standard", 0.7, 0.3, "aluminio, vidrio AG, litio"),
    p("Xiaomi Poco F5", 2023, "#1a1a2e", 3, "standard", 0.7, 0.3, "aluminio, vidrio Gorilla, litio"),
    p("Xiaomi Poco F6 Pro", 2024, "#0a1a2a", 3, "standard", 0.75, 0.25, "aluminio, vidrio Gorilla, litio"),
    p("Xiaomi Poco M5", 2022, "#2a3a3a", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    // Motorola
    p("Motorola Moto G6", 2018, "#3a4a5e", 2, "standard", 0.4, 0.6, "vidrio, aluminio, litio"),
    p("Motorola Moto G7", 2019, "#2a3a4e", 2, "standard", 0.4, 0.6, "vidrio, aluminio, litio"),
    p("Motorola Moto G8", 2020, "#2a3a4a", 3, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Motorola Moto G9", 2020, "#1a2a3a", 3, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Motorola Moto G13", 2023, "#2a3a4e", 3, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Motorola Moto G23", 2023, "#3a2a4e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Motorola Moto G54", 2024, "#1e3a2e", 2, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Motorola Moto G84", 2024, "#2e1a4a", 2, "standard", 0.5, 0.5, "vidrio mate, aluminio, litio"),
    p("Motorola Edge 30", 2022, "#3a5a6e", 3, "standard", 0.65, 0.35, "aluminio, vidrio, litio"),
    p("Motorola Edge 40", 2023, "#2a4a5e", 3, "standard", 0.7, 0.3, "aluminio, vidrio Gorilla, litio"),
    p("Motorola Edge 40 Neo", 2023, "#4a6a5e", 3, "standard", 0.6, 0.4, "aluminio, vidrio, litio"),
    p("Motorola Edge 50 Pro", 2024, "#3a1a5e", 3, "standard", 0.7, 0.3, "aluminio, vidrio Gorilla, litio"),
    p("Motorola Razr 40 Ultra", 2023, "#1a1a4e", 2, "flip", 0.8, 0.2, "aluminio, Gorilla Glass Victus, litio"),
    p("Motorola Razr 50 Ultra", 2024, "#6b1a3a", 2, "flip", 0.82, 0.18, "aluminio, Gorilla Glass Victus 2, litio"),
    // Huawei
    p("Huawei P30 Pro", 2019, "#2a4a6e", 4, "standard", 0.8, 0.2, "vidrio, aluminio, litio"),
    p("Huawei P40 Pro", 2020, "#1a3a5e", 4, "standard", 0.82, 0.18, "vidrio, aluminio, litio"),
    p("Huawei P50 Pro", 2021, "#1a2a4e", 4, "standard", 0.84, 0.16, "vidrio, aluminio, litio"),
    p("Huawei P60 Pro", 2023, "#1a3040", 3, "standard", 0.85, 0.15, "aluminio, vidrio kunlun, litio"),
    p("Huawei Mate 40 Pro", 2020, "#1a2040", 3, "standard", 0.85, 0.15, "vidrio, aluminio, litio"),
    p("Huawei Mate 50 Pro", 2022, "#1a2a3e", 3, "standard", 0.87, 0.13, "vidrio kunlun, aluminio, litio"),
    p("Huawei Mate 60 Pro", 2023, "#1a1a2e", 3, "standard", 0.88, 0.12, "titanio, vidrio kunlun, litio"),
    p("Huawei Nova 9", 2021, "#c0b070", 4, "standard", 0.6, 0.4, "vidrio, aluminio, litio"),
    p("Huawei Nova 10", 2022, "#c0a870", 2, "standard", 0.65, 0.35, "vidrio, aluminio, litio"),
    p("Huawei Nova 11", 2023, "#c0a870", 2, "standard", 0.7, 0.3, "aluminio, vidrio, litio"),
    p("Huawei Nova 12", 2024, "#b0a060", 3, "standard", 0.72, 0.28, "aluminio, vidrio, litio"),
    // Google Pixel
    p("Google Pixel 6", 2021, "#3a5a4e", 2, "standard", 0.78, 0.22, "aluminio reciclado, vidrio Corning, litio"),
    p("Google Pixel 6 Pro", 2021, "#c0b8a0", 3, "standard", 0.82, 0.18, "aluminio reciclado, vidrio Corning, litio"),
    p("Google Pixel 7", 2022, "#4a3560", 2, "standard", 0.8, 0.2, "aluminio reciclado, vidrio Corning, litio"),
    p("Google Pixel 7 Pro", 2022, "#2a3a4a", 3, "standard", 0.85, 0.15, "aluminio reciclado, vidrio Corning, litio"),
    p("Google Pixel 7a", 2023, "#3d5a3e", 2, "standard", 0.75, 0.25, "aluminio, vidrio Corning, litio"),
    p("Google Pixel 8", 2023, "#e8d5c0", 2, "standard", 0.82, 0.18, "aluminio reciclado, vidrio Corning Victus 2, litio"),
    p("Google Pixel 8 Pro", 2023, "#1a3a2e", 3, "standard", 0.88, 0.12, "titanio, vidrio Corning Victus 2, litio"),
    p("Google Pixel 8a", 2024, "#3a5a4e", 2, "standard", 0.78, 0.22, "aluminio, vidrio Corning, litio"),
    p("Google Pixel 9", 2024, "#2d4a5e", 2, "standard", 0.85, 0.15, "aluminio reciclado, vidrio Corning Victus 2, litio"),
    p("Google Pixel 9 Pro", 2024, "#1a2a1e", 3, "standard", 0.9, 0.1, "titanio, vidrio Corning Victus 2, litio"),
    p("Google Pixel 9 Pro Fold", 2024, "#1a2030", 3, "fold", 0.88, 0.12, "titanio, vidrio Corning Victus 2, litio"),
    // OnePlus
    p("OnePlus 9", 2021, "#2a1a4e", 3, "standard", 0.78, 0.22, "aluminio, Gorilla Glass 5, litio"),
    p("OnePlus 9 Pro", 2021, "#1a3a2e", 4, "standard", 0.82, 0.18, "aluminio, Gorilla Glass 5, litio"),
    p("OnePlus 10 Pro", 2022, "#1a2a1a", 3, "standard", 0.8, 0.2, "aluminio, Gorilla Glass Victus, litio"),
    p("OnePlus 11", 2023, "#1a1a1a", 3, "standard", 0.82, 0.18, "aluminio, Gorilla Glass Victus 2, litio"),
    p("OnePlus 12", 2024, "#0a2a1a", 3, "standard", 0.85, 0.15, "aluminio, Gorilla Glass, litio"),
    p("OnePlus 13", 2025, "#1a1a2e", 3, "standard", 0.87, 0.13, "aluminio, Gorilla Glass Armor, litio"),
    p("OnePlus Nord CE 3", 2023, "#3a4a5e", 3, "standard", 0.6, 0.4, "policarbonato, vidrio, litio"),
    p("OnePlus Nord 3", 2023, "#2a3a4e", 3, "standard", 0.65, 0.35, "aluminio, vidrio, litio"),
    p("OnePlus Open", 2023, "#1a2a3a", 4, "fold", 0.88, 0.12, "titanio, Gorilla Glass Victus 2, litio"),
    // Sony
    p("Sony Xperia 1 V", 2023, "#1a1a1a", 3, "standard", 0.83, 0.17, "aluminio, Gorilla Glass Victus, litio"),
    p("Sony Xperia 1 VI", 2024, "#1a1a1a", 3, "standard", 0.85, 0.15, "aluminio, Gorilla Glass Victus 2, litio"),
    p("Sony Xperia 5 V", 2023, "#1a3a2e", 3, "standard", 0.82, 0.18, "aluminio, Gorilla Glass Victus 2, litio"),
    p("Sony Xperia 10 VI", 2024, "#2a3a5e", 3, "standard", 0.6, 0.4, "aluminio, vidrio, litio"),
    // OPPO
    p("OPPO Find X7 Ultra", 2024, "#1a1a2e", 4, "ultra", 0.87, 0.13, "titanio, vidrio AG, litio"),
    p("OPPO Find X6 Pro", 2023, "#2a1a3e", 3, "standard", 0.85, 0.15, "vidrio cerámico, aluminio, litio"),
    p("OPPO Reno 11 Pro", 2024, "#3a4a6e", 3, "standard", 0.75, 0.25, "aluminio, vidrio Gorilla, litio"),
    p("OPPO Reno 10 Pro", 2023, "#2e3a5e", 3, "standard", 0.72, 0.28, "aluminio, vidrio, litio"),
    p("OPPO Reno 10", 2023, "#4a5a6e", 3, "standard", 0.65, 0.35, "aluminio, vidrio, litio"),
    p("OPPO A98", 2023, "#2a4a5e", 3, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("OPPO A78", 2023, "#2a3a4a", 2, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("OPPO A58", 2023, "#3a3a4e", 2, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    // Vivo
    p("Vivo X200 Pro", 2025, "#1a1a2e", 3, "standard", 0.88, 0.12, "titanio, vidrio AGC, litio"),
    p("Vivo X100 Pro", 2024, "#1e2a40", 3, "standard", 0.85, 0.15, "aluminio, vidrio AGC, litio"),
    p("Vivo X100", 2024, "#2a3a4e", 3, "standard", 0.8, 0.2, "aluminio, vidrio AGC, litio"),
    p("Vivo V30 Pro", 2024, "#4a3a5e", 3, "standard", 0.72, 0.28, "vidrio mate, aluminio, litio"),
    p("Vivo V29", 2023, "#3a2a5e", 3, "standard", 0.7, 0.3, "vidrio mate, aluminio, litio"),
    p("Vivo Y36", 2023, "#2a4a5e", 2, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Vivo Y100", 2024, "#3a3a5e", 3, "standard", 0.5, 0.5, "policarbonato, vidrio, litio"),
    // Realme
    p("Realme GT 5 Pro", 2024, "#1a2a3e", 3, "standard", 0.75, 0.25, "aluminio, vidrio Gorilla, litio"),
    p("Realme GT Neo 5", 2023, "#2a1a4e", 3, "standard", 0.7, 0.3, "aluminio, vidrio, litio"),
    p("Realme 12 Pro+", 2024, "#3a2a5e", 3, "standard", 0.7, 0.3, "aluminio, vidrio, litio"),
    p("Realme 12 Pro", 2024, "#4a3a5e", 3, "standard", 0.65, 0.35, "aluminio, vidrio, litio"),
    p("Realme 11 Pro+", 2023, "#2a4a3e", 3, "standard", 0.65, 0.35, "aluminio, vidrio, litio"),
    p("Realme C67", 2024, "#3a4a5e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Realme C55", 2023, "#2a4a5e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Realme Narzo 60 Pro", 2023, "#1a3a4e", 3, "standard", 0.6, 0.4, "vidrio, aluminio, litio"),
    // Nothing
    p("Nothing Phone (1)", 2022, "#f0f0f0", 2, "standard", 0.8, 0.2, "aluminio reciclado, vidrio Gorilla 5, litio"),
    p("Nothing Phone (2)", 2023, "#1a1a1a", 2, "standard", 0.82, 0.18, "aluminio reciclado, vidrio Gorilla 5, litio"),
    p("Nothing Phone (2a)", 2024, "#f0f0f0", 2, "standard", 0.7, 0.3, "aluminio, vidrio, litio"),
    // Tecno
    p("Tecno Spark 20 Pro+", 2024, "#1a3a5e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Tecno Spark 10 Pro", 2023, "#2a3a5e", 3, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Tecno Camon 20 Pro", 2023, "#1a2a4e", 3, "standard", 0.5, 0.5, "vidrio, aluminio, litio"),
    p("Tecno Camon 30 Pro", 2024, "#2a2a4e", 3, "standard", 0.55, 0.45, "vidrio, aluminio, litio"),
    p("Tecno Phantom V Fold", 2023, "#1a1a2e", 3, "fold", 0.8, 0.2, "aluminio, vidrio, litio"),
    // Infinix
    p("Infinix Note 30 Pro", 2023, "#2a4a3e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Infinix Note 40 Pro", 2024, "#3a3a5e", 3, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("Infinix Hot 40 Pro", 2024, "#3a2a5e", 3, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Infinix Zero 30", 2023, "#1a2a4e", 3, "standard", 0.6, 0.4, "vidrio, aluminio, litio"),
    // Honor
    p("Honor Magic 7 Pro", 2025, "#1a1a2e", 3, "standard", 0.88, 0.12, "titanio, vidrio nano cristal, litio"),
    p("Honor Magic 7 Lite", 2025, "#3a5a7e", 3, "standard", 0.6, 0.4, "policarbonato, vidrio, litio"),
    p("Honor Magic 6 Pro", 2024, "#1a2a3e", 3, "standard", 0.85, 0.15, "aluminio, vidrio Gorilla, litio"),
    p("Honor Magic 6 Lite", 2024, "#4a5a6e", 3, "standard", 0.6, 0.4, "policarbonato, vidrio, litio"),
    p("Honor Magic 5 Pro", 2023, "#1a2a2e", 3, "standard", 0.83, 0.17, "aluminio, vidrio nano cristal, litio"),
    p("Honor Magic 5 Lite", 2023, "#3a5a6e", 3, "standard", 0.55, 0.45, "policarbonato, vidrio, litio"),
    p("Honor Magic 4 Pro", 2022, "#1a2a3e", 3, "standard", 0.8, 0.2, "aluminio, vidrio, litio"),
    p("Honor Magic V2", 2023, "#c0b090", 3, "fold", 0.85, 0.15, "titanio, vidrio kunlun, litio"),
    p("Honor Magic V3", 2024, "#1a1a1a", 3, "fold", 0.88, 0.12, "titanio, vidrio nano cristal, litio"),
    p("Honor Magic Vs", 2023, "#2a2a3e", 3, "fold", 0.82, 0.18, "aluminio, vidrio, litio"),
    p("Honor 200 Pro", 2024, "#3a5a6e", 3, "standard", 0.75, 0.25, "aluminio, vidrio Gorilla, litio"),
    p("Honor 200", 2024, "#4a6a7e", 3, "standard", 0.7, 0.3, "aluminio, vidrio, litio"),
    p("Honor 200 Lite", 2024, "#5a7a8e", 2, "standard", 0.5, 0.5, "policarbonato, vidrio, litio"),
    p("Honor 100 Pro", 2024, "#2a3a5e", 3, "standard", 0.72, 0.28, "vidrio, aluminio, litio"),
    p("Honor 100", 2024, "#3a4a6e", 3, "standard", 0.68, 0.32, "vidrio, aluminio, litio"),
    p("Honor 90", 2023, "#3a5a6e", 3, "standard", 0.7, 0.3, "vidrio, aluminio, litio"),
    p("Honor 90 Lite", 2023, "#4a6a7e", 3, "standard", 0.55, 0.45, "policarbonato, vidrio, litio"),
    p("Honor 80 Pro", 2023, "#2a4a5e", 3, "standard", 0.7, 0.3, "vidrio, aluminio, litio"),
    p("Honor 80", 2023, "#3a5a5e", 3, "standard", 0.65, 0.35, "vidrio, aluminio, litio"),
    p("Honor 70", 2022, "#2a5a6e", 3, "standard", 0.65, 0.35, "vidrio, aluminio, litio"),
    p("Honor 70 Lite", 2022, "#4a6a7e", 2, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("Honor 60 Pro", 2022, "#3a5a6e", 3, "standard", 0.65, 0.35, "vidrio, aluminio, litio"),
    p("Honor 60", 2022, "#4a5a6e", 3, "standard", 0.6, 0.4, "vidrio, aluminio, litio"),
    p("Honor 50", 2021, "#2a4a6e", 3, "standard", 0.6, 0.4, "vidrio, aluminio, litio"),
    p("Honor 50 Lite", 2021, "#3a5a7e", 3, "standard", 0.5, 0.5, "policarbonato, vidrio, litio"),
    p("Honor X9b", 2024, "#1a3a5e", 3, "standard", 0.55, 0.45, "aluminio, vidrio, litio"),
    p("Honor X9a", 2023, "#2a4a5e", 3, "standard", 0.5, 0.5, "aluminio, vidrio, litio"),
    p("Honor X9", 2022, "#3a4a5e", 3, "standard", 0.48, 0.52, "policarbonato, vidrio, litio"),
    p("Honor X8b", 2024, "#2a3a4e", 3, "standard", 0.5, 0.5, "policarbonato, vidrio, litio"),
    p("Honor X8a", 2023, "#3a4a5e", 3, "standard", 0.45, 0.55, "policarbonato, vidrio, litio"),
    p("Honor X8", 2022, "#4a5a6e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Honor X7b", 2024, "#2a4a5e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Honor X7a", 2023, "#3a5a5e", 3, "standard", 0.38, 0.62, "policarbonato, vidrio, litio"),
    p("Honor X7", 2022, "#4a5a6e", 2, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Honor X6a", 2024, "#4a5a6e", 2, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    p("Honor X6", 2023, "#5a6a7e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Honor X5 Plus", 2024, "#3a4a5e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Honor X5", 2023, "#4a5a6e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
    p("Honor Play 8T", 2024, "#3a4a5e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Honor Play 60 Plus", 2024, "#2a3a4e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("Honor Play 40 Plus", 2023, "#3a4a5e", 3, "standard", 0.35, 0.65, "policarbonato, vidrio, litio"),
    // ZTE
    p("ZTE Axon 40 Ultra", 2022, "#1a1a1a", 3, "ultra", 0.8, 0.2, "vidrio, aluminio, litio"),
    p("ZTE Blade V40", 2022, "#2a3a4e", 3, "standard", 0.4, 0.6, "policarbonato, vidrio, litio"),
    p("ZTE Blade A54", 2023, "#3a4a5e", 2, "standard", 0.3, 0.7, "policarbonato, vidrio, litio"),
];

const LAPTOP_DB = [
    // Apple MacBook
    l("Apple MacBook Air (M1, 2020)", 2020, "#c0bfb8", "ultrabook", false, false, 0.85, 0.15, "aluminio reciclado, vidrio Retina, litio", "#1a3a6e"),
    l("Apple MacBook Air (M2, 2022)", 2022, "#b0b8c1", "ultrabook", false, false, 0.87, 0.13, "aluminio reciclado, vidrio Retina, litio", "#1a3a6e"),
    l("Apple MacBook Air (M3, 2024)", 2024, "#1a1a1e", "ultrabook", false, false, 0.88, 0.12, "aluminio reciclado, vidrio Retina, litio", "#1a3a6e"),
    l("Apple MacBook Pro 13 (M1)", 2020, "#c5c5be", "pro", true, false, 0.9, 0.1, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 13 (M2)", 2022, "#c0bfb8", "pro", true, false, 0.9, 0.1, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 14 (M1 Pro)", 2021, "#c5c5be", "pro", true, false, 0.91, 0.09, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 14 (M2 Pro)", 2023, "#c0bfb8", "pro", true, false, 0.91, 0.09, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 14 (M3 Pro)", 2023, "#1a1a1e", "pro", true, false, 0.92, 0.08, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 14 (M4 Pro)", 2024, "#1a1a1a", "pro", true, false, 0.93, 0.07, "aluminio, Liquid Retina XDR, litio", "#2a2a9e"),
    l("Apple MacBook Pro 16 (M1 Max)", 2021, "#c5c5be", "workstation", true, true, 0.92, 0.08, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 16 (M2 Max)", 2023, "#c0bfb8", "workstation", true, true, 0.93, 0.07, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 16 (M3 Max)", 2023, "#c5c5be", "workstation", true, true, 0.93, 0.07, "aluminio, Liquid Retina XDR, litio", "#2a2a8e"),
    l("Apple MacBook Pro 16 (M4 Max)", 2024, "#c8c8bc", "workstation", true, true, 0.94, 0.06, "aluminio, Liquid Retina XDR, litio", "#2a2a9e"),
    // Dell
    l("Dell XPS 13 (9310)", 2021, "#c0c8d0", "ultrabook", true, false, 0.87, 0.13, "aluminio, vidrio Gorilla, litio", "#1a1a6e"),
    l("Dell XPS 13 (9315)", 2022, "#c8d0d8", "ultrabook", true, false, 0.87, 0.13, "aluminio, vidrio Gorilla, litio", "#1a1a6e"),
    l("Dell XPS 13 Plus", 2022, "#c8d0d8", "ultrabook", true, false, 0.88, 0.12, "aluminio, Gorilla Glass, litio", "#1a1a6e"),
    l("Dell XPS 15 (9510)", 2021, "#c0c8d0", "pro", true, false, 0.87, 0.13, "aluminio, fibra de carbono, litio", "#1a1a6e"),
    l("Dell XPS 15 (9520)", 2022, "#c0c8d0", "pro", true, false, 0.87, 0.13, "aluminio, fibra de carbono, litio", "#1a1a6e"),
    l("Dell XPS 15 (9530)", 2023, "#1a1a1e", "pro", true, false, 0.88, 0.12, "fibra de carbono, aluminio, litio", "#1a1a6e"),
    l("Dell XPS 17 (9710)", 2021, "#1a1a1e", "workstation", true, true, 0.87, 0.13, "aluminio, fibra de carbono, litio", "#1a1a6e"),
    l("Dell XPS 17 (9730)", 2023, "#1a1a1e", "workstation", true, true, 0.88, 0.12, "fibra de carbono, aluminio, litio", "#1a1a6e"),
    l("Dell Inspiron 14", 2023, "#3a4a5e", "ultrabook", false, false, 0.5, 0.5, "policarbonato, aluminio, litio", "#1a1a5e"),
    l("Dell Inspiron 15", 2023, "#3a3a4e", "ultrabook", false, false, 0.5, 0.5, "policarbonato, aluminio, litio", "#1a1a5e"),
    l("Dell Inspiron 16", 2024, "#4a4a5e", "ultrabook", false, false, 0.5, 0.5, "policarbonato, aluminio, litio", "#1a1a5e"),
    l("Dell Vostro 15", 2023, "#2a2a3e", "ultrabook", false, false, 0.45, 0.55, "policarbonato, aluminio, litio", "#1a1a4e"),
    l("Dell Alienware x14", 2022, "#0a1020", "gaming", true, true, 0.75, 0.25, "magnesio, aluminio, litio", "#8a2aee"),
    l("Dell Alienware m16", 2023, "#0a1020", "gaming", true, true, 0.75, 0.25, "magnesio, aluminio, litio", "#8a2aee"),
    l("Dell Alienware m18", 2023, "#0a1020", "gaming", true, true, 0.75, 0.25, "magnesio, aluminio, litio", "#8a2aee"),
    l("Dell Latitude 5540", 2023, "#2a2a3e", "ultrabook", true, false, 0.6, 0.4, "aluminio, fibra de carbono, litio", "#1a1a5e"),
    // HP
    l("HP Pavilion 14", 2023, "#2a3a4e", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a2a5e"),
    l("HP Pavilion 15", 2023, "#2a3a4a", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a2a5e"),
    l("HP Envy 13", 2022, "#c0b898", "ultrabook", false, false, 0.75, 0.25, "aluminio, vidrio, litio", "#1a3a6e"),
    l("HP Envy 15", 2023, "#c0b898", "pro", false, false, 0.78, 0.22, "aluminio, vidrio, litio", "#1a3a6e"),
    l("HP Envy x360", 2023, "#c0b898", "convertible", false, false, 0.75, 0.25, "aluminio, vidrio, litio", "#1a3a6e"),
    l("HP Spectre x360 13", 2022, "#1a1a2e", "convertible", true, false, 0.88, 0.12, "aluminio, Corning, litio", "#1a4a8e"),
    l("HP Spectre x360 14", 2023, "#1a1a2e", "convertible", true, false, 0.88, 0.12, "aluminio, Corning, litio", "#1a4a8e"),
    l("HP Spectre x360 16", 2024, "#2a3a4e", "convertible", true, false, 0.88, 0.12, "aluminio, Corning, litio", "#1a4a8e"),
    l("HP Omen 15", 2022, "#1a1a1a", "gaming", true, false, 0.7, 0.3, "aluminio, plástico, litio", "#8a1a2e"),
    l("HP Omen 16", 2023, "#1a1a1a", "gaming", true, false, 0.7, 0.3, "aluminio, plástico, litio", "#8a1a2e"),
    l("HP Omen 17", 2024, "#1a1a1a", "gaming", true, true, 0.72, 0.28, "aluminio, plástico, litio", "#8a1a2e"),
    l("HP Victus 15", 2023, "#1a2a3a", "gaming", false, false, 0.6, 0.4, "policarbonato, vidrio, litio", "#3a1a8e"),
    l("HP Victus 16", 2024, "#1a2a3a", "gaming", false, false, 0.62, 0.38, "policarbonato, vidrio, litio", "#3a1a8e"),
    // Lenovo
    l("Lenovo ThinkPad X1 Carbon Gen 9", 2021, "#1a1a1a", "ultrabook", true, false, 0.68, 0.32, "fibra de carbono, magnesio, litio", "#1a1a4e"),
    l("Lenovo ThinkPad X1 Carbon Gen 10", 2022, "#1a1a1a", "ultrabook", true, false, 0.7, 0.3, "fibra de carbono, magnesio, litio", "#1a1a4e"),
    l("Lenovo ThinkPad X1 Carbon Gen 11", 2023, "#1a1a1a", "ultrabook", true, false, 0.7, 0.3, "fibra de carbono, magnesio, litio", "#1a1a4e"),
    l("Lenovo ThinkPad X1 Carbon Gen 12", 2024, "#1a1a1a", "ultrabook", true, false, 0.72, 0.28, "fibra de carbono, magnesio, litio", "#1a1a4e"),
    l("Lenovo ThinkPad T14", 2023, "#1a1a1a", "ultrabook", false, false, 0.65, 0.35, "fibra de carbono, aluminio, litio", "#1a1a4e"),
    l("Lenovo ThinkPad L14", 2023, "#1a1a1a", "ultrabook", false, false, 0.6, 0.4, "policarbonato, aluminio, litio", "#1a1a4e"),
    l("Lenovo IdeaPad 3", 2023, "#4a5a6e", "ultrabook", false, false, 0.45, 0.55, "policarbonato, litio", "#1a2a5e"),
    l("Lenovo IdeaPad 5", 2023, "#4a5a6e", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a2a5e"),
    l("Lenovo IdeaPad Gaming 3", 2023, "#1a2a3a", "gaming", false, false, 0.55, 0.45, "policarbonato, litio", "#3a1aee"),
    l("Lenovo Legion 5", 2023, "#1a1a2e", "gaming", false, false, 0.7, 0.3, "aluminio, policarbonato, litio", "#4a1aee"),
    l("Lenovo Legion 5 Pro", 2023, "#1a1a1a", "gaming", true, false, 0.75, 0.25, "aluminio, magnesio, litio", "#4a1aee"),
    l("Lenovo Legion 7", 2024, "#1a1a1a", "gaming", true, false, 0.8, 0.2, "aluminio, magnesio, litio", "#4a1aee"),
    l("Lenovo Legion Slim 7", 2024, "#1a1a1a", "gaming", true, false, 0.82, 0.18, "aluminio, magnesio, litio", "#4a1aee"),
    l("Lenovo Yoga 7i", 2023, "#5a6a7e", "convertible", false, false, 0.75, 0.25, "aluminio, vidrio, litio", "#2a3a8e"),
    l("Lenovo Yoga 9i", 2024, "#c8b898", "convertible", true, false, 0.82, 0.18, "aluminio, Corning, litio", "#2a3a8e"),
    // Asus
    l("Asus Zenbook 13", 2022, "#4a5a6e", "ultrabook", false, false, 0.78, 0.22, "aluminio, vidrio, litio", "#2a3a6e"),
    l("Asus Zenbook 14", 2024, "#5a6a6e", "ultrabook", false, false, 0.8, 0.2, "aluminio anodizado, vidrio Gorilla, litio", "#2a3a6e"),
    l("Asus Zenbook Duo", 2024, "#1a1a2e", "pro", true, false, 0.82, 0.18, "aluminio, vidrio, litio", "#2a3a8e"),
    l("Asus Vivobook 14", 2023, "#2a3a4a", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a3a5e"),
    l("Asus Vivobook 15", 2023, "#2a3a4a", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a3a5e"),
    l("Asus Vivobook 16", 2024, "#3a4a5a", "ultrabook", false, false, 0.52, 0.48, "aluminio, policarbonato, litio", "#1a3a5e"),
    l("Asus ROG Zephyrus G14", 2024, "#1a1a1a", "gaming", true, false, 0.82, 0.18, "aluminio, magnesio, litio", "#ee4a1a"),
    l("Asus ROG Zephyrus G15", 2023, "#2a2a3e", "gaming", true, false, 0.82, 0.18, "aluminio, magnesio, litio", "#ee4a1a"),
    l("Asus ROG Zephyrus M16", 2023, "#1a1a2e", "gaming", true, false, 0.82, 0.18, "aluminio, magnesio, litio", "#ee4a1a"),
    l("Asus ROG Strix G15", 2023, "#0a1010", "gaming", true, true, 0.78, 0.22, "aluminio, policarbonato, litio", "#1aee4a"),
    l("Asus ROG Strix G17", 2023, "#0a1010", "gaming", true, true, 0.78, 0.22, "aluminio, policarbonato, litio", "#1aee4a"),
    l("Asus TUF Gaming F15", 2024, "#1a2a1a", "gaming", false, false, 0.7, 0.3, "aluminio, policarbonato, litio", "#4aee1a"),
    l("Asus TUF Gaming A15", 2024, "#1a1a2e", "gaming", false, false, 0.7, 0.3, "aluminio, policarbonato, litio", "#4aee1a"),
    l("Asus TUF Gaming A17", 2024, "#1a2a2e", "gaming", false, false, 0.7, 0.3, "aluminio, policarbonato, litio", "#4aee1a"),
    // Acer
    l("Acer Aspire 3", 2023, "#3a4a5e", "ultrabook", false, false, 0.45, 0.55, "policarbonato, litio", "#1a2a5e"),
    l("Acer Aspire 5", 2023, "#3a4a5e", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a2a5e"),
    l("Acer Swift 3", 2023, "#c0c8d0", "ultrabook", false, false, 0.75, 0.25, "aluminio, vidrio, litio", "#1a3a6e"),
    l("Acer Swift 5", 2023, "#c8d0d8", "ultrabook", true, false, 0.8, 0.2, "aluminio, vidrio, litio", "#1a3a6e"),
    l("Acer Swift Go", 2024, "#e0c8b0", "ultrabook", false, false, 0.78, 0.22, "aluminio, vidrio, litio", "#1a3a6e"),
    l("Acer Nitro 5", 2023, "#1a1a1a", "gaming", false, false, 0.6, 0.4, "policarbonato, aluminio, litio", "#ee1a1a"),
    l("Acer Nitro 16", 2024, "#1a1a1a", "gaming", false, false, 0.62, 0.38, "policarbonato, aluminio, litio", "#ee1a1a"),
    l("Acer Predator Helios 300", 2023, "#1a2a1a", "gaming", true, false, 0.75, 0.25, "aluminio, magnesio, litio", "#1aee4a"),
    l("Acer Predator Helios Neo 16", 2024, "#0a1a10", "gaming", true, false, 0.75, 0.25, "aluminio, magnesio, litio", "#1aee4a"),
    // Microsoft
    l("Microsoft Surface Pro 9", 2022, "#c0c8d0", "convertible", true, false, 0.88, 0.12, "magnesio, Gorilla Glass, litio", "#1a4aee"),
    l("Microsoft Surface Pro 10", 2024, "#c8d0d8", "convertible", true, false, 0.88, 0.12, "magnesio, Gorilla Glass, litio", "#1a4aee"),
    l("Microsoft Surface Laptop 5", 2022, "#b0b8c1", "ultrabook", true, false, 0.85, 0.15, "aluminio, Gorilla Glass, litio", "#1a4aee"),
    l("Microsoft Surface Laptop 6", 2024, "#1a1a1a", "ultrabook", true, false, 0.87, 0.13, "aluminio, Gorilla Glass, litio", "#1a4aee"),
    // Razer
    l("Razer Blade 14", 2024, "#1a1a1a", "gaming", true, false, 0.88, 0.12, "aluminio CNC anodizado, litio", "#1aee1a"),
    l("Razer Blade 15", 2024, "#1a1a1a", "gaming", true, false, 0.88, 0.12, "aluminio CNC anodizado, litio", "#1aee1a"),
    l("Razer Blade 16", 2024, "#1a1a1a", "gaming", true, true, 0.9, 0.1, "aluminio CNC anodizado, litio", "#1aee1a"),
    // LG
    l("LG Gram 14", 2024, "#f0f0f0", "ultrabook", false, false, 0.7, 0.3, "magnesio, aluminio, litio", "#1a2a5e"),
    l("LG Gram 16", 2024, "#f0f0f0", "ultrabook", false, false, 0.7, 0.3, "magnesio, aluminio, litio", "#1a2a5e"),
    l("LG Gram 17", 2024, "#f0f0f0", "ultrabook", false, false, 0.7, 0.3, "magnesio, aluminio, litio", "#1a2a5e"),
    // Huawei
    l("Huawei MateBook X Pro", 2024, "#1a1a1a", "ultrabook", true, false, 0.88, 0.12, "magnesio, vidrio, litio", "#1a3a6e"),
    l("Huawei MateBook 14s", 2023, "#c0c8d0", "ultrabook", false, false, 0.78, 0.22, "aluminio, vidrio, litio", "#1a3a6e"),
    l("Huawei MateBook D15", 2023, "#3a4a5e", "ultrabook", false, false, 0.5, 0.5, "aluminio, policarbonato, litio", "#1a2a5e"),
    // MSI
    l("MSI GF63 Thin", 2023, "#1a1a2e", "gaming", false, false, 0.6, 0.4, "policarbonato, aluminio, litio", "#ee1a1a"),
    l("MSI Katana 15", 2024, "#1a1a1a", "gaming", false, false, 0.65, 0.35, "aluminio, policarbonato, litio", "#ee1a1a"),
    l("MSI Stealth 16", 2024, "#1a1a1a", "gaming", true, false, 0.82, 0.18, "aluminio, magnesio, litio", "#ee1a4a"),
    l("MSI Raider GE78", 2024, "#1a1a1a", "gaming", true, true, 0.78, 0.22, "aluminio, magnesio, litio", "#ee1a4a"),
    l("MSI Modern 14", 2023, "#3a4a5e", "ultrabook", false, false, 0.55, 0.45, "aluminio, policarbonato, litio", "#1a2a5e"),
    l("MSI Prestige 16", 2024, "#c0c8d0", "ultrabook", true, false, 0.8, 0.2, "aluminio, vidrio, litio", "#1a3a6e"),
];

// Índices
const PHONE_MAP = Object.fromEntries(PHONE_DB.map(d => [d.name.toLowerCase(), d]));
const LAPTOP_MAP = Object.fromEntries(LAPTOP_DB.map(d => [d.name.toLowerCase(), d]));

export const getModelsByBrand = (input, type = 'phone') => {
    const search = input.toLowerCase().trim();
    if (search.length < 2) return [];
    const db = type === 'phone' ? PHONE_DB : LAPTOP_DB;
    return db.filter(d => d.name.toLowerCase().includes(search)).slice(0, 20);
};

export const getModelYear = (modelName) => {
    if (!modelName) return null;
    const key = modelName.toLowerCase().trim();
    return PHONE_MAP[key]?.year || LAPTOP_MAP[key]?.year || null;
};

export const getAIModelConfig = (modelName, type = 'phone') => {
    const key = modelName.toLowerCase().trim();
    const db = type === 'phone' ? PHONE_MAP : LAPTOP_MAP;
    const entry = db[key];

    let config = {
        color: type === 'phone' ? '#252525' : '#8a9ba8',
        cameraCount: 2, isUltra: false, isPro: false,
        roughness: 0.35, metalness: 0.7,
        materials: type === 'phone' ? "plástico, aluminio, silicio, cobre" : "aluminio, policarbonato, litio",
        description: `Dispositivo ${modelName} — renderizado estándar.`,
        exists: modelName.length > 3, year: null, screenGlow: '#1a2a5e', form: 'standard',
    };

    if (entry) {
        config = {
            color: entry.color,
            cameraCount: entry.cameras || 2,
            isUltra: entry.isUltra || entry.form === 'ultra' || entry.form === 'fold',
            isPro: entry.isPro || false,
            roughness: entry.rough ?? 0.2,
            metalness: entry.metal ?? 0.8,
            materials: entry.materials,
            description: `${entry.name} (${entry.year}) detectado ✓ — ${entry.materials}.`,
            exists: true, year: entry.year,
            screenGlow: entry.screenGlow || '#1a2a5e',
            form: entry.form || 'standard',
        };
    } else if (modelName.length > 3) {
        const ml = key;
        if (ml.includes('iphone')) { config.color = '#1a1a1a'; config.isPro = ml.includes('pro'); config.cameraCount = ml.includes('pro') ? 3 : 2; }
        else if (ml.includes('samsung') || ml.includes('galaxy')) { config.color = '#1a2230'; config.isUltra = ml.includes('ultra'); config.cameraCount = ml.includes('ultra') ? 4 : 3; }
        else if (ml.includes('honor')) { config.color = '#1a2a3e'; config.cameraCount = ml.includes('pro') ? 3 : 3; config.metalness = ml.includes('magic') ? 0.85 : 0.6; }
        else if (ml.includes('huawei')) { config.color = '#1a2a4e'; config.cameraCount = ml.includes('pro') ? 4 : 3; config.metalness = 0.8; }
        else if (ml.includes('oneplus')) { config.color = '#1a1a1a'; config.cameraCount = 3; config.metalness = 0.82; }
        else if (ml.includes('motorola') || ml.includes('moto')) { config.color = '#2a3a4e'; config.cameraCount = 3; config.metalness = 0.5; }
        else if (ml.includes('xiaomi') || ml.includes('redmi') || ml.includes('poco')) { config.color = '#1a2a3a'; config.cameraCount = 3; config.metalness = 0.6; }
        else if (ml.includes('oppo')) { config.color = '#2a3a5e'; config.cameraCount = 3; config.metalness = 0.65; }
        else if (ml.includes('vivo')) { config.color = '#3a2a5e'; config.cameraCount = 3; config.metalness = 0.7; }
        else if (ml.includes('realme')) { config.color = '#2a4a3e'; config.cameraCount = 3; config.metalness = 0.6; }
        else if (ml.includes('macbook')) { config.color = '#b0b8c1'; config.isPro = ml.includes('pro'); config.metalness = 0.9; }
        else if (ml.includes('dell') && ml.includes('xps')) { config.color = '#c8d0d8'; config.isPro = true; }
        else if (ml.includes('rog') || ml.includes('gaming') || ml.includes('alienware') || ml.includes('legion') || ml.includes('nitro') || ml.includes('predator') || ml.includes('razer')) { config.color = '#0a1010'; config.isUltra = true; config.screenGlow = '#ee1aee'; config.form = 'gaming'; }
        config.description = `"${modelName}" — no está en catálogo, renderizado por similitud.`;
        config.exists = false;
    }
    return config;
};
