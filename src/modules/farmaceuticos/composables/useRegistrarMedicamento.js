import { ref } from 'vue';
import { registrarMedicamentoService } from '../services/registrarMedicamentoService.js';

export function useRegistrarMedicamento() {
  const guardando = ref(false);
  const error = ref(null);
  const visible = ref(false);
  const formulario = ref({
    nombre: '',
    descripcion: '',
    stock: 0,
    precio: '',
    estado: 'activo' 
  });

  const abrirModal = () => {
    visible.value = true;
    error.value = null;
    formulario.value = {
      nombre: '',
      descripcion: '',
      stock: 0,
      precio: '',
      estado: 'activo'
    };
  };

  const cerrarModal = () => {
    visible.value = false;
  };

  const ejecutarRegistro = async () => {
    guardando.value = true;
    error.value = null;

    try {
      const payload = {
        ...formulario.value,
        stock: Number(formulario.value.stock),
        precio: Number(formulario.value.precio)
      };

      const respuesta = await registrarMedicamentoService.registrar(payload);
      cerrarModal();
      return respuesta; 
    } catch (err) {
      console.error('Error al registrar medicamento:', err);
      error.value = err.response?.data?.message || 'Ocurrió un error al procesar el registro.';
      throw err;
    } finally {
      guardando.value = false;
    }
  };

  return {
    formulario,
    guardando,
    error,
    visible,
    abrirModal,
    cerrarModal,
    ejecutarRegistro
  };
}