/**
 * AIModelSelector Service (Granular & Strict Device Validation)
 * Contexto: Febrero 2026.
 */
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

    // 1. FILTRO DE RUIDO Y NÚMEROS INVÁLIDOS ("0", "plus" aislado, nombres muy cortos)
    const numbers = modelLower.match(/\d+/g);
    if (numbers && numbers.some(n => parseInt(n) === 0 && !modelLower.includes('a0') && !modelLower.includes('s0'))) {
        // Bloquear "0" si no es parte de una serie real tipo "A04"
        config.exists = false;
        config.description = `IA no reconoce "${modelName}" como una nomenclatura de hardware válida. El número 0 no es usual en estas series.`;
    }

    if (modelLower.length < 3) {
        config.exists = false;
        config.description = "Nombre demasiado corto para ser un modelo verificado.";
    }

    if (!config.exists) {
        config.color = '#7f1d1d';
        config.materials = "";
        return config;
    }

    if (type === 'phone') {
        // Apple / iPhone
        if (modelLower.includes('iphone')) {
            const match = modelLower.match(/iphone (\d+)/);
            if (match && parseInt(match[1]) > 19) {
                config.exists = false;
                config.description = `Modelo de iPhone futurista (${match[1]}) no disponible en 2026.`;
            } else {
                config.isPro = modelLower.includes('pro');
                config.cameraCount = config.isPro ? 3 : 2;
                config.materials = config.isPro ? "titanio, vidrio cerámico, litio" : "aluminio, vidrio, litio";
            }
        }
        // Samsung
        else if (modelLower.includes('samsung') || modelLower.includes('galaxy')) {
            const sMatch = modelLower.match(/s(\d+)/);
            if (sMatch && parseInt(sMatch[1]) > 30) {
                config.exists = false;
                config.description = `Serie Samsung S${sMatch[1]} no identificada.`;
            }
            if (config.exists) {
                config.isUltra = modelLower.includes('ultra');
                config.materials = config.isUltra ? "titanio, vidrio victus, litio" : "aluminio, vidrio, litio";
            }
        }
        // ... otras marcas ...
    }

    else if (type === 'laptop') {
        // 2. VALIDACIÓN GRANULAR PARA LAPTOPS

        // Dell XPS (Regla específica: 13, 14, 15, 16, 17)
        if (modelLower.includes('dell') && modelLower.includes('xps')) {
            const numMatch = modelLower.match(/(\d+)/);
            const validXPS = [12, 13, 14, 15, 16, 17];
            if (numMatch && !validXPS.includes(parseInt(numMatch[0]))) {
                config.exists = false;
                config.description = `La serie Dell XPS solo utiliza tamaños reales (13-17"). El modelo "${numMatch[0]}" es ficticio.`;
            } else if (!numMatch) {
                // Dell XPS sin numero suele ser real (modelo base), pero si añade "0" o similar arriba ya lo filtramos
            }
            config.materials = "fibra de carbono, aluminio, litio, cobre";
        }
        // MacBook
        else if (modelLower.includes('macbook')) {
            const mMatch = modelLower.match(/m(\d+)/);
            if (mMatch && parseInt(mMatch[1]) > 6) {
                config.exists = false;
                config.description = `Procesador Apple M${mMatch[1]} no reconocido.`;
            }
            config.materials = "aluminio 100% reciclado, vidrio, litio";
        }
        // HP / Lenovo / Asus (Filtros de numero alto)
        else {
            const numMatch = modelLower.match(/(\d+)/);
            if (numMatch && parseInt(numMatch[0]) > 9000) {
                config.exists = false;
                config.description = `Nomenclatura "${modelName}" excede los rangos de series comerciales.`;
            }
        }
    }

    if (!config.exists) {
        config.color = '#7f1d1d';
        config.materials = "";
    }

    return config;
};
