<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Confirmar Inasistencia</h3>
          <button class="btn-close-x" @click="$emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <p>¿Está seguro de marcar como <strong>"No asistió"</strong> al paciente?</p>
          <div v-if="cita?.paciente" class="patient-preview-box">
            <p class="preview-name">
              {{ cita.paciente.nombre }} {{ cita.paciente.apellido }}
            </p>
            <p class="preview-meta">CI: {{ cita.paciente.ci }} | Hora: {{ cita.hora.substring(0, 5) }}</p>
          </div>
          <p class="warning-text">Esta acción cancelará la cita médica de manera permanente en la agenda.</p>
          
          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancelar-modal" :disabled="loading" @click="$emit('close')">
            Volver
          </button>
          <button class="btn-confirmar-modal" :disabled="loading" @click="$emit('confirm')">
            <span v-if="loading" class="spinner-mini"></span>
            <span v-else>Confirmar Inasistencia</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, required: true },
  cita: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  errorMessage: { type: String, default: null }
});

defineEmits(['close', 'confirm']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(26, 43, 46, 0.4);
  backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}

.modal-box {
  background: white; border-radius: 16px; width: 100%; max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 24px;
  display: flex; flex-direction: column; gap: 16px;
  font-family: 'DM Sans', sans-serif;
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 {
  font-family: 'Sora', sans-serif; font-size: 16px; color: #1a2b2e; margin: 0;
}
.btn-close-x {
  background: none; border: none; font-size: 22px; color: #7a9aaa; cursor: pointer;
}

.modal-body {
  font-size: 14px; color: #475569; line-height: 1.5;
}
.patient-preview-box {
  background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 12px; margin: 12px 0;
}
.preview-name { font-weight: 600; color: #1a2b2e; margin-bottom: 2px; }
.preview-meta { font-size: 12px; color: #64748b; }
.warning-text { font-size: 12.5px; color: #b45309; font-weight: 500; }

.error-banner {
  background: #fef2f2; border: 1px solid #fee2e2; color: #b91c1c;
  padding: 10px; border-radius: 8px; font-size: 12.5px; margin-top: 10px;
}

.modal-footer {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;
}
.btn-cancelar-modal {
  background: #f1f5f9; color: #475569; border: none; padding: 10px 16px;
  border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;
}
.btn-confirmar-modal {
  background: #dc2626; color: white; border: none; padding: 10px 16px;
  border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
}
.btn-confirmar-modal:hover { background: #b91c1c; }
.btn-confirmar-modal:disabled, .btn-cancelar-modal:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner-mini {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Animación de Entrada */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>