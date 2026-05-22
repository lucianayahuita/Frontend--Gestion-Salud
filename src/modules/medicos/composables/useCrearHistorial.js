import { ref } from 'vue';
import { crearHistorialService, actualizarEstadoCitaService } from '../services/crearHistorialService';

export const useCrearHistorial = () => {
  const guardando = ref(false);
  const errorHistorial = ref(null);
  const exitoHistorial = ref(false);

  const registrarConsultaCompleta = async (cita, datosHistorial) => {
    guardando.value = true;
    errorHistorial.value = null;
    exitoHistorial.value = false;

    try {
      await crearHistorialService(datosHistorial);

      const horaFormateada = cita.hora && cita.hora.length >= 5 ? cita.hora.substring(0, 5) : "08:00";
      const hoyStr = new Date().toISOString().split('T')[0];
      const fechaCita = cita.fecha >= hoyStr ? cita.fecha : hoyStr;

      const datosActualizacionCita = {
        paciente_id: parseInt(cita.paciente_id || cita.paciente?.id, 10),
        medico_id: parseInt(cita.medico_id, 10),
        fecha: fechaCita,
        hora: horaFormateada, 
        estado: 'completada' 
      };
      
      await actualizarEstadoCitaService(cita.id, datosActualizacionCita);
      
      exitoHistorial.value = true;
      return { success: true };
    } catch (err) {
      if (err.response && err.response.data) {
        console.log("--- DETALLES DEL ERROR ---");
        console.error("Respuesta del servidor:", err.response.data);
        
        if (err.response.data.errors) {
          console.log("Campos rechazados por validación:");
          console.table(err.response.data.errors);
        }
        
        errorHistorial.value = err.response.data.message || "Datos invalidos";
      } else {
        console.error("Error genérico en el proceso clínico:", err);
        errorHistorial.value = "Error de conexión o de servidor.";
      }
      
      return { success: false, error: err };
    } finally {
      guardando.value = false;
    }
  };

  return {
    registrarConsultaCompleta,
    guardando,
    errorHistorial,
    exitoHistorial
  };
};