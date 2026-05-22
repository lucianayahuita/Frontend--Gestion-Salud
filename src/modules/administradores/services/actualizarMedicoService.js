import api from '@/api/axios.js';

export const actualizarMedicoService = {
  async actualizarMedico(id, datos) {
    try {
      const respuesta = await api.put(`/users/${id}`, {
        name: datos.name,
        email: datos.email,
        rol_id: datos.rol_id || 2 
      });
      return respuesta.data;
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw error.response?.data?.message || error.message || 'Error al actualizar el médico';
    }
  }
};