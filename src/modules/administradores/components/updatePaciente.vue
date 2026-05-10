<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Actualizar Datos de Contacto</h3>
        <p class="subtitle">{{ props.paciente.nombre }} {{ props.paciente.apellido }} {{ props.paciente.segundo_apellido }}</p>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleUpdate">

        <div class="field-group">
          <label>Teléfono</label>
          <input v-model="form.telefono" placeholder="Teléfono / Celular" />
        </div>

        <div class="field-group">
          <label>Dirección</label>
          <input v-model="form.direccion" placeholder="Dirección de domicilio" />
        </div>

        <div class="field-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.seguro" />
            <span>¿Cuenta con seguro médico?</span>
          </label>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="actions">
          <button type="button" class="btn-cancelar" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-guardar" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Actualizar Datos' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useUpdatePaciente } from '../composables/useUpdatePaciente';

const props = defineProps(['paciente']);
const emit = defineEmits(['close', 'actualizar']);

const { ejecutarActualizacion, loading, error } = useUpdatePaciente();

const form = reactive({
  telefono: '',
  direccion: '',
  seguro: false,
});

onMounted(() => {
  if (props.paciente) {
    form.telefono  = props.paciente.telefono  || ''
    form.direccion = props.paciente.direccion || ''
    form.seguro    = !!props.paciente.seguro   // API devuelve 1/0
  }
});

const handleUpdate = async () => {
  try {
    await ejecutarActualizacion(props.paciente.id, {
      user_id:          props.paciente.user_id,
      nombre:           props.paciente.nombre,
      apellido:         props.paciente.apellido,
      segundo_apellido: props.paciente.segundo_apellido || '',
      ci:               props.paciente.ci,
      fecha_nacimiento: props.paciente.fecha_nacimiento,
      telefono:         form.telefono,
      direccion:        form.direccion,
      seguro:           form.seguro,
      estado:           'Activo',
    });
    emit('actualizar');
    emit('close');
  } catch (err) {
    console.error('Error al actualizar:', err.response?.data || err.message);
  }
};
</script>

<style scoped>
@import '@/assets/global.css';

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
}

.modal-content {
  background: white; padding: 28px; border-radius: 16px;
  width: 100%; max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.modal-header { position: relative; margin-bottom: 24px; }
.modal-header h3 { font-size: 1.2rem; color: #1a2b2e; margin: 0 0 4px; font-family: var(--font-work); }
.subtitle { color: #3aa085; font-size: 0.875rem; margin: 0; font-weight: 600; }

.btn-close {
  position: absolute; top: 0; right: 0;
  width: 30px; height: 30px; border-radius: 50%;
  border: none; background: #f4f8f7; color: #5a7a80;
  font-size: 1.1rem; cursor: pointer;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.field-group { margin-bottom: 16px; }
.field-group > label:not(.checkbox-label) {
  display: block; font-size: 12px; font-weight: 600;
  margin-bottom: 6px; color: #5a7a80;
}

input:not([type="checkbox"]) {
  width: 100%; padding: 10px 12px;
  border: 1.5px solid #e0eeea; border-radius: 8px;
  font-size: 14px; font-family: inherit;
  outline: none; transition: border-color 0.2s;
}
input:not([type="checkbox"]):focus { border-color: #1D9E75; }

.checkbox-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: #3d5260; cursor: pointer; font-weight: 500;
}
.checkbox-label input[type="checkbox"] {
  width: 16px; height: 16px; accent-color: #1D9E75; margin: 0;
}

.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

.btn-guardar {
  background: #1D9E75; color: white; border: none;
  padding: 10px 24px; border-radius: 8px;
  font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.btn-guardar:hover { background: #0f6e56; }
.btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-cancelar {
  padding: 10px 16px; background: #f3f4f6; color: #4b5563;
  border: none; border-radius: 8px; cursor: pointer;
}
.btn-cancelar:hover { background: #e5e7eb; }

.error { color: #dc2626; font-size: 13px; margin-top: 8px; text-align: center; }
</style>