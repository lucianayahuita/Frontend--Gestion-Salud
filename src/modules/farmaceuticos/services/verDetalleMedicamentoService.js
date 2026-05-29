import api from '@/api/axios.js';

export const verDetalleMedicamentoService = {
  /**
   * @param {Number|String} id 
   */
  async obtenerDetalle(id) {
    const response = await api.get(`/medicamentos/${id}`);
    return response.data; 
  }
};