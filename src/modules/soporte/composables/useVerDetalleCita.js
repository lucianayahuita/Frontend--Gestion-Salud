import { ref } from 'vue';
import { verDetalleCitaService } from '../services/verDetalleCitaService.js';

export function useVerDetalleCita() {
  const isOpen = ref(false);
  const citaDetalle = ref(null);
  const loadingDetalle = ref(false);
  const errorDetalle = ref(null);
  const abrirModalDetalle = async (id) => {
    isOpen.value = true;
    loadingDetalle.value = true;
    errorDetalle.value = null;
    citaDetalle.value = null;

    try {
      citaDetalle.value = await verDetalleCitaService.obtenerDetalleCita(id);
    } catch (err) {
      errorDetalle.value = err.response?.data?.message || 'No se pudo cargar el detalle de la cita';
    } finally {
      loadingDetalle.value = false;
    }
  };

  const cerrarModalDetalle = () => {
    isOpen.value = false;
    citaDetalle.value = null;
  };

  return {
    isOpen,
    citaDetalle,
    loadingDetalle,
    errorDetalle,
    abrirModalDetalle,
    cerrarModalDetalle
  };
}