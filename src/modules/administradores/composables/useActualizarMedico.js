import { ref } from 'vue';
import { actualizarMedicoService } from '../services/actualizarMedicoService';

export function useActualizarMedico(medicoInicial) {
  const email = ref(medicoInicial?.email || '');
  const cargando = ref(false);
  const errores = ref(null);
  const ejecutarActualizacion = async (id) => {
    cargando.value = true;
    errores.value = null;
    const datosPayload = {
      name: medicoInicial.name,     
      email: email.value,          
      rol_id: medicoInicial.rol_id || 2 
    };

    try {
      await actualizarMedicoService.actualizarMedico(id, datosPayload);
      return true;
    } catch (err) {
      errores.value = err;
      return false;
    } finally {
      cargando.value = false;
    }
  };

  return { email, cargando, errores, ejecutarActualizacion };
}