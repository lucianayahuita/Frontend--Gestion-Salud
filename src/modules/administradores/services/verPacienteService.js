// verpacienteService.js
import api from '@/api/axios.js'

export const verPacienteService = {
  async obtenerUno(id) {
    const { data } = await api.get(`/pacientes/${id}`)
    return data.data
  }
}