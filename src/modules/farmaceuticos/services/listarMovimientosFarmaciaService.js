import api from '@/api/axios.js';

export const listarMovimientosFarmaciaService = {
  async obtenerMovimientos(filtros = {}) {
    const params = {};
    if (filtros.medicamento_id) params.medicamento_id = filtros.medicamento_id;
    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
    if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
    const response = await api.get('movimientos-farmacia', { params });
    return response.data.data;
  }
};