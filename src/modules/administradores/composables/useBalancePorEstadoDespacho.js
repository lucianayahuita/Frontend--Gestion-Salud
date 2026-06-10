import { ref } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico'; 

export function useBalanceRecetas() {
  const datos = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const hoy = new Date();
  const unMesAtras = new Date();
  unMesAtras.setMonth(hoy.getMonth() - 1);

  const filtros = ref({
    fecha_desde: unMesAtras.toISOString().split('T')[0],
    fecha_hasta: hoy.toISOString().split('T')[0]
  });

  const fetchReporte = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await reportesService.getRecetasBalancePorEstadoDespacho(filtros.value);
      if (data.success) {
        datos.value = data.data;
      } else {
        error.value = data.message || 'Error al obtener el reporte';
      }
    } catch (e) {
      console.error('Error balance recetas:', e);
      error.value = e.response?.data?.message || 'Error de conexión con el servidor.';
    } finally {
      loading.value = false;
    }
  };

  const limpiar = () => {
    datos.value = null;
    error.value = null;
    filtros.value.fecha_desde = unMesAtras.toISOString().split('T')[0];
    filtros.value.fecha_hasta = hoy.toISOString().split('T')[0];
  };

  return {
    datos,
    loading,
    error,
    filtros,
    fetchReporte,
    limpiar
  };
}