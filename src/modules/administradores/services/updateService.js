import api from '@/api/axios.js'; 

export const updatePaciente = async (id, data) => {
    try {
        const response = await api.put(`/pacientes/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error en el servicio:", error);
        throw error.response ? error.response.data : new Error('Error al actualizar');
    }
};