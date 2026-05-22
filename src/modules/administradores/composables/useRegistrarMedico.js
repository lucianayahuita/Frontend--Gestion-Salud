import { ref } from 'vue';
import { medicoService } from '../services/registrarMedicoService';

export function useRegistrarMedico() {
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
      await medicoService.registrarMedico(formulario.value);
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