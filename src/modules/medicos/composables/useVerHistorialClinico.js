import { ref } from 'vue';
import { obtenerHistorialService } from '../services/verHistorialClinicoService';

export const useVerHistorialClinico = () => {
  const datosPaciente = ref(null);
  const historias = ref([]);
  const cargando = ref(false);
  const errorHistorial = ref(null);

  const cargarHistorial = async (pacienteId) => {
    cargando.value = true;
    errorHistorial.value = null;
    try {
      const data = await obtenerHistorialService(pacienteId);
      datosPaciente.value = data.paciente;
      historias.value = data.historias || [];
    } catch (err) {
      console.error(err);
      errorHistorial.value = err;
    } finally {
      cargando.value = false;
    }
  };

  return {
    datosPaciente,
    historias,
    cargando,
    errorHistorial,
    cargarHistorial
  };
};