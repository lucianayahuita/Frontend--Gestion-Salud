import { ref }  from 'vue';
import logService from '../services/logService.js';

export function useLogs() {
    const logs = ref([]);
    const loading = ref(false);
    const paginacion = ref({});

    const filtros = ref({
        tipo_evento: '',
        user_id: '',
        fecha_desde: new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString().split('T')[0],
        fecha_hasta: new Date().toISOString().split('T')[0],
    });

    const fetchLogs = async (page = 1) => {
        loading.value = true;
        try {
            const params = { page };
            if (filtros.value.tipo_evento) params.tipo_evento = filtros.value.tipo_evento;
            if (filtros.value.user_id)    params.user_id    = filtros.value.user_id;
            if (filtros.value.fecha_desde) params.fecha_desde = filtros.value.fecha_desde;
            if (filtros.value.fecha_hasta) params.fecha_hasta = filtros.value.fecha_hasta;

            const res = await logService.getLogsSeguridad(params);
            logs.value = res.data.data;
            paginacion.value = {
                currentPage: res.data.current_page,
                lastPage:    res.data.last_page,
                total:       res.data.total,
            };
        } catch (error) {
            console.error('Error cargando logs:', error);
            logs.value = [];
        } finally {
            loading.value = false;
        }
    };

    const resetFiltros = () => {
        filtros.value.tipo_evento = '';
        filtros.value.user_id    = '';
        filtros.value.fecha_desde = new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString().split('T')[0];
        filtros.value.fecha_hasta = new Date().toISOString().split('T')[0];
        fetchLogs();
    };

    return { logs, loading, filtros, paginacion, fetchLogs, resetFiltros };
}