import { ref } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js'; 

export function useTasaCancelacionPorMedico(isOpen) {
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

  const filtros = ref({
    medico_id: '', 
    fecha_desde: primerDiaMes,
    fecha_hasta: ultimoDiaMes
  });

  const loading = ref(false);
  const metricas = ref({
    total_citas: 0,
    citas_canceladas: 0,
    tasa_cancelacion_porcentaje: 0
  });

  const fetchReporte = async () => {
    if (isOpen && !isOpen.value) return;
    if (!filtros.value.medico_id) return;

    loading.value = true;
    try {
      const { data } = await reportesService.getTasaCancelacionPorMedico({
        medico_id: filtros.value.medico_id,
        fecha_desde: filtros.value.fecha_desde,
        fecha_hasta: filtros.value.fecha_hasta
      });

      if (data && data.success && data.data) {
        metricas.value = {
          total_citas: data.data.total_citas ?? 0,
          citas_canceladas: data.data.citas_canceladas ?? 0,
          tasa_cancelacion_porcentaje: data.data.tasa_cancelacion_porcentaje ?? 0
        };
      } else {
        resetMetricas();
      }
    } catch (error) {
      console.error('Error al obtener la tasa de cancelación por médico:', error);
      resetMetricas();
    } finally {
      loading.value = false;
    }
  };

  const resetMetricas = () => {
    metricas.value = {
      total_citas: 0,
      citas_canceladas: 0,
      tasa_cancelacion_porcentaje: 0
    };
  };

  return {
    filtros,
    loading,
    metricas,
    fetchReporte
  };
}