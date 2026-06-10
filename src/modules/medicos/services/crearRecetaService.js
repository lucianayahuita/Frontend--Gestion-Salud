import api from '@/api/axios.js';
export const crearRecetaService = {
  /**
   * @param {Object} payload 
   */
  async registrarReceta(payload) {
    const { data } = await api.post('/recetas-medicas', {
      cita_id: parseInt(payload.cita_id, 10),
      medicamento_id: parseInt(payload.medicamento_id, 10),
      dosis: payload.dosis,
      frecuencia: payload.frecuencia,
      duracion: payload.duracion,
      indicaciones: payload.indicaciones,
      estado_despacho: payload.estado_despacho || 'pendiente'
    });
    return data;
  }
};