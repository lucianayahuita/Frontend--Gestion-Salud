import api from '@/api/axios.js'

export const deletePacienteService = {
  async eliminar(id) {
    const { data } = await api.delete(`/pacientes/${id}`)
    return data
  }
}