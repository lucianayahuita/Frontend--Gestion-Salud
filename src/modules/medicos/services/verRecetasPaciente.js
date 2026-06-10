import api from '@/api/axios.js';

export const verRecetasPacienteService = {
  /**
   * @param {String|Number} pacienteId 
   * @returns {Promise<Array>} 
   */
  async obtenerRecetasPorPaciente(pacienteId) {
    try {
      const response = await api.get(`/pacientes/${pacienteId}/recetas-medicas`);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data?.message || 'Error al recuperar las recetas médicas.');
    } catch (error) {
      console.error('Error en verRecetasPacienteService:', error);
      throw error.response?.data?.message || error.message || 'Error de conexión con el servidor.';
    }
  }
};