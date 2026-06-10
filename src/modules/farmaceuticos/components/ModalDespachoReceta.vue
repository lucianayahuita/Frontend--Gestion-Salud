<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-card animate-scale-up">
      
      <header class="modal-header">
        <div class="header-title">
          <Truck :size="20" />
          <h2>Procesar Despacho #REC-{{ receta?.id }}</h2>
        </div>
        <button class="btn-close" @click="cerrarModal" :disabled="cargando">
          <X :size="18" />
        </button>
      </header>

      <div class="modal-body">
        
        <div v-if="error" class="alert-box" :class="{ 'alert-danger': codigoError === 409, 'alert-warning': codigoError !== 409 }">
          <AlertTriangle :size="18" />
          <div>
            <strong v-if="codigoError === 409">¡Error de Almacén! Stock Insuficiente.</strong>
            <p>{{ error }}</p>
          </div>
        </div>

        <div class="prescription-summary">
          <span class="summary-tag">DATOS DE LA PRESCRIPCIÓN MÉDICA</span>
          <div class="summary-row">
            <span class="label">Medicamento:</span>
            <span class="value text-highlight">{{ receta?.medicamento?.nombre }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Tratamiento:</span>
            <span class="value">{{ receta?.dosis }} — {{ receta?.frecuencia }} por {{ receta?.duracion }}</span>
          </div>
          <div class="summary-details">
            <strong>Indicaciones médicas:</strong> {{ receta?.indicaciones || 'Sin indicaciones adicionales registradas.' }}
          </div>
        </div>

        <form @submit.prevent="handleFormSubmit" class="despacho-form">
          
          <div class="form-group">
            <label for="cantidad">Cantidad Calculada Automatizada <span class="required">*</span></label>
            <div class="input-icon-wrapper">
              <Layers :size="16" class="input-icon" />
              <input 
                id="cantidad"
                type="number" 
                v-model="form.cantidad" 
                min="1"
                required
                :disabled="cargando"
                class="form-control"
              />
            </div>
            <small class="form-hint">La máquina calculó este valor en base a las instrucciones del médico. Puedes ajustarlo manualmente de ser necesario.</small>
          </div>

          <div class="form-group">
            <label for="detalle">Justificación / Detalle del Movimiento</label>
            <textarea 
              id="detalle"
              v-model="form.detalle" 
              rows="3"
              :disabled="cargando"
              class="form-control text-area-control"
            ></textarea>
          </div>

        </form>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="cerrarModal" :disabled="cargando">
          Cancelar
        </button>
        <button class="btn-submit" @click="handleFormSubmit" :disabled="cargando || !farmaceuticoId">
          <RefreshCw v-if="cargando" :size="14" class="spin" />
          <Check v-else :size="14" />
          <span>{{ cargando ? 'Procesando...' : 'Confirmar Salida' }}</span>
        </button>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, ref } from 'vue';
import { Truck, X, Layers, Check, RefreshCw, AlertTriangle } from 'lucide-vue-next';
import { useRegistrarMovimientoDespacho } from '../composables/useRegistrarMovimientoDespacho.js';
import api from '@/api/axios.js';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  receta: { type: Object, default: null }
});

const emit = defineEmits(['close', 'saved']);

const { cargando, error, codigoError, calcularCantidadAutomatica, ejecutarDespacho } = useRegistrarMovimientoDespacho();
const farmaceuticoId = ref(null);

const form = reactive({
  cantidad: 1,
  detalle: ''
});
const obtenerUsuarioLogueado = async () => {
  try {
    const response = await api.get('me');
    if (response.data && response.data.id) {
      farmaceuticoId.value = response.data.id;
    } else if (response.data?.data?.id) {
      farmaceuticoId.value = response.data.data.id;
    }
  } catch (err) {
    console.error("Error crítico leyendo sesión de farmacia (/me):", err);
  }
};

watch(() => props.receta, (nuevaReceta) => {
  if (nuevaReceta) {
    const sugerenciaCalculada = calcularCantidadAutomatica(nuevaReceta);
    form.cantidad = sugerenciaCalculada; 
    form.detalle = `Despacho automatizado de ${sugerenciaCalculada} uds del medicamento según la prescripción médica.`;
  }
}, { immediate: true });

const cerrarModal = () => {
  if (!cargando.value) emit('close');
};

const handleFormSubmit = async () => {
  if (!form.cantidad || form.cantidad <= 0) return;

  const resultado = await ejecutarDespacho(
    props.receta,
    form.cantidad,
    form.detalle,
    farmaceuticoId.value 
  );

  if (resultado.success) {
    emit('saved'); 
    emit('close'); 
  }
};

onMounted(() => {
  obtenerUsuarioLogueado();
});
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 9999; }

.modal-card { background: white; width: 100%; max-width: 500px; border-radius: 14px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow: hidden; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; }

.modal-header { background: #115843; padding: 16px 20px; color: white; display: flex; justify-content: space-between; align-items: center; }
.header-title { display: flex; align-items: center; gap: 10px; }
.header-title h2 { margin: 0; font-size: 16px; font-weight: 600; font-family: 'Sora', sans-serif; letter-spacing: 0.02em; }
.btn-close { background: transparent; border: none; color: rgba(255,255,255,0.8); cursor: pointer; border-radius: 6px; display: flex; align-items: center; justify-content: center; padding: 4px; transition: background 0.2s; }
.btn-close:hover { background: rgba(255,255,255,0.15); color: white; }

.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 18px; }

.prescription-summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.summary-tag { font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px; }
.summary-row { display: flex; font-size: 13.5px; }
.summary-row .label { color: #64748b; width: 110px; flex-shrink: 0; }
.summary-row .value { color: #1e293b; font-weight: 500; }
.summary-row .text-highlight { color: #115843; font-weight: 700; }
.summary-details { border-top: 1px dashed #e2e8f0; margin-top: 4px; padding-top: 8px; font-size: 12.5px; color: #475569; line-height: 1.4; }

/* Formulario */
.despacho-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: #334155; }
.required { color: #ef4444; }

.input-icon-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 12px; color: #94a3b8; }
.form-control { width: 100%; border: 1px solid #cbd5e1; padding: 10px 12px; border-radius: 8px; font-size: 13.5px; color: #1e293b; outline: none; transition: border-color 0.15s ease; font-family: 'Inter', sans-serif; }
.input-icon-wrapper .form-control { padding-left: 36px; }
.form-control:focus { border-color: #115843; box-shadow: 0 0 0 3px rgba(17, 88, 67, 0.08); }
.text-area-control { resize: none; }
.form-hint { font-size: 11.5px; color: #64748b; line-height: 1.3; }

/* Alertas de error del Servidor */
.alert-box { display: flex; gap: 12px; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.4; }
.alert-danger { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
.alert-warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
.alert-box p { margin: 2px 0 0 0; }

/* Footer de Control */
.modal-footer { padding: 14px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancel { background: white; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.15s; }
.btn-cancel:hover { background: #f1f5f9; color: #1e293b; }

.btn-submit { background: #115843; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; color: white; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(17, 88, 67, 0.15); transition: all 0.15s; }
.btn-submit:hover { background: #083b2c; }
.btn-submit:disabled, .btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

/* Animación */
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-scale-up { animation: scaleUp 0.18s ease-out forwards; }
@keyframes scaleUp { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>