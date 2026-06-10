<template>
  <div class="reportes-container">
    
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Analíticas y Reportes</h1>
        <p class="dashboard-sub">Conoce los principales reportes del sistema</p>
      </div>
    </div>

    <div class="metrics-grid">
      <div 
        class="metric-card" 
        :class="{ 'metric-card--active': reporteSeleccionado === 'productividad' }"
        @click="seleccionarReporte('productividad', '/reportes/productividad-medica')"
      >
        <div class="metric-icon metric-icon--green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Rendimiento</span>
          <h3 class="metric-value">Productividad Médica</h3>
        </div>
      </div>

      <div 
        class="metric-card" 
        :class="{ 'metric-card--active': reporteSeleccionado === 'despacho' }"
        @click="seleccionarReporte('despacho', '/reportes/medicamentos-mas-prescritos-por-periodo')"
      >
        <div class="metric-icon metric-icon--blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Distribución</span>
          <h3 class="metric-value">Gestion de Farmacia</h3>
        </div>
      </div>

      <div 
        class="metric-card" 
        :class="{ 'metric-card--active': reporteSeleccionado === 'citas' }"
        @click="seleccionarReporte('citas', '/reportes/pacientes-atendidos-por-medico')"
      >
        <div class="metric-icon metric-icon--purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="metric-info">
          <span class="metric-label">Control Operativo</span>
          <h3 class="metric-value">Gestión de Citas</h3>
        </div>
      </div>
    </div>

    <div class="analytics-section">
      <div class="analytics-card">
        
        <div class="analytics-header">
          <h2 class="section-title">{{ tituloReporteActivo }}</h2>
          
          <div class="filter-box">
            <template v-if="reporteSeleccionado === 'productividad' || reporteSeleccionado === 'citas'">
              <div class="filter-input-group">
                <label>Médico:</label>
                <select v-model="filtros.medico_id" @change="fetchDatosReporte" class="custom-select">
                  <option value="" disabled>Seleccione un médico...</option>
                  <option v-for="medico in medicos" :key="medico.id" :value="medico.id">
                    Dr(a). {{ medico.name }}
                  </option>
                </select>
              </div>
            </template>

            <template v-if="reporteSeleccionado === 'despacho'">
              <div class="filter-input-group">
                <label>Mostrar Top:</label>
                <select v-model.number="filtros.top" @change="fetchDatosReporte" class="custom-select">
                  <option :value="3">Los 3 más prescritos</option>
                  <option :value="5">Los 5 más prescritos</option>
                  <option :value="10">Los 10 más prescritos</option>
                </select>
              </div>
            </template>

            <div class="filter-input-group">
              <label>Desde:</label>
              <input type="date" v-model="filtros.fecha_inicio" @change="fetchDatosReporte" class="custom-date" />
            </div>
            <div class="filter-input-group">
              <label>Hasta:</label>
              <input type="date" v-model="filtros.fecha_fin" @change="fetchDatosReporte" class="custom-date" />
            </div>
          </div>
        </div>

        <!-- ── Botones de subreportes por sección ── -->
        <div v-if="reporteSeleccionado === 'productividad'" class="subreportes-row">
          <span class="subreportes-label">Reportes detallados:</span>
          <button class="btn-subreporte btn-green" @click="abrirModal('recetasMedico')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round"/>
              <path d="M14 2v6h6M12 18v-6M9 15h6" stroke-linecap="round"/>
            </svg>
            Recetas emitidas por médico
          </button>
          <button class="btn-subreporte btn-blue" @click="abrirModal('medicamentosMedico')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Medicamentos más prescritos por médico
          </button>
        </div>

        <div v-if="reporteSeleccionado === 'citas'" class="subreportes-row">
          <span class="subreportes-label">Reportes detallados:</span>
          <button class="btn-subreporte btn-purple" @click="abrirModal('citasPorMedico')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke-linecap="round"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round"/>
            </svg>
            Total de citas por médico
          </button>
          <button class="btn-subreporte btn-red" @click="abrirModal('tasaCancelacion')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke-linecap="round"/>
            </svg>
            Tasa de cancelación de citas
          </button>
        </div>

        <div v-if="reporteSeleccionado === 'despacho'" class="subreportes-row subreportes-wrap">
          <span class="subreportes-label">Reportes detallados:</span>
          <button class="btn-subreporte btn-green" @click="abrirModal('recetasPorMedico')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-linecap="round"/>
              <path d="M14 2v6h6" stroke-linecap="round"/>
            </svg>
            Recetas emitidas por médico
          </button>
          <button class="btn-subreporte btn-teal" @click="abrirModal('recetasPorPaciente')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round"/>
            </svg>
            Recetas por paciente
          </button>
          <button class="btn-subreporte btn-blue" @click="abrirModal('balanceEstado')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M3 3v18h18" stroke-linecap="round"/>
              <path d="M7 16l4-4 4 4 4-6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Balance por estado de despacho
          </button>
          <button class="btn-subreporte btn-purple" @click="abrirModal('recetasFarmaceutico')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v4m0 0l-8-4m8 4l8-4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Recetas despachadas por farmacéutico
          </button>
          <button class="btn-subreporte btn-orange" @click="abrirModal('medicamentosPeriodo')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round"/>
            </svg>
            Medicamentos más prescritos por periodo
          </button>
          <button class="btn-subreporte btn-red" @click="abrirModal('stockBajo')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Alertas de stock bajo
          </button>
        </div>

        <!-- Contenido principal -->
        <div v-if="loading" class="state-container">
          <div class="spinner"></div>
          <p>Consultando métricas en tiempo real...</p>
        </div>

        <div v-else-if="(reporteSeleccionado === 'productividad' || reporteSeleccionado === 'citas') && !filtros.medico_id" class="state-container">
          <p class="empty-text">Por favor seleccione un médico para evaluar su rendimiento y gestión.</p>
        </div>

        <div v-else-if="datosReporte.length === 0" class="state-container">
          <p class="empty-text">No se encontraron registros en el sistema para los parámetros configurados.</p>
        </div>

        <div v-else class="data-layout">
          <div class="graph-wrapper" :class="{ 'graph-wrapper--centered': reporteSeleccionado === 'productividad' || reporteSeleccionado === 'citas' }">
            <div class="chart-container" :style="reporteSeleccionado === 'productividad' || reporteSeleccionado === 'citas' ? 'max-width: 600px;' : ''">
              <Bar v-if="reporteSeleccionado === 'productividad' && chartData" :data="chartData" :options="chartOptionsGeneral" />
              <Bar v-if="reporteSeleccionado === 'despacho' && chartData" :data="chartData" :options="chartOptionsDespacho" />
              <Bar v-if="reporteSeleccionado === 'citas' && chartData" :data="chartData" :options="chartOptionsGeneral" />
            </div>
          </div>

          <div class="table-wrapper">
            <table class="report-table">
              <thead>
                <tr>
                  <th>Métrica / Concepto Analizado</th>
                  <th class="text-right">Valor Obtenido</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="reporteSeleccionado === 'productividad'">
                  <tr>
                    <td>Citas Médicas Completadas</td>
                    <td class="text-right font-bold text-green">{{ resProductividad.citas_completadas }}</td>
                  </tr>
                  <tr>
                    <td>Recetas Emitidas</td>
                    <td class="text-right font-bold text-blue">{{ resProductividad.recetas_emitidas }}</td>
                  </tr>
                  <tr class="row-highlight">
                    <td>Índice Global de Productividad</td>
                    <td class="text-right font-bold text-purple">{{ resProductividad.indice_productividad }}</td>
                  </tr>
                </template>

                <template v-else-if="reporteSeleccionado === 'citas'">
                  <tr>
                    <td>Pacientes Únicos Atendidos</td>
                    <td class="text-right font-bold text-teal">{{ resCitas.total_pacientes_unicos }} pac.</td>
                  </tr>
                  <tr>
                    <td>Total de Citas Completadas</td>
                    <td class="text-right font-bold text-purple">{{ resCitas.total_citas_completadas }} citas</td>
                  </tr>
                  <tr class="row-highlight">
                    <td>Promedio de Citas por Paciente</td>
                    <td class="text-right font-bold text-blue">
                      {{ resCitas.total_pacientes_unicos > 0 ? (resCitas.total_citas_completadas / resCitas.total_pacientes_unicos).toFixed(1) : 0 }}
                    </td>
                  </tr>
                </template>

                <template v-else>
                  <tr v-for="(item, idx) in datosReporte" :key="idx">
                    <td>
                      <span class="rank-badge">{{ idx + 1 }}</span>
                      {{ item.medicamento_nombre || item.medicamento || item.nombre || item.detalle }}
                    </td>
                    <td class="text-right font-bold text-blue">
                      {{ item.total_prescripciones ?? item.cantidad ?? 0 }} rec.
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Modales placeholder ── -->
    <Teleport to="body">
      <div
        v-if="modalActivo && 
              modalActivo !== 'recetasMedico' && 
              modalActivo !== 'recetasPorMedico' && 
              modalActivo !== 'recetasPorPaciente' && 
              modalActivo !== 'recetasFarmaceutico' && 
              modalActivo !== 'medicamentosPeriodo' &&
              modalActivo !== 'stockBajo' &&
              modalActivo !== 'citasPorMedico' &&
              modalActivo !== 'tasaCancelacion'" 
        class="modal-overlay"
        @click.self="cerrarModal"
      >
      </div>
    </Teleport>

    <ModalRecetasEmitidasPorMedico
      v-if="modalActivo === 'recetasMedico' || modalActivo === 'recetasPorMedico'"
      :fecha-desde="filtros.fecha_inicio"
      :fecha-hasta="filtros.fecha_fin"
      @close="cerrarModal"
    />
    
    <ModalMedicamentosMasPrescritosPorMedico
      v-if="modalActivo === 'medicamentosMedico'"
      :fecha-desde="filtros.fecha_inicio"
      :fecha-hasta="filtros.fecha_fin"
      @close="cerrarModal"
    />

    <ModalMedicamentosMasPrescritosPorPeriodo
      v-if="modalActivo === 'medicamentosPeriodo'"
      :is-open="modalActivo === 'medicamentosPeriodo'"
      :fecha-desde="filtros.fecha_inicio"
      :fecha-hasta="filtros.fecha_fin"
      :top="filtros.top"
      @close="cerrarModal"
    />
    
    <ModalRecetasEmitidasPorPaciente
      v-if="modalActivo === 'recetasPorPaciente'"
      :is-open="modalActivo === 'recetasPorPaciente'"
      :fecha-desde="filtros.fecha_inicio"
      :fecha-hasta="filtros.fecha_fin"
      @close="cerrarModal"
    />
    
    <ModalBalanceRecetas 
      v-if="modalActivo === 'balanceEstado'"
      :is-open="modalActivo === 'balanceEstado'" 
      :fecha-desde="filtros.fecha_inicio"
      :fecha-hasta="filtros.fecha_fin"
      @close="cerrarModal" 
    />

    <ModalRecetasDespachadasPorFarmaceutico
      v-if="modalActivo === 'recetasFarmaceutico'"
      :is-open="modalActivo === 'recetasFarmaceutico'"
      :fecha-desde="filtros.fecha_inicio"
      :fecha-hasta="filtros.fecha_fin"
      @close="cerrarModal"/>
    
    <ModalAlertaStockBajo 
      v-if="modalActivo === 'stockBajo'"
      :is-open="modalActivo === 'stockBajo'"
      @close="cerrarModal"/>

    <ModalCitasPorMedico 
      v-if="modalActivo === 'citasPorMedico'" 
      :is-open="modalActivo === 'citasPorMedico'" 
      @close="cerrarModal" 
    />
    <ModalTasaCancelacion 
      v-if="modalActivo === 'tasaCancelacion'" 
      :is-open="modalActivo === 'tasaCancelacion'" 
      @close="cerrarModal" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../../api/axios.js';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import ModalRecetasEmitidasPorMedico from './ModalRecetasEmitidasPorMedico.vue';
