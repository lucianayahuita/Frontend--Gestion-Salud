<template>
  <div class="dashboard-citas">
    
    <header class="header-section">
      <div class="welcome-box-clean">
        <h1 class="welcome-title-clean">
          Control de Citas Médicas 
          <span class="doctor-badge">Dr/a. {{ nombreMedico }}</span>
        </h1>
        <p class="welcome-sub-clean">
          Gestiona tu agenda diaria. Actualmente tienes
          <span class="count-pill">{{ citas.length }} citas programadas</span> en total.
        </p>
      </div>
    </header>

    <div class="main-content-layout">
      
      <section class="appointments-column">
        <div class="filter-status">
          <h2 class="column-title">
            {{ fechaFiltro === hoyStr ? 'Citas para Hoy' : 'Citas para el ' + formatearFechaSimple(fechaFiltro) }}
          </h2>
          <span class="count-pill">{{ citasFiltradas.length }} Consultas</span>
        </div>

        <div v-if="loading" class="state-msg">
          <div class="spinner"></div>
          <p>Cargando agenda...</p>
        </div>
        
        <div v-else-if="citasFiltradas.length > 0" class="cards-stack">
          <div 
            v-for="cita in citasFiltradas" 
            :key="cita.id" 
            :class="['cita-card-horizontal', { 'cita-expired': verificarSiCitaExpiro(cita) }]"
          >
            <div class="cita-time" :class="{ 'time-expired': verificarSiCitaExpiro(cita) }">
              <Clock :size="15" />
              <span>{{ cita.hora.substring(0, 5) }}</span>
            </div>
            
            <div class="cita-patient">
              <div :class="['patient-avatar', { 'avatar-expired': verificarSiCitaExpiro(cita) }]">
                {{ cita.paciente.nombre[0].toUpperCase() }}
              </div>
              <div class="patient-info">
                <span class="patient-name">
                  {{ cita.paciente.nombre }} {{ cita.paciente.apellido }} {{ cita.paciente.segundo_apellido || '' }}
                </span>
                <span class="patient-id">CI: {{ cita.paciente.ci }}</span>
              </div>
            </div>

            <div class="cita-actions">
              <button class="btn-inasistencia" @click="cancelarCitaCtx.abrirModal(cita)">
                No asistió
              </button>
              
              <button 
                :disabled="verificarSiCitaExpiro(cita)" 
                :class="['btn-atender', { 'btn-atender-disabled': verificarSiCitaExpiro(cita) }]" 
                @click="irARegistrarConsulta(cita)"
              >
                {{ verificarSiCitaExpiro(cita) ? 'Expirada' : 'Registrar consulta' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="state-msg empty">
          <CalendarX :size="36" class="icon-empty" />
          <h3>No hay citas programadas</h3>
          <p>Tu agenda para la fecha seleccionada se encuentra libre.</p>
        </div>
      </section>

      <aside class="calendar-column">
        
        <div class="calendar-card">
          <h3 class="side-panel-title">Seleccionar Fecha</h3>
          
          <div class="calendar-wrapper">
            <input 
              type="date" 
              v-model="fechaFiltro" 
              class="custom-datepicker"
            />
          </div>

          <div class="visual-calendar-box">
            <VDatePicker 
              :attributes="attributes"
              expanded
              borderless
              transparent
              locale="es"
              :key="fechaFiltro" 
            />
          </div>

          <div class="calendar-hint">
            <div class="hint-item">
              <span class="dot green"></span> Días con citas pendientes
            </div>
          </div>

          <button @click="fechaFiltro = hoyStr" class="btn-reset">
            Volver a Hoy
          </button>
        </div>

        <div class="chart-card">
          <h3 class="side-panel-title">Tendencia de Demanda</h3>
          <p class="chart-subtitle">Historial de citas por mes este año</p>
          
          <div class="chart-container">
            <div v-if="loadingChart" class="chart-loading">
              <div class="spinner mini"></div>
            </div>
            <Line v-else :data="chartData" :options="chartOptions" />
          </div>
        </div>

      </aside>
    </div>

    <ModalCancelarCita 
      :is-open="cancelarCitaCtx.isOpen.value"
      :cita="cancelarCitaCtx.citaSeleccionada.value"
      :loading="cancelarCitaCtx.loading.value"
      :error-message="cancelarCitaCtx.error.value"
      @close="cancelarCitaCtx.cerrarModal"
      @confirm="cancelarCitaCtx.ejecutarCancelacion(recargarAgendaTrasCancelacion)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'; 
import { Clock, CalendarX } from 'lucide-vue-next';
import api from '@/api/axios.js';

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js'

import ModalCancelarCita from '../components/ModalCancelarCita.vue';
import { useCancelarCita } from '../composables/useCancelarCita.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const router = useRouter(); 
const hoyStr = new Date().toISOString().split('T')[0];
const fechaFiltro = ref(hoyStr);
const citas = ref([]);
const loading = ref(true);
const loadingChart = ref(true);
const nombreMedico = ref('');
const idMedicoLogueado = ref(null);
const horaActualReactiva = ref(new Date());
let intervaloReloj = null;

const cancelarCitaCtx = useCancelarCita();

const chartData = ref({ labels: [], datasets: [] });
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f0f4f2' }, ticks: { font: { family: 'DM Sans', size: 10 }, stepSize: 1 } },
    x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 10 } } }
  }
};

