<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="cerrarModal">
    <div :class="['modal-card animate-fade-in', esSalida ? 'border-salida' : 'border-entrada']">
      
      <header :class="['modal-header', esSalida ? 'header-salida' : 'header-entrada']">
        <div class="header-icon-box">
          <Info :size="20" />
        </div>
        <div>
          <h2 class="modal-title">Detalle de Transacción #{{ movimientoId }}</h2>
        </div>
        <button class="btn-close-x" @click="cerrarModal" aria-label="Cerrar modal">
          <X :size="18" />
        </button>
      </header>

      <div v-if="cargandoDetalle" class="loading-container">
        <div class="spinner-large"></div>
        <p>Buscando bitácora en el servidor...</p>
      </div>

      <div v-else-if="errorDetalle" class="form-alert-error">
        <AlertCircle :size="16" />
        <span>{{ errorDetalle }}</span>
      </div>

      <div v-else-if="detalle" class="modal-body">
        
        <div class="detail-row header-badge-row">
          <span class="detail-label">Tipo de Movimiento</span>
          <span :class="['status-badge', esSalida ? 'badge-salida' : 'badge-entrada']">
            <Upload v-if="esSalida" :size="14" />
            <Download v-else :size="14" />
            {{ esSalida ? 'Salida de Almacén' : 'Entrada de Stock' }}
          </span>
        </div>

        <hr class="divider" />

        <div class="section-title">Medicamento Implicado</div>
        <div class="info-card">
          <div class="detail-row">
            <span class="detail-label">Nombre Comercial:</span>
            <span class="detail-value text-bold">{{ detalle.medicamento?.nombre }}</span>
          </div>
          <div class="detail-grid-2">
            <div class="detail-row">
              <span class="detail-label">Stock Actual:</span>
              <span class="detail-value font-mono">{{ detalle.medicamento?.stock }} uds</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Precio unitario:</span>
              <span class="detail-value font-mono">${{ detalle.medicamento?.precio }}</span>
            </div>
          </div>
        </div>

        <div class="section-title">Datos del Registro</div>
        <div class="info-card">
          <div class="detail-row">
            <span class="detail-label">Cantidad Operada:</span>
            <span :class="['detail-value text-bold quantity-text', esSalida ? 'text-salida' : 'text-entrada']">
              {{ esSalida ? '-' : '+' }} {{ detalle.cantidad }} unidades
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha del Sistema:</span>
            <span class="detail-value font-mono">{{ formatearFecha(detalle.fecha) }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Origen / Vínculo:</span>
            <span class="detail-value text-badge-origen" v-if="detalle.receta_medica_id">
              Receta Médica #{{ detalle.receta_medica_id }}
            </span>
            <span class="detail-value text-muted" v-else>
              Ajuste Directo de Inventario
            </span>
          </div>

          <div class="detail-row flex-column">
            <span class="detail-label">Justificación / Motivo:</span>
            <div class="justificacion-box">
              {{ detalle.detalle }}
            </div>
          </div>
        </div>

        <div class="section-title">Responsable de Operación</div>
        <div class="info-card responsable-card">
          <div class="detail-row">
            <span class="detail-label">Farmacéutico:</span>
            <span class="detail-value user-name-text">{{ detalle.farmaceutico?.name }}</span>
          </div>
          <div class="detail-row" v-if="detalle.farmaceutico?.email">
            <span class="detail-label">Contacto:</span>
            <span class="detail-value font-mono text-muted email-text">{{ detalle.farmaceutico?.email }}</span>
          </div>
        </div>

        <footer class="modal-footer-buttons">
          <button type="button" class="btn-cancel" @click="cerrarModal">
            Cerrar Ventana
          </button>
        </footer>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { Info, X, AlertCircle, Download, Upload } from 'lucide-vue-next';
import { useVerDetalleMovimiento } from '../composables/useVerDetalleMovimiento';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  movimientoId: { type: [Number, String], default: null }
});

