import { ref } from 'vue';
import { pacienteService } from '../services/pacienteService';

export function useRegistroPaciente() {
  const cargando = ref(false);
  const errores = ref(null);

  const formulario = ref({
    nombre: '',
    apellido: '',
    segundo_apellido: '',  
    email: '',
    password: '',
    ci: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    seguro: false
  });

  const enviarRegistro = async () => {
    cargando.value = true;
    errores.value = null;
    try {
      await pacienteService.registrarPacienteCompleto(formulario.value);
      return true;
    } catch (err) {
      errores.value = typeof err === 'string' ? err : 'Error al registrar el paciente';
      return false;
    } finally {
      cargando.value = false;
    }
  };

  return { formulario, cargando, errores, enviarRegistro };
}