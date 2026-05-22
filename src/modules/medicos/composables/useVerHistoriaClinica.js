import { ref } from 'vue'
import { verHistoriaClinicaService } from '../services/verHistoriaClinicaService'

export function useVerHistoriaClinica() {
  const historiaDetalle = ref(null)
  const cargandoDetalle = ref(false)
  const errorDetalle = ref(null)
  const mostrarModalDetalle = ref(false)

  const cargarYVerDetalle = async (id) => {
    cargandoDetalle.value = true
    errorDetalle.value = null
    mostrarModalDetalle.value = true
    historiaDetalle.value = null

    try {
      const respuesta = await verHistoriaClinicaService.obtenerDetalleHistoria(id)
      if (respuesta.success) {
        historiaDetalle.value = respuesta.data
      } else {
        errorDetalle.value = respuesta.message || 'No se pudo cargar el detalle.'
      }
    } catch (err) {
      errorDetalle.value = err.response?.data?.message || 'Error de conexión con el servidor.'
    } finally {
      cargandoDetalle.value = false
    }
  }

  const cerrarModalDetalle = () => {
    mostrarModalDetalle.value = false
    historiaDetalle.value = null
    errorDetalle.value = null
  }

  return {
    historiaDetalle,
    cargandoDetalle,
    errorDetalle,
    mostrarModalDetalle,
    cargarYVerDetalle,
    cerrarModalDetalle
  }
}