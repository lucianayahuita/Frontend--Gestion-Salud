import { ref } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js';

export function useAlertaStockBajo(isOpen) {
  const filtros = ref({ umbral: 10 });
  const loading = ref(false);
  const datosReporte = ref([]);

  const fetchReporte = async () => {
    if (isOpen && !isOpen.value) return;
    loading.value = true;
    try {
      const { data } = await reportesService.getAlertasStockBajo({
        umbral: filtros.value.umbral
      });
      if (data && data.success && data.data && data.data.medicamentos) {
        datosReporte.value = data.data.medicamentos;
      } else {
        datosReporte.value = [];
      }
    } catch (error) {
      console.error(error);
      datosReporte.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { filtros, loading, datosReporte, fetchReporte };
}