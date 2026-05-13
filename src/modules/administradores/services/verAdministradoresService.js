import api from '@/api/axios.js'

export const verAdministradoresService = {

  async obtenerUno(id) {
    try {

      const { data } = await api.get(`/users/${id}`)

      return data.data

    } catch (error) {

      throw error.response?.data?.message 
        || error.message 
        || 'Error al obtener administrador'
    }
  }

}