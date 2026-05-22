<template>
  <Transition name="modal-fade">
    <div v-if="mostrar" class="modal-overlay" @click.self="$emit('cerrar')">
      <div class="modal-container">
        
        <header class="modal-header">
          <div class="modal-header-title">
            <ClipboardListIcon :size="20" class="text-teal" />
            <h2>Detalle de Consulta Médica</h2>
          </div>
          <button class="btn-close" @click="$emit('cerrar')">✕</button>
        </header>

        <div class="modal-body">
          <div v-if="cargando" class="modal-loading">
            <div class="spinner"></div>
            <p>Buscando registro clínico en el servidor...</p>
          </div>

          <div v-else-if="error" class="modal-error">
            <AlertCircleIcon :size="24" />
            <p>{{ error }}</p>
          </div>

          <div v-else-if="historia" class="modal-content-layout">
            
            <div class="main-clinical-info">
              <div class="info-block">
                <span class="block-label">Motivo de la Consulta</span>
                <p class="block-value text-bold">{{ historia.motivo_consulta }}</p>
              </div>

              <div class="info-block">
                <span class="block-label">Enfermedad Actual / Sintomatología</span>
                <p class="block-value">{{ historia.enfermedad_actual || 'Ninguna registrada' }}</p>
              </div>

              <div class="grid-two-cols">
                <div class="info-block base-diagnostic">
                  <span class="block-label text-blue">Diagnóstico Definitivo</span>
                  <p class="block-value highlight-blue">{{ historia.diagnostico }}</p>
                </div>
                <div class="info-block base-treatment">
                  <span class="block-label text-green">Tratamiento Asignado</span>
                  <p class="block-value highlight-green">{{ historia.tratamiento }}</p>
                </div>
              </div>

              <div class="info-block border-top-dash">
                <span class="block-label">Indicaciones / Observaciones</span>
                <p class="block-value notes-text">{{ historia.observaciones || 'Sin observaciones adicionales.' }}</p>
              </div>
            </div>

            <div class="vitals-sidebar">
              <h3>Triaje de la Cita</h3>
              <div class="vitals-vertical-list">
                <div class="v-item">
                  <span class="v-label">Presión Arterial</span>
                  <span class="v-val">{{ historia.presion_arterial || '—' }} <small>mmHg</small></span>
                </div>
                <div class="v-item">
                  <span class="v-label">Temperatura</span>
                  <span class="v-val">{{ historia.temperatura || '—' }} <small>°C</small></span>
                </div>
                <div class="v-item">
                  <span class="v-label">Saturación O₂</span>
                  <span class="v-val">{{ historia.saturacion || '—' }} <small>%</small></span>
                </div>
                <div class="v-item">
                  <span class="v-label">Peso Corporal</span>
                  <span class="v-val">{{ historia.peso || '—' }} <small>kg</small></span>
                </div>
                <div class="v-item">
                  <span class="v-label">Estatura / Talla</span>
                  <span class="v-val">{{ historia.talla || '—' }} <small>m</small></span>
                </div>
              </div>
              
              <div class="date-footer">
                <span>Registrado el {{ formatearFechaDetalle(historia.fecha) }}</span>
              </div>
            </div>

          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-modal-action" @click="$emit('cerrar')">Cerrar Detalle</button>
        </footer>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ClipboardListIcon, AlertCircleIcon } from 'lucide-vue-next'

defineProps({
  mostrar: { type: Boolean, required: true },
  cargando: { type: Boolean, default: false },
  error: { type: String, default: null },
  historia: { type: Object, default: null }
})

defineEmits(['cerrar'])

function formatearFechaDetalle(f) {
  if (!f) return ''
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    .format(new Date(f + 'T00:00:00'))
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-container {
  background: #ffffff; width: 90%; max-width: 850px; border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  display: flex; flex-direction: column; max-height: 85vh; overflow: hidden;
  border: 1px solid #e2e8f0;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc;
}
.modal-header-title { display: flex; align-items: center; gap: 8px; }
.modal-header-title h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
.text-teal { color: #059669; }
.btn-close { background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; transition: color 0.2s; }
.btn-close:hover { color: #0f172a; }

.modal-body { padding: 24px; overflow-y: auto; flex: 1; background: #ffffff; }

/* Layout Interno */
.modal-content-layout { display: grid; grid-template-columns: 1fr 240px; gap: 24px; }
.main-clinical-info { display: flex; flex-direction: column; gap: 16px; }
.info-block { display: flex; flex-direction: column; gap: 4px; }
.block-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
.block-value { font-size: 14px; color: #334155; margin: 0; line-height: 1.5; }
.text-bold { font-weight: 600; color: #0f172a; }

.grid-two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.base-diagnostic { background: #f0f6ff; padding: 12px; border-radius: 10px; border: 1px solid #bae6fd; }
.base-treatment { background: #f0fdf4; padding: 12px; border-radius: 10px; border: 1px solid #bbf7d0; }
.text-blue { color: #0284c7; }
.text-green { color: #166534; }
.highlight-blue { color: #0369a1; font-weight: 700; }
.highlight-green { color: #14532d; font-weight: 700; font-style: italic; }
.border-top-dash { border-top: 1px dashed #e2e8f0; padding-top: 14px; }
.notes-text { color: #475569; font-style: italic; }

/* Barra Lateral de Signos Vitales */
.vitals-sidebar { background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; }
.vitals-sidebar h3 { font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0 0 12px 0; color: #475569; text-align: center; }
.vitals-vertical-list { display: flex; flex-direction: column; gap: 8px; }
.v-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; }
.v-label { font-size: 12px; color: #64748b; }
.v-val { font-size: 13px; font-weight: 700; color: #0f172a; }
.v-val small { font-weight: 400; color: #94a3b8; }
.date-footer { margin-top: 16px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 500; }

/* Footer */
.modal-footer { padding: 12px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; justify-content: flex-end; }
.btn-modal-action { background: #0f172a; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-modal-action:hover { background: #1e293b; }

/* Loading States */
.modal-loading { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 0; color: #64748b; }
.spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #059669; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.modal-error { color: #dc2626; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px; text-align: center; }

/* Animaciones Transición */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>