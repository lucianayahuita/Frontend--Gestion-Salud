import api from '@/api/axios.js';

export const verHistoriaClinicaService = {
  async obtenerDetalleHistoria(historiaId) {
    try {
      const response = await api.get(`/historias-clinicas/${historiaId}`)
      return response.data
    } catch (error) {
      console.error(`Error en el servicio al traer la historia ${historiaId}:`, error)
      throw error
    }
  }
};