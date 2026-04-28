import { ref } from 'vue'
import { deletePacienteService } from '../services/deleteService'
// ESTA ES LA LÍNEA QUE TE FALTA (Asegúrate que la ruta @/api/axios.js sea la correcta)
import api from '@/api/axios.js' 

export function useDeletePaciente() {
  const eliminando = ref(false)
  const errorEliminar = ref(null)

  const ejecutarEliminacionCompleta = async (pacienteId, userId) => {
    eliminando.value = true
    errorEliminar.value = null
    
    try {
      // 1. Usamos el SERVICE para el paciente (Este ya funciona)
      await deletePacienteService.eliminar(pacienteId)

      // 2. Usamos API directamente para el usuario
      if (userId) {
        console.log("Intentando eliminar usuario ID:", userId)
        await api.delete(`/users/${userId}`)
      }

      return true
    } catch (e) {
      console.error("Error en la eliminación:", e)
      errorEliminar.value = e.response?.data?.message || 'Error al eliminar registros'
      return false
    } finally {
      eliminando.value = false
    }
  }

  return { eliminando, errorEliminar, ejecutarEliminacionCompleta }
}