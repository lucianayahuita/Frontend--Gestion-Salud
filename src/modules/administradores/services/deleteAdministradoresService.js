import api from '@/api/axios.js'

export const deleteAdministradoresService = {

  async eliminar(id) {
    const { data } = await api.delete(`/users/${id}`)
    return data
  }

}