import { ref } from 'vue';
import { actualizarFarmaceuticoService } from '../services/actualizarFarmaceuticoService';

export function useActualizarFarmaceutico(farmaceuticoInicial) {
  const email = ref(farmaceuticoInicial?.email || '');
  const cargando = ref(false);
  const errores = ref(null);

  const ejecutarActualizacion = async (id) => {
    cargando.value = true;
    errores.value = null;
    
    const datosPayload = {
      name: farmaceuticoInicial.name,
      email: email.value,             
      rol_id: farmaceuticoInicial.rol_id || 5 
    };

    try {
      await actualizarFarmaceuticoService.actualizarFarmaceutico(id, datosPayload);
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