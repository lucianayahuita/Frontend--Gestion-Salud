import api from '@/api/axios.js';

export const reportesService = {
  getRecetasEmitidasPorMedico(params) {
    return api.get('/reportes/recetas-emitidas-por-medico', { params });
  },
  getMedicamentosMasPrescritosPorMedico(params) {
    return api.get('/reportes/medicamentos-mas-prescritos-por-medico', { params });
  },
  getRecetasEmitidasPorPacienteHistorico(params) {
    return api.get('/reportes/recetas-por-paciente-historico', { params });
  },
  getRecetasBalancePorEstadoDespacho(params) {
    return api.get('/reportes/balance-recetas-estado-despacho', { params });
  },
  getRecetasDespachadasPorFarmaceutico(params){
    return api.get('reportes/recetas-despachadas-por-farmaceutico', { params });
  },
  getMedicamentosMasPrescritosPorPeriodo(params){
    return api.get('/reportes/medicamentos-mas-prescritos-por-periodo', { params });
  },
  getAlertasStockBajo(params){
    return api.get('/reportes/alertas-medicamentos-stock-bajo', { params });
  },
  getTotalDeCitasPorMedico(params){
    return api.get('/reportes/total-citas-por-medico', { params });
  },
  getTasaCancelacionPorMedico(params){
    return api.get('/reportes/tasa-cancelacion-por-medico', { params });
  }
};