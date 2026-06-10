<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">
            ¡Hola, {{ nombreFarmaceutica }}!
            <Hand class="icon-hand" :size="28" :stroke-width="2.5" />
          </h1>
          <p class="page-sub">Aquí tienes un resumen de la actividad farmacéutica.</p>
        </div>
      </div>
    </div>

    <section class="productivity-analytics-panel">
      <div class="analytics-header">
        <div class="analytics-title-box">
          <TrendingUp :size="20" class="analytics-icon-accent" />
          <div>
            <h2 class="analytics-main-title">Rendimiento y Productividad Mensual</h2>
            <p class="analytics-subtitle">Estadísticas de recetas médicas procesadas en los últimos meses</p>
          </div>
        </div>
        <div class="analytics-badge-total">
          <span class="badge-label">Total Histórico</span>
          <span class="badge-value">{{ totalRecetasHistoricas }} Recetas</span>
        </div>
      </div>
      
      <div class="chart-wrapper-container">
        <div class="clinical-chart-container">
          
          <div class="chart-grid-lines">
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxRecetasMes) }}</span></div>
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxRecetasMes * 0.75) }}</span></div>
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxRecetasMes * 0.5) }}</span></div>
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxRecetasMes * 0.25) }}</span></div>
            <div class="grid-line-row-base"><span class="grid-y-label">0</span></div>
          </div>

          <div class="chart-bars-timeline">
            <div 
              v-for="(mes, index) in datosProductividad" 
              :key="index" 
              class="chart-timeline-column"
            >
              <div class="bar-tooltip-bubble">{{ mes.cantidad }} uds</div>
              
              <div class="bar-geometric-track">
                <div 
                  class="bar-geometric-fill"
                  :style="{ height: `${(mes.cantidad / maxRecetasMes) * 100 || 4}%` }"
                  :class="{ 'bar-active-highlight': mes.esMesActual }"
                ></div>
              </div>
              
              <span class="axis-x-label">{{ mes.nombre }}</span>
            </div>
          </div>

        </div>
      </div>
    </section>

    <div class="dashboard-content-layout">

      <section class="panel-section">
        <div class="section-header">
          <h2 class="section-title">Alertas de Stock Crítico</h2>
          <span class="count-tag urgent">{{ stockCritico.length }} Alertas</span>
        </div>

        <div v-if="cargando" class="loading-state">
          <div class="spinner"></div>
          <p>Sincronizando almacén...</p>
        </div>

        <div v-else class="appointments-list">
          <div
            v-for="med in stockCritico"
            :key="'critico-' + med.id"
            class="appointment-card-horizontal alert-border card-compact"
          >
            <div class="card-left-info">
              <div class="time-block stock-danger">
                <span>Cant: {{ med.stock }}</span>
              </div>
              <div class="date-block">
                <span class="day-label">Mínimo: {{ med.stock_minimo || 10 }}</span>
              </div>
            </div>

            <div class="card-main-content">
              <div class="patient-avatar status-critical">
                <Pill :size="18" />
              </div>
              <div class="patient-info">
                <h3 class="patient-name">{{ med.nombre }}</h3>
                <p class="patient-id"><strong>Código:</strong> #{{ med.id }}</p>
                <p class="doctor-sub"><strong>Precio:</strong> Bs. {{ med.precio }}</p>
              </div>
            </div>

            <div class="card-status-area">
              <span class="status-badge critical">Reponer</span>
              <button class="btn-action order-btn" @click="solicitarPedido(med)">
                Pedir Lote
              </button>
            </div>
          </div>

          <div v-if="stockCritico.length === 0" class="empty-state">
            <CheckCircle :size="32" class="success-icon" />
            <p>Niveles de stock estables en todo el inventario.</p>
          </div>
        </div>
      </section>

      <section class="panel-section">
        <div class="section-header">
          <h2 class="section-title">Últimos Movimientos de Farmacia</h2>
          <span class="count-tag info">Kardex Diario</span>
        </div>

        <div v-if="cargando" class="loading-state">
          <div class="spinner"></div>
        </div>

        <div v-else class="appointments-list">
          <div
            v-for="mov in ultimosMovimientos"
            :key="'mov-' + mov.id"
            class="appointment-card-horizontal movement-border"
          >
            <div class="card-left-info">
              <div :class="['movement-type-indicator', esIngreso(mov.tipo) ? 'text-ingreso' : 'text-egreso']">
                <span class="amount-badge">
                  {{ esIngreso(mov.tipo) ? '⬆ +' : '⬇ -' }}{{ Math.abs(mov.cantidad) }}
                </span>
              </div>
              <div class="date-block">
                <span class="day-label uppercase-text">{{ mov.tipo }}</span>
              </div>
            </div>

            <div class="card-main-content">
              <div :class="['patient-avatar', esIngreso(mov.tipo) ? 'bg-ingreso' : 'bg-egreso']">
                <TrendingUp v-if="esIngreso(mov.tipo)" :size="20" />
                <TrendingDown v-else :size="20" />
              </div>
              <div class="patient-info">
                <h3 class="patient-name">{{ mov.medicamento?.nombre || 'Medicamento Sin Nombre' }}</h3>
                <p class="patient-id"><strong>Detalle:</strong> {{ mov.detalle || 'N/A' }}</p>
                <p class="doctor-sub"><strong>Registrado:</strong> {{ formatearFechaHora(mov.created_at || mov.fecha) }}</p>
              </div>
            </div>

            <div class="card-status-area">
              <span class="status-badge" :class="esIngreso(mov.tipo) ? 'badge-ingreso-pill' : 'badge-egreso-pill'">
                {{ esIngreso(mov.tipo) ? 'Entrada' : 'Salida' }}
              </span>
            </div>
          </div>

          <div v-if="ultimosMovimientos.length === 0" class="empty-state">
            <ArrowUpDown :size="32" style="color: #6b8896; margin-bottom: 8px;" />
            <p>No se registran movimientos de inventario el día de hoy.</p>
          </div>
        </div>
      </section>

      <section class="panel-section full-width-panel">
        <div class="section-header">
          <h2 class="section-title">Recetas Médicas Pendientes de Despacho</h2>
          <span class="count-tag recipes">{{ recetasPendientes.length }} Pendientes</span>
        </div>

        <div v-if="cargandoRecetas" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando recetas...</p>
        </div>

        <div v-else class="appointments-list">
          <div
            v-for="receta in recetasPendientes"
            :key="'receta-' + receta.id"
            class="appointment-card-horizontal receta-border"
          >
            <div class="card-left-info">
              <div class="time-block receta-time">
                <span>{{ receta.cita?.hora?.substring(0, 5) || '--:--' }}</span>
              </div>
              <div class="date-block">
                <span class="day-label">{{ formatearFecha(receta.cita?.fecha) }}</span>
              </div>
            </div>

            <div class="card-main-content">
              <div class="patient-avatar receta-avatar">
                <ClipboardList :size="20" />
              </div>
              <div class="patient-info">
                <h3 class="patient-name">{{ receta.medicamento?.nombre || 'Medicamento' }}</h3>
                <p class="patient-id">
                  <strong>Dosis:</strong> {{ receta.dosis || 'N/A' }} ·
                  <strong>Frecuencia:</strong> {{ receta.frecuencia || 'N/A' }} ·
                  <strong>Duración:</strong> {{ receta.duracion || 'N/A' }}
                </p>
                <p class="doctor-sub">
                  <strong>Indicaciones:</strong> {{ receta.indicaciones || 'Sin indicaciones adicionales' }}
                </p>
              </div>
            </div>

            <div class="card-status-area">
              <span class="status-badge pending-badge">Pendiente</span>
              <button class="btn-action despacho-btn" @click="abrirModalDespacho(receta)">
                <PackageCheck :size="14" />
                Despachar
              </button>
            </div>
          </div>

          <div v-if="recetasPendientes.length === 0" class="empty-state">
            <ClipboardList :size="32" style="color: #6b8896; margin-bottom: 8px;" />
            <p>No hay recetas pendientes de despacho en este momento.</p>
          </div>
        </div>
      </section>

    </div>

    <ModalDespachoReceta 
      :is-open="modalAbierto" 
      :receta="recetaSeleccionada" 
      @close="cerrarModalDespacho" 
      @saved="actualizarDatosPostDespacho" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Hand, Pill, AlertTriangle, Layers,
  CheckCircle, ArrowUpDown, TrendingUp, TrendingDown,
  ClipboardList, PackageCheck
} from 'lucide-vue-next'
import api from '@/api/axios.js'

