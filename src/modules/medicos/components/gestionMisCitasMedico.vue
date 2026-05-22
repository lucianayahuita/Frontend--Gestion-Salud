<template>
  <div class="dashboard-citas">
    <header class="header-section">
      <div class="welcome-box">
        <h1 class="welcome-title">Mis Citas Médicas <CalendarCheck :size="28" /></h1>
        <p class="welcome-sub">Bienvenido, Dr/a. {{ nombreMedico }}</p>
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

        <div v-if="loading" class="state-msg">Cargando agenda...</div>
        
        <div v-else-if="citasFiltradas.length > 0" class="cards-stack">
          <div v-for="cita in citasFiltradas" :key="cita.id" class="cita-card-horizontal">
            <div class="cita-time">
              <Clock :size="16" />
              <span>{{ cita.hora.substring(0, 5) }}</span>
            </div>
            
            <div class="cita-patient">
              <div class="patient-avatar">{{ cita.paciente.nombre[0].toUpperCase() }}</div>
              <div class="patient-info">
                <span class="patient-name">
                  {{ cita.paciente.nombre }} {{ cita.paciente.apellido }} {{ cita.paciente.segundo_apellido || '' }}
                </span>
                <span class="patient-id">CI: {{ cita.paciente.ci }}</span>
              </div>
            </div>

            <div class="cita-actions">
              <button class="btn-atender" @click="irARegistrarConsulta(cita)">
                Registrar consulta
              </button>
            </div>
          </div>
        </div>

        <div v-else class="state-msg empty">
          <CalendarX :size="40" />
          <p>No hay citas para esta fecha.</p>
        </div>
      </section>

      <aside class="calendar-column">
        <div class="calendar-card">
          <div class="calendar-header-box">
            <h3 class="calendar-title">Seleccionar Fecha</h3>
          </div>
          
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
              <span class="dot green"></span> Días con citas programadas
            </div>
          </div>

          <button @click="fechaFiltro = hoyStr" class="btn-reset">
            Volver a Hoy
          </button>
        </div>
      </aside>
    </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { CalendarCheck, Clock, CalendarX } from 'lucide-vue-next';
import api from '@/api/axios.js';

const router = useRouter(); 
const hoyStr = new Date().toISOString().split('T')[0];
const fechaFiltro = ref(hoyStr);
const citas = ref([]);
const loading = ref(true);
const nombreMedico = ref('');
const idMedicoLogueado = ref(null);

const cargarDatos = async () => {
  loading.value = true;
  try {
    const { data: userData } = await api.get('/me');
    nombreMedico.value = userData.data.name;
    idMedicoLogueado.value = userData.data.id; 
    
    const { data: citasData } = await api.get(`/medicos/${userData.data.id}/citas`);
    citas.value = citasData.data;
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
  console.log("Enviando cita a la ruta:", cita);
  router.push({ 
    name: 'NuevaConsulta', 
    params: { 
      id: cita.paciente.id,
      cita: JSON.stringify(cita) 
    } 
  });
};

onMounted(cargarDatos);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.dashboard-citas { padding: 30px; background: #f8faf9; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.welcome-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: linear-gradient(135deg, #0f7a5a 0%, #17a37a 100%);
  padding: 24px 32px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(15, 122, 90, 0.15);
  position: relative;
  overflow: hidden;
  flex: 1; 
  margin-right: 20px;
}

.welcome-box::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.welcome-title {
  font-family: 'Sora', sans-serif;
  font-size: 28px;
  color: white;
  font-weight: 700;
  margin: 0;
  z-index: 1;
}

.welcome-sub {
  color: rgba(237, 242, 240, 0.8);
  font-size: 15px;
  margin: 0;
  z-index: 1;
}

.main-content-layout { display: grid; grid-template-columns: 1fr 340px; gap: 30px; }

/* Cards Citas */
.appointments-column { min-width: 0; }
.filter-status { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.column-title { font-family: 'Sora', sans-serif; font-size: 18px; color: #1a2b2e; margin: 0; }
.count-pill { background: #1D9E75; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.cards-stack { display: flex; flex-direction: column; gap: 12px; }
.cita-card-horizontal {
  background: white; border-radius: 16px; padding: 16px 24px;
  display: flex; align-items: center; border: 1.5px solid #edf2f0;
  transition: all 0.2s;
}
.cita-card-horizontal:hover { border-color: #1D9E75; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

.cita-time { display: flex; align-items: center; gap: 6px; color: #0d7a63; font-weight: 700; min-width: 100px; }
.cita-patient { flex: 1; display: flex; align-items: center; gap: 15px; padding: 0 20px; border-left: 1.5px solid #f0f4f3; min-width: 0; }
.patient-avatar { width: 40px; height: 40px; border-radius: 10px; background: #e0eeea; color: #0d7a63; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.patient-info { min-width: 0; }
.patient-name { display: block; font-weight: 600; color: #1a2b2e; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; }
.patient-id { font-size: 12px; color: #7a9aaa; }

.btn-atender { background: rgba(13, 148, 136, 1); color: white; border: none; padding: 8px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-atender:hover { background: rgba(15, 118, 110, 1); }

/* Sidebar Calendario */
.calendar-card { background: white; border-radius: 20px; border: 1.5px solid #edf2f0; padding: 20px; position: sticky; top: 30px; }
.calendar-title { font-family: 'Sora', sans-serif; font-size: 16px; margin-bottom: 15px; color: #1a2b2e; }
.custom-datepicker {
  width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #e0eeea;
  font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1a2b2e; cursor: pointer; outline: none;
  margin-bottom: 20px;
}

.visual-calendar-box {
  background: #fcfdfd; border-radius: 12px; padding: 5px;
  border: 1px solid #f0f4f3;
}

.calendar-hint { margin-top: 15px; }
.hint-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #7a9aaa; }
.dot.green { width: 8px; height: 8px; background: #1D9E75; border-radius: 50%; }

.btn-reset { width: 100%; margin-top: 20px; background: #f0f7f5; color: #0d7a63; border: none; padding: 10px; border-radius: 10px; font-weight: 600; cursor: pointer; }

.state-msg { text-align: center; padding: 60px; color: #7a9aaa; }

@media (max-width: 900px) {
  .main-content-layout { grid-template-columns: 1fr; }
  .calendar-column { order: -1; }
}
</style>