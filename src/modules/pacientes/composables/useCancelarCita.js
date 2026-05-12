import { ref } from 'vue';
import { deleteCita } from '../services/cancelarCita';

export function useCancelarCita() {
    const estaCancelando = ref(false);
    const errorCancelacion = ref(null);

    const cancelar = async (citaId) => {
        estaCancelando.value = true;
        errorCancelacion.value = null;
        try {
            const res = await deleteCita(citaId);
            return res.success; 
        } catch (err) {
            errorCancelacion.value = err.response?.data?.message || "No se pudo cancelar.";
            return false;
        } finally {
            estaCancelando.value = false;
        }
    };

    return { cancelar, estaCancelando, errorCancelacion };
}