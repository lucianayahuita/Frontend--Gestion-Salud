import api from '@/api/axios.js';
export const getUltimaCita = async (pacienteId) => {
    const response = await api.get(`/citas`, {
        params: {
            paciente_id: pacienteId,
            estado: 'pendiente'
        }
    });
    return response.data;
};