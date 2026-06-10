<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">
            ¡Hola, Dr/a. {{ nombreMedico }}! 
            <Hand class="icon-hand" :size="28" :stroke-width="2.5" />
          </h1>
          <p class="page-sub">
            Tienes {{ citasPendientes.length }} consultas pendientes y {{ recetasEmitidas.length }} recetas registradas.
          </p>
        </div>
      </div>
    </div>

    <section class="analytics-section">
      <div class="panel-section-chart">
        <div class="section-header">
          <h2 class="section-title">Rendimiento y Productividad Mensual</h2>
          <span class="count-tag chart-tag">Métricas Clave</span>
        </div>
        <div class="chart-wrapper">
          <div v-if="cargandoChart" class="loading-state">
            <div class="spinner spinner-green"></div>
            <p>Procesando historial médico para el gráfico...</p>
          </div>
          <Bar v-else :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </section>

    <div class="dashboard-grid-layout">
      
      <section class="panel-section">
        <div class="section-header">
          <h2 class="section-title">Cronograma de Consultas</h2>
          <span class="count-tag">{{ citasPendientes.length }} Total</span>
        </div>

        <div v-if="cargando" class="loading-state">
          <div class="spinner"></div>
          <p>Actualizando agenda...</p>
        </div>
        
        <div v-else class="appointments-list">
          <div 
            v-for="cita in citasPendientes" 
            :key="cita.id" 
            :class="['appointment-card-horizontal', { 'appointment-expired': verificarSiCitaExpiro(cita) }]"
          >
            <div class="card-left-info">
              <div class="time-block" :class="{ 'time-expired': verificarSiCitaExpiro(cita) }">
                <Clock :size="14" />
                <span>{{ cita.hora.substring(0, 5) }}</span>
              </div>
              <div class="date-block">
                <span class="day">{{ obtenerDiaNumero(cita.fecha) }}</span>
                <span class="month">{{ obtenerMesCorta(cita.fecha) }}</span>
              </div>
            </div>

            <div class="card-main-content">
              <div :class="['patient-avatar', { 'avatar-expired': verificarSiCitaExpiro(cita) }]">
                {{ cita.paciente?.nombre?.charAt(0) || 'P' }}
              </div>
              <div class="patient-info">
                <h3 class="patient-name">
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                </h3>
                <p class="patient-id">Ci: {{ cita.paciente?.ci }}</p>
              </div>
            </div>

            <div class="card-status-area">
              <span v-if="verificarSiCitaExpiro(cita)" class="status-badge expired">
                Expirada
              </span>
              <span v-else :class="['status-badge', esHoy(cita.fecha) ? 'today' : 'upcoming']">
                {{ esHoy(cita.fecha) ? 'Hoy' : 'Próximamente' }}
              </span>

              <button 
                v-if="verificarSiCitaExpiro(cita)" 
                class="btn-action btn-redirect" 
                @click="irAGestionCitas"
              >
                Gestionar
              </button>
              <button 
                v-else 
                class="btn-action" 
                @click="verHistorial(cita.paciente.id)"
              >
                Historial
              </button>
            </div>
          </div>

          <div v-if="citasPendientes.length === 0" class="empty-state-card border-appointments">
            <div class="empty-icon-wrapper color-appointments">
              <Calendar :size="24" />
            </div>
            <h3>Sin consultas pendientes</h3>
            <p>Tu agenda de citas se encuentra liberada para los próximos días.</p>
          </div>
        </div>
      </section>

      <section class="panel-section">
        <div class="section-header">
          <h2 class="section-title">Recetas Emitidas Recientemente</h2>
          <span class="count-tag prescription-tag">{{ recetasEmitidas.length }} Historial</span>
        </div>

        <div v-if="cargandoRecetas" class="loading-state">
          <div class="spinner spinner-purple"></div>
          <p>Sincronizando recetas...</p>
        </div>

        <div v-else class="appointments-list">
          <div v-for="receta in recetasEmitidas" :key="'receta-' + receta.id" class="recipe-card-horizontal">
            <div class="recipe-main-content">
              <div class="recipe-icon-avatar">
                <FileText :size="20" />
              </div>
              <div class="recipe-details">
                <h3 class="medicine-title">{{ receta.medicamento?.nombre || 'Medicamento No Especificado' }}</h3>
                <p class="patient-subtext">
                  <strong>Paciente:</strong> {{ receta.cita?.paciente?.nombre }} {{ receta.cita?.paciente?.apellido }}
                </p>
                <p class="treatment-line">
                  {{ receta.dosis }} · {{ receta.frecuencia }} por {{ receta.duracion }}
                </p>
              </div>
            </div>

            <div class="recipe-status-area">
              <span :class="['pill-status', receta.estado_despacho?.toLowerCase() === 'despachada' ? 'pill-success' : 'pill-pending']">
                {{ receta.estado_despacho || 'Pendiente' }}
              </span>
              <span class="recipe-date-label">{{ formatearFechaCorta(receta.created_at || receta.cita?.fecha) }}</span>
            </div>
          </div>

          <div v-if="recetasEmitidas.length === 0" class="empty-state-card border-recipes">
            <div class="empty-icon-wrapper color-recipes">
              <FileText :size="24" />
            </div>
            <h3>No has emitido recetas</h3>
            <p>Las prescripciones médicas que registres en tus consultas aparecerán aquí.</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { Hand, Clock, Calendar, FileText } from 'lucide-vue-next';
