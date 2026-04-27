import { ref, onMounted } from 'vue'
import { pacienteService } from '../services/listapacienteService'

export function useGestionPacientes() {
  const pacientes = ref([])
  const cargando  = ref(false)
  const error     = ref(null)
  const busqueda  = ref('')

  const cargarPacientes = async () => {
    cargando.value = true
    try {
      pacientes.value = await pacienteService.obtenerTodos()
    } catch (e) {
      error.value = 'Error al cargar pacientes'
    } finally {
      cargando.value = false
    }
  }

  const pacientesFiltrados = () => {
    const q = busqueda.value.toLowerCase()
    if (!q) return pacientes.value
    return pacientes.value.filter(p =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      String(p.ci).includes(q)
    )
  }

  const calcularEdad = (fecha) => {
    if (!fecha) return '-'
    return new Date().getFullYear() - new Date(fecha).getFullYear()
  }

  onMounted(cargarPacientes)

  return { pacientes, cargando, error, busqueda, pacientesFiltrados, calcularEdad, cargarPacientes }
}