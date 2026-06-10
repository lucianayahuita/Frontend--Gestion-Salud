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
            <div v-if="cargandoRecetas" class="estado-loading-recetas">
              <div class="loading-pulse-recetas"></div>
              <span>Obteniendo recetas médicas actualizadas...</span>
            </div>

            <p v-else-if="errorRecetas" class="error-banner">{{ errorRecetas }}</p>

            <div v-else-if="recetas.length === 0" class="empty-state">
              <PillIcon :size="48" class="empty-icon-svg" />
              <p>No hay recetas médicas vinculadas al historial de este paciente.</p>
            </div>

            <div v-else class="timeline">
              <div
                v-for="(receta, index) in recetas"
                :key="'rx-api-' + receta.id"
                class="tl-item"
                :style="{ '--delay': index * 0.07 + 's' }"
              >
                <div class="tl-node-col">
                  <div class="tl-index green">Rx</div>
                  <div class="tl-line" v-if="index < recetas.length - 1"></div>
                </div>
                
                <div class="tl-card rx-card">
                  <div class="tl-card-top">
                    <div class="tl-date-badge green">
                      <span class="tl-day">{{ getDia(receta.cita?.fecha) }}</span>
                      <span class="tl-month">{{ getMes(receta.cita?.fecha) }}</span>
                      <span class="tl-year">{{ getAnio(receta.cita?.fecha) }}</span>
                    </div>
                    
                    <div class="tl-card-header">
                      <div class="rx-header-meta">
                        <h4 class="tl-title green-title">Receta Médica <span>#{{ receta.id }}</span></h4>
                        <span :class="['estado-despacho-badge', receta.estado_despacho]">
                          <component 
                            :is="receta.estado_despacho === 'despachada' ? CheckCircle2Icon : ClockIcon" 
                            :size="10" 
                          />
                          {{ receta.estado_despacho }}
                        </span>
                      </div>
                      <p class="tl-motivo treatment-text-bold">
                        <strong>Medicamento:</strong> {{ receta.medicamento?.nombre }}
                      </p>
                      <p class="rx-subtext">Emitido en Cita #{{ receta.cita_id }} (Médico #{{ receta.cita?.medico_id }})</p>
                    </div>
                  </div>

                  <div class="tl-card-body">
                    <div class="tl-field border-teal">
                      <span class="tl-field-label text-blue">
                        <PillIcon :size="11" style="margin-right:4px;vertical-align:middle;" />
                        Posología y Duración
                      </span>
                      <span class="tl-field-value highlight">
                        Dosis: {{ receta.dosis }} <br>
                        Frecuencia: {{ receta.frecuencia }}
                      </span>
                      <span class="rx-duracion-tag">Tratamiento por: {{ receta.duracion }}</span>
                    </div>
                    
                    <div class="tl-field bg-soft-green">
                      <span class="tl-field-label text-green">
                        <FileTextIcon :size="11" style="margin-right:4px;vertical-align:middle;" />
                        Indicaciones
                      </span>
                      <span class="tl-field-value treatment-text">
                        {{ receta.indicaciones || 'Sin indicaciones adicionales' }}
                      </span>
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
                <span class="resumen-num">{{ recetas.length }}</span>
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
import { ref, computed, onMounted, watch } from 'vue'

import { useVerHistorialClinico } from '../composables/useVerHistorialClinico'
import { useVerHistoriaClinica } from '../composables/useVerHistoriaClinica'
// IMPORTAMOS EL NUEVO COMPOSABLE DE RECETAS
import { useVerRecetasPaciente } from '../composables/useVerRecetasPaciente'
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
  Clock as ClockIcon,
  CheckCircle2 as CheckCircle2Icon
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

const {
  recetas,
  cargandoRecetas,
  errorRecetas,
  cargarRecetas
} = useVerRecetasPaciente()

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

watch(tabActiva, (nuevaTab) => {
  if (nuevaTab === 'recetas' && recetas.value.length === 0) {
    cargarRecetas(props.id)
  }
})

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

