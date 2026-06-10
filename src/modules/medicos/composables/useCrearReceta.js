import { ref } from 'vue';
import { crearRecetaService } from '../services/crearRecetaService.js'; 

export function useCrearReceta() {
  const guardandoReceta = ref(false);
  const errorReceta = ref(null);

  const formularioReceta = ref({
    medicamento_id: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    indicaciones: '',
    estado_despacho: 'pendiente'
  });

  const resetFormulario = () => {
    formularioReceta.value = {
      medicamento_id: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      indicaciones: '',
      estado_despacho: 'pendiente'
    };
    errorReceta.value = null;
  };

  const enviarReceta = async (citaId) => {
    if (!citaId || !formularioReceta.value.medicamento_id) {
      errorReceta.value = 'Faltan parámetros obligatorios.';
      return null;
    }

    guardandoReceta.value = true;
    errorReceta.value = null;

    try {
      const payload = {
        cita_id: citaId,
        ...formularioReceta.value
      };
      const resultado = await crearRecetaService.registrarReceta(payload);
      return resultado;
    } catch (err) {
      console.error('Error en useCrearReceta:', err);
      errorReceta.value = err.response?.data?.message || 'Error al registrar la receta.';
      throw err;
    } finally {
      guardandoReceta.value = false;
    }
  };

  return {
    formularioReceta,
    guardandoReceta,
    errorReceta,
    enviarReceta,
    resetFormulario
  };
}