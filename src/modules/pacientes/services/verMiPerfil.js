import api from '@/api/axios.js';

export const getMyProfile = async () => {
    try {
        const response = await api.get('/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPatientDetails = async (id) => {
    try {
        const response = await api.get(`/pacientes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};