// EVALUADOR COMPARTIDO DE EXPIRACIÓN DE CITAS
const verificarSiCitaExpiro = (cita) => {
  if (!cita.fecha || !cita.hora) return false;
  const fechaCitaObj = new Date(`${cita.fecha}T${cita.hora.substring(0, 5)}:00`);
  return fechaCitaObj < horaActualReactiva.value;
};

const recargarAgendaTrasCancelacion = async () => {
  if (idMedicoLogueado.value) {
    const { data: citasData } = await api.get(`/medicos/${idMedicoLogueado.value}/citas`);
    citas.value = citasData.data || [];
    procesarEstadisticasCitas();
  }
};

const procesarEstadisticasCitas = () => {
  loadingChart.value = true;
  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const conteoMensual = Array(12).fill(0);

  citas.value.forEach(cita => {
    if (cita.fecha) {
      const mesIdx = new Date(cita.fecha + 'T00:00:00').getMonth();
      if (mesIdx >= 0 && mesIdx <= 11) {
        conteoMensual[mesIdx]++;
      }
    }
  });

  const mesActual = new Date().getMonth();
  let mesesFiltro = [];
  for (let i = 5; i >= 0; i--) {
    let target = mesActual - i;
    if (target < 0) target += 12;
    mesFiltro.push(target);
  }

  chartData.value = {
    labels: mesesFiltro.map(idx => mesesNombres[idx]),
    datasets: [
      {
        label: 'Citas Totales',
        data: mesesFiltro.map(idx => conteoMensual[idx]),
        borderColor: '#1D9E75',
        backgroundColor: 'rgba(29, 158, 117, 0.06)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#1D9E75',
        pointRadius: 4
      }
    ]
  };
  loadingChart.value = false;
};

const cargarDatos = async () => {
  loading.value = true;
  try {
    const { data: userData } = await api.get('/me');
    nombreMedico.value = userData.data.name;
    idMedicoLogueado.value = userData.data.id; 
    
    const { data: citasData } = await api.get(`/medicos/${userData.data.id}/citas`);
    citas.value = citasData.data || [];
    procesarEstadisticasCitas();
  } catch (err) {
    console.error('Error al cargar datos de la agenda:', err);
  } finally {
    loading.value = false;
  }
};

const attributes = computed(() => {
  const pendientes = citas.value.filter(
    cita => cita.estado && cita.estado.toLowerCase() === 'pendiente'
  );

  return [
    {
      highlight: { color: 'green', fillMode: 'light' },
      dates: new Date(fechaFiltro.value + 'T12:00:00'),
    },
    ...pendientes.map(cita => ({
      dot: 'green',
      dates: new Date(cita.fecha + 'T12:00:00'),
    }))
  ];
});

const citasFiltradas = computed(() => {
  return citas.value.filter(c => {
    const coincideFecha = c.fecha === fechaFiltro.value;
    const esPendiente = c.estado && c.estado.toLowerCase() === 'pendiente';
    return coincideFecha && esPendiente;
  });
});

const formatearFechaSimple = (f) => {
  if (!f) return '';
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(f + 'T00:00:00'));
};

const irARegistrarConsulta = (cita) => {
  if (verificarSiCitaExpiro(cita)) return; 
  router.push({ 
    name: 'NuevaConsulta', 
    params: { 
      id: cita.paciente.id,
      cita: JSON.stringify(cita) 
    } 
  });
};

