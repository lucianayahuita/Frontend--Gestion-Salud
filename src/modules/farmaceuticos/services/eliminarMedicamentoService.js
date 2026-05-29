import api from '@/api/axios.js';

export const eliminarMedicamentoService = {
  /**
   * @param {Number|String} id 
   */
  async eliminar(id) {
    const response = await api.delete(`/medicamentos/${id}`);
    return response.data; 
  }
};