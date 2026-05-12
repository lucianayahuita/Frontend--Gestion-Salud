import api from '@/api/axios.js'

export const agendarCitaService = {
  async obtenerMedicos() {
    const { data } = await api.get('/medicos')
    return data.data || []
  },

  async obtenerPacientePorUserId(userId) {
    const { data } = await api.get('/pacientes')
    const lista = data.data || []
    return lista.find(p => p.user_id === userId) || null
  },

  async obtenerDisponibilidad(medico_id, fecha) {
    const { data } = await api.get('/citas/disponibilidad', {
      params: { medico_id, fecha }
    })
    const horarios = data.data?.horarios || []
    return horarios.filter(h => h.disponible === true)
  },

  async crearCita(datos) {
    const { data } = await api.post('/citas', {
      paciente_id: datos.paciente_id,
      medico_id:   datos.medico_id,
      fecha:       datos.fecha,
      hora:        datos.hora, 
      estado:      'pendiente'
    })
    return data
  }
}