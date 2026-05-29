import { ref, reactive, watch } from 'vue';
import { listarMedicamentosService } from '../services/listarMedicamentosService.js';

export function useListarMedicamentos() {
  const medicamentos = ref([]);
  const totalItems = ref(0);
  const cargando = ref(false);
  const error = ref(null);
  const filtros = reactive({
    search: '',
    estado: ''
  });

  const cargarMedicamentos = async () => {
    cargando.value = true;
    error.value = null;
    try {
      const resultado = await listarMedicamentosService.obtenerMedicamentos(filtros);
      medicamentos.value = resultado.data || [];
      totalItems.value = medicamentos.value.length;
    } catch (err) {
      console.error('Error en el módulo de medicamentos:', err);
      error.value = err.response?.data?.message || 'Error al cargar el catálogo de medicamentos.';
    } finally {
      cargando.value = false;
    }
  };
  watch(
    () => [filtros.search, filtros.estado],
    () => {
      cargarMedicamentos();
    }
  );

  return {
    medicamentos,
    totalItems,
    cargando,
    error,
    filtros,
    cargarMedicamentos 
  };
}