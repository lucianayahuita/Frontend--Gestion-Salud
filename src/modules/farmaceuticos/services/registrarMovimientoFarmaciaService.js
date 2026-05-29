import api from '@/api/axios.js'; 
export const registrarMovimientoFarmaciaService = {
  async obtenerMedicamentosDisponibles() {
    const response = await api.get('medicamentos', { params: { estado: 'activo' } });
    return response.data.data; 
  },
  /**
   * @param {Object} data 
   */
  async registrarMovimiento(data) {
    const response = await api.post('movimientos-farmacia', data);
    return response.data; 
  }
};