import api from '@/api/axios.js'

export const deletePacienteService = {
  // Borra solo la ficha médica
  async eliminar(id) {
    const { data } = await api.delete(`/pacientes/${id}`)
    return data
  },

  // Borra la cuenta de acceso (lo que sale en el Dashboard)
  async eliminarUsuario(userId) {
    const { data } = await api.delete(`/users/${userId}`)
    return data
  }
}