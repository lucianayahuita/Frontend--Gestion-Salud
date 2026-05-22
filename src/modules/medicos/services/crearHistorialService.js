import api from '@/api/axios.js';

export const crearHistorialService = async (datosHistorial) => {
  try {
    const response = await api.post('/historias-clinicas', datosHistorial);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const actualizarEstadoCitaService = async (idCita, datosCita) => {
  try {
    const response = await api.put(`/citas/${idCita}`, datosCita);
    return response.data;
  } catch (error) {
    throw error;
  }
};