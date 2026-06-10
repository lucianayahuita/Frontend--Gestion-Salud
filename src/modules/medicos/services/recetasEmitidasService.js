import api from '@/api/axios'; 

export const recetasEmitidasService = {
  async getPerfilUsuario() {
    const response = await api.get('/me');
    return response.data.success ? response.data.data : response.data;
  },
  async getRecetasPorMedico(medicoId) {
    const response = await api.get(`/medicos/${medicoId}/recetas-medicas`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Error al obtener las recetas');
  }
};