import ModalMedicamentosMasPrescritosPorMedico from './ModalMedicamentosMasPreescritosPorMedico.vue';
import ModalRecetasEmitidasPorPaciente from './ModalRecetasEmitidasPorPaciente.vue';
import ModalBalanceRecetas from './ModalBalanceRecetas.vue';
import ModalRecetasDespachadasPorFarmaceutico from './ModalRecetasDespachadasPorFarmaceutico.vue';
import ModalMedicamentosMasPrescritosPorPeriodo from './ModalMedicamentosMasPrescritosPorPeriodo.vue';
import ModalAlertaStockBajo from './ModalAlertaStockBajo.vue'; 
import ModalCitasPorMedico from './ModalCitasPorMedico.vue';
import ModalTasaCancelacion from './ModalTasaCancelacionPorMedico.vue'; 
ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, CategoryScale, LinearScale);

const reporteSeleccionado = ref('productividad');
const endpointActivo = ref('/reportes/productividad-medica');
const loading = ref(false);
const datosReporte = ref([]);
const modalActivo = ref(null);

const titulosModales = {
  recetasMedico:        'Recetas emitidas por médico',
  medicamentosMedico:   'Medicamentos más prescritos por médico',
  citasPorMedico:       'Total de citas por médico',
  tasaCancelacion:      'Tasa de cancelación de citas',
  recetasPorMedico:     'Recetas emitidas por médico',
  recetasPorPaciente:   'Recetas por paciente',
  balanceEstado:        'Balance de recetas por estado de despacho',
  recetasFarmaceutico:  'Recetas despachadas por farmacéutico',
  medicamentosPeriodo:  'Medicamentos más prescritos por periodo',
  stockBajo:            'Alertas de medicamentos con stock bajo',
};

