<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">

      <div class="modal-header">
        <h2 class="modal-title">Registrar Nuevo Farmacéutico</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="registration-form">

        <div class="form-section">
          <span class="section-tag">Identificación Laboral</span>
          <div class="grid-2">
            <div class="field-icon">
              <User :size="16" class="icon" />
              <input v-model="formulario.nombre" placeholder="Nombre(s)" required />
            </div>
            <div class="field-icon">
              <Users :size="16" class="icon" />
              <input v-model="formulario.apellido" placeholder="Apellido(s)" required />
            </div>
          </div>
        </div>

        <div class="form-section">
          <span class="section-tag">Credenciales de Acceso</span>
          <div class="input-group">
            <div class="field-icon">
              <Mail :size="16" class="icon" />
              <input
                v-model="formulario.email"
                type="email"
                placeholder="Correo corporativo"
                autocomplete="username"
                required
              />
            </div>
            <div class="field-icon">
              <Lock :size="16" class="icon" />
              <input
                v-model="formulario.password"
                type="password"
                placeholder="Contraseña temporal"
                autocomplete="new-password"
                required
              />
            </div>
          </div>
        </div>

        <p v-if="errores && typeof errores === 'string'" class="error-banner">{{ errores }}</p>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="cargando">
            {{ cargando ? 'Registrando...' : 'Guardar Farmacéutico' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Mail, Lock, User, Users } from 'lucide-vue-next';
import { useRegistrarFarmaceutico } from '../composables/useRegistrarFarmaceutico';

const emit = defineEmits(['close', 'actualizar']);
const { formulario, cargando, errores, enviarRegistro } = useRegistrarFarmaceutico();

const handleSubmit = async () => {
  const exito = await enviarRegistro();
  if (exito) {
    emit('actualizar');
    emit('close');
  } else {
    if (errores.value && typeof errores.value === 'object') {
      const listaErrores = Object.values(errores.value).flat().join('\n');
      alert("Error de validación en el servidor:\n\n" + listaErrores);
    } else {
      alert(errores.value || 'Ocurrió un error al dar de alta al farmacéutico.');
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
  background: white; width: 500px; max-width: 90%;
  border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-size: 1.4rem; color: #1a2b2e; margin: 0; font-family: var(--font-work); }

.section-tag { display: block; font-size: 11px; font-weight: 700; color: #1D9E75; text-transform: uppercase; margin-bottom: 10px; }
.form-section { margin-bottom: 16px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.input-group { display: flex; flex-direction: column; gap: 4px; }

input {
  width: 100%; padding: 12px 12px 12px 36px; border: 1.5px solid #e0eeea; border-radius: 8px;
  font-family: inherit; transition: border-color 0.2s; margin-bottom: 12px;
  background-color: white; outline: none; box-sizing: border-box;
}
input:focus { border-color: var(--secondary-color); }

.btn-close {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: #f4f8f7; color: #5a7a80; font-size: 1.2rem;
  cursor: pointer; transition: background 0.2s, color 0.2s;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.field-icon { position: relative; display: flex; align-items: center; width: 100%; }
.field-icon .icon { position: absolute; left: 12px; color: #1D9E75; pointer-events: none; top: 14px; z-index: 10; }

.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; }
.btn-primary { background: #1D9E75; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-secondary { background: #f4f8f7; color: #5a7a80; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; margin-bottom: 12px; }
</style>