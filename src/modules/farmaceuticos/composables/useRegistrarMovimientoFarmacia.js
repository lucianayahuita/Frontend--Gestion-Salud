import { ref } from 'vue';
import { registrarMovimientoFarmaciaService } from '../services/registrarMovimientoFarmaciaService.js';
export function useRegistrarMovimientoFarmacia() {
  const medicamentos = ref([]);
  const cargandoMedicamentos = ref(false);
  const procesandoGuardado = ref(false);
  const errorFormulario = ref(null);
  const formulario = ref({
    medicamento_id: '',
    tipo: 'entrada',
    cantidad: 1,
    detalle: '',
    fecha: new Date().toISOString().split('T')[0] 
  });

  const limpiarFormulario = () => {
    formulario.value = {
      medicamento_id: '',
      tipo: 'entrada',
      cantidad: 1,
      detalle: '',
      fecha: new Date().toISOString().split('T')[0]
    };
    errorFormulario.value = null;
  };
  const cargarMedicamentosSelector = async () => {
    cargandoMedicamentos.value = true;
    try {
      medicamentos.value = await registrarMovimientoFarmaciaService.obtenerMedicamentosDisponibles();
    } catch (err) {
      console.error("Error cargando catálogo de medicamentos:", err);
    } finally {
      cargandoMedicamentos.value = false;
    }
  };
 const enviarFormulario = async () => {
  if (!formulario.value.medicamento_id || !formulario.value.cantidad || !formulario.value.detalle) {
    errorFormulario.value = "Por favor, completa todos los campos obligatorios.";
    return false;
  }
  procesandoGuardado.value = true;
  errorFormulario.value = null;
  try {
    const fechaSistema = new Date().toISOString().split('T')[0];

    const payload = {
      medicamento_id: Number(formulario.value.medicamento_id),
      tipo: formulario.value.tipo,
      cantidad: Number(formulario.value.cantidad),
      detalle: formulario.value.detalle,
      fecha: fechaSistema 
    };

    await registrarMovimientoFarmaciaService.registrarMovimiento(payload);
    return true; 
  } catch (err) {
    console.error("Error al registrar transacción:", err);
    errorFormulario.value = "No se pudo guardar la transacción.";
    return false;
  } finally {
    procesandoGuardado.value = false;
  }
};

  return {
    formulario,
    medicamentos,
    cargandoMedicamentos,
    procesandoGuardado,
    errorFormulario,
    limpiarFormulario,
    cargarMedicamentosSelector,
    enviarFormulario
  };
}