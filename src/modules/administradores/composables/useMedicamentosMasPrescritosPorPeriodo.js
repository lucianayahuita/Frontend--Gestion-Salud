import { ref } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js';

export function useMedicamentosMasPrescritosPorPeriodo(isOpen) {
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

  const filtros = ref({
    fecha_desde: primerDiaMes,
    fecha_hasta: ultimoDiaMes,
    top: 5 
  });

  const loading = ref(false);
  const datosReporte = ref([]); 

  const fetchReporte = async () => {
    if (isOpen && !isOpen.value) return;

    loading.value = true;
    try {
      const { data } = await reportesService.getMedicamentosMasPrescritosPorPeriodo({
        fecha_desde: filtros.value.fecha_desde,
        fecha_hasta: filtros.value.fecha_hasta,
        top: filtros.value.top
      });
      
      if (data && data.success && data.data && data.data.ranking) {
        datosReporte.value = data.data.ranking;
      } else {
        datosReporte.value = [];
      }
    } catch (error) {
      console.error('Error al obtener reporte de medicamentos más prescritos:', error);
      datosReporte.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    filtros,
    loading,
    datosReporte,
    fetchReporte
  };
}