import ModalDespachoReceta from '@/modules/farmaceuticos/components/ModalDespachoReceta.vue'

const router = useRouter()

const nombreFarmaceutica = ref('Cargando...')
const cargando           = ref(true)
const cargandoRecetas    = ref(true)

const totalMedicamentos  = ref(0)
const stockCritico       = ref([])
const ultimosMovimientos = ref([])
const recetasPendientes  = ref([])

const totalRecetasHistoricas = ref(0)
const recetasPorMesRaw       = ref(Array(12).fill(0))

const modalAbierto = ref(false)
const recetaSeleccionada = ref(null)

const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const mesActualIndex = new Date().getMonth()

const cargarDashboard = async () => {
  cargando.value = true
  try {
    const { data: resUser } = await api.get('/me')
    const usuario = resUser.data

    nombreFarmaceutica.value = usuario?.name
      ? usuario.name.split(' ')[0]
      : 'Farmacéutica'

    const { data: resMed } = await api.get('/medicamentos')
    const medicamentos = resMed.data || []
    totalMedicamentos.value = medicamentos.length
    stockCritico.value = medicamentos.filter(
      med => Number(med.stock) <= Number(med.stock_minimo || 10)
    )

    await cargarUltimosMovimientos()

  } catch (error) {
    console.error('Error cargando dashboard:', error)
    nombreFarmaceutica.value = 'Farmacéutica'
  } finally {
    cargando.value = false
  }
}

