import api from '@/api/axios.js';

export const actualizarFarmaceuticoService = {
  async actualizarFarmaceutico(id, datos) {
    try {
      const respuesta = await api.put(`/users/${id}`, {
        name: datos.name,
        email: datos.email,
        rol_id: datos.rol_id || 5 
      });
      return respuesta.data;
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        throw error.response.data.errors;
      }
      throw error.response?.data?.message || error.message || 'Error al actualizar el farmacéutico';
    }
  }
};