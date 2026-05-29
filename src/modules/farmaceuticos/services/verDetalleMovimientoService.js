import api from '@/api/axios.js';

export const verDetalleMovimientoService = {
  /**
   * @param {Number|String} id 
   */
  async obtenerDetalleMovimiento(id) {
    try {
      const response = await api.get(`movimientos-farmacia/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error en servicio al consultar movimiento #${id}:`, error);
      throw error;
    }
  }
};
    