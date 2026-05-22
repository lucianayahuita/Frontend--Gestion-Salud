import api from '@/api/axios.js';

export const verFarmaceuticoService = {
  async obtenerDetalleFarmaceutico(id) {
    try {
      const respuesta = await api.get(`/users/${id}`);
      return respuesta.data.data || respuesta.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Error al obtener el detalle del farmacéutico';
    }
  }
};