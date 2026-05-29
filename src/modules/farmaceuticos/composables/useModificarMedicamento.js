import { ref } from 'vue';
import { modificarMedicamentoService } from '../services/modificarMedicamentoService.js';

export function useModificarMedicamento() {
  const modificando = ref(false);
  const errorModificar = ref(null);
  const visibleModificar = ref(false);
  const medicamentoId = ref(null);
  const formularioModificar = ref({
    nombre: '',
    descripcion: '',
    precio: '',
    estado: 'activo'
  });
  const abrirModalEditar = (medicamento) => {
    medicamentoId.value = medicamento.id;
    errorModificar.value = null;
    visibleModificar.value = true;
    
    // Mapeamos los valores actuales
    formularioModificar.value = {
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion || '',
      precio: medicamento.precio,
      estado: medicamento.estado
    };
  };

  const cerrarModalEditar = () => {
    visibleModificar.value = false;
    medicamentoId.value = null;
  };

  const ejecutarActualizacion = async () => {
    modificando.value = true;
    errorModificar.value = null;

    try {
      const payload = {
        ...formularioModificar.value,
        precio: Number(formularioModificar.value.precio)
      };

      const respuesta = await modificarMedicamentoService.actualizar(medicamentoId.value, payload);
      cerrarModalEditar();
      return respuesta;
    } catch (err) {
      console.error('Error al actualizar medicamento:', err);
      errorModificar.value = err.response?.data?.message || 'Error al intentar actualizar el medicamento.';
      throw err;
    } finally {
      modificando.value = false;
    }
  };

  return {
    formularioModificar,
    modificando,
    errorModificar,
    visibleModificar,
    abrirModalEditar,
    cerrarModalEditar,
    ejecutarActualizacion
  };
}