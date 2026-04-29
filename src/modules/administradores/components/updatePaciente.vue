<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Actualizar Datos de Contacto</h3>
        <p class="subtitle">Paciente: {{ props.paciente.nombre }} {{ props.paciente.apellido }}</p>
      </div>

      <form @submit.prevent="handleUpdate">
        <div class="field-group">
          <label>C.I. (No editable)</label>
          <input :value="props.paciente.ci" class="input-readonly" readonly />
        </div>

        <div class="field-group">
          <label>Teléfono</label>
          <input v-model="form.telefono" placeholder="Nuevo número de celular" required />
        </div>

        <div class="field-group">
          <label>Dirección</label>
          <input v-model="form.direccion" placeholder="Nueva dirección" required />
        </div>
        
        <div class="actions">
          <button type="button" class="btn-cancelar" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-guardar" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Actualizar Datos' }}
          </button>
        </div>
      </form>
      
      <p v-if="error" class="error">{{ error }}</p>
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
  direccion: ''
});

onMounted(() => {
  if (props.paciente) {
    form.telefono = props.paciente.telefono;
    form.direccion = props.paciente.direccion;
  }
});

const handleUpdate = async () => {
    try {
        const datosCompletos = {
            ...props.paciente,      
            telefono: form.telefono, 
            direccion: form.direccion 
        };

        // Enviamos el objeto con todos los campos
        await ejecutarActualizacion(props.paciente.id, datosCompletos);
        
        emit('actualizar'); 
    } catch (err) {
        console.error("DETALLES DEL ERROR:", err.response?.data || err.message);
    }
};
</script>

<style scoped>
@import '@/assets/global.css';
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

.modal-content { 
  background: white; padding: 24px; border-radius: 16px; 
  width: 100%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

.modal-header { margin-bottom: 20px; font-family: var(--font-family); }
.subtitle { color: #666; font-size: 0.9rem; margin-top: 4px; font-family: var(--font-family); }

.field-group { margin-bottom: 16px; }
.field-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #444; }

input { 
  width: 100%; padding: 10px; border: 1.5px solid #e0eeea; 
  border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s;
}

input:focus { border-color: #1D9E75; }

.input-readonly { background: #f5f5f5; color: #888; cursor: not-allowed; border-color: #eee; }

.actions { display: flex; justify-content: center; gap: 12px; margin-top: 24px; }

.btn-guardar {
  background: var(--secondary-color);
  color: white;
  border: none;
  padding: 10px 24px; 
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
}

.btn-cancelar {
  padding: 10px 16px; background: #f3f4f6; color: #4b5563;
  border: none; border-radius: 8px; cursor: pointer;
}

.error { color: #dc2626; font-size: 13px; margin-top: 12px; text-align: center; }
</style>