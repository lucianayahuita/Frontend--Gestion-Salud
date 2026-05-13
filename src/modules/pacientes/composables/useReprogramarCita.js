import { ref } from 'vue';
import { reprogramarCitaService } from '../services/reprogramarService';

export const useReprogramarCita = () => {
  const reprogramando = ref(false);
  const errorReprogramar = ref(null);

  const reprogramar = async (id, datos) => {
    reprogramando.value = true;
    errorReprogramar.value = null;
    try {
      const res = await reprogramarCitaService(id, datos);
      return { success: true, data: res };
    } catch (err) {
      errorReprogramar.value = err;
      return { success: false, error: err };
    } finally {
      reprogramando.value = false;
    }
  };

  return {
    reprogramar,
    reprogramando,
    errorReprogramar
  };
};