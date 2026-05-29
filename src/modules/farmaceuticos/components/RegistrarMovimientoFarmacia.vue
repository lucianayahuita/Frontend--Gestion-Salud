<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="cerrarModal">
    <div :class="['modal-card animate-fade-in', formulario.tipo === 'salida' ? 'border-salida' : 'border-entrada']">
      
      <header :class="['modal-header', formulario.tipo === 'salida' ? 'header-salida' : 'header-entrada']">
        <div class="header-icon-box">
          <ArrowUpDown :size="20" />
        </div>
        <div>
          <h2 class="modal-title">Registrar Movimiento</h2>
        </div>
        <button class="btn-close-x" @click="cerrarModal" aria-label="Cerrar modal">
          <X :size="18" />
        </button>
      </header>

      <div v-if="errorFormulario" class="form-alert-error">
        <AlertCircle :size="16" />
        <span>{{ errorFormulario }}</span>
      </div>

      <form @submit.prevent="guardarTransaccion" class="modal-body">
        
        <div class="form-group">
          <label class="form-label">Tipo de Operación <span class="required">*</span></label>
          <div class="radio-toggle-group">
            
            <label :class="['toggle-option', formulario.tipo === 'entrada' ? 'active-entrada' : '']">
              <input type="radio" v-model="formulario.tipo" value="entrada" hidden />
              <div class="option-content">
                <Download :size="16" />
                <span>Entrada de Stock</span>
              </div>
            </label>
            
            <label :class="['toggle-option', formulario.tipo === 'salida' ? 'active-salida' : '']">
              <input type="radio" v-model="formulario.tipo" value="salida" hidden />
              <div class="option-content">
                <Upload :size="16" />
                <span>Salida de Despacho</span>
              </div>
            </label>

          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Medicamento <span class="required">*</span></label>
          <div class="select-wrapper">
            <select v-model="formulario.medicamento_id" class="form-control-input" :disabled="cargandoMedicamentos">
              <option value="" disabled>
                {{ cargandoMedicamentos ? 'Cargando catálogo desde el servidor...' : 'Seleccione un medicamento...' }}
              </option>
              <option v-for="med in medicamentos" :key="med.id" :value="med.id">
                {{ med.nombre }} (Disponibles: {{ med.stock }} uds)
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Cantidad a procesar <span class="required">*</span></label>
          <input 
            type="number" 
            v-model="formulario.cantidad" 
            min="1" 
            class="form-control-input" 
            placeholder="Ej. 50"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Detalle / Justificación <span class="required">*</span></label>
          <textarea 
            v-model="formulario.detalle" 
            rows="3" 
            class="form-control-input text-area-input" 
            placeholder="Ej. Abastecimiento mensual de farmacia central o receta interna #..."
          ></textarea>
        </div>

        <footer class="modal-footer-buttons">
          <button type="button" class="btn-cancel" @click="cerrarModal" :disabled="procesandoGuardado">
            Cancelar
          </button>
          <button 
            type="submit" 
            :class="['btn-submit-save', formulario.tipo === 'salida' ? 'bg-btn-salida' : 'bg-btn-entrada']" 
            :disabled="procesandoGuardado"
          >
            <span v-if="procesandoGuardado" class="mini-spinner"></span>
            <span v-else>Confirmar Transacción</span>
          </button>
        </footer>

      </form>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { ArrowUpDown, AlertCircle, X, Download, Upload } from 'lucide-vue-next';
import { useRegistrarMovimientoFarmacia } from '@/modules/farmaceuticos/composables/useRegistrarMovimientoFarmacia.js';

const props = defineProps({
  isOpen: { type: Boolean, required: true }
});

const emit = defineEmits(['close', 'saved']);

const {
  formulario,
  medicamentos,
  cargandoMedicamentos,
  procesandoGuardado,
  errorFormulario,
  limpiarFormulario,
  cargarMedicamentosSelector,
  enviarFormulario
} = useRegistrarMovimientoFarmacia();

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    limpiarFormulario();
    cargarMedicamentosSelector();
  }
});

const cerrarModal = () => {
  if (!procesandoGuardado.value) emit('close');
};

const guardarTransaccion = async () => {
  const exito = await enviarFormulario();
  if (exito) {
    emit('saved'); 
    cerrarModal();
  }
};
</script>

<style scoped>
/* ── DIALOG BACKGROUND STYLES ── */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 32, 27, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-card { background: white; width: 100%; max-width: 500px; border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); overflow: hidden; transition: border-color 0.3s ease; }

.border-entrada { border: 1px solid #e3ede9; }
.border-salida { border: 1px solid #fee2e2; }

/* Dinámica de cabeceras contextuales */
.modal-header { padding: 20px 24px; color: white; display: flex; align-items: center; gap: 14px; position: relative; transition: background-color 0.3s ease; }
.header-entrada { background: #115843; }
.header-salida { background: #991b1b; }

.header-icon-box { width: 38px; height: 38px; background: rgba(255,255,255,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.modal-title { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 600; margin: 0; }
.modal-subtitle { font-size: 12px; color: rgba(255, 255, 255, 0.75); margin: 2px 0 0 0; }

.btn-close-x { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; cursor: pointer; opacity: 0.8; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: all 0.2s; }
.btn-close-x:hover { opacity: 1; background-color: rgba(255, 255, 255, 0.15); }

.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; color: #334155; }
.required { color: #ef4444; }

/* Inputs Estilizados */
.form-control-input { padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-family: inherit; font-size: 14px; outline: none; transition: all 0.2s; background-color: #f8fafc; }
.form-control-input:focus { border-color: #115843; background-color: white; box-shadow: 0 0 0 3px rgba(17, 88, 67, 0.08); }
.text-area-input { resize: none; }

/* Controles de Entrada / Salida (Tabs) */
.radio-toggle-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f1f5f9; padding: 4px; border-radius: 10px; }
.toggle-option { text-align: center; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; }
.option-content { display: flex; align-items: center; gap: 8px; justify-content: center; }

.active-entrada { background: white; color: #065f46; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
.active-salida { background: white; color: #991b1b; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }

/* Alertas de error de validación */
.form-alert-error { background: #fee2e2; border-left: 4px solid #ef4444; color: #991b1b; padding: 12px 16px; margin: 16px 24px 0; border-radius: 6px; font-size: 13px; display: flex; align-items: center; gap: 8px; }

/* Botones del Footer */
.modal-footer-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
.btn-cancel { background: #f1f5f9; border: none; padding: 11px 20px; border-radius: 10px; color: #64748b; font-weight: 600; font-size: 14px; cursor: pointer; transition: background-color 0.2s; }
.btn-cancel:hover { background: #e2e8f0; }

.btn-submit-save { border: none; padding: 11px 24px; border-radius: 10px; color: white; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 160px; transition: all 0.2s ease; }
.bg-btn-entrada { background: #115843; box-shadow: 0 4px 10px rgba(17, 88, 67, 0.15); }
.bg-btn-entrada:hover { background: #073528; }
.bg-btn-salida { background: #991b1b; box-shadow: 0 4px 10px rgba(153, 27, 27, 0.15); }
.bg-btn-salida:hover { background: #731212; }

/* Animación Loader */
.mini-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
</style>