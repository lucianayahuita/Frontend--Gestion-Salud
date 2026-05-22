import api from '@/api/axios.js';

export const medicoService = {
  async registrarMedico(datos) {
    try {
      const respuesta = await api.post('/users', {
        name: `${datos.nombre} ${datos.apellido}`,
        email: datos.email,
        password: datos.password,
        rol_id: 2 
      });
      
      return respuesta.data;
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        throw error.response.data.errors; 
      }
      throw error.response?.data?.message || error.message || 'Error al registrar el médico';
    }
  }
};