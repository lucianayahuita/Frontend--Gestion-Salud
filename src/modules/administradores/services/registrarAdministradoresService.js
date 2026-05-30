import api from '@/api/axios.js'
 
export const registrarAdminService = {
  async registrar(datos) {
    try {
      const { data } = await api.post('/users', {
        name:     datos.name,
        email:    datos.email,
        password: datos.password,
        rol_id:   3 
      })
      return data
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Error al registrar personal de soporte'
    }
  }
}
 