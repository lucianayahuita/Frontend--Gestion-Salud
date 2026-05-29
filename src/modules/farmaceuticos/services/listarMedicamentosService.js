import api from '@/api/axios.js';

export const listarMedicamentosService = {
  /**
   * Obtiene la lista de medicamentos filtrada 
   * @param {Object} filtros - Filtros opcionales (search, estado)
   */
  async obtenerMedicamentos(filtros = {}) {
    const params = {};
    if (filtros.search) params.search = filtros.search;
    if (filtros.estado) params.estado = filtros.estado;
    const response = await api.get('/medicamentos', { params });
    
    return response.data; 
  }
};