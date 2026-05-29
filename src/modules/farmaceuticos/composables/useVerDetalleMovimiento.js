import { ref } from 'vue';
import { verDetalleMovimientoService } from '../services/verDetalleMovimientoService';

export function useVerDetalleMovimiento() {
  const detalle = ref(null);
  const cargandoDetalle = ref(false);
  const errorDetalle = ref(null);

  const cargarDetalleMovimiento = async (id) => {
    if (!id) return;
    
    cargandoDetalle.value = true;
    errorDetalle.value = null;
    detalle.value = null;

    try {
      const respuesta = await verDetalleMovimientoService.obtenerDetalleMovimiento(id);
      if (respuesta && respuesta.success) {
        detalle.value = respuesta.data;
      } else {
        errorDetalle.value = respuesta.message || "No se pudo recuperar la información.";
      }
    } catch (err) {
      errorDetalle.value = err.response?.data?.message || "Error de conexión con el servidor de farmacia.";
    } finally {
      cargandoDetalle.value = false;
    }
  };

  const limpiarDetalle = () => {
    detalle.value = null;
    errorDetalle.value = null;
  };

  return {
    detalle,
    cargandoDetalle,
    errorDetalle,
    cargarDetalleMovimiento,
    limpiarDetalle
  };
}