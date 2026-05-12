import { ref } from 'vue'
import { registrarAdminService } from '../services/registrarAdministradoresService'

export function useRegistrarAdministradores() {
  const cargando = ref(false)
  const errores = ref(null)

  const formulario = ref({
    name:     '',
    email:    '',
    password: '',
  })

  const enviarRegistro = async () => {
    cargando.value = true
    errores.value = null
    try {
      await registrarAdminService.registrar(formulario.value)
      return true
    } catch (err) {
      errores.value = typeof err === 'string' ? err : 'Error al registrar el administrador'
      return false
    } finally {
      cargando.value = false
    }
  }

  return { formulario, cargando, errores, enviarRegistro }
}