import api from '@/api/axios.js';
import { useRouter } from 'vue-router';

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter();

const nombreMedico = ref('');
const citas = ref([]);
const recetas = ref([]);
const cargando = ref(true);
const cargandoRecetas = ref(true);
const cargandoChart = ref(true);
const fechaActual = ref('');

const horaActualReactiva = ref(new Date());
let intervaloReloj = null;

const verHistorial = (pacienteId) => {
  router.push({ name: 'HistorialClinico', params: { id: String(pacienteId) } });
};

const irAGestionCitas = () => {
  router.push('/medico/citas');
};

const citasPendientes = computed(() => {
  const hoyString = new Date().toLocaleDateString('sv-SE');
  return citas.value.filter(cita => {
    const estadosVisibles = ['pendiente', 'confirmada'];
    const esEstadoVisible = cita.estado && estadosVisibles.includes(cita.estado.toLowerCase());
    const esFechaValida = cita.fecha >= hoyString;
    return esEstadoVisible && esFechaValida;
  });
});

const recetasEmitidas = computed(() => {
  return recetas.value.slice(0, 5);
});

const verificarSiCitaExpiro = (cita) => {
  if (!cita.fecha || !cita.hora) return false;
  const fechaCitaObj = new Date(`${cita.fecha}T${cita.hora.substring(0, 5)}:00`);
  
  return fechaCitaObj < horaActualReactiva.value;
};

const chartData = ref({ labels: [], datasets: [] });
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { font: { family: 'DM Sans', size: 12, weight: '600' }, boxWidth: 12 } }
  },
  scales: {
    y: { beginAtZero: true, grid: { color: '#eef2f1' }, ticks: { font: { family: 'DM Sans' }, stepSize: 1 } },
    x: { grid: { display: false }, ticks: { font: { family: 'DM Sans' } } }
  }
};

const procesarDatosParaGrafico = () => {
  cargandoChart.value = true;
  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const conteoCitas = Array(12).fill(0);
  const conteoRecetas = Array(12).fill(0);

  citas.value.forEach(cita => {
    if (cita.fecha) {
      const mesIndex = new Date(cita.fecha + 'T00:00:00').getMonth(); 
      if (mesIndex >= 0 && mesIndex <= 11) conteoCitas[mesIndex]++;
    }
  });

  recetas.value.forEach(receta => {
    const fechaString = receta.created_at || receta.cita?.fecha;
    if (fechaString) {
      const mesIndex = new Date(fechaString).getMonth();
      if (mesIndex >= 0 && mesIndex <= 11) conteoRecetas[mesIndex]++;
    }
  });

  const mesActualIndex = new Date().getMonth();
  let indicesMesesAVisualizar = [];
  for (let i = 5; i >= 0; i--) {
    let index = mesActualIndex - i;
    if (index < 0) index += 12; 
    indicesMesesAVisualizar.push(index);
  }

  chartData.value = {
    labels: indicesMesesAVisualizar.map(idx => nombresMeses[idx]),
    datasets: [
      { label: 'Consultas Registradas', backgroundColor: '#0d9488', borderRadius: 6, data: indicesMesesAVisualizar.map(idx => conteoCitas[idx]) },
      { label: 'Recetas Emitidas', backgroundColor: '#6366f1', borderRadius: 6, data: indicesMesesAVisualizar.map(idx => conteoRecetas[idx]) }
    ]
  };
  cargandoChart.value = false;
};