const exportarPDF = () => {
  const paciente = datosPaciente.value
  const historias = historiasOrdenadas.value
  const listaRecetas = recetas.value
  const fechaHoy = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(new Date())

  const seccionConsultas = historias.map((h, i) => `
    <div class="bloque">
      <p class="consulta-titulo">Consulta ${String(i + 1).padStart(2, '0')} &nbsp;·&nbsp; #${h.id} &nbsp;·&nbsp; ${formatearFecha(h.fecha)}</p>

      <p class="etiqueta">Motivo de consulta</p>
      <p class="valor">${h.motivo_consulta || '—'}</p>

      <p class="etiqueta">Diagnóstico</p>
      <p class="valor">${h.diagnostico || 'Pendiente de diagnóstico'}</p>

      <p class="etiqueta">Tratamiento / Medicación</p>
      <p class="valor">${h.tratamiento || 'Sin tratamiento indicado'}</p>

      ${h.enfermedad_actual ? `
      <p class="etiqueta">Enfermedad actual / Síntomas</p>
      <p class="valor">${h.enfermedad_actual}</p>
      ` : ''}

      ${(h.presion_arterial || h.temperatura || h.saturacion || h.peso || h.talla) ? `
      <p class="etiqueta">Signos vitales</p>
      <p class="valor">
        ${h.presion_arterial ? `Presión: ${h.presion_arterial} mmHg &nbsp;&nbsp;` : ''}
        ${h.temperatura      ? `Temperatura: ${h.temperatura} °C &nbsp;&nbsp;`   : ''}
        ${h.saturacion       ? `SpO₂: ${h.saturacion}% &nbsp;&nbsp;`             : ''}
        ${h.peso             ? `Peso: ${h.peso} kg &nbsp;&nbsp;`                 : ''}
        ${h.talla            ? `Talla: ${h.talla} m`                             : ''}
      </p>
      ` : ''}
    </div>
    ${i < historias.length - 1 ? '<hr class="separador">' : ''}
  `).join('')

  const seccionRecetas = listaRecetas.map((r, i) => `
    <div class="bloque">
      <p class="consulta-titulo">
        Receta #${r.id} &nbsp;·&nbsp; ${formatearFecha(r.cita?.fecha)} &nbsp;·&nbsp;
        <span class="estado-${r.estado_despacho}">${(r.estado_despacho || '').toUpperCase()}</span>
      </p>

      <p class="etiqueta">Medicamento</p>
      <p class="valor">${r.medicamento?.nombre || '—'}</p>

      <p class="etiqueta">Dosis</p>
      <p class="valor">${r.dosis || '—'}</p>

      <p class="etiqueta">Frecuencia</p>
      <p class="valor">${r.frecuencia || '—'}</p>

      <p class="etiqueta">Duración</p>
      <p class="valor">${r.duracion || '—'}</p>

      <p class="etiqueta">Indicaciones</p>
      <p class="valor">${r.indicaciones || 'Sin indicaciones adicionales'}</p>
    </div>
    ${i < listaRecetas.length - 1 ? '<hr class="separador">' : ''}
  `).join('')

  const html = `
    <div id="pdf-root">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, #pdf-root { font-family: Arial, sans-serif; color: #1a1a1a; font-size: 12px; line-height: 1.6; }

        .cabecera { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 2px solid #059669; }
        .cabecera-eyebrow { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #059669; margin-bottom: 4px; }
        .cabecera-nombre { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .cabecera-meta { font-size: 10px; color: #555; }
        .cabecera-fecha { font-size: 10px; color: #888; margin-top: 4px; }

        .seccion-titulo {
          font-size: 11px; font-weight: bold; text-transform: uppercase;
          letter-spacing: 0.5px; color: #059669;
          border-left: 3px solid #059669; padding-left: 8px;
          margin: 20px 0 12px;
        }

        .bloque { margin-bottom: 10px; }
        .consulta-titulo { font-size: 12px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }

        .etiqueta { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.4px; color: #0284c7; margin-top: 6px; margin-bottom: 2px; }
        .valor { font-size: 11px; color: #334155; }

        /* ── Estado receta ── */
        .estado-despachada { color: #047857; font-weight: bold; }
        .estado-pendiente  { color: #b45309; font-weight: bold; }

        .separador { border: none; border-top: 1px solid #e2e8f0; margin: 14px 0; }

        .pie { margin-top: 24px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #aaa; text-align: center; }
      </style>

      <!-- Cabecera -->
      <div class="cabecera">
        <p class="cabecera-eyebrow">Historia Clínica</p>
        <p class="cabecera-nombre">${paciente.nombre} ${paciente.apellido} ${paciente.segundo_apellido || ''}</p>
        <p class="cabecera-meta">Paciente #${paciente.id} &nbsp;·&nbsp; CI ${paciente.ci} &nbsp;·&nbsp; ${historias.length} consulta(s) &nbsp;·&nbsp; ${listaRecetas.length} receta(s)</p>
        <p class="cabecera-fecha">Generado el ${fechaHoy}</p>
      </div>

      <!-- Consultas -->
      ${historias.length > 0 ? `
        <p class="seccion-titulo">Consultas Médicas (${historias.length})</p>
        ${seccionConsultas}
      ` : ''}

      <!-- Recetas -->
      ${listaRecetas.length > 0 ? `
        <p class="seccion-titulo">Recetas Médicas (${listaRecetas.length})</p>
        ${seccionRecetas}
      ` : ''}

      <p class="pie">Gestión Salud &nbsp;·&nbsp; Historia Clínica de ${paciente.nombre} ${paciente.apellido}</p>
    </div>
  `

  const contenedor = document.createElement('div')
  contenedor.innerHTML = html
  contenedor.style.position = 'absolute'
  contenedor.style.left = '-9999px'
  document.body.appendChild(contenedor)

  import('html2pdf.js').then(({ default: html2pdf }) => {
    html2pdf()
      .set({
        margin:      [12, 15, 12, 15],
        filename:    `HC_${paciente.nombre}_${paciente.apellido}.pdf`,
        image:       { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(contenedor.querySelector('#pdf-root'))
      .save()
      .then(() => document.body.removeChild(contenedor))
  })
}
onMounted(() => {
  cargarHistorial(props.id)
  cargarRecetas(props.id)
})
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

.estado-loading-recetas {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 40px; color: #64748b; font-size: 14px;
}
.loading-pulse-recetas {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2.5px solid #e2e8f0; border-top-color: #10b981;
  animation: spin 0.8s linear infinite;
}

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

/* Meta-información y Badges de la Receta */
.rx-header-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}
.rx-subtext {
  font-size: 11px;
  color: #94a3b8;
  margin: 3px 0 0 0;
}
.estado-despacho-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 12px;
  letter-spacing: 0.3px;
}
.estado-despacho-badge.despachada {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.estado-despacho-badge.pendiente {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}
.rx-duracion-tag {
  display: inline-block;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #0369a1;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 6px;
}

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

/*para el pdf*/
.pdf-consulta { border:1px solid #e2e8f0; border-radius:10px; margin-bottom:14px; overflow:hidden; page-break-inside:avoid; }
      .pdf-consulta-header { display:flex; align-items:flex-start; gap:12px; padding:12px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; }
      .pdf-num { width:32px;height:32px;border-radius:8px;background:#f0fdf4;color:#166534;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #bbf7d0; }
      .pdf-num-rx { background:#d1fae5;color:#065f46; }
      .pdf-consulta-meta { font-size:13px;color:#0f172a; }
      .pdf-motivo { font-size:12px;color:#64748b;margin-top:3px; }
      .pdf-badge { font-size:10px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:10px;margin-left:8px; }
      .pdf-badge.despachada { background:#ecfdf5;color:#047857; }
      .pdf-badge.pendiente  { background:#fffbeb;color:#b45309; }
      .pdf-campos { display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#e2e8f0; }
      .pdf-campo { background:white;padding:10px 16px; }
      .pdf-campo-full { grid-column:1/-1; }
      .pdf-campo-label { display:block;font-size:10px;font-weight:700;text-transform:uppercase;color:#0284c7;margin-bottom:3px;letter-spacing:0.3px; }
      .pdf-campo-valor { font-size:13px;color:#334155; }
      .pdf-vitales { padding:12px 16px;background:#f0fdf4;border-top:1px solid #bbf7d0; }
      .pdf-vitales-title { font-size:11px;font-weight:700;text-transform:uppercase;color:#059669;display:block;margin-bottom:10px; }
      .pdf-vitales-grid { display:flex;gap:12px;flex-wrap:wrap; }
      .pdf-vital { background:white;border:1px solid #bbf7d0;border-radius:8px;padding:8px 14px;text-align:center; }
      .pdf-vital strong { display:block;font-size:14px;color:#0f172a; }
      .pdf-vital span { font-size:10px;color:#64748b; }
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