import api from '@/api/axios.js';

const logService = {
    async getLogsSeguridad(params = {}) {
        const { data } = await api.get('/logs/seguridad', { params });
        return data;
    }
};

export default logService;