const abrirModal = (tipo) => { modalActivo.value = tipo; };
const cerrarModal = () => { modalActivo.value = null; };

const resProductividad = ref({ citas_completadas: 0, recetas_emitidas: 0, indice_productividad: 0 });
const resCitas = ref({ total_pacientes_unicos: 0, total_citas_completadas: 0 });
const medicos = ref([]);
const filtros = ref({
  fecha_inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  fecha_fin: new Date().toISOString().split('T')[0],
  medico_id: '',
  top: 3
});

const tituloReporteActivo = computed(() => {
  if (reporteSeleccionado.value === 'productividad') return 'Análisis de Datos: Productividad Médica';
  if (reporteSeleccionado.value === 'despacho') return `Análisis de Datos: Top ${filtros.value.top} Medicamentos Más Prescritos`;
  return 'Análisis de Datos: Gestión de Citas y Pacientes Atendidos';
});

const cargarPersonal = async () => {
  try {
    const { data } = await api.get('/users');
    const usuarios = data.data || data;
    if (Array.isArray(usuarios)) {
      medicos.value = usuarios.filter(u => String(u.row_id || u.rol_id) === '2');
      if (medicos.value.length > 0) filtros.value.medico_id = medicos.value[0].id;
    }
  } catch (error) {
    console.error('Error inicializando catálogo médico:', error);
  }
};

