import api from '@/api/axios.js';

export const cancelarCitaService = {
  /**
   * @param {Number|String} citaId 
   * @returns {Promise<Object>} 
   */
  async cancelar(citaId) {
    const response = await api.delete(`/citas/${citaId}`);
    return response.data;
  }
};