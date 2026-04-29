import { ref } from 'vue';
import { updatePaciente } from '../services/updateService';

export function useUpdatePaciente() {
    const loading = ref(false);
    const error = ref(null);

    const ejecutarActualizacion = async (id, datos) => {
        loading.value = true;
        error.value = null;
        try {
            const resultado = await updatePaciente(id, datos);
            return resultado;
        } catch (err) {
            error.value = err.message || 'Error desconocido';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { ejecutarActualizacion, loading, error };
}