const seleccionarReporte = (tipo, endpoint) => {
  reporteSeleccionado.value = tipo;
  endpointActivo.value = endpoint;
  fetchDatosReporte();
};

const fetchDatosReporte = async () => {
  if ((reporteSeleccionado.value === 'productividad' || reporteSeleccionado.value === 'citas') && !filtros.value.medico_id) return;
  loading.value = true;
  try {
    let params = {};
    if (reporteSeleccionado.value === 'productividad') {
      params = { medico_id: filtros.value.medico_id, fecha_desde: filtros.value.fecha_inicio, fecha_hasta: filtros.value.fecha_fin };
    } else if (reporteSeleccionado.value === 'despacho') {
      params = { fecha_desde: filtros.value.fecha_inicio, fecha_hasta: filtros.value.fecha_fin, top: filtros.value.top };
    } else if (reporteSeleccionado.value === 'citas') {
      params = { medico_id: filtros.value.medico_id, fecha_desde: filtros.value.fecha_inicio, fecha_hasta: filtros.value.fecha_fin };
    }

    const { data } = await api.get(endpointActivo.value, { params });
    let respuestaLimpia = data.data !== undefined ? data.data : data;

    if (reporteSeleccionado.value === 'productividad') {
      resProductividad.value = {
        citas_completadas: respuestaLimpia.citas_completadas ?? 0,
        recetas_emitidas: respuestaLimpia.recetas_emitidas ?? 0,
        indice_productividad: respuestaLimpia.indice_productividad ?? 0
      };
      datosReporte.value = [1];
    } else if (reporteSeleccionado.value === 'despacho') {
      datosReporte.value = respuestaLimpia.ranking || [];
    } else if (reporteSeleccionado.value === 'citas') {
      resCitas.value = {
        total_pacientes_unicos: respuestaLimpia.total_pacientes_unicos ?? 0,
        total_citas_completadas: respuestaLimpia.total_citas_completadas ?? 0
      };
      datosReporte.value = [1];
    }
  } catch (error) {
    console.error('Error procesando reporte analítico:', error);
    datosReporte.value = [];
  } finally {
    loading.value = false;
  }
};

