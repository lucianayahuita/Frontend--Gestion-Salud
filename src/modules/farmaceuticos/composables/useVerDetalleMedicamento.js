import { ref } from 'vue';
import { verDetalleMedicamentoService } from '../services/verDetalleMedicamentoService.js';

export function useVerDetalleMedicamento() {
  const medicamento = ref(null);
  const cargando = ref(false);
  const error = ref(null);
  const visible = ref(false);

  const abrirDetalle = async (id) => {
    visible.value = true;
    cargando.value = true;
    error.value = null;
    medicamento.value = null;
    
    try {
      const resultado = await verDetalleMedicamentoService.obtenerDetalle(id);
      medicamento.value = resultado.data;
    } catch (err) {
      console.error('Error al obtener detalle del medicamento:', err);
      error.value = err.response?.data?.message || 'No se pudo cargar la información del medicamento.';
    } finally {
      cargando.value = false;
    }
  };

  const cerrarDetalle = () => {
    visible.value = false;
    medicamento.value = null;
  };

  return {
    medicamento,
    cargando,
    error,
    visible,
    abrirDetalle,
    cerrarDetalle
  };
}