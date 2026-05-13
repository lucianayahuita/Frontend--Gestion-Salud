import { ref } from 'vue';
import { getUltimaCita } from '../services/verCita';

export function useVerMiCita() {
    const cita = ref(null);
    const cargando = ref(false);

    const cargarCita = async (pacienteId) => {
        if (!pacienteId) return; 
        cargando.value = true;
        try {
            const res = await getUltimaCita(pacienteId);
            if (res.success && res.data.length > 0) {
                cita.value = res.data[0]; 
            } else {
                cita.value = null;
            }
        } catch (err) {
            console.error("Error al cargar cita", err);
        } finally {
            cargando.value = false;
        }
    };

    return { cita, cargando, cargarCita };
}