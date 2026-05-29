<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div class="modal-card">
      
      <header class="modal-header">
        <div class="header-title-group">
          <div class="avatar-pill text-warning-box">
            <Edit3 :size="20" />
          </div>
          <h2 class="modal-title">Modificar Medicamento</h2>
        </div>
        <button class="btn-close" @click="cerrar" :disabled="modificando">
          <X :size="18" />
        </button>
      </header>

      <form @submit.prevent="enviarFormulario">
        <main class="modal-body">
          
          <div v-if="error" class="error-alert">
            <AlertTriangle :size="18" />
            <span>{{ error }}</span>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label" for="edit-nombre">Nombre del Medicamento *</label>
              <input 
                id="edit-nombre"
                v-model="formulario.nombre"
                type="text" 
                required
                placeholder="Ej. Paracetamol 500mg" 
                class="form-control"
                :disabled="modificando"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="edit-precio">Precio Unitario ($) *</label>
              <input 
                id="edit-precio"
                v-model="formulario.precio"
                type="number" 
                step="0.01"
                min="0"
                required
                placeholder="0.00" 
                class="form-control"
                :disabled="modificando"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="edit-estado">Estado Operativo</label>
              <select 
                id="edit-estado"
                v-model="formulario.estado"
                class="form-select"
                :disabled="modificando"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label" for="edit-descripcion">Descripción / Acción Terapéutica</label>
              <textarea 
                id="edit-descripcion"
                v-model="formulario.descripcion"
                rows="3"
                placeholder="Modificar las indicaciones o composición..." 
                class="form-control text-area"
                :disabled="modificando"
              ></textarea>
            </div>
          </div>

        </main>

        <footer class="modal-footer">
          <button type="button" class="btn-secondary" @click="cerrar" :disabled="modificando">
            Cancelar
          </button>
          <button type="submit" class="btn-update" :disabled="modificando">
            <span v-if="modificando" class="btn-spinner"></span>
            <span v-else>Actualizar Cambios</span>
          </button>
        </footer>
      </form>

    </div>
  </div>
</template>

<script setup>
import { Edit3, X, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  visible: Boolean,
  formulario: Object,
  modificando: Boolean,
  error: String
});

const emit = defineEmits(['close', 'submit']);

const cerrar = () => {
  if (!props.modificando) emit('close');
};

const enviarFormulario = () => {
  emit('submit');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.modal-card {
  background: white; width: 100%; max-width: 520px;
  border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden; font-family: 'DM Sans', sans-serif;
  animation: modalScale 0.2s ease-out;
}
@keyframes modalScale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
.modal-header { padding: 18px 24px;  background: rgba(13, 148, 136, 1);border-bottom: 1px solid #edf2f7; display: flex; justify-content: space-between; align-items: center; }
.header-title-group { display: flex; align-items: center; gap: 12px; color:white}
.avatar-pill { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.text-warning-box { background: #fffbeb; color: #d97706; }
.modal-title { font-family: 'Sora', sans-serif; font-size: 23px; font-weight: 700; color: white; margin: 0; margin-left: 50px; }
.btn-close { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 6px; }
.btn-close:hover:not(:disabled) { background: #fee2e2; color: #ef4444; }
.modal-body { padding: 24px; }
.error-alert { background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; padding: 12px 16px; border-radius: 10px; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; font-size: 13.5px; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12.5px; font-weight: 600; color: #4a5e68; }
.form-control, .form-select { padding: 10px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 14px; outline: none; background: white; color: #1a2b2e; }
.form-control:focus, .form-select:focus { border-color: #d97706; }
.text-area { resize: none; }
.modal-footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; gap: 12px; }
.btn-secondary { background: white; border: 1px solid #cbd5e1; color: #475569; padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 13.5px; cursor: pointer; }
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; }
.btn-update { background: #d97706; border: none; color: white; padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 140px; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.15); }
.btn-update:hover:not(:disabled) { background: #b45309; }
.btn-update:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>