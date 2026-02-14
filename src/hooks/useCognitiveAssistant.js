import { useCallback } from 'react';

/**
 * useCognitiveAssistant Hook
 * Provee herramientas de asistencia auditiva para reducir la carga de lectura.
 */
export const useCognitiveAssistant = () => {

    const speak = useCallback((text) => {
        // Cancelar cualquier discurso previo para evitar solapamientos
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9; // Velocidad ligeramente mas lenta para mejor comprension
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    }, []);

    const notifyPart = useCallback((partName, impactInfo) => {
        const message = `Has seleccionado ${partName}. ${impactInfo}`;
        speak(message);

        // Feedback haptico simulado si estuviera disponible
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
    }, [speak]);

    return { speak, notifyPart };
};
