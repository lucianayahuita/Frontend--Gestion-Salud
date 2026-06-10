import { ref } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js';

export function useMedicamentosMasPrescritosPorMedico() {
  const datos = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const filtros = ref({
    medico_id: '',
    top: 10,
    fecha_desde: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString().split('T')[0],
    fecha_hasta: new Date().toISOString().split('T')[0],
  });

  const fetchReporte = async () => {
    if (!filtros.value.medico_id) return;
    loading.value = true;
    error.value = null;
    try {
      const { data } = await reportesService.getMedicamentosMasPrescritosPorMedico({
        medico_id:   filtros.value.medico_id,
        top:         filtros.value.top,
        fecha_desde: filtros.value.fecha_desde,
        fecha_hasta: filtros.value.fecha_hasta,
      });
      datos.value = data.data ?? data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar el reporte';
      datos.value = null;
    } finally {
      loading.value = false;
    }
  };

  const limpiar = () => {
    datos.value = null;
    error.value = null;
  };

  return { datos, loading, error, filtros, fetchReporte, limpiar };
}