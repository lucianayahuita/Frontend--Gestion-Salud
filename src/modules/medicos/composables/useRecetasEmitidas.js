import { ref, computed, onMounted } from 'vue';
import { recetasEmitidasService } from '../services/recetasEmitidasService.js';
export function useVerRecetasEmitidas() {
  const recetas = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Filtros reactivos
  const filtroEstado = ref('todos');
  const filtroBusqueda = ref('');

  const cargarRecetas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const usuario = await recetasEmitidasService.getPerfilUsuario();
      const medicoId = usuario?.id; 

      if (!medicoId) {
        throw new Error('No se pudo determinar el identificador del médico desde el servidor.');
      }
      recetas.value = await recetasEmitidasService.getRecetasPorMedico(medicoId);
    } catch (err) {
      error.value = err.message || 'Error en la comunicación con el servidor.';
    } finally {
      loading.value = false;
    }
  };
  const recetasFiltradas = computed(() => {
    return recetas.value.filter(receta => {
      const coincideEstado = filtroEstado.value === 'todos' || 
                            receta.estado_despacho.toLowerCase() === filtroEstado.value.toLowerCase();
      
      const query = filtroBusqueda.value.toLowerCase().trim();
      const coincideBusqueda = !query || 
                               receta.medicamento?.nombre.toLowerCase().includes(query) ||
                               receta.cita_id.toString().includes(query) ||
                               receta.indicaciones.toLowerCase().includes(query);

      return coincideEstado && coincideBusqueda;
    });
  });
  const totalPendientes = computed(() => recetas.value.filter(r => r.estado_despacho === 'pendiente').length);
  const totalDespachadas = computed(() => recetas.value.filter(r => r.estado_despacho === 'despachada').length);

  onMounted(() => {
    cargarRecetas();
  });

  return {
    recetas,
    recetasFiltradas,
    loading,
    error,
    filtroEstado,
    filtroBusqueda,
    totalPendientes,
    totalDespachadas,
    recargarRecetas: cargarRecetas
  };
}