<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">

      <div class="modal-header">
        <h2 class="modal-title">Registrar Administrador</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">

        <div class="form-section">
          <span class="section-tag">Datos del Administrador</span>

          <div class="field-icon">
            <User :size="16" class="icon" />
            <input
              v-model="formulario.name"
              placeholder="Nombre completo"
              required
            />
          </div>

          <div class="field-icon">
            <Mail :size="16" class="icon" />
            <input
              v-model="formulario.email"
              type="email"
              placeholder="Correo electrónico"
              autocomplete="username"
              required
            />
          </div>

          <div class="field-icon">
            <Lock :size="16" class="icon" />
            <input
              v-model="formulario.password"
              type="password"
              placeholder="Contraseña"
              autocomplete="new-password"
              required
            />
          </div>
        </div>

        <p v-if="errores" class="error-banner">{{ errores }}</p>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="cargando">
            {{ cargando ? 'Procesando...' : 'Guardar Administrador' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Mail, Lock, User } from 'lucide-vue-next'
import { useRegistrarAdministradores } from '../composables/useRegistrarAdministradores'

const emit = defineEmits(['close', 'actualizar'])
const { formulario, cargando, errores, enviarRegistro } = useRegistrarAdministradores()

const handleSubmit = async () => {
  const exito = await enviarRegistro()
  if (exito) {
    emit('actualizar')
    emit('close')
  }
}
</script>

<style scoped>
@import '@/assets/global.css';

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.modal-content {
  background: white; width: 460px; max-width: 90%;
  border-radius: 20px; padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-size: 1.3rem; color: #1a2b2e; margin: 0; font-family: var(--font-work); }

.btn-close {
  width: 32px; height: 32px; border-radius: 50%;
  border: none; background: #f4f8f7; color: #5a7a80;
  font-size: 1.2rem; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.section-tag { display: block; font-size: 11px; font-weight: 700; color: #1D9E75; text-transform: uppercase; margin-bottom: 12px; }
.form-section { margin-bottom: 8px; }

.field-icon { position: relative; display: flex; align-items: center; margin-bottom: 12px; }
.field-icon .icon { position: absolute; left: 12px; color: #1D9E75; pointer-events: none; top: 50%; transform: translateY(-50%); }
.field-icon input { padding-left: 36px; }

input {
  width: 100%; padding: 12px;
  border: 1.5px solid #e0eeea; border-radius: 8px;
  font-family: inherit; font-size: 14px;
  transition: border-color 0.2s; outline: none;
}
input:focus { border-color: #1D9E75; }

.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.btn-primary { background: #1D9E75; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #0f6e56; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: #f4f8f7; color: #5a7a80; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
.btn-secondary:hover { background: #e0eeea; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; margin-top: 8px; }
</style>