const cargarDatos = async () => {
  cargando.value = true;
  try {
    const { data: userData } = await api.get('/me');
    nombreMedico.value = userData.data.name.split(' ')[0];
    
    const { data: citasData } = await api.get(`/medicos/${userData.data.id}/citas`);
    citas.value = citasData.data || [];
    
    await cargarRecetasEmitidas(userData.data.id);
    procesarDatosParaGrafico();
  } catch (err) {
    console.error('Error general al sincronizar el Dashboard:', err);
    cargandoChart.value = false;
  } finally {
    cargando.value = false;
  }
};

const cargarRecetasEmitidas = async (medicoId) => {
  cargandoRecetas.value = true;
  try {
    const { data: recetasData } = await api.get('/recetas-medicas');
    recetas.value = (recetasData.data || []).filter(receta => receta.cita?.medico_id === medicoId);
  } catch (err) {
    console.error('Error al cargar historial de recetas:', err);
  } finally {
    cargandoRecetas.value = false;
  }
};

const esHoy = (f) => f === new Date().toISOString().split('T')[0];
const obtenerDiaNumero = (f) => new Date(f + 'T00:00:00').getDate();
const obtenerMesCorta = (f) => new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(f + 'T00:00:00')).replace('.', '');
const formatearFechaCorta = (fechaRaw) => fechaRaw ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(fechaRaw)) : 'Reciente';

onMounted(() => {
  cargarDatos();
  fechaActual.value = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  // Evalúa dinámicamente cada 30 segundos si alguna cita entra en estado expirado
  intervaloReloj = setInterval(() => {
    horaActualReactiva.value = new Date();
  }, 30000);
});

