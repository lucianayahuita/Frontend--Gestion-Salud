import api from '@/api/axios.js';

export const deleteCita = async (citaId) => {
    const response = await api.delete(`/citas/${citaId}`);
    return response.data;
};