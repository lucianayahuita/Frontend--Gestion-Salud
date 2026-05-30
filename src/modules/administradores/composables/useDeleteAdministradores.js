import { ref } from 'vue'
import { deleteAdministradoresService } from '../services/deleteAdministradoresService'

export function useDeleteAdministradores() {

  const eliminando = ref(false)
  const errorEliminar = ref(null)

  const ejecutarEliminacion = async (id) => {

    eliminando.value = true
    errorEliminar.value = null

    try {
      await deleteAdministradoresService.eliminar(id)
      return true
    } catch (e) {
      errorEliminar.value = 'No se pudo eliminar el personal de soporte. Por favor, intenta nuevamente.'
      return false
    } finally {
      eliminando.value = false
    }
  }

  return {
    eliminando,
    errorEliminar,
    ejecutarEliminacion
  }
}