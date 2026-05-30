import api from '@/api/axios.js';

export const verDetalleCitaService = {
  /**
   * @param {Number|String} id 
   */
  async obtenerDetalleCita(id) {
    try {
      const { data } = await api.get(`/citas/${id}`);
      if (data && data.success) {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error(`Error en verDetalleCitaService al consultar ID ${id}:`, error);
      throw error;
    }
  }
};