<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      
      <div class="modal-header">
        <h3 class="modal-titulo">Detalles de la Consulta</h3>
        <button class="btn-cerrar-x" @click="$emit('close')">
          <X :size="20" color="#7a9aaa" />
        </button>
      </div>

      <div class="modal-body">
        
        <div v-if="loading" class="modal-loading">
          <div class="spinner"></div>
          <p>Consultando historial médico de la cita...</p>
        </div>

        <div v-else-if="error" class="modal-error">
          <AlertCircle :size="32" color="#ef4444" />
          <p>{{ error }}</p>
        </div>

        <div v-else-if="cita" class="detalle-grid">
          
          <div class="seccion-detalle full-width">
            <span class="detalle-label">Paciente</span>
            <div class="paciente-card">
              <User :size="20" color="#1D9E75" />
              <div>
                <span class="paciente-nombre">
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }} {{ cita.paciente?.segundo_apellido || '' }}
                </span>
                <span class="paciente-sub text-muted">ID Sistema: {{ cita.paciente_id }}</span>
              </div>
            </div>
          </div>

          <div class="seccion-detalle">
            <span class="detalle-label">Médico Responsable</span>
            <p class="detalle-valor font-semibold">{{ nombreMedico || 'Cargando...' }}</p>
            <span class="sub-id">ID Médico: {{ cita.medico_id }}</span>
          </div>

          <div class="seccion-detalle">
            <span class="detalle-label">Estado de Cita</span>
            <div>
              <span :class="['estado-badge', cita.estado?.toLowerCase()]">
                {{ cita.estado }}
              </span>
            </div>
          </div>

          <div class="seccion-detalle">
            <span class="detalle-label">Fecha Programada</span>
            <div class="icon-texto-row">
              <Calendar :size="16" color="#7a9aaa" />
              <p class="detalle-valor">{{ cita.fecha }}</p>
            </div>
          </div>

          <div class="seccion-detalle">
            <span class="detalle-label">Hora de Consulta</span>
            <div class="icon-texto-row">
              <Clock :size="16" color="#7a9aaa" />
              <p class="detalle-valor">{{ cita.hora }}</p>
            </div>
          </div>

          <div class="seccion-detalle full-width auditoria">
            <p><strong>Creación:</strong> {{ formatFechaISO(cita.created_at) }}</p>
            <p><strong>Última Modificación:</strong> {{ formatFechaISO(cita.updated_at) }}</p>
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secundario" @click="$emit('close')">Cerrar Ventana</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { X, User, Calendar, Clock, AlertCircle } from 'lucide-vue-next';

// Definición de Props y Emits
defineProps({
  isOpen: Boolean,
  cita: Object,
  loading: Boolean,
  error: String,
  nombreMedico: String // Pasamos el nombre mapeado que ya resolvimos en el Dashboard
});

defineEmits(['close']);

// Formateador simple para fechas ISO provenientes del backend
const formatFechaISO = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleString('es-BO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch {
    return isoString;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(26, 43, 46, 0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white; width: 100%; max-width: 500px;
  border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  display: flex; flex-direction: column; overflow: hidden;
}
.modal-header {
  padding: 16px 20px; border-bottom: 1px solid #e8f0ed;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-titulo { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; color: #1a2b2e; }
.btn-cerrar-x { background: transparent; border: none; cursor: pointer; display: flex; }

.modal-body { padding: 20px; max-height: 75vh; overflow-y: auto; }
.modal-loading { text-align: center; padding: 20px; color: #7a9aaa; }
.spinner {
  width: 32px; height: 32px; border: 3px solid #e1f5ee; border-top-color: #1D9E75;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.modal-error { text-align: center; padding: 12px; color: #991b1b; display: flex; flex-direction: column; align-items: center; gap: 8px; }

/* Grid de detalles */
.detalle-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.full-width { grid-column: span 2; }
.seccion-detalle { display: flex; flex-direction: column; gap: 4px; }
.detalle-label { font-size: 0.75rem; color: #7a9aaa; text-transform: uppercase; letter-spacing: 0.03em; font-weight: 500; }
.detalle-valor { font-size: 0.9rem; color: #1a2b2e; }
.font-semibold { font-weight: 600; }
.sub-id { font-size: 0.75rem; color: #7a9aaa; }

.paciente-card {
  background: #f4faf7; border: 1px solid #e1f2eb; border-radius: 10px;
  padding: 12px; display: flex; align-items: center; gap: 12px;
}
.paciente-nombre { font-weight: 600; color: #1a2b2e; font-size: 0.95rem; display: block; }
.paciente-sub { font-size: 0.75rem; display: block; }
.icon-texto-row { display: flex; align-items: center; gap: 6px; }

/* Estados badges */
.estado-badge { font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; display: inline-block; text-transform: capitalize; }
.estado-badge.pendiente { background: #fef3c7; color: #d97706; }
.estado-badge.completada, .estado-badge.atendido { background: #d1fae5; color: #065f46; }
.estado-badge.cancelado { background: #fee2e2; color: #991b1b; }

.auditoria { background: #f8fafc; padding: 10px 12px; border-radius: 8px; border: 1px solid #f1f5f9; margin-top: 8px; }
.auditoria p { font-size: 0.72rem; color: #64748b; margin: 2px 0; }

.modal-footer { padding: 12px 20px; border-top: 1px solid #e8f0ed; background: #f8faf9; display: flex; justify-content: flex-end; }
.btn-secundario {
  background: white; border: 1px solid #cbd5e1; color: #475569;
  padding: 8px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; cursor: pointer;
}
.btn-secundario:hover { background: #f1f5f9; }
</style>