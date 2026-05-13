import api from '@/api/axios.js';

export const verMisCitasService = {
  async getCitasByPaciente(pacienteId) {
    try {
      const response = await api.get(`/pacientes/${pacienteId}/citas`);
      
      if (response.data && response.data.success) {
        return response.data.data; 
      }
      return [];
    } catch (error) {
      console.error("Error en el servicio:", error);
      throw error;
    }
  }
};