const cargarUltimosMovimientos = async () => {
  try {
    const { data: resMov } = await api.get('/movimientos-farmacia')
    ultimosMovimientos.value = (resMov.data || []).slice(0, 3)
  } catch (error) {
    console.error('Error al actualizar movimientos recientes:', error)
  }
}

const cargarRecetas = async () => {
  cargandoRecetas.value = true
  try {
    const { data } = await api.get('/recetas-medicas')
    const todas = data.data || []
    
    totalRecetasHistoricas.value = todas.length
    
    recetasPendientes.value = todas.filter(
      r => r.estado_despacho?.toLowerCase() === 'pendiente'
    )
    const contadorMeses = Array(12).fill(0)
    todas.forEach(receta => {
      const fechaRaw = receta.created_at || receta.cita?.fecha
      if (fechaRaw) {
        const fechaObj = new Date(fechaRaw)
        if (!isNaN(fechaObj.getTime())) {
          const mes = fechaObj.getMonth()
          contadorMeses[mes]++
        }
      }
    })
    recetasPorMesRaw.value = contadorMeses

  } catch (error) {
    console.error('Error cargando recetas:', error)
  } finally {
    cargandoRecetas.value = false
  }
}

const datosProductividad = computed(() => {
  const resultado = []
  for (let i = 5; i >= 0; i--) {
    let indexMes = mesActualIndex - i
    if (indexMes < 0) indexMes += 12
    
    resultado.push({
      nombre: nombresMeses[indexMes],
      cantidad: recetasPorMesRaw.value[indexMes] || 0,
      esMesActual: indexMes === mesActualIndex
    })
  }
  return resultado
})

const maxRecetasMes = computed(() => {
  const cantidades = datosProductividad.value.map(m => m.cantidad)
  const max = Math.max(...cantidades)
  return max > 0 ? max * 1.15 : 10 
})

const abrirModalDespacho = (receta) => {
  recetaSeleccionada.value = receta
  modalAbierto.value = true
}

const cerrarModalDespacho = () => {
  modalAbierto.value = false
  recetaSeleccionada.value = null
}

const actualizarDatosPostDespacho = async () => {
  await cargarRecetas()
  await cargarUltimosMovimientos()
  
  const { data: resMed } = await api.get('/medicamentos')
  const medicamentos = resMed.data || []
  stockCritico.value = medicamentos.filter(
    med => Number(med.stock) <= Number(med.stock_minimo || 10)
  )
}

const solicitarPedido = () => {
  router.push({ name: 'FarmaceuticoDisponibilidad' })
}
const esIngreso = (tipo) => tipo?.toLowerCase() === 'entrada'

const formatearFechaHora = (fechaRaw) => {
  if (!fechaRaw) return 'Hace un momento'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(fechaRaw)) + ' hrs'
}

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return '---'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(new Date(fechaRaw))
}