onBeforeUnmount(() => {
  if (intervaloReloj) clearInterval(intervaloReloj);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');

.dashboard { padding: 4px; font-family: 'DM Sans', sans-serif; background: #f4f7f6; min-height: 100vh; color: #1a2b2e; }

.welcome-card { background: #0f7a5a; padding: 24px 32px; border-radius: 20px; color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; box-shadow: 0 10px 25px rgba(15, 122, 90, 0.15); }
.welcome-title { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 12px; }
.page-sub { margin: 4px 0 0; font-size: 13.5px; opacity: 0.9; }

.analytics-section { margin-bottom: 25px; }
.panel-section-chart { background: white; padding: 24px; border-radius: 20px; border: 1.5px solid #eef2f1; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
.chart-wrapper { height: 260px; position: relative; margin-top: 15px; }
.count-tag.chart-tag { background: #0f7a5a; }

.dashboard-grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 25px; }
.panel-section { display: flex; flex-direction: column; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.section-title { font-family: 'Sora', sans-serif; font-size: 18px; color: #1a2b2e; margin: 0; font-weight: 600; }

.count-tag { background: #1D9E75; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
.count-tag.prescription-tag { background: #6366f1; }

.appointments-list { display: flex; flex-direction: column; gap: 14px; }

.appointment-card-horizontal { background: white; border-radius: 16px; padding: 14px 20px; display: flex; align-items: center; border: 1.5px solid #eef2f1; transition: all 0.2s ease; }
.appointment-card-horizontal:hover { transform: translateY(-2px); border-color: #b2e8d6; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }

/* --- NUEVOS ESTILOS EN CASO DE CITA EXPIRADA --- */
.appointment-card-horizontal.appointment-expired { background: #fdf2f2; border-color: #fca5a5; }
.appointment-card-horizontal.appointment-expired:hover { border-color: #f87171; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.03); }

.card-left-info { display: flex; flex-direction: column; align-items: center; padding-right: 20px; border-right: 1.5px solid #f0f4f3; min-width: 75px; }
.time-block { display: flex; align-items: center; gap: 4px; color: #0d7a63; font-weight: 700; font-size: 13px; margin-bottom: 3px; }
.time-block.time-expired { color: #b91c1c; }

.date-block { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.date-block .day { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; color: #1a2b2e; }
.date-block .month { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #7a9aaa; }

.card-main-content { flex: 1; display: flex; align-items: center; gap: 16px; padding-left: 20px; }
.patient-avatar { width: 42px; height: 42px; border-radius: 12px; background: #edfaf5; color: #1D9E75; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; }
.patient-avatar.avatar-expired { background: #fee2e2; color: #dc2626; }

.patient-name { font-family: 'Sora', sans-serif; font-size: 14.5px; color: #1a2b2e; margin: 0; font-weight: 600; }
.patient-id { font-size: 12px; color: #7a9aaa; margin: 2px 0 0; }

.card-status-area { display: flex; align-items: center; gap: 14px; }
.status-badge { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.status-badge.today { background: #d6f5eb; color: #0d7a63; }
.status-badge.upcoming { background: #eef4fb; color: #2563eb; }
.status-badge.expired { background: #fee2e2; color: #b91c1c; }

.btn-action { background: #0d9488; color: white; border: none; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; white-space: nowrap; }
.btn-action:hover { background: #0f7a5a; }

/* NUEVO BOTÓN DE REDIRECCIÓN (ROJO) */
.btn-redirect { background: #dc2626; }
.btn-redirect:hover { background: #b91c1c; }

.recipe-card-horizontal { background: white; border-radius: 16px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; border: 1.5px solid #eef2f1; transition: all 0.2s ease; }
.recipe-card-horizontal:hover { transform: translateY(-2px); border-color: #c7d2fe; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }

.recipe-main-content { display: flex; align-items: center; gap: 16px; flex: 1; }
.recipe-icon-avatar { width: 42px; height: 42px; border-radius: 12px; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; }
.recipe-details { display: flex; flex-direction: column; }
.medicine-title { font-family: 'Sora', sans-serif; font-size: 14.5px; color: #1a2b2e; margin: 0; font-weight: 600; }
.patient-subtext { font-size: 12px; color: #4b5563; margin: 3px 0 1px 0; }
.treatment-line { font-size: 11.5px; color: #6b7280; font-weight: 500; }

.recipe-status-area { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; min-width: 90px; }
.pill-status { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.pill-success { background: #d1fae5; color: #065f46; }
.pill-pending { background: #fef3c7; color: #92400e; }
.recipe-date-label { font-size: 11px; color: #9ca3af; font-weight: 500; }

.empty-state-card { background: white; border-radius: 20px; padding: 40px 30px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.empty-state-card.border-appointments, .empty-state-card.border-recipes { border: 2px dashed #cbd5e1; }

.empty-icon-wrapper { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
.empty-icon-wrapper.color-appointments { background: #edfaf5; color: #1d9e75; }
.empty-icon-wrapper.color-recipes { background: #f5f3ff; color: #6366f1; }

.empty-state-card h3 { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; margin: 0 0 6px 0; color: #1e293b; }
.empty-state-card p { font-size: 12.5px; color: #64748b; margin: 0; max-width: 280px; line-height: 1.4; }

.loading-state { text-align: center; padding: 30px; color: #7a9aaa; font-size: 13px; }
.spinner { width: 24px; height: 24px; border: 3px solid #dbf3ea; border-top-color: #0f7a5a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
.spinner-purple { border-color: #e0e7ff; border-top-color: #6366f1; }
.spinner-green { border-color: #e0f2fe; border-top-color: #0d9488; }
@keyframes spin { to { transform: rotate(360deg); } }

.icon-hand { animation: wave 2.2s infinite; transform-origin: 70% 70%; display: inline-block; }
@keyframes wave { 0%,100%{transform:rotate(0)} 12%{transform:rotate(14deg)} 24%{transform:rotate(-8deg)} 36%{transform:rotate(10deg)} 48%{transform:rotate(-4deg)} }

@media (max-width: 1024px) { .dashboard-grid-layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) {
  .appointment-card-horizontal, .recipe-card-horizontal { flex-direction: column; align-items: flex-start; gap: 12px; }
  .card-left-info { border-right: none; border-bottom: 1.5px solid #f0f4f3; width: 100%; padding-bottom: 8px; flex-direction: row; justify-content: space-between; }
  .card-main-content { padding-left: 0; }
  .card-status-area, .recipe-status-area { width: 100%; flex-direction: row; justify-content: space-between; align-items: center; }
  .recipe-status-area { border-top: 1px dashed #e5e7eb; padding-top: 8px; }
}
</style>