import api from '@/api/axios.js'

export const updateAdministradoresService = {

 
  async actualizar(id, datos) {

    try {

     
      const { data } = await api.put(

        `/users/${id}`,

        {
          name: datos.name,

          email: datos.email,

          rol_id: 1
        }

      )

     
      return data

    } catch (error) {

     
      throw (
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar administrador'
      )

    }

  }

}