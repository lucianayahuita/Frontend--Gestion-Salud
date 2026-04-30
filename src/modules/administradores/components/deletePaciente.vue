<template>
  <div class="modal-overlay" @click.self="$emit('close')" v-if="paciente">
    
    <div class="modal-content">
      
      <div class="modal-header">
        <h3>Eliminar Paciente</h3>
        <p class="subtitle">
          Paciente: {{ paciente.nombre }} {{ paciente.apellido }}
        </p>
      </div>

      <div class="warning-box">
        <p>
          ¿Estás seguro de eliminar a <strong>{{ paciente.nombre }}</strong>?
        </p>
        <small>Esta acción no se puede deshacer.</small>
      </div>

      <div class="actions">
        <button class="btn-cancelar" @click="$emit('close')">
          Cancelar
        </button>

        <button class="btn-eliminar" @click="confirmar" :disabled="eliminando">
          {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
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
@import '@/assets/global.css';

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  font-family: var(--font-family);
}

.modal-header {
  margin-bottom: 16px;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-top: 4px;
}

.warning-box {
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #991b1b;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancelar {
  padding: 10px 16px;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-eliminar {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-eliminar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
}
</style>