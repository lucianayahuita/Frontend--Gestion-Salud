import api from '@/api/axios.js'

export const pacienteService = {
  async obtenerTodos() {
    const { data } = await api.get('/pacientes')
    return data.data.filter(p => p.ci !== undefined)
  },

  async eliminar(id) {
    await api.delete(`/pacientes/${id}`)
  }
}