import api from '@/api/axios.js';

export const obtenerPacientesService = async () => {
  try {
    const response = await api.get('/pacientes');
    return response.data.data; 
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener el listado de pacientes';
  }
};