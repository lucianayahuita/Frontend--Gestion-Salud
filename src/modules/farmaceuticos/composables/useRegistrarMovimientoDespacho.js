import { ref } from 'vue';
import { registrarMovimientoDespachoService } from '../services/registrarMovimientoDespachoService.js';

export function useRegistrarMovimientoDespacho() {
  const cargando = ref(false);
  const error = ref(null);
  const codigoError = ref(null); 

  const calcularCantidadAutomatica = (receta) => {
    if (!receta) return 1;

    try {
      const dosisNumerica = parseFloat(receta.dosis) || 1;

      let tomasAlDia = 1;
      const frec = receta.frecuencia.toLowerCase();
      
      if (frec.includes('8 hrs') || frec.includes('8 horas')) {
        tomasAlDia = 3; // 24 horas / 8
      } else if (frec.includes('12 hrs') || frec.includes('12 horas')) {
        tomasAlDia = 2; // 24 horas / 12
      } else if (frec.includes('6 hrs') || frec.includes('6 horas')) {
        tomasAlDia = 4; // 24 horas / 6
      } else if (frec.includes('24 hrs') || frec.includes('24 horas') || frec.includes('diario')) {
        tomasAlDia = 1;
      }

      const matchesDias = receta.duracion.match(/\d+/);
      const diasTotales = matchesDias ? parseInt(matchesDias[0]) : 1;

      const unidadesPorToma = dosisNumerica >= 10 ? 1 : dosisNumerica;

      const totalCalculado = unidadesPorToma * tomasAlDia * diasTotales;
      return totalCalculado > 0 ? totalCalculado : 1;

    } catch (err) {
      console.warn("Fallo al calcular de forma automatizada, usando 1 por defecto:", err);
      return 1;
    }
  };

  const ejecutarDespacho = async (receta, cantidad, detalle, farmaceuticoId) => {
    if (!farmaceuticoId) {
      error.value = "No se ha detectado la sesión del farmacéutico autenticado.";
      return { success: false };
    }

    cargando.value = true;
    error.value = null;
    codigoError.value = null;

    try {
      const movimientoPayload = {
        medicamento_id: receta.medicamento_id,
        receta_medica_id: receta.id,
        farmaceutico_id: farmaceuticoId, 
        tipo: "salida",
        cantidad: parseInt(cantidad),
        detalle: detalle || `Despacho de insumos médicos de receta #${receta.id}`,
        fecha: new Date().toISOString().split('T')[0] 
      };

      await registrarMovimientoDespachoService.registrarMovimiento(movimientoPayload);

      const recetaPayload = {
        cita_id: receta.cita_id,
        medicamento_id: receta.medicamento_id,
        dosis: receta.dosis,
        frecuencia: receta.frecuencia,
        duracion: receta.duracion,
        indicaciones: receta.indicaciones,
        estado_despacho: "despachada" // Transición de estado a finalizado
      };

      await registrarMovimientoDespachoService.actualizarReceta(receta.id, recetaPayload);
      return { success: true };

    } catch (err) {
      if (err.response) {
        codigoError.value = err.response.status; 
        error.value = err.response.data?.message || "Error al registrar la operación.";
      } else {
        error.value = "Fallo de comunicación con el servidor.";
      }
      return { success: false };
    } finally {
      cargando.value = false;
    }
  };

  return {
    cargando,
    error,
    codigoError,
    calcularCantidadAutomatica,
    ejecutarDespacho
  };
}