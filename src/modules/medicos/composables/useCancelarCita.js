import { ref } from 'vue';
import { cancelarCitaService } from '../services/cancelarCitaService.js';

export function useCancelarCita() {
  const isOpen = ref(false);
  const citaSeleccionada = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const abrirModal = (cita) => {
    citaSeleccionada.value = cita;
    error.value = null;
    isOpen.value = true;
  };

  const cerrarModal = () => {
    isOpen.value = false;
    citaSeleccionada.value = null;
    error.value = null;
  };

  const ejecutarCancelacion = async (onSuccess) => {
    if (!citaSeleccionada.value) return;

    loading.value = true;
    error.value = null;
    try {
      await cancelarCitaService.cancelar(citaSeleccionada.value.id);
      if (onSuccess) await onSuccess();
      cerrarModal();
    } catch (err) {
      console.error('Error en el proceso de cancelación:', err);
      error.value = err.response?.data?.message || 'No se pudo registrar la inasistencia. Intente nuevamente.';
    } finally {
      loading.value = false;
    }
  };

  return {
    isOpen,
    citaSeleccionada,
    loading,
    error,
    abrirModal,
    cerrarModal,
    ejecutarCancelacion
  };
}