const chartData = computed(() => {
  if (reporteSeleccionado.value === 'productividad') {
    return {
      labels: ['Citas Completadas', 'Recetas Emitidas', 'Índice Productividad'],
      datasets: [{ label: 'Métricas', backgroundColor: ['#1D9E75', '#2563eb', '#8b5cf6'], borderRadius: 6, barThickness: 45, data: [resProductividad.value.citas_completadas, resProductividad.value.recetas_emitidas, resProductividad.value.indice_productividad] }]
    };
  }
  if (!datosReporte.value || datosReporte.value.length === 0) return null;
  if (reporteSeleccionado.value === 'despacho') {
    return {
      labels: datosReporte.value.map(item => item.medicamento_nombre),
      datasets: [{ label: 'Veces Prescrito', backgroundColor: '#2563eb', borderRadius: 6, barThickness: 40, data: datosReporte.value.map(item => item.total_prescripciones) }]
    };
  }
  if (reporteSeleccionado.value === 'citas') {
    return {
      labels: ['Pacientes Únicos', 'Citas Completadas'],
      datasets: [{ label: 'Volumen Operativo', backgroundColor: ['#0d9488', '#7c3aed'], borderRadius: 6, barThickness: 50, data: [resCitas.value.total_pacientes_unicos, resCitas.value.total_citas_completadas] }]
    };
  }
  return null;
});

const chartOptionsGeneral = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, grid: { color: '#edf4f1' } }, x: { grid: { display: false } } }
};
const chartOptionsDespacho = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: true, position: 'top' } },
  scales: { y: { beginAtZero: true, title: { display: true, text: 'Cantidad' }, grid: { color: '#edf4f1' } }, x: { grid: { display: false } } }
};

