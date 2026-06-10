import { ref, watch } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js'; 

export function useRecetasDespachadasPorFarmaceutico(isOpen) {
  const loading = ref(false);
  const datosReporte = ref(null);
  
  const filtros = ref({
    farmaceutico_id: '',
    fecha_desde: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    fecha_hasta: new Date().toISOString().split('T')[0],
  });

  const fetchReporte = async () => {
    if (!filtros.value.farmaceutico_id) return;
    
    loading.value = true;
    try {
      const { data } = await reportesService.getRecetasDespachadasPorFarmaceutico(filtros.value);
      datosReporte.value = data.data !== undefined ? data.data : data;
    } catch (error) {
      console.error('Error al consultar recetas por farmacéutico:', error);
      datosReporte.value = null;
    } finally {
      loading.value = false;
    }
  };

  watch(filtros, () => {
    if (isOpen.value) fetchReporte();
  }, { deep: true });

  watch(isOpen, (nuevoValor) => {
    if (nuevoValor && filtros.value.farmaceutico_id) {
      fetchReporte();
    }
  });

  return {
    filtros,
    loading,
    datosReporte,
    fetchReporte
  };
}