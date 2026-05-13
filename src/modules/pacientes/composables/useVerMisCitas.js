// composables/useVerMisCitas.js
import { ref } from 'vue';
import { verMisCitasService } from '../services/verMisCitasService';

export function useVerMisCitas() {
  const citas = ref([]);
  const cargando = ref(false);
  const error = ref(null);

  const cargarCitas = async (pacienteId) => {
    if (!pacienteId || pacienteId === 'undefined') {
      console.warn("cargarCitas: No se proporcionó un ID de paciente válido");
      return;
    }
    
    cargando.value = true;
    error.value = null;
    
    try {
      console.log("Iniciando petición para paciente ID:", pacienteId);
      const respuesta = await verMisCitasService.getCitasByPaciente(pacienteId);
      citas.value = respuesta || []; 
      
      console.log("Citas cargadas con éxito:", citas.value);
    } catch (err) {
      console.error("Error capturado en el composable:", err);
      error.value = "No se pudieron cargar tus citas.";
      citas.value = []; 
    } finally {
      cargando.value = false;
    }
  };

  return {
    citas,
    cargando,
    error,
    cargarCitas
  };
}