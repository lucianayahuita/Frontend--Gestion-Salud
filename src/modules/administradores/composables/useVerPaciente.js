import { ref } from 'vue'
import { verPacienteService } from '../services/verPacienteService'

export function useVerPaciente() {
  const paciente = ref(null)
  const cargando = ref(false)
  const error = ref(null)

  const cargarPaciente = async (id) => {
    if (!id) return
    cargando.value = true
    error.value = null
    try {
      const datos = await verPacienteService.obtenerUno(id)
      paciente.value = datos
    } catch (e) {
      error.value = 'No se encontró el detalle del paciente'
    } finally {
      cargando.value = false
    }
  }

  return { paciente, cargando, error, cargarPaciente }
}