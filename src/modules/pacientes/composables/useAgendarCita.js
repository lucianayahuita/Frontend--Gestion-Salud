import { ref, computed } from 'vue'
import { agendarCitaService } from '../services/agendarCitaService'
import { useAuthStore } from '@/store/auth.js'

export function useAgendarCita() {
  const authStore = useAuthStore()

  const medicos           = ref([])
  const disponibilidad    = ref([])
  const medicoId          = ref(null)
  const fechaSeleccionada = ref('')
  const horaSeleccionada  = ref(null)
  const pacienteId        = ref(null)

  const cargandoMedicos  = ref(false)
  const cargandoHorarios = ref(false)
  const agendando        = ref(false)
  const error            = ref(null)
  const exito            = ref(false)

  const fechaMin = computed(() => new Date().toISOString().split('T')[0])

  const fechaFormateada = computed(() => {
    if (!fechaSeleccionada.value) return ''
    return new Date(fechaSeleccionada.value + 'T00:00:00').toLocaleDateString('es-BO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  })
  const cargarMedicos = async () => {
    cargandoMedicos.value = true
    error.value = null
    try {
      // 1. Cargar lista de médicos
      medicos.value = await agendarCitaService.obtenerMedicos()

      const userId = authStore.user?.id
      if (userId) {
        const paciente = await agendarCitaService.obtenerPacientePorUserId(userId)
        pacienteId.value = paciente?.id || null
      }
    } catch (e) {
      error.value = 'Error al cargar datos'
    } finally {
      cargandoMedicos.value = false
    }
  }

  const buscarDisponibilidad = async () => {
    if (!medicoId.value || !fechaSeleccionada.value) {
      error.value = 'Selecciona un médico y una fecha'
      return
    }
    cargandoHorarios.value = true
    error.value = null
    horaSeleccionada.value = null
    disponibilidad.value = []
    try {
      disponibilidad.value = await agendarCitaService.obtenerDisponibilidad(
        medicoId.value,
        fechaSeleccionada.value
      )
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al obtener horarios'
    } finally {
      cargandoHorarios.value = false
    }
  }

  const seleccionarHora = (hora) => {
    horaSeleccionada.value = hora
  }

  const confirmarCita = async () => {
    if (!horaSeleccionada.value) {
      error.value = 'Selecciona un horario disponible'
      return
    }
    if (!pacienteId.value) {
      error.value = 'No se encontró tu ficha de paciente'
      return
    }

    agendando.value = true
    error.value = null
    exito.value = false
    try {
      await agendarCitaService.crearCita({
        paciente_id: pacienteId.value,
        medico_id:   medicoId.value,
        fecha:       fechaSeleccionada.value,
        hora:        horaSeleccionada.value,
      })
      exito.value = true
      horaSeleccionada.value = null
      disponibilidad.value = []
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al agendar la cita'
    } finally {
      agendando.value = false
    }
  }

  return {
    medicos,
    disponibilidad,
    medicoId,
    fechaSeleccionada,
    horaSeleccionada,
    fechaMin,
    fechaFormateada,
    cargandoMedicos,
    cargandoHorarios,
    agendando,
    error,
    exito,
    cargarMedicos,
    buscarDisponibilidad,
    seleccionarHora,
    confirmarCita,
  }
}