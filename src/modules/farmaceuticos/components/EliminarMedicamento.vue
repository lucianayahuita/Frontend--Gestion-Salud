<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div class="modal-card">
      
      <main class="modal-body text-center">
        <div class="alert-avatar-container">
          <div class="avatar-pill text-danger-box animate-pulse">
            <AlertTriangle :size="32" />
          </div>
        </div>

        <h2 class="modal-title">¿Confirmar Eliminación?</h2>
        
        <p class="modal-description">
          Estás a punto de retirar de forma permanente el medicamento 
          <strong class="highlight-text">{{ medicamento?.nombre }}</strong> 
          (Código #{{ medicamento?.id }}) del sistema de almacén.
        </p>

        <div v-if="error" class="error-alert">
          <AlertCircle :size="16" />
          <span>{{ error }}</span>
        </div>
      </main>

      <footer class="modal-footer">
        <button 
          type="button" 
          class="btn-secondary" 
          @click="cerrar" 
          :disabled="eliminando"
        >
          Cancelar
        </button>
        <button 
          type="button" 
          class="btn-danger-action" 
          @click="confirmar" 
          :disabled="eliminando"
        >
          <span v-if="eliminando" class="btn-spinner"></span>
          <span v-else>Sí, Eliminar Registro</span>
        </button>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  visible: Boolean,
  medicamento: Object,
  eliminando: Boolean,
  error: String
});

const emit = defineEmits(['close', 'confirm']);

const cerrar = () => {
  if (!props.eliminando) emit('close');
};

const confirmar = () => {
  emit('confirm');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-card {
  background: white; width: 100%; max-width: 420px;
  border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden; font-family: 'DM Sans', sans-serif;
  animation: modalScale 0.2s ease-out;
  padding: 12px;
}
@keyframes modalScale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }

.text-center { text-align: center; }
.alert-avatar-container { display: flex; justify-content: center; margin-top: 16px; margin-bottom: 16px; }

.avatar-pill { 
  width: 64px; height: 64px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
}
.text-danger-box { background: #fee2e2; color: #ef4444; }

.modal-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0; }
.modal-description { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 12px 20px; }
.highlight-text { color: #0f172a; font-weight: 600; }

.error-alert { background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; padding: 10px 14px; border-radius: 10px; margin-top: 12px; display: flex; align-items: center; gap: 8px; font-size: 13px; text-align: left; }

.modal-footer { padding: 12px 12px 4px; display: flex; gap: 12px; }
.modal-footer button { flex: 1; }

.btn-secondary { background: white; border: 1px solid #cbd5e1; color: #475569; padding: 11px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.15s; }
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; }

.btn-danger-action { background: #ef4444; border: none; color: white; padding: 11px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2); transition: background 0.15s; }
.btn-danger-action:hover:not(:disabled) { background: #dc2626; }
.btn-danger-action:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
</style>