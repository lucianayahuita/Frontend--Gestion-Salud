import { ref, computed } from 'vue';
import { reportesService } from '../services/recetasEmitidasPorMedico.js';

export function useRecetasEmitidasPorPaciente() {
  const datos = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const filtros = ref({
    paciente_id: '',
    fecha_desde: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    fecha_hasta: new Date().toISOString().split('T')[0],
  });

  const listaRecetas = computed(() => datos.value?.recetas || []);
  const totalRecetas = computed(() => datos.value?.total_recetas || 0);

  const chartDataMapeada = computed(() => {
    if (listaRecetas.value.length === 0) return null;
    const conteo = {};
    listaRecetas.value.forEach(r => {
      const nombreMed = r.medicamento?.nombre || 'Desconocido';
      conteo[nombreMed] = (conteo[nombreMed] || 0) + 1;
    });
    return {
      labels: Object.keys(conteo),
      datasets: [{
        label: 'Cantidad Recetada',
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        data: Object.values(conteo)
      }]
    };
  });

  const fetchReporte = async () => {
    if (!filtros.value.paciente_id) return;
    loading.value = true;
    error.value = null;
    try {
      // LLAMADA AL MÉTODO CORRECTO DE TU SERVICIO
      const response = await reportesService.getRecetasEmitidasPorPacienteHistorico({
        paciente_id: filtros.value.paciente_id,
        fecha_desde: filtros.value.fecha_desde,
        fecha_hasta: filtros.value.fecha_hasta,
      });
      const respuestaApi = response.data;
      datos.value = respuestaApi.success ? respuestaApi.data : respuestaApi;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar el reporte histórico';
      datos.value = null;
    } finally {
      loading.value = false;
    }
  };

  const limpiar = () => {
    datos.value = null;
    error.value = null;
    filtros.value.paciente_id = '';
  };

  return {
    datos,
    listaRecetas,
    totalRecetas,
    chartDataMapeada,
    loading,
    error,
    filtros,
    fetchReporte,
    limpiar,
  };
}