onMounted(() => {
  cargarDatos();
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

.dashboard-citas { padding: 4px; background: #f4f7f6; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: #1a2b2e; }

.header-section { margin-bottom: 28px; border-bottom: 1.5px solid #eef2f1; padding-bottom: 16px; }
.welcome-box-clean { display: flex; flex-direction: column; gap: 4px; }
.welcome-title-clean { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700; color: #1a2b2e; margin: 0; display: flex; align-items: center; gap: 12px; }
.doctor-badge { font-size: 13px; background: #e0eeea; color: #0d7a63; padding: 4px 12px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600; }
.welcome-sub-clean { color: #64748b; font-size: 14px; margin: 0; }

.main-content-layout { 
  display: grid; 
  grid-template-columns: 1fr 340px; 
  gap: 30px; 
  align-items: start;
}

.appointments-column { min-width: 0; }
.filter-status { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.column-title { font-family: 'Sora', sans-serif; font-size: 17px; color: #1a2b2e; margin: 0; font-weight: 600; }
.count-pill { background: #1D9E75; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }

.cards-stack { display: flex; flex-direction: column; gap: 12px; }
.cita-card-horizontal {
  background: white; border-radius: 16px; padding: 16px 20px;
  display: flex; align-items: center; border: 1.5px solid #eef2f1;
  transition: all 0.2s ease;
}
.cita-card-horizontal:hover { transform: translateY(-2px); border-color: #1D9E75; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }

/* --- ESTILOS DE EXPIRACIÓN NUEVOS --- */
.cita-card-horizontal.cita-expired { background: #fdf2f2; border-color: #fca5a5; }
.cita-card-horizontal.cita-expired:hover { border-color: #f87171; box-shrink: 0; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.03); }

.cita-time { display: flex; align-items: center; gap: 6px; color: #0d7a63; font-weight: 700; min-width: 90px; font-size: 14px; }
.cita-time.time-expired { color: #b91c1c; }

.cita-patient { flex: 1; display: flex; align-items: center; gap: 15px; padding: 0 20px; border-left: 1.5px solid #f0f4f3; min-width: 0; }
.patient-avatar { width: 38px; height: 38px; border-radius: 10px; background: #edfaf5; color: #1D9E75; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Sora', sans-serif; flex-shrink: 0; }
.patient-avatar.avatar-expired { background: #fee2e2; color: #dc2626; }

.patient-name { display: block; font-weight: 600; color: #1a2b2e; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.patient-id { font-size: 12px; color: #7a9aaa; }

.cita-actions { display: flex; gap: 10px; align-items: center; }

.btn-inasistencia { background: white; color: #dc2626; border: 1.5px solid #fee2e2; padding: 8px 14px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; }
.btn-inasistencia:hover { background: #fef2f2; border-color: #fca5a5; }

.btn-atender { background: #0d9488; color: white; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; white-space: nowrap; }
.btn-atender:hover { background: #0f7a5a; }

/* MODIFICACIONES BOTÓN DESHABILITADO */
.btn-atender-disabled { background: #94a3b8 !important; color: #ffffff; cursor: not-allowed; opacity: 0.7; }

.calendar-column { 
  position: sticky; 
  top: 24px; 
  display: flex;
  flex-direction: column;
  gap: 20px; 
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}
.calendar-column::-webkit-scrollbar { width: 4px; }
.calendar-column::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.calendar-card, .chart-card { background: white; border-radius: 20px; border: 1.5px solid #eef2f1; padding: 20px; }

.side-panel-title { font-family: 'Sora', sans-serif; font-size: 15px; margin: 0 0 14px 0; color: #1a2b2e; font-weight: 600; }
.custom-datepicker {
  width: 100%; padding: 10px; border-radius: 10px; border: 1.5px solid #e0eeea;
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a2b2e; cursor: pointer; outline: none;
  margin-bottom: 16px; background: #fafdfc;
}
.visual-calendar-box { background: #fafdfc; border-radius: 12px; padding: 4px; border: 1px solid #eef2f1; }

.calendar-hint { margin-top: 12px; }
.hint-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #7a9aaa; }
.dot.green { width: 7px; height: 7px; background: #1D9E75; border-radius: 50%; }

.btn-reset { width: 100%; margin-top: 16px; background: #f0f7f5; color: #0d7a63; border: none; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 12.5px; cursor: pointer; transition: 0.15s; }
.btn-reset:hover { background: #e0eeea; }

.chart-subtitle { font-size: 12px; color: #7a9aaa; margin: -10px 0 16px 0; }
.chart-container { height: 140px; position: relative; }
.chart-loading { display: flex; align-items: center; justify-content: center; height: 100%; }

.state-msg { text-align: center; padding: 50px 30px; color: #7a9aaa; }
.state-msg.empty { background: white; border-radius: 20px; border: 2px dashed #cbd5e1; display: flex; flex-direction: column; align-items: center; }
.state-msg h3 { font-family: 'Sora', sans-serif; font-size: 15px; margin: 12px 0 4px 0; color: #1e293b; }
.state-msg p { font-size: 13px; margin: 0; }
.icon-empty { color: #94a3b8; }

.spinner { width: 24px; height: 24px; border: 3px solid #dbf3ea; border-top-color: #0f7a5a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
.spinner.mini { width: 18px; height: 18px; border-width: 2px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 950px) {
  .main-content-layout { grid-template-columns: 1fr; }
  .calendar-column { position: static; max-height: none; }
}
</style>