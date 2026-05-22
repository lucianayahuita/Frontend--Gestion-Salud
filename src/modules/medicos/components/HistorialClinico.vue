<template>
  <div class="hc-page">
    <div v-if="cargando" class="estado-loading">
      <div class="loading-pulse"></div>
      <span>Cargando historial clínico...</span>
    </div>

    <p v-else-if="errorHistorial" class="error-banner">{{ errorHistorial }}</p>

    <div v-else-if="datosPaciente" class="hc-root">

      <header class="hc-header">
        <div class="header-accent-bar"></div>
        <div class="header-inner">
          <div class="patient-avatar">
            {{ getInitials(datosPaciente.nombre, datosPaciente.apellido) }}
          </div>
          <div class="header-text">
            <p class="header-eyebrow">Historia Clínica</p>
            <h1 class="patient-title">
              {{ datosPaciente.nombre }} {{ datosPaciente.apellido }}
              <span v-if="datosPaciente.segundo_apellido">{{ datosPaciente.segundo_apellido }}</span>
            </h1>
            <div class="header-chips">
              <span class="chip chip-id">
                <span class="chip-dot"></span>
                Paciente #{{ datosPaciente.id }}
              </span>
              <span class="chip chip-ci">CI {{ datosPaciente.ci }}</span>
              <span class="chip chip-count" v-if="historiasOrdenadas.length > 0">
                {{ historiasOrdenadas.length }} consultas
              </span>
            </div>
          </div>
          <button class="btn-export" @click="exportarPDF">
            <DownloadIcon :size="16" />
            Exportar PDF
          </button>
        </div>
      </header>

      <div class="hc-layout">
        <section class="main-section">

          <div class="tabs-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-btn', { active: tabActiva === tab.id }]"
              @click="tabActiva = tab.id"
            >
              <component :is="tab.icon" :size="15" />
              {{ tab.nombre }}
            </button>
          </div>

          <div v-if="tabActiva === 'consultas'" class="tab-pane">
            <div v-if="historiasOrdenadas.length === 0" class="empty-state">
              <ClipboardListIcon :size="48" class="empty-icon-svg" />
              <p>No se registran consultas previas.</p>
            </div>

            <div v-else class="timeline">
              <div
                v-for="(historia, index) in historiasOrdenadas"
                :key="historia.id"
                class="tl-item"
                :style="{ '--delay': index * 0.07 + 's' }"
              >
                <div class="tl-node-col">
                  <div class="tl-index">{{ String(index + 1).padStart(2,'0') }}</div>
                  <div class="tl-line" v-if="index < historiasOrdenadas.length - 1"></div>
                </div>

                <div class="tl-card">
                  <div class="tl-card-top">
                    <div class="tl-date-badge">
                      <span class="tl-day">{{ getDia(historia.fecha) }}</span>
                      <span class="tl-month">{{ getMes(historia.fecha) }}</span>
                      <span class="tl-year">{{ getAnio(historia.fecha) }}</span>
                    </div>
                    <div class="tl-card-header">
                      <h4 class="tl-title">Consulta <span>#{{ historia.id }}</span></h4>
                      <p class="tl-motivo"><strong>Motivo:</strong> {{ historia.motivo_consulta }}</p>
                    </div>
                    <div class="action-area">
                      <button class="btn-ver-detalle" @click="cargarYVerDetalle(historia.id)">
                        Ver detalle
                        <ArrowRightIcon :size="14" />
                      </button>
                    </div>
                  </div>

                  <div class="tl-card-body">
                    <div class="tl-field border-teal">
                      <span class="tl-field-label text-blue">
                        <StethoscopeIcon :size="11" style="margin-right:4px;vertical-align:middle;" />
                        Diagnóstico
                      </span>
                      <span class="tl-field-value highlight">{{ historia.diagnostico || 'Pendiente de diagnóstico' }}</span>
                    </div>
                    <div class="tl-field bg-soft-green">
                      <span class="tl-field-label text-green">
                        <PillIcon :size="11" style="margin-right:4px;vertical-align:middle;" />
                        Tratamiento / Medicación
                      </span>
                      <span class="tl-field-value treatment-text">{{ historia.tratamiento || 'Sin tratamiento farmacológico indicado' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="tabActiva === 'recetas'" class="tab-pane">
            <div v-if="historiasOrdenadas.length === 0" class="empty-state">
              <PillIcon :size="48" class="empty-icon-svg" />
              <p>No hay recetas registradas.</p>
            </div>
            <div v-else class="timeline">
              <div
                v-for="(historia, index) in historiasOrdenadas"
                :key="'rx-' + historia.id"
                class="tl-item"
                :style="{ '--delay': index * 0.07 + 's' }"
              >
                <div class="tl-node-col">
                  <div class="tl-index green">Rx</div>
                  <div class="tl-line" v-if="index < historiasOrdenadas.length - 1"></div>
                </div>
                <div class="tl-card rx-card">
                  <div class="tl-card-top">
                    <div class="tl-date-badge green">
                      <span class="tl-day">{{ getDia(historia.fecha) }}</span>
                      <span class="tl-month">{{ getMes(historia.fecha) }}</span>
                      <span class="tl-year">{{ getAnio(historia.fecha) }}</span>
                    </div>
                    <div class="tl-card-header">
                      <h4 class="tl-title green-title">Receta emitida en Consulta #{{ historia.id }}</h4>
                      <p class="tl-motivo treatment-text-bold">{{ historia.tratamiento || 'Sin tratamiento registrado' }}</p>
                    </div>
                  </div>
                  <div class="tl-card-body" v-if="historia.observaciones">
                    <div class="tl-field">
                      <span class="tl-field-label text-green">
                        <FileTextIcon :size="11" style="margin-right:3px;vertical-align:middle;" />
                        Indicaciones y Observaciones
                      </span>
                      <span class="tl-field-value">{{ historia.observaciones }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <aside class="sidebar">
          <div class="sidebar-card vitals-card">
            <div class="sidebar-card-header">
              <div class="sidebar-card-icon-wrap teal">
                <HeartPulseIcon :size="16" />
              </div>
              <h3>Signos Vitales</h3>
              <span class="sidebar-card-sub" v-if="historiasOrdenadas.length > 0">Última consulta</span>
            </div>

            <div v-if="historiasOrdenadas.length > 0" class="vitals-grid">
              <div class="vital-item">
                <div class="vital-icon"><ActivityIcon :size="14" /></div>
                <div class="vital-value">{{ historiasOrdenadas[historiasOrdenadas.length - 1].presion_arterial || '—' }}</div>
                <div class="vital-label">Presión <span>mmHg</span></div>
              </div>
              <div class="vital-item">
                <div class="vital-icon"><ThermometerIcon :size="14" /></div>
                <div class="vital-value">{{ historiasOrdenadas[historiasOrdenadas.length - 1].temperatura || '—' }}</div>
                <div class="vital-label">Temp. <span>°C</span></div>
              </div>
              <div class="vital-item">
                <div class="vital-icon"><WindIcon :size="14" /></div>
                <div class="vital-value">{{ historiasOrdenadas[historiasOrdenadas.length - 1].saturacion || '—' }}</div>
                <div class="vital-label">SpO₂ <span>%</span></div>
              </div>
              <div class="vital-item">
                <div class="vital-icon"><ScaleIcon :size="14" /></div>
                <div class="vital-value">{{ historiasOrdenadas[historiasOrdenadas.length - 1].peso || '—' }}</div>
                <div class="vital-label">Peso <span>kg</span></div>
              </div>
              <div class="vital-item">
                <div class="vital-icon"><RulerIcon :size="14" /></div>
                <div class="vital-value">{{ historiasOrdenadas[historiasOrdenadas.length - 1].talla || '—' }}</div>
                <div class="vital-label">Talla <span>m</span></div>
              </div>
            </div>
            <p v-else class="no-data">Sin registros de signos vitales.</p>
          </div>

          <div class="sidebar-card">
            <div class="sidebar-card-header">
              <div class="sidebar-card-icon-wrap blue">
                <BarChart2Icon :size="16" />
              </div>
              <h3>Resumen</h3>
            </div>
            <div class="resumen-list">
              <div class="resumen-stat">
                <span class="resumen-num">{{ historiasOrdenadas.length }}</span>
                <span class="resumen-desc">Consultas totales</span>
              </div>
              <div class="resumen-stat">
                <span class="resumen-num">{{ historiasOrdenadas.filter(h => h.tratamiento).length }}</span>
                <span class="resumen-desc">Recetas emitidas</span>
              </div>
              <div class="resumen-stat" v-if="historiasOrdenadas.length > 0">
                <span class="resumen-num small">{{ formatearFecha(historiasOrdenadas[historiasOrdenadas.length - 1].fecha) }}</span>
                <span class="resumen-desc">Última consulta</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <VerDetalleHistorial
      :mostrar="mostrarModalDetalle"
      :cargando="cargandoDetalle"
      :error="errorDetalle"
      :historia="historiaDetalle"
      @cerrar="cerrarModalDetalle"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useVerHistorialClinico } from '../composables/useVerHistorialClinico'
import { useVerHistoriaClinica } from '../composables/useVerHistoriaClinica'
import VerDetalleHistorial from '../components/VerDetalleHistorial.vue'

import {
  DownloadIcon,
  ArrowRightIcon,
  ClipboardListIcon,
  PillIcon,
  FileTextIcon,
  ThermometerIcon,
  StethoscopeIcon,
  HeartPulseIcon,
  ActivityIcon,
  WindIcon,
  ScaleIcon,
  RulerIcon,
  BarChart2Icon,
} from 'lucide-vue-next'

const props = defineProps({ id: { type: String, required: true } })

const {
  datosPaciente,
  historias,
  cargando,
  errorHistorial,
  cargarHistorial,
} = useVerHistorialClinico()

const {
  historiaDetalle,
  cargandoDetalle,
  errorDetalle,
  mostrarModalDetalle,
  cargarYVerDetalle,
  cerrarModalDetalle,
} = useVerHistoriaClinica()

const historiasOrdenadas = computed(() => {
  if (!historias.value) return []
  return [...historias.value].sort((a, b) => {
    if (a.fecha !== b.fecha) {
      return a.fecha.localeCompare(b.fecha)
    }
    return a.id - b.id
  })
})

const tabActiva = ref('consultas')
const tabs = [
  { id: 'consultas', nombre: 'Consultas', icon: StethoscopeIcon },
  { id: 'recetas',   nombre: 'Recetas',   icon: PillIcon },
]

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function getDia(f)  { return f ? new Date(f + 'T00:00:00').getDate() : '' }
function getMes(f)  { return f ? MESES[new Date(f + 'T00:00:00').getMonth()] : '' }
function getAnio(f) { return f ? new Date(f + 'T00:00:00').getFullYear() : '' }

function formatearFecha(f) {
  if (!f) return ''
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(new Date(f + 'T00:00:00'))
}

function getInitials(n, a) {
  return ((n?.[0] ?? '') + (a?.[0] ?? '')).toUpperCase()
}

const exportarPDF = () => window.print()

onMounted(() => cargarHistorial(props.id))
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@400;500;700&display=swap');

.hc-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 14px 28px 60px;
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
}

.hc-root { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Loading ── */
.estado-loading {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; padding: 80px;
  color: #64748b; font-size: 15px;
}
.loading-pulse {
  width: 40px; height: 40px; border-radius: 50%;
  border: 3px solid #e2e8f0; border-top-color: #059669;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-banner {
  background: #fef2f2; color: #dc2626; padding: 14px 18px;
  border-radius: 12px; font-size: 14px; border-left: 4px solid #dc2626;
}

/* ══ HEADER ══ */
.hc-header {
  background: #ffffff; border-radius: 16px;
  margin-bottom: 24px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
}
.header-accent-bar {
  height: 4px;
  background: linear-gradient(90deg, #059669, #10b981, #34d399);
}
.header-inner {
  display: flex; align-items: center; gap: 20px; padding: 18px 24px;
}
.patient-avatar {
  width: 56px; height: 56px; border-radius: 12px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white; font-size: 1.25rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-family: 'Sora', sans-serif; letter-spacing: 0.5px;
}
.header-text { flex: 1; }
.header-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: #059669; margin: 0 0 2px;
}
.patient-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem; font-weight: 700; color: #0f172a;
  margin: 0 0 8px; line-height: 1.2;
}

.header-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  padding: 4px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 6px;
}
.chip-id    { background: #f0fdf4; color: #166534; }
.chip-ci    { background: #f0f9ff; color: #075985; }
.chip-count { background: #fffbeb; color: #92400e; }
.chip-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #166534;
}

.btn-export {
  display: flex; align-items: center; gap: 8px;
  background: rgba(13, 148, 136, 1); color: white; border: none;
  padding: 10px 16px; border-radius: 10px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; flex-shrink: 0;
}
.btn-export:hover { background: #1e293b; transform: translateY(-1px); }

/* ══ LAYOUT ══ */
.hc-layout {
  display: grid; grid-template-columns: 1fr 320px;
  gap: 24px; align-items: start;
}

.main-section {
  background: #ffffff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
}

/* ── Tabs ── */
.tabs-nav {
  display: flex; border-bottom: 1px solid #e2e8f0;
  padding: 0 16px; background: #f8fafc; gap: 2px;
}
.tab-btn {
  padding: 14px 16px; border: none; background: none;
  font-family: 'Sora', sans-serif;
  font-size: 13px; font-weight: 600; color: #64748b;
  cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.2s; display: flex; align-items: center; gap: 7px;
  margin-bottom: -1px;
}
.tab-btn:hover  { color: #0f172a; }
.tab-btn.active { color: #059669; border-bottom-color: #059669; }

.tab-pane { padding: 24px; }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 52px 20px; color: #94a3b8; gap: 12px;
}
.empty-icon-svg { opacity: 0.35; }

/* ══ TIMELINE ══ */
.timeline { display: flex; flex-direction: column; }
.tl-item {
  display: flex; gap: 16px;
  animation: fadeUp 0.4s ease both;
  animation-delay: var(--delay, 0s);
}
.tl-node-col {
  display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 40px;
}
.tl-index {
  width: 36px; height: 36px; border-radius: 10px;
  background: #f0fdf4; color: #166534;
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  border: 1px solid #bbf7d0;
}
.tl-index.green { background: #d1fae5; color: #065f46; }

.tl-line {
  width: 2px; flex: 1; min-height: 24px;
  background: #e2e8f0;
  margin: 8px 0;
}

/* ── Timeline Card Profesional ── */
.tl-card {
  flex: 1; background: rgba(121, 192, 164, 0.42); border: 1px solid #e2e8f0;
  border-radius: 14px; overflow: hidden; margin-bottom: 20px;
  transition: all 0.2s;
}
.tl-card:hover { border-color: #10b981; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.rx-card { border-left: 4px solid #10b981; }

.tl-card-top {
  display: flex; align-items: center; gap: 16px; padding: 16px;
}
.tl-date-badge {
  display: flex; flex-direction: column; align-items: center;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 10px; padding: 8px; min-width: 100px;
  text-align: center; flex-shrink: 0;
}
.tl-date-badge.green { border-color: #bbf7d0; background: #f0fdf4; }
.tl-day   { font-size: 1.2rem; font-weight: 800; color: #0f172a; line-height: 1; }
.tl-month { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #059669; margin: 2px 0; }
.tl-year  { font-size: 10px; color: #94a3b8; }

.tl-card-header { flex: 1; min-width: 0; }
.tl-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px; font-family: 'Sora', sans-serif; }
.tl-title span { color: #059669; }
.green-title { color: #166534; }
.tl-motivo { font-size: 13px; color: #475569; margin: 0; }

.btn-ver-detalle {
  display: flex; align-items: center; gap: 6px;
  background: #f8fafc; border: 1px solid #e2e8f0; color: #475569;
  padding: 8px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; flex-shrink: 0;
}
.btn-ver-detalle:hover { background: #059669; color: white; border-color: #059669; }

/* ── Módulos Internos: Diagnóstico y Tratamiento ── */
.tl-card-body {
  display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #e2e8f0; background: rgba(121, 192, 164, 0.42);
}
.tl-field {
  padding: 14px 16px ; background: rgba(121, 192, 164, 0.42);
}
.border-teal { border-right: 1px solid #e2e8f0; }
.bg-soft-green { background-color: rgba(121, 192, 164, 0.42); }

.tl-field-label {
  display: block; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.text-blue { color: #0284c7; }
.text-green { color:#0284c7;}

.tl-field-value { font-size: 13px; color: #334155; line-height: 1.4; display: block; }
.tl-field-value.highlight { color: #0f172a; font-weight: 600; }
.treatment-text { color: #0f172a; font-weight: 500; font-style: italic; }
.treatment-text-bold { font-weight: 600; color: #111827; }

/* ══ SIDEBAR ══ */
.sidebar { display: flex; flex-direction: column; gap: 20px; }
.sidebar-card {
  background: rgba(21, 158, 236, 0.12); border-radius: 16px; padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.sidebar-card-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
}
.sidebar-card-icon-wrap {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.sidebar-card-icon-wrap.teal   { background: #f0fdf4; color: #059669; }
.sidebar-card-icon-wrap.blue   { background: #f0f9ff; color: #0284c7; }

.sidebar-card-header h3 {
  font-size: 12px; font-weight: 700; color: #0f172a; margin: 0; flex: 1;
  text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Sora', sans-serif;
}
.sidebar-card-sub { font-size: 11px; color: #94a3b8; }

.vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.vital-item {
  background: #f8fafc; border-radius: 10px; padding: 10px;
  border: 1px solid #e2e8f0; text-align: center;
}
.vital-icon { color: #059669; margin-bottom: 2px; display: flex; justify-content: center; }
.vital-value { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.vital-label { font-size: 11px; color: #64748b; margin-top: 2px; }
.vital-label span { color: #94a3b8; font-size: 10px; }

.resumen-list { display: flex; flex-direction: column; }
.resumen-stat {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid #f1f5f9;
}
.resumen-stat:last-child { border-bottom: none; }
.resumen-num { font-size: 1.25rem; font-weight: 700; color: #059669; }
.resumen-num.small { font-size: 0.95rem; color: #0f172a; }
.resumen-desc { font-size: 12px; color: #64748b; }
.no-data { color: #94a3b8; font-size: 13px; font-style: italic; margin: 0; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hc-layout { grid-template-columns: 1fr; }
  .sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
}
@media (max-width: 640px) {
  .hc-page { padding: 12px 16px; }
  .header-inner { flex-wrap: wrap; gap: 12px; }
  .btn-export { width: 100%; justify-content: center; }
  .sidebar { grid-template-columns: 1fr; }
  .tl-card-top { flex-wrap: wrap; gap: 10px; }
  .tl-card-body { grid-template-columns: 1fr; }
  .border-teal { border-right: none; border-bottom: 1px solid #e2e8f0; }
}
</style>