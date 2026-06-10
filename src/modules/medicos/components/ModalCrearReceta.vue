<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="cerrarYResetear">
    <div class="modal-content text-sora">
      
      <div class="modal-header">
        <div class="title-group">
          <Pill :size="18" class="text-primary" />
          <h3>Emitir Receta Médica Directa</h3>
        </div>
        <button class="btn-close" @click="cerrarYResetear">
          <X :size="16" />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="errorReceta" class="error-notice">
          {{ errorReceta }}
        </div>

        <form @submit.prevent="handleGuardar">
          
          <div class="form-group-modal" :class="{ 'has-error': v$.medicamento_id.$error }">
            <label>Medicamento *</label>
            <select 
              v-model="formularioReceta.medicamento_id" 
              class="modal-select"
              @change="v$.medicamento_id.$touch()"
            >
              <option value="" disabled>Seleccione un medicamento activo...</option>
              <option v-for="med in medicamentos" :key="med.id" :value="med.id">
                {{ med.nombre }} (Stock: {{ med.stock }})
              </option>
            </select>
            <span v-if="v$.medicamento_id.$error && !v$.medicamento_id.required.$response" class="error-text">
              Debe seleccionar un medicamento válido.
            </span>
            <span v-if="v$.medicamento_id.$error && !v$.medicamento_id.tieneStock.$response" class="error-text">
              ¡Error! Este medicamento no cuenta con unidades disponibles en el inventario (Stock: 0).
            </span>
          </div>

          <div class="form-row-modal">
            
            <div class="form-group-modal" :class="{ 'has-error': v$.dosis.$error }">
              <label>Dosis *</label>
              <input 
                v-model="formularioReceta.dosis" 
                type="text" 
                placeholder="Ej: 500 mg / 1 tableta" 
                @blur="v$.dosis.$touch()"
              />
              <span v-if="v$.dosis.$error" class="error-text">La dosis es obligatoria.</span>
            </div>
            
            <div class="form-group-modal" :class="{ 'has-error': v$.frecuencia.$error }">
              <label>Frecuencia *</label>
              <input 
                v-model="formularioReceta.frecuencia" 
                type="text" 
                placeholder="Ej: Cada 8 horas" 
                @blur="v$.frecuencia.$touch()"
              />
              <span v-if="v$.frecuencia.$error" class="error-text">La frecuencia es obligatoria.</span>
            </div>

          </div>

          <div class="form-group-modal" :class="{ 'has-error': v$.duracion.$error }">
            <label>Duración del tratamiento *</label>
            <input 
              v-model="formularioReceta.duracion" 
              type="text" 
              placeholder="Ej: 7 días" 
              @blur="v$.duracion.$touch()"
            />
            <span v-if="v$.duracion.$error" class="error-text">Especifique la duración del tratamiento.</span>
          </div>

          <div class="form-group-modal">
            <label>Indicaciones adicionales</label>
            <textarea v-model="formularioReceta.indicaciones" rows="2" placeholder="Ej: Tomar después de las comidas principales."></textarea>
          </div>

          <div class="modal-footer-actions">
            <button type="button" class="btn-cancelar-modal" @click="cerrarYResetear" :disabled="guardandoReceta">
              Cancelar
            </button>
            <button type="submit" class="btn-guardar-modal" :disabled="guardandoReceta">
              <Loader2 v-if="guardandoReceta" class="spinner" :size="14" />
              {{ guardandoReceta ? 'Registrando...' : 'Emitir Receta' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { Pill, X, Loader2 } from 'lucide-vue-next';
import { useCrearReceta } from '../composables/useCrearReceta.js';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  citaId: { type: [Number, String], required: true },
  medicamentos: { type: Array, required: true, default: () => [] }
});
const emit = defineEmits(['close', 'receta-creada']);
const { formularioReceta, guardandoReceta, errorReceta, enviarReceta, resetFormulario } = useCrearReceta();
// valida que su stock sea mayor que 0
const tieneStock = (value) => {
  if (!value) return true; 
  const medicamentoSeleccionado = props.medicamentos.find(m => m.id === value);
  return medicamentoSeleccionado ? medicamentoSeleccionado.stock > 0 : false;
};

const reglas = {
  medicamento_id: { 
    required,
    tieneStock 
  },
  dosis: { required },
  frecuencia: { required },
  duracion: { required }
};

const v$ = useVuelidate(reglas, formularioReceta);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetFormulario();
    v$.value.$reset();
  }
});

const cerrarYResetear = () => {
  v$.value.$reset();
  emit('close');
};

const handleGuardar = async () => {
  v$.value.$touch();

  if (v$.value.$invalid) return;

  try {
    const res = await enviarReceta(props.citaId);
    emit('receta-creada', res);
    emit('close');
  } catch (err) {
    console.error('Error al crear receta:', err);
  }
};
</script>

<style scoped>
.text-sora { font-family: 'Sora', sans-serif; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
  display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(3px);
}
.modal-content {
  background: white; width: 90%; max-width: 460px; border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; animation: scaleUp 0.2s ease;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.title-group { display: flex; align-items: center; gap: 8px; }
.title-group h3 { font-size: 14px; margin: 0; color: #1a2b2e; font-weight: 600; }
.text-primary { color: #1D9E75; }
.btn-close { background: none; border: none; cursor: pointer; color: #94a3b8; }
.btn-close:hover { color: #64748b; }
.modal-body { padding: 20px; }
.form-group-modal { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
.form-row-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.form-group-modal label { font-size: 11px; font-weight: 600; color: #6b8f9a; }
.form-group-modal input, .modal-select, .form-group-modal textarea {
  font-family: 'Sora', sans-serif; font-size: 12.5px; padding: 8px 10px;
  border: 1px solid #E0EEEA; border-radius: 6px; background: #F5FAF8; outline: none;
  transition: border-color 0.15s ease-in-out;
}
.form-group-modal input:focus, .modal-select:focus, .form-group-modal textarea:focus { border-color: #1D9E75; background: #fff; }

.form-group-modal.has-error input,
.form-group-modal.has-error select {
  border-color: #f87171 !important;
  background-color: #fff5f5;
}
.error-text {
  color: #dc2626;
  font-size: 10.5px;
  font-weight: 500;
  margin-top: 1px;
}

.modal-footer-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; padding-top: 12px; border-top: 1px solid #f1f5f9; }
.btn-cancelar-modal, .btn-guardar-modal { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; padding: 8px 14px; border-radius: 6px; cursor: pointer; border: none; }
.btn-cancelar-modal { background: #f1f5f9; color: #475569; }
.btn-cancelar-modal:hover { background: #e2e8f0; }
.btn-guardar-modal { background: #1D9E75; color: white; display: inline-flex; align-items: center; gap: 6px; }
.btn-guardar-modal:hover { background: #0F6E56; }
.error-notice { background: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 12px; }
.spinner { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
</style>