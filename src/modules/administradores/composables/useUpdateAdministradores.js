import { ref } from 'vue'

import { updateAdministradoresService } from '../services/updateAdministradoresService'

export function useUpdateAdministradores() {

  const loading = ref(false)

 
  const error = ref(null)


  const ejecutarActualizacion = async (id, datos) => {

    loading.value = true

    error.value = null

    try {

      
      const response = await updateAdministradoresService.actualizar(
        id,
        datos
      )

   
      return response

    } catch (e) {

      error.value =
        e ||
        'No se pudo actualizar el administrador'

    
      throw e

    } finally {

     
      loading.value = false

    }

  }

  
  return {

    loading,

    error,

    ejecutarActualizacion

  }

}