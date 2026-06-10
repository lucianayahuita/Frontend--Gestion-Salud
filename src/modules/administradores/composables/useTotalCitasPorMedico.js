import { ref } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js'; 

export function useTotalCitasPorMedico(isOpen) {
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

  const filtros = ref({
    medico_id: '', 
    fecha_desde: primerDiaMes,
    fecha_hasta: ultimoDiaMes
  });

  const loading = ref(false);
  
  const totalCitas = ref(0);
  const desgloseEstados = ref({
    completada: 0,
    pendiente: 0
  });

  const fetchReporte = async () => {
    if (isOpen && !isOpen.value) return;
    if (!filtros.value.medico_id) return;

    loading.value = true;
    try {
      const { data } = await reportesService.getTotalDeCitasPorMedico({
        medico_id: filtros.value.medico_id,
        fecha_desde: filtros.value.fecha_desde,
        fecha_hasta: filtros.value.fecha_hasta
      });

      if (data && data.success && data.data) {
        totalCitas.value = data.data.total_citas || 0;
        desgloseEstados.value = {
          completada: data.data.por_estado?.completada || 0,
          pendiente: data.data.por_estado?.pendiente || 0
        };
      } else {
        totalCitas.value = 0;
        desgloseEstados.value = { completada: 0, pendiente: 0 };
      }
    } catch (error) {
      console.error('Error al obtener reporte total de citas por médico:', error);
      totalCitas.value = 0;
      desgloseEstados.value = { completada: 0, pendiente: 0 };
    } finally {
      loading.value = false;
    }
  };

  return {
    filtros,
    loading,
    totalCitas,
    desgloseEstados,
    fetchReporte
  };
}