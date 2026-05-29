<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div class="modal-card">
      
      <header class="modal-header">
        <div class="header-title-group">
          <div class="avatar-pill">
            <Plus :size="20" />
          </div>
          <h2 class="modal-title">Registrar Nuevo Medicamento</h2>
        </div>
        <button class="btn-close" @click="cerrar" :disabled="guardando">
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
              <label class="form-label" for="nombre">Nombre del Medicamento *</label>
              <input 
                id="nombre"
                v-model="formulario.nombre"
                type="text" 
                required
                placeholder="Ej. Amoxicilina 500mg" 
                class="form-control"
                :disabled="guardando"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="precio">Precio Unitario ($) *</label>
              <input 
                id="precio"
                v-model="formulario.precio"
                type="number" 
                step="0.01"
                min="0"
                required
                placeholder="0.00" 
                class="form-control"
                :disabled="guardando"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="stock">Cantidad Inicial (Stock) *</label>
              <input 
                id="stock"
                v-model="formulario.stock"
                type="number" 
                min="0"
                required
                placeholder="0" 
                class="form-control"
                :disabled="guardando"
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label" for="estado">Estado Operativo</label>
              <select 
                id="estado"
                v-model="formulario.estado"
                class="form-select"
                :disabled="guardando"
              >
                <option value="activo">Activo (Disponible para venta)</option>
                <option value="inactivo">Inactivo (No disponible)</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label" for="descripcion">Descripción / Notas Adicionales</label>
              <textarea 
                id="descripcion"
                v-model="formulario.descripcion"
                rows="3"
                placeholder="Ingresa la acción terapéutica o indicaciones de almacenamiento..." 
                class="form-control text-area"
                :disabled="guardando"
              ></textarea>
            </div>
          </div>

        </main>

        <footer class="modal-footer">
          <button type="button" class="btn-secondary" @click="cerrar" :disabled="guardando">
            Cancelar
          </button>
          <button type="submit" class="btn-submit" :disabled="guardando">
            <span v-if="guardando" class="btn-spinner"></span>
            <span v-else>Guardar Registro</span>
          </button>
        </footer>
      </form>

    </div>
  </div>
</template>

<script setup>
import { Plus, X, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  visible: Boolean,
  formulario: Object,
  guardando: Boolean,
  error: String
});

const emit = defineEmits(['close', 'submit']);

const cerrar = () => {
  if (!props.guardando) emit('close');
};

const enviarFormulario = () => {
  emit('submit');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 520px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  animation: modalScale 0.2s ease-out;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  padding: 18px 24px;
  background: rgba(13, 148, 136, 1);
  border-bottom: 1px solid #edf2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-pill {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #eefaf6;
  color: #115843;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}
.btn-close:hover:not(:disabled) { background: #fee2e2; color: #ef4444; }

.modal-body {
  padding: 24px;
}

.error-alert {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.full-width { grid-column: span 2; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #4a5e68;
}

.form-control, .form-select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  background: white;
  color: #1a2b2e;
}

.form-control:focus, .form-select:focus {
  border-color: #115843;
}

.form-control:disabled, .form-select:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.text-area {
  resize: none;
}

.modal-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-submit {
  background: #115843;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  box-shadow: 0 4px 10px rgba(17, 88, 67, 0.15);
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) { background: #073528; }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>