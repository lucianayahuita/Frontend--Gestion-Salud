import { ref } from 'vue';
import { verFarmaceuticoService } from '../services/verFarmaceuticoService';

export function useVerFarmaceutico() {
  const farmaceutico = ref(null);
  const cargando = ref(false);
  const error = ref(null);

  const cargarDetalle = async (id) => {
    cargando.value = true;
    error.value = null;
    try {
      farmaceutico.value = await verFarmaceuticoService.obtenerDetalleFarmaceutico(id);
    } catch (err) {
      error.value = err;
    } finally {
      cargando.value = false;
    }
  };

  return { farmaceutico, cargando, error, cargarDetalle };
}