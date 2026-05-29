import api from '@/api/axios.js';

export const modificarMedicamentoService = {
  /**
   * @param {Number|String} id - 
   * @param {Object} datosMedicamento 
   */
  async actualizar(id, datosMedicamento) {
    const response = await api.put(`/medicamentos/${id}`, datosMedicamento);
    return response.data; 
  }
};