<template>
  <div class="modal-overlay" @click.self="$emit('close')" v-if="paciente">
    
    <div class="modal-content">


      <div class="modal-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </div>

      <h3 class="modal-title">¿Eliminar paciente?</h3>
      <p class="modal-desc">Esta acción no se puede deshacer. Se eliminará permanentemente a</p>
      <p class="paciente-nombre">{{ paciente.nombre }} {{ paciente.apellido }} {{ paciente.segundo_apellido }}</p>

      <p v-if="errorEliminar" class="error">{{ errorEliminar }}</p>

      <div class="btns">
        <button class="btn-cancelar" @click="$emit('close')">Cancelar</button>
        <button class="btn-confirmar" @click="confirmar" :disabled="eliminando">
          {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
        </button>
      </div>


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
  const exito = await ejecutarEliminacionCompleta(props.paciente.id)
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
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 36px 32px;
  border-radius: 20px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
}

.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0 0 8px;
}

.modal-desc {
  font-size: 14px;
  color: #5a7a80;
  margin: 0 0 4px;
}

.paciente-nombre {
  font-size: 15px;
  font-weight: 700;
  color: #ef4444;
  margin: 0 0 24px;
}

.btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancelar {
  background: #f4f8f7;
  color: #5a7a80;
  border: none;
  padding: 11px 28px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancelar:hover { background: #e0eeea; }

.btn-confirmar {
  background: #ef4444;
  color: white;
  border: none;
  padding: 11px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

}
.btn-confirmar:hover { background: #dc2626; }
.btn-confirmar:disabled { opacity: 0.6; cursor: not-allowed; }

.error {
  background: #fee2e2;
  color: #dc2626;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  margin: 0 0 16px;

}
</style>