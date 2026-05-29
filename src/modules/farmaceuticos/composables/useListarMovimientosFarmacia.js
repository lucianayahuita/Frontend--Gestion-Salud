import { ref, reactive, watch } from 'vue';
import { listarMovimientosFarmaciaService } from '../services/listarMovimientosFarmaciaService.js';

export function useListarMovimientosFarmacia() {
  const movimientos = ref([]);
  const cargando = ref(false);
  const error = ref(null);
  const filtros = reactive({
    medicamento_id: '',
    tipo: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const cargarMovimientos = async () => {
    cargando.value = true;
    error.value = null;
    try {
      movimientos.value = await listarMovimientosFarmaciaService.obtenerMovimientos(filtros);
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      error.value = "No se pudo sincronizar el historial con el servidor.";
    } finally {
      cargando.value = false;
    }
  };
  watch(() => [filtros.tipo, filtros.fecha_desde, filtros.fecha_hasta], () => {
    cargarMovimientos();
  });

  return {
    movimientos,
    cargando,
    error,
    filtros,
    cargarMovimientos
  };
}