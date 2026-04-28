<template>
  <div class="modal-overlay" v-if="paciente">
    <div class="modal-content">
      <h3>Eliminar Paciente</h3>
      <p>¿Estás seguro de eliminar a <strong>{{ paciente.nombre }}</strong>?</p>
      
      <div class="btns">
        <button @click="$emit('close')">Cancelar</button>
        <button @click="confirmar" :disabled="eliminando">
          {{ eliminando ? 'Eliminando...' : 'Confirmar' }}
        </button>
      </div>
      
      <p v-if="errorEliminar" class="error">{{ errorEliminar }}</p>
    </div>
  </div>
</template>

<script setup>
import { useDeletePaciente } from '../composables/useDeletePaciente'

const props = defineProps({
  paciente: Object
})

const emit = defineEmits(['close', 'actualizar'])
const { eliminando, errorEliminar, ejecutarEliminacionCompleta } = useDeletePaciente()

const confirmar = async () => {
  // OJO: Verifica si tu objeto tiene user_id o id_usuario
  const exito = await ejecutarEliminacionCompleta(props.paciente.id, props.paciente.user_id)
  if (exito) {
    emit('actualizar')
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); /* Fondo oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Asegúrate de que esté arriba de todo */
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
</style>