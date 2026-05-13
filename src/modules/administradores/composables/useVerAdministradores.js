import { ref } from 'vue'
import { verAdministradoresService } from '../services/verAdministradoresService'

export function useVerAdministradores() {

  
  const admin = ref(null)

  
  const cargando = ref(false)

 
  const error = ref(null)

 
  const cargarAdministrador = async (id) => {

    if (!id) return

    cargando.value = true
    error.value = null

    try {
      const data = await verAdministradoresService.obtenerUno(id)

      admin.value = data

    } catch (e) {
      error.value = 'No se pudo cargar el administrador'
    } finally {
      cargando.value = false
    }
  }

  return {
    admin,
    cargando,
    error,
    cargarAdministrador
  }
}