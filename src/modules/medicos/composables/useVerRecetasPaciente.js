import { ref } from 'vue';
import { verRecetasPacienteService } from '../services/verRecetasPaciente.js';

export function useVerRecetasPaciente() {
  const recetas = ref([]);
  const cargandoRecetas = ref(false);
  const errorRecetas = ref(null);

  const cargarRecetas = async (pacienteId) => {
    if (!pacienteId) return;
    
    cargandoRecetas.value = true;
    errorRecetas.value = null;
    
    try {
      const data = await verRecetasPacienteService.obtenerRecetasPorPaciente(pacienteId);
      recetas.value = data;
    } catch (err) {
      errorRecetas.value = err;
    } finally {
      cargandoRecetas.value = false;
    }
  };

  return {
    recetas,
    cargandoRecetas,
    errorRecetas,
    cargarRecetas
  };
}