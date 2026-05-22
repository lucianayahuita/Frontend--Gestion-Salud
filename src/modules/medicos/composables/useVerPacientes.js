import { ref } from 'vue';
import { obtenerPacientesService } from '../services/verPacientesService';

export const useVerPacientes = () => {
  const pacientes = ref([]);
  const cargando = ref(false);
  const errorPacientes = ref(null);

  const cargarPacientes = async () => {
    cargando.value = true;
    errorPacientes.value = null;
    try {
      pacientes.value = await obtenerPacientesService();
    } catch (err) {
      console.error(err);
      errorPacientes.value = err;
    } finally {
      cargando.value = false;
    }
  };

  return {
    pacientes,
    cargando,
    errorPacientes,
    cargarPacientes
  };
};