onMounted(() => {
  cargarDashboard()
  cargarRecetas()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');

.dashboard { padding: 5px; font-family: 'DM Sans', sans-serif; background: #f4f7f6; min-height: 100vh; color: #1a2b2e; }

/* ── Welcome ── */
.welcome-card { background: #176b10; padding: 30px 40px; border-radius: 24px; color: whitesmoke; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(17,88,67,0.15); }
.welcome-title { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; margin: 0; color: whitesmoke; display: flex; align-items: center; gap: 12px; }
.page-sub { margin: 6px 0 0; font-size: 14px; color: white; }

/* ── INTERFAZ COHERENTE DE GRÁFICO (REUTILIZANDO LÍNEAS DE MEDICO.VUE) ── */
.productivity-analytics-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  margin-bottom: 35px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}
.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}
.analytics-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}
.analytics-icon-accent {
  color: #0d9488;
}
.analytics-main-title {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}
.analytics-subtitle {
  margin: 2px 0 0;
  font-size: 13px;
  color: #64748b;
}
.analytics-badge-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: #f8fafc;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.analytics-badge-total .badge-label {
  font-size: 9px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.analytics-badge-total .badge-value {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

/* Lienzo Estilo Clínico */
.clinical-chart-container {
  height: 220px;
  position: relative;
  margin-left: 25px;
  margin-bottom: 15px;
}
.chart-grid-lines {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.grid-line-row {
  width: 100%;
  border-bottom: 1px dashed #e2e8f0;
  position: relative;
  height: 0;
}
.grid-line-row-base {
  width: 100%;
  border-bottom: 2px solid #cbd5e1;
  position: relative;
  height: 0;
}
.grid-y-label {
  position: absolute;
  left: -32px;
  top: -7px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  width: 24px;
  text-align: right;
}

/* Contenedor Línea Temporal Eje X */
.chart-bars-timeline {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  z-index: 2;
  padding: 0 10px;
}
.chart-timeline-column {
  width: 14%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  justify-content: flex-end;
}
.bar-geometric-track {
  width: 100%;
  max-width: 32px;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
.bar-geometric-fill {
  width: 100%;
  background: #cbd5e1; 
  border-radius: 4px 4px 0 0;
  transition: height 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  cursor: pointer;
}
.bar-geometric-fill:hover {
  background: #94a3b8;
}
.bar-geometric-fill.bar-active-highlight {
  background: #10b981; 
}

.bar-tooltip-bubble {
  position: absolute;
  top: -12px;
  background: #1e293b;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: scale(0.9) translateY(4px);
  transition: all 0.15s ease;
  pointer-events: none;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  z-index: 10;
}
.chart-timeline-column:hover .bar-tooltip-bubble {
  opacity: 1;
  transform: scale(1) translateY(-10px);
}
.axis-x-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-top: 12px;
  position: absolute;
  bottom: -26px;
}

/* ── Layout paneles ── */
.dashboard-content-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 30px; }
.full-width-panel { grid-column: 1 / -1; }
.panel-section { background: transparent; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.section-title { font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 600; margin: 0; color: rgba(15,122,90,1); }
.count-tag { padding: 3px 12px; border-radius: 30px; font-size: 11px; font-weight: 600; color: white; }
.count-tag.urgent  { background: #de4343; }
.count-tag.info    { background: #3b82f6; }
.count-tag.recipes { background: #9333ea; }

/* ── Cards base ── */
.appointments-list { display: flex; flex-direction: column; gap: 14px; }

.appointment-card-horizontal {
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  border: 1px solid #e3ede9;
  transition: all 0.2s ease;
}
.appointment-card-horizontal.alert-border:hover    { border-color: #fca5a5; transform: translateY(-1px); }
.appointment-card-horizontal.movement-border:hover { border-color: #bfdbfe; transform: translateY(-1px); }
.appointment-card-horizontal.receta-border         { border-left: 3px solid #9333ea; }
.appointment-card-horizontal.receta-border:hover   { border-color: #d8b4fe; transform: translateY(-1px); }

/* ── Modificador compacto ── */
.card-compact { padding: 10px 16px; border-radius: 12px; }
.card-compact .card-left-info { padding-right: 14px; min-width: 68px; }
.card-compact .time-block.stock-danger { font-size: 12px; }
.card-compact .day-label { font-size: 10px; margin-top: 2px; }
.card-compact .card-main-content { gap: 12px; padding-left: 14px; }
.card-compact .patient-avatar { width: 34px; height: 34px; border-radius: 9px; }
.card-compact .patient-name { font-size: 13px; }
.card-compact .patient-id   { font-size: 11px; }
.card-compact .doctor-sub   { font-size: 10px; }
.card-compact .btn-action   { padding: 6px 13px; font-size: 11px; border-radius: 8px; }
.card-compact .status-badge { padding: 3px 9px; font-size: 9px; }

/* ── Left column ── */
.card-left-info { display: flex; flex-direction: column; align-items: center; padding-right: 24px; border-right: 1.5px solid #edf3f1; min-width: 90px; text-align: center; }
.time-block.stock-danger { color: #de4343; font-weight: 700; font-size: 15px; }
.time-block.receta-time  { color: #9333ea; font-weight: 700; font-size: 15px; }
.amount-badge { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; }
.day-label { font-size: 11px; color: #7a94a0; font-weight: 600; margin-top: 4px; }
.uppercase-text { text-transform: uppercase; letter-spacing: 0.03em; }

/* ── Main column ── */
.card-main-content { flex: 1; display: flex; align-items: center; gap: 20px; padding-left: 24px; }
.patient-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.patient-avatar.status-critical { background: #fff0f0; color: #de4343; border: 1px solid #fecaca; }
.patient-avatar.receta-avatar   { background: #fdf4ff; color: #9333ea; border: 1px solid #e9d5ff; }
.bg-ingreso { background: #e6fbf3 !important; color: #10b981 !important; border: 1px solid #a7f3d0; }
.bg-egreso  { background: #fff1f2 !important; color: #f43f5e !important; border: 1px solid #fecdd3; }
.text-ingreso { color: #10b981 !important; }
.text-egreso  { color: #f43f5e !important; }
.patient-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; margin: 0; color: #1a2b2e; }
.patient-id   { font-size: 12.5px; color: #4a5e68; margin: 3px 0 0; }
.doctor-sub   { font-size: 11.5px; color: #7a94a0; margin: 1px 0 0; }

/* ── Actions column ── */
.card-status-area { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.status-badge { padding: 5px 12px; border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.status-badge.critical      { background: #fecaca; color: #b91c1c; }
.status-badge.pending-badge { background: #ede9fe; color: #6d28d9; }
.badge-ingreso-pill { background: #d1fae5; color: #065f46; padding: 5px 12px; border-radius: 8px; font-size: 10px; font-weight: 700; }
.badge-egreso-pill  { background: #ffe4e6; color: #991b1b; padding: 5px 12px; border-radius: 8px; font-size: 10px; font-weight: 700; }

.btn-action { border: none; padding: 9px 18px; border-radius: 10px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
.btn-action.order-btn      { background: #115843; color: white; }
.btn-action.order-btn:hover  { background: #073528; }
.btn-action.despacho-btn  { background: #7c3aed; color: white; }
.btn-action.despacho-btn:hover { background: #5b21b6; }

/* ── States ── */
.loading-state { text-align: center; padding: 40px; color: #6b8896; }
.spinner { width: 28px; height: 28px; border: 3px solid #dbf3ea; border-top-color: #115843; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { background: white; padding: 35px; border-radius: 16px; text-align: center; color: #6b8896; font-size: 13.5px; border: 1px dashed #cedcd7; }
.success-icon { color: #1d9e75; margin-bottom: 8px; }

/* ── Hand wave ── */
.icon-hand { animation: wave 2.2s infinite; transform-origin: 70% 70%; display: inline-block; }
@keyframes wave { 0%,100%{transform:rotate(0)} 12%{transform:rotate(14deg)} 24%{transform:rotate(-8deg)} 36%{transform:rotate(10deg)} 48%{transform:rotate(-4deg)} 60%{transform:rotate(0)} }

@media (max-width: 1024px) { .dashboard-content-layout { grid-template-columns: 1fr; } }
@media (max-width: 650px) {
  .appointment-card-horizontal { flex-direction: column; align-items: flex-start; gap: 16px; padding: 18px; }
  .card-left-info { border-right: none; border-bottom: 1.5px solid #edf3f1; width: 100%; padding: 0 0 10px 0; flex-direction: row; justify-content: space-between; min-width: auto; }
  .card-main-content { padding-left: 0; width: 100%; }
  .card-status-area { width: 100%; flex-direction: row; justify-content: space-between; }
}
</style>