onMounted(async () => {
  loading.value = true;
  await cargarPersonal();
  await fetchDatosReporte();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.reportes-container {
  font-family: 'DM Sans', sans-serif;
  display: flex; flex-direction: column; gap: 5px;
  padding: 16px; color: #1a2b2e;
  background-color: #fafdfc; min-height: 100vh;
}

.dashboard-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; color: #162427; margin: 0 0 4px 0; }
.dashboard-sub { font-size: 0.74rem; color: #7a9aaa; margin: 0; }

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) { .metrics-grid { grid-template-columns: 1fr; } }

.metric-card {
  background: white; border: 1.5px solid #e8f0ed; border-radius: 16px;
  padding: 20px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; transition: all 0.25s ease;
}
.metric-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(29,158,117,0.06); }
.metric-card--active { border-color: #1D9E75; background: #f4fbf8; }

.metric-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.metric-icon svg { width: 22px; height: 22px; }
.metric-icon--green { background: #edfaf5; color: #1D9E75; }
.metric-icon--blue  { background: #eef4fb; color: #2563eb; }
.metric-icon--purple{ background: #f3eefb; color: #7c3aed; }

.metric-info { display: flex; flex-direction: column; gap: 2px; }
.metric-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #7a9aaa; font-weight: 600; }
.metric-value { font-family: 'Sora', sans-serif; font-size: 1.15rem; font-weight: 700; margin: 0; color: #1a2b2e; }

.analytics-card { background: white; border: 1.5px solid #e8f0ed; border-radius: 20px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
.analytics-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; border-bottom: 1px solid #edf4f1; padding-bottom: 16px; }
.section-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 600; color: #1a2b2e; margin: 0; }

.filter-box { display: flex; flex-wrap: wrap; gap: 16px; }
.filter-input-group { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #3d5260; }
.custom-select, .custom-date { padding: 6px 12px; border: 1px solid #dce8e4; border-radius: 8px; font-family: 'DM Sans', sans-serif; color: #1a2b2e; background-color: #fff; outline: none; }
.custom-select:focus, .custom-date:focus { border-color: #1D9E75; }

/* ── Subreportes ── */
.subreportes-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 0 18px;
  border-bottom: 1px solid #edf4f1;
  margin-bottom: 20px;
}
.subreportes-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9dbfb3;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-right: 4px;
  white-space: nowrap;
}
.btn-subreporte {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 20px;
  border: 1.5px solid;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.btn-green   { background: #edfaf5; color: #0f6e56; border-color: #a7e8d4; }
.btn-green:hover   { background: #1D9E75; color: white; border-color: #1D9E75; }
.btn-blue    { background: #eef4fb; color: #1d4ed8; border-color: #bfdbfe; }
.btn-blue:hover    { background: #2563eb; color: white; border-color: #2563eb; }
.btn-purple  { background: #f3eefb; color: #6d28d9; border-color: #ddd6fe; }
.btn-purple:hover  { background: #7c3aed; color: white; border-color: #7c3aed; }
.btn-red     { background: #fcebeb; color: #b91c1c; border-color: #fca5a5; }
.btn-red:hover     { background: #e05757; color: white; border-color: #e05757; }
.btn-teal    { background: #e6fafa; color: #0f766e; border-color: #99f6e4; }
.btn-teal:hover    { background: #0d9488; color: white; border-color: #0d9488; }
.btn-orange  { background: #fef3e2; color: #b45309; border-color: #fcd34d; }
.btn-orange:hover  { background: #d97706; color: white; border-color: #d97706; }

/* Contenido */
.data-layout { display: flex; flex-direction: column; gap: 32px; }
.graph-wrapper { background: #fbfdfc; border: 1px solid #edf4f1; border-radius: 12px; padding: 20px; width: 100%; box-sizing: border-box; }
.graph-wrapper--centered { display: flex; justify-content: center; }
.chart-container { height: 320px; width: 100%; max-width: 100%; position: relative; }

.table-wrapper { overflow-x: auto; }
.report-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.report-table th { background: rgba(13,148,136,1); color: white; padding: 14px 16px; font-weight: 600; border-bottom: 1px solid #edf4f1; }
.report-table td { padding: 14px 16px; border-bottom: 1px solid #f4f8f6; color: #3d5260; }
.report-table tbody tr:hover { background: #fafdfc; }
.row-highlight { background-color: #f9fafb; font-weight: 500; }
.rank-badge { background: #eef4fb; color: #2563eb; padding: 2px 7px; font-size: 11px; font-weight: bold; border-radius: 6px; margin-right: 8px; }

.text-right { text-align: right; }
.text-green { color: #1D9E75; } .text-blue { color: #2563eb; }
.text-purple { color: #7c3aed; } .text-teal { color: #0d9488; }
.font-bold { font-weight: 600; }

.state-container { padding: 80px 20px; text-align: center; color: #7a9aaa; font-size: 0.95rem; }
.empty-text { color: #9dbfb3; }
.spinner { width: 36px; height: 36px; border: 3.5px solid #edfaf5; border-top-color: #1D9E75; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
}
.modal-content {
  background: #fff; border-radius: 18px;
  width: 90%; max-width: 560px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid #e8f0ed;
}
.modal-header h3 {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: #1a2b2e;
}
.btn-cerrar {
  background: none; border: none; cursor: pointer;
  color: #9dbfb3; display: flex; align-items: center;
  padding: 4px; border-radius: 6px; transition: background 0.15s;
}
.btn-cerrar:hover { background: #f0f6f3; }

.modal-body-placeholder {
  padding: 48px 24px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.placeholder-icon {
  width: 72px; height: 72px;
  background: #e1f5ee; border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.placeholder-titulo {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: #1a2b2e;
}
.placeholder-sub {
  font-size: 0.85rem; color: #7a9aaa; line-height: 1.6;
}
</style>