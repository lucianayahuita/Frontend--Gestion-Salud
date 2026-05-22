import { ref } from 'vue';
import { farmaceuticoService } from '../services/registrarFarmaceuticoService';

export function useRegistrarFarmaceutico() {
  const cargando = ref(false);
  const errores = ref(null);

  const formulario = ref({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });

  const enviarRegistro = async () => {
    cargando.value = true;
    errores.value = null;
    try {
      await farmaceuticoService.registrarFarmaceutico(formulario.value);
      return true;
    } catch (err) {
      errores.value = err;
      return false;
    } finally {
      cargando.value = false;
    }
  };

  return { formulario, cargando, errores, enviarRegistro };
}