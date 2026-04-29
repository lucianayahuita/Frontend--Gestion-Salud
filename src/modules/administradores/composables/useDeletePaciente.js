import { ref } from 'vue'
import { deletePacienteService } from '../services/deleteService'
import api from '@/api/axios.js' 

export function useDeletePaciente() {
  const eliminando = ref(false)
  const errorEliminar = ref(null)

  const ejecutarEliminacionCompleta = async (pacienteId, userId) => {
    eliminando.value = true
    errorEliminar.value = null
    
    try {
      // 1. Borrar primero al PACIENTE (Ficha médica)
      // Es mejor borrar la "dependencia" primero
      console.log("1. Eliminando ficha de paciente:", pacienteId)
      await deletePacienteService.eliminar(pacienteId)

      // 2. Borrar al USUARIO (Cuenta de acceso)
      if (userId) {
        console.log("2. Eliminando cuenta de usuario ID:", userId)
        await api.delete(`/users/${userId}`)
      }

      return true
    } catch (e) {
      console.error("Error en la eliminación:", e)
      // Capturamos el mensaje del servidor si existe
      errorEliminar.value = e.response?.data?.message || e.message || 'Error al eliminar registros'
      return false
    } finally {
      eliminando.value = false
    }
  }

  return { eliminando, errorEliminar, ejecutarEliminacionCompleta }
}