import { ref, onMounted } from 'vue'
import { pacienteService } from '../services/listapacienteService'

export function useGestionPacientes() {
  const pacientes = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const busqueda = ref('')

  const cargarPacientes = async () => {
    cargando.value = true
    error.value = null
    try {
      // Aquí es donde ocurre la magia
      const respuesta = await pacienteService.obtenerTodos()
      pacientes.value = respuesta
    } catch (e) {
      console.error("Error capturado:", e)
      error.value = 'Error al cargar pacientes'
    } finally {
      cargando.value = false
    }
  }

  const pacientesFiltrados = () => {
    const q = busqueda.value.toLowerCase().trim()
    if (!q) return pacientes.value
    
    return pacientes.value.filter(p => {
      const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase()
      const ci = String(p.ci)
      return nombreCompleto.includes(q) || ci.includes(q)
    })
  }

  const calcularEdad = (fecha) => {
    if (!fecha) return '-'
    const hoy = new Date()
    const cumple = new Date(fecha)
    let edad = hoy.getFullYear() - cumple.getFullYear()
    const m = hoy.getMonth() - cumple.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--
    }
    return edad
  }

  onMounted(() => {
    cargarPacientes()
  })

  return { 
    pacientes, 
    cargando, 
    error, 
    busqueda, 
    pacientesFiltrados, 
    calcularEdad, 
    cargarPacientes 
  }
}