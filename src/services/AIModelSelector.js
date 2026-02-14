/**
 * AIModelSelector Service (Ultra-Expanded Catalog & Discovery)
 * Contexto: Febrero 2026.
 */

const PHONE_MODELS = {
    apple: [
        "Apple iPhone 11", "Apple iPhone 11 Pro", "Apple iPhone 12", "Apple iPhone 12 Pro", "Apple iPhone 12 mini",
        "Apple iPhone 13", "Apple iPhone 13 Pro", "Apple iPhone 13 mini", "Apple iPhone 14", "Apple iPhone 14 Pro",
        "Apple iPhone 14 Plus", "Apple iPhone 15", "Apple iPhone 15 Pro", "Apple iPhone 15 Plus", "Apple iPhone 15 Ultra",
        "Apple iPhone 16", "Apple iPhone 16 Pro", "Apple iPhone 16 Plus", "Apple iPhone 16 Ultra",
        "Apple iPhone 17", "Apple iPhone 17 Pro", "Apple iPhone 17 Ultra", "Apple iPhone SE (2022)"
    ],
    samsung: [
        "Samsung Galaxy S20", "Samsung Galaxy S21", "Samsung Galaxy S21 FE", "Samsung Galaxy S22", "Samsung Galaxy S23",
        "Samsung Galaxy S23 Ultra", "Samsung Galaxy S24", "Samsung Galaxy S24 Ultra", "Samsung Galaxy S25", "Samsung Galaxy S25 Ultra",
        "Samsung Galaxy A10", "Samsung Galaxy A11", "Samsung Galaxy A12", "Samsung Galaxy A13", "Samsung Galaxy A14",
        "Samsung Galaxy A15", "Samsung Galaxy A20", "Samsung Galaxy A21s", "Samsung Galaxy A22", "Samsung Galaxy A23",
        "Samsung Galaxy A24", "Samsung Galaxy A25", "Samsung Galaxy A30", "Samsung Galaxy A31", "Samsung Galaxy A32",
        "Samsung Galaxy A33", "Samsung Galaxy A34", "Samsung Galaxy A35", "Samsung Galaxy A50", "Samsung Galaxy A51",
        "Samsung Galaxy A52", "Samsung Galaxy A52s", "Samsung Galaxy A53", "Samsung Galaxy A54", "Samsung Galaxy A55",
        "Samsung Galaxy A70", "Samsung Galaxy A71", "Samsung Galaxy A72", "Samsung Galaxy A73", "Samsung Galaxy Z Fold 5",
        "Samsung Galaxy Z Flip 5", "Samsung Galaxy Z Fold 6", "Samsung Galaxy Z Flip 6"
    ],
    xiaomi: [
        "Xiaomi Redmi Note 10", "Xiaomi Redmi Note 11", "Xiaomi Redmi Note 12", "Xiaomi Redmi Note 13", "Xiaomi Redmi Note 13 Pro",
        "Xiaomi 11T Pro", "Xiaomi 12 Pro", "Xiaomi 13 Pro", "Xiaomi 13T", "Xiaomi 14", "Xiaomi 14 Ultra",
        "Xiaomi Poco X3 Pro", "Xiaomi Poco X4 Pro", "Xiaomi Poco X5 Pro", "Xiaomi Poco X6 Pro", "Xiaomi Poco F3", "Xiaomi Poco F4", "Xiaomi Poco F5"
    ],
    motorola: [
        "Motorola Moto G6", "Motorola Moto G7", "Motorola Moto G8", "Motorola Moto G9", "Motorola Moto G10",
        "Motorola Moto G20", "Motorola Moto G30", "Motorola Moto G50", "Motorola Moto G100", "Motorola Moto G13",
        "Motorola Moto G23", "Motorola Moto G54", "Motorola Moto G84", "Motorola Edge 30", "Motorola Edge 40",
        "Motorola Edge 40 Neo", "Motorola Edge 50 Pro", "Motorola Razr 40 Ultra"
    ],
    huawei: [
        "Huawei P30 Pro", "Huawei P40 Pro", "Huawei P50 Pro", "Huawei P60 Pro", "Huawei Mate 30 Pro",
        "Huawei Mate 40 Pro", "Huawei Mate 50 Pro", "Huawei Mate 60 Pro", "Huawei Nova 9", "Huawei Nova 10", "Huawei Nova 11"
    ],
    google: ["Google Pixel 4", "Google Pixel 5", "Google Pixel 6", "Google Pixel 6 Pro", "Google Pixel 7", "Google Pixel 7a", "Google Pixel 8", "Google Pixel 8 Pro", "Google Pixel 9"]
};

const LAPTOP_MODELS = {
    apple: [
        "Apple MacBook Air (M1, 2020)", "Apple MacBook Air (M2, 2022)", "Apple MacBook Air (M3, 2024)",
        "Apple MacBook Pro 13 (M1)", "Apple MacBook Pro 13 (M2)", "Apple MacBook Pro 14 (M1 Pro)",
        "Apple MacBook Pro 14 (M2 Pro)", "Apple MacBook Pro 14 (M3 Pro)", "Apple MacBook Pro 16 (M1 Max)",
        "Apple MacBook Pro 16 (M2 Max)", "Apple MacBook Pro 16 (M3 Max)", "Apple MacBook Pro 14 (M4 Pro)", "Apple MacBook Pro 16 (M4 Max)"
    ],
    asus: [
        "Asus Zenbook 13", "Asus Zenbook 14", "Asus Zenbook Duo", "Asus Vivobook 14", "Asus Vivobook 15", "Asus Vivobook 16",
        "Asus ROG Zephyrus G14", "Asus ROG Zephyrus G15", "Asus ROG Zephyrus M16", "Asus ROG Strix G15",
        "Asus ROG Strix G17", "Asus TUF Gaming F15", "Asus TUF Gaming A15", "Asus TUF Gaming A17"
    ],
    dell: [
        "Dell XPS 13 (9310)", "Dell XPS 13 (9315)", "Dell XPS 13 Plus", "Dell XPS 15 (9510)", "Dell XPS 15 (9520)",
        "Dell XPS 15 (9530)", "Dell XPS 17 (9710)", "Dell XPS 17 (9730)", "Dell Inspiron 14", "Dell Inspiron 15",
        "Dell Inspiron 16", "Dell Vostro 15", "Dell Alienware x14", "Dell Alienware m16", "Dell Alienware m18"
    ],
    hp: [
        "HP Pavilion 14", "HP Pavilion 15", "HP Envy 13", "HP Envy 15", "HP Envy x360", "HP Spectre x360 13",
        "HP Spectre x360 14", "HP Spectre x360 16", "HP Omen 15", "HP Omen 16", "HP Omen 17", "HP Victus 15", "HP Victus 16"
    ],
    lenovo: [
        "Lenovo ThinkPad X1 Carbon Gen 9", "Lenovo ThinkPad X1 Carbon Gen 10", "Lenovo ThinkPad X1 Carbon Gen 11",
        "Lenovo ThinkPad T14", "Lenovo ThinkPad L14", "Lenovo IdeaPad 3", "Lenovo IdeaPad 5", "Lenovo IdeaPad Gaming 3",
        "Lenovo Legion 5", "Lenovo Legion 5 Pro", "Lenovo Legion 7", "Lenovo Legion Slim 7", "Lenovo Yoga 7i", "Lenovo Yoga 9i"
    ],
    acer: [
        "Acer Aspire 3", "Acer Aspire 5", "Acer Swift 3", "Acer Swift 5", "Acer Swift Go",
        "Acer Nitro 5", "Acer Nitro 16", "Acer Predator Helios 300", "Acer Predator Helios Neo 16"
    ]
};

/**
 * Retorna una lista de modelos si el input coincide con una marca o parte de ella.
 */
export const getModelsByBrand = (input, type = 'phone') => {
    const search = input.toLowerCase().trim();
    if (search.length < 2) return [];

    const data = type === 'phone' ? PHONE_MODELS : LAPTOP_MODELS;

    // Buscar si alguna marca en el catálogo coincide con el input
    let brandFound = null;
    for (const brandKey in data) {
        if (brandKey.startsWith(search) || search.includes(brandKey)) {
            brandFound = brandKey;
            break;
        }
    }

    if (brandFound) {
        return data[brandFound];
    }

    // Búsqueda global si no hay marca clara
    const allModels = Object.values(data).flat();
    return allModels.filter(m => m.toLowerCase().includes(search)).slice(0, 15);
};

export const getAIModelConfig = (modelName, type = 'phone') => {
    const modelLower = modelName.toLowerCase().trim();

    let config = {
        color: '#374151',
        cameraCount: 1,
        isUltra: false,
        isPro: false,
        roughness: 0.5,
        metalness: 0.5,
        materials: "plástico, aluminio, silicio, cobre",
        description: `Dispositivo detectado: ${modelName}.`,
        exists: true
    };

    // Filtros de coherencia
    const numbers = modelLower.match(/\d+/g);
    if (numbers && numbers.some(n => parseInt(n) === 0 && !modelLower.includes('a0') && !modelLower.includes('s0'))) {
        config.exists = false;
        config.description = `IA no reconoce "${modelName}" como una nomenclatura válida. El número 0 no es usual en estas series.`;
    }

    if (modelLower.length < 3) {
        config.exists = false;
        config.description = "Nombre demasiado corto para ser un modelo verificado.";
    }

    if (type === 'phone') {
        if (modelLower.includes('iphone')) {
            const match = modelLower.match(/iphone (\d+)/);
            if (match && parseInt(match[1]) > 19) config.exists = false;
            config.isPro = modelLower.includes('pro') || modelLower.includes('ultra');
            config.cameraCount = config.isPro ? 3 : 2;
            config.materials = config.isPro ? "titanio, vidrio cerámico, litio" : "aluminio, vidrio, litio";
        }
        else if (modelLower.includes('samsung') || modelLower.includes('galaxy')) {
            config.isUltra = modelLower.includes('ultra') || modelLower.includes('fold');
            if (modelLower.includes('s2') || modelLower.includes('s22') || modelLower.includes('s23') || modelLower.includes('s24')) {
                config.cameraCount = config.isUltra ? 4 : 3;
            } else {
                config.cameraCount = 2;
            }
            config.materials = config.isUltra ? "titanio, vidrio victus, litio" : "aluminio, vidrio, litio";
        }
    } else if (type === 'laptop') {
        if (modelLower.includes('macbook')) {
            const mMatch = modelLower.match(/m(\d+)/);
            if (mMatch && parseInt(mMatch[1]) > 6) config.exists = false;
            config.materials = "aluminio 100% reciclado, vidrio, litio";
            config.color = "#94a3b8";
        } else if (modelLower.includes('dell') && modelLower.includes('xps')) {
            config.materials = "fibra de carbono, aluminio, litio";
            config.color = "#cbd5e1";
        } else if (modelLower.includes('rog') || modelLower.includes('gaming') || modelLower.includes('alienware')) {
            config.materials = "magnesio, cobre, aluminio, litio";
            config.color = "#1e293b";
        }
    }

    if (!config.exists) {
        config.color = '#7f1d1d';
        config.materials = "";
    }

    return config;
};
