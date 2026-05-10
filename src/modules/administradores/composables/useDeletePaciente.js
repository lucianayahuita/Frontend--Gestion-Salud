import { ref } from 'vue'
import { deletePacienteService } from '../services/deleteService'
 
export function useDeletePaciente() {
  const eliminando = ref(false)
  const errorEliminar = ref(null)
 
  const ejecutarEliminacionCompleta = async (pacienteId) => {
    eliminando.value = true
    errorEliminar.value = null
 
    try {
      await deletePacienteService.eliminar(pacienteId)
      return true
    } catch (e) {
      errorEliminar.value = e.response?.data?.message || e.message || 'Error al eliminar el paciente'
      return false
    } finally {
      eliminando.value = false
    }
  }
 
  return { eliminando, errorEliminar, ejecutarEliminacionCompleta }
}
 