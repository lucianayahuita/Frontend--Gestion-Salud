import api from '@/api/axios.js';

export const obtenerHistorialService = async (pacienteId) => {
  try {
    const response = await api.get(`/pacientes/${pacienteId}/historias-clinicas`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener el historial clínico del paciente';
  }
};