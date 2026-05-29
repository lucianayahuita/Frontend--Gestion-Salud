import api from '@/api/axios.js';

export const registrarMedicamentoService = {
  /**
   * @param {Object} datosMedicamento 
   */
  async registrar(datosMedicamento) {
    const response = await api.post('/medicamentos', datosMedicamento);
    return response.data;
  }
};