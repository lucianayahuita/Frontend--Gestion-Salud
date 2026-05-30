import api from '@/api/axios.js';

export const verCitasService = {
  async obtenerCitas() {
    try {
      const { data } = await api.get('/citas');
      if (data && data.success) {
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error en verCitasService.obtenerCitas:', error);
      throw error;
    }
  }
};