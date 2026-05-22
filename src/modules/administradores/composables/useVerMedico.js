import { ref } from 'vue';
import { verMedicoService } from '../services/verMedicoService';

export function useVerMedico() {
  const medico = ref(null);
  const cargando = ref(false);
  const error = ref(null);

  const cargarDetalle = async (id) => {
    cargando.value = true;
    error.value = null;
    try {
      medico.value = await verMedicoService.obtenerDetalleMedico(id);
    } catch (err) {
      error.value = err;
    } finally {
      cargando.value = false;
    }
  };

  return { medico, cargando, error, cargarDetalle };
}