const emit = defineEmits(['close']);

const { 
  detalle, 
  cargandoDetalle, 
  errorDetalle, 
  cargarDetalleMovimiento, 
  limpiarDetalle 
} = useVerDetalleMovimiento();

const esSalida = computed(() => detalle.value?.tipo === 'salida');

watch(() => props.isOpen, (open) => {
  if (open && props.movimientoId) {
    cargarDetalleMovimiento(props.movimientoId);
  } else {
    limpiarDetalle();
  }
});

const cerrarModal = () => {
  emit('close');
};

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return '';
  // Formateador básico local YYYY-MM-DD
  return fechaRaw.split('T')[0]; 
};
</script>

<style scoped>
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 32, 27, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-card { background: white; width: 100%; max-width: 480px; border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); overflow: hidden; }

.border-entrada { border: 1px solid #e3ede9; }
.border-salida { border: 1px solid #fee2e2; }

.modal-header { padding: 20px 24px; color: white; display: flex; align-items: center; gap: 14px; position: relative; }
.header-entrada { background: #115843; }
.header-salida { background: #991b1b; }

.header-icon-box { width: 38px; height: 38px; background: rgba(255,255,255,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.modal-title { font-family: 'Sora', sans-serif; font-size: 21px; font-weight: 600; margin: 0; }

.btn-close-x { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; cursor: pointer; opacity: 0.8; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: all 0.2s; }
.btn-close-x:hover { opacity: 1; background-color: rgba(255, 255, 255, 0.15); }

.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; max-height: 80vh; overflow-y: auto; }

/* Contenedores de Información Interna */
.section-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
.info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.responsable-card { border-left: 3px solid #64748b; background: #f1f5f9; }

.detail-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; gap: 10px; }
.detail-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-top: 1px dashed #e2e8f0; padding-top: 10px; }
.flex-column { flex-direction: column; align-items: flex-start; gap: 6px; }

.detail-label { color: #64748b; font-weight: 500; }
.detail-value { color: #1e293b; font-weight: 600; text-align: right; }
.text-muted { font-weight: 400; color: #64748b; font-size: 13px; }
.text-bold { font-weight: 700; }
.font-mono { font-family: monospace; font-size: 13px; }
.user-name-text { text-transform: capitalize; color: #0f172a; }
.email-text { font-size: 12px; }

/* Badges Dinámicos de Estado */
.header-badge-row { align-items: center; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 30px; font-size: 13px; font-weight: 700; }
.badge-entrada { background: #d1fae5; color: #065f46; }
.badge-salida { background: #fee2e2; color: #991b1b; }

.text-badge-origen { background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; }

.quantity-text { font-size: 16px; }
.text-entrada { color: #047857; }
.text-salida { color: #b91c1c; }

.justificacion-box { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #334155; line-height: 1.5; width: 100%; min-height: 45px; box-sizing: border-box; text-align: left; }

.divider { border: none; border-top: 1px solid #f1f5f9; margin: 4px 0; }

/* Loaders y Errores */
.loading-container { padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #64748b; font-size: 14px; }
.spinner-large { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #115843; border-radius: 50%; animation: spin 0.8s linear infinite; }
.form-alert-error { background: #fee2e2; border-left: 4px solid #ef4444; color: #991b1b; padding: 12px 16px; margin: 16px; border-radius: 6px; font-size: 13px; display: flex; align-items: center; gap: 8px; }

.modal-footer-buttons { display: flex; justify-content: flex-end; margin-top: 10px; }
.btn-cancel { background: #f1f5f9; border: none; padding: 11px 20px; border-radius: 10px; color: #64748b; font-weight: 600; font-size: 14px; cursor: pointer; transition: background-color 0.2s; }
.btn-cancel:hover { background: #e2e8f0; }

@keyframes spin { to { transform: rotate(360deg); } }
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
</style>