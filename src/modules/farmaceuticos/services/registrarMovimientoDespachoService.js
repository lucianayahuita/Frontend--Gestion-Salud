import api from '@/api/axios.js';

export const registrarMovimientoDespachoService = {
  /**
   * @param {Object} movimientoPayload 
   */
  async registrarMovimiento(movimientoPayload) {
    const response = await api.post('movimientos-farmacia', movimientoPayload);
    return response.data;
  },

  /**
   * @param {Number|String} recetaId 
   * @param {Object} recetaPayload 
   */
  async actualizarReceta(recetaId, recetaPayload) {
    const response = await api.put(`recetas-medicas/${recetaId}`, recetaPayload);
    return response.data;
  }
};