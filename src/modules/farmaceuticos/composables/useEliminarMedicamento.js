import { ref } from 'vue';
import { eliminarMedicamentoService } from '../services/eliminarMedicamentoService.js';

export function useEliminarMedicamento() {
  const eliminando = ref(false);
  const errorEliminar = ref(null);
  const visibleEliminar = ref(false);
  const medicamentoParaEliminar = ref(null);

  const abrirModalEliminar = (medicamento) => {
    medicamentoParaEliminar.value = medicamento;
    errorEliminar.value = null;
    visibleEliminar.value = true;
  };

  const cerrarModalEliminar = () => {
    visibleEliminar.value = false;
    medicamentoParaEliminar.value = null;
  };

  const ejecutarEliminacion = async () => {
    if (!medicamentoParaEliminar.value) return;

    eliminando.value = true;
    errorEliminar.value = null;

    try {
      const respuesta = await eliminarMedicamentoService.eliminar(medicamentoParaEliminar.value.id);
      cerrarModalEliminar();
      return respuesta;
    } catch (err) {
      console.error('Error al eliminar medicamento:', err);
      errorEliminar.value = err.response?.data?.message || 'Error al intentar eliminar el medicamento del inventario.';
      throw err;
    } finally {
      eliminando.value = false;
    }
  };

  return {
    eliminando,
    errorEliminar,
    visibleEliminar,
    medicamentoParaEliminar,
    abrirModalEliminar,
    cerrarModalEliminar,
    ejecutarEliminacion
  };
}