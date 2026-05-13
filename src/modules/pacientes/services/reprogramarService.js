import api from '@/api/axios.js';

export const reprogramarCitaService = async (id, datosCita) => {
  try {
    const response = await api.put(`/citas/${id}`, datosCita);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al reprogramar la cita';
  }
};