<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">

      <div class="modal-header">
        <h2 class="modal-title">Modificar Cuenta de Farmacia</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="update-form">
        
        <div class="form-section">
          <span class="section-tag">Información del Usuario</span>
          <div class="field-icon disabled-field">
            <User :size="16" class="icon" />
            <input :value="farmaceutico.name" disabled class="input-disabled" />
          </div>
          <p class="field-help">El nombre completo se enviará de forma requerida al servidor.</p>
        </div>

        <div class="form-section">
          <span class="section-tag">Credenciales de Comunicación</span>
          <div class="field-icon">
            <Mail :size="16" class="icon" />
            <input 
              v-model="email" 
              type="email" 
              placeholder="nuevo.correo@gmail.com" 
              required 
            />
          </div>
        </div>

        <p v-if="errores && typeof errores === 'string'" class="error-banner">
          {{ errores }}
        </p>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="cargando">
            {{ cargando ? 'Guardando cambios...' : 'Actualizar Correo' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { User, Mail } from 'lucide-vue-next';
import { useActualizarFarmaceutico } from '../composables/useActualizarFarmaceutico';

const props = defineProps({
  farmaceutico: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'actualizar']);
const { email, cargando, errores, ejecutarActualizacion } = useActualizarFarmaceutico(props.farmaceutico);

const handleSubmit = async () => {
  const exito = await ejecutarActualizacion(props.farmaceutico.id);
  if (exito) {
    emit('actualizar');
    emit('close');
  } else {
    if (errores.value && typeof errores.value === 'object') {
      const listaErrores = Object.values(errores.value).flat().join('\n');
      alert("Error de validación detectado:\n\n" + listaErrores);
    }
  }
};
</script>

<style scoped>
@import '@/assets/global.css';

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.modal-content {
  background: white; width: 450px; max-width: 90%;
  border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-title { font-size: 1.35rem; color: #1a2b2e; margin: 0; font-family: var(--font-work); font-weight: 700; }

.btn-close {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: #f4f8f7; color: #5a7a80; font-size: 1.2rem;
  cursor: pointer; transition: background 0.2s, color 0.2s;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.form-section { margin-bottom: 20px; }
.section-tag { display: block; font-size: 11px; font-weight: 700; color: #1D9E75; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.03em; }

.field-icon { position: relative; display: flex; align-items: center; width: 100%; }
.field-icon .icon { position: absolute; left: 14px; color: #1D9E75; pointer-events: none; }

input {
  width: 100%; padding: 13px 14px 13px 40px; border: 1.5px solid #e0eeea; border-radius: 8px;
  font-family: inherit; font-size: 14px; color: #1a2b2e; transition: border-color 0.2s;
  background-color: white; outline: none; box-sizing: border-box;
}
input:focus { border-color: #1D9E75; }

.disabled-field .icon { color: #8fa0a4; }
.input-disabled { background-color: #f4f8f7; border-color: #e2edea; color: #6b8488; cursor: not-allowed; }
.field-help { margin: 4px 0 0 4px; font-size: 11.5px; color: #78989e; }

.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-primary { background: #1D9E75; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #0f6e56; }
.btn-primary:disabled { background: #a5dcc8; cursor: not-allowed; }

.btn-secondary { background: #f4f8f7; color: #5a7a80; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-secondary:hover { background: #e8f0ed; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; margin-bottom: 12px; }
</style>