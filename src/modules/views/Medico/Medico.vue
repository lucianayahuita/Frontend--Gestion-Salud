<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">
            ¡Hola, Dr/a. {{ nombreMedico }}! 
            <Hand class="icon-hand" :size="28" :stroke-width="2.5" />
          </h1>
          <p class="page-sub">Tienes {{ citas.length }} consultas pendientes en tu agenda.</p>
        </div>
      </div>
    </div>

    <section class="appointments-container">
      <div class="section-header">
        <h2 class="section-title">Cronograma de Consultas</h2>
        <span class="count-tag">{{ citas.length }} Total</span>
      </div>

      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Actualizando agenda...</p>
      </div>
      
      <div v-else class="appointments-list">
        <div v-for="cita in citas" :key="cita.id" class="appointment-card-horizontal">
          <div class="card-left-info">
            <div class="time-block">
              <Clock :size="16" />
              <span>{{ cita.hora.substring(0, 5) }}</span>
            </div>
            <div class="date-block">
              <span class="day">{{ obtenerDiaNumero(cita.fecha) }}</span>
              <span class="month">{{ obtenerMesCorta(cita.fecha) }}</span>
            </div>
          </div>

          <div class="card-main-content">
            <div class="patient-avatar">
              {{ cita.paciente.nombre.charAt(0) }}
            </div>
            <div class="patient-info">
              <h3 class="patient-name">
                {{ cita.paciente.nombre }} {{ cita.paciente.apellido }} {{ cita.paciente.segundo_apellido || '' }}
              </h3>
              <p class="patient-id">Ci: {{ cita.paciente.ci }}</p>
            </div>
          </div>

          <div class="card-status-area">
            <span :class="['status-badge', esHoy(cita.fecha) ? 'today' : 'upcoming']">
              {{ esHoy(cita.fecha) ? 'Hoy' : 'Próximamente' }}
            </span>
            <button class="btn-action">Ver historial</button>
          </div>
        </div>

        <div v-if="citas.length === 0" class="empty-state">
          <p>No se encontraron citas para los próximos días.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Hand, Clock, Calendar } from 'lucide-vue-next';
import api from '@/api/axios.js';

const nombreMedico = ref('');
const citas = ref([]);
const cargando = ref(true);
const fechaActual = ref('');

const cargarDatos = async () => {
  cargando.value = true;
  try {
    const { data: userData } = await api.get('/me');
    nombreMedico.value = userData.data.name.split(' ')[0];
    
    const { data: citasData } = await api.get(`/medicos/${userData.data.id}/citas`);
    citas.value = citasData.data;
  } catch (err) {
    console.error('Error al cargar la API:', err);
  } finally {
    cargando.value = false;
  }
};

// Helpers para fechas
const esHoy = (f) => f === new Date().toISOString().split('T')[0];
const obtenerDiaNumero = (f) => new Date(f + 'T00:00:00').getDate();
const obtenerMesCorta = (f) => new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(f + 'T00:00:00')).replace('.', '');

onMounted(() => {
  cargarDatos();
  fechaActual.value = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.dashboard { padding: 30px; font-family: 'DM Sans', sans-serif; background: #f4f7f6; min-height: 100vh; }

/* Header */
.welcome-card {
  background: #0f7a5a;
  padding: 30px 40px;
  border-radius: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(15, 122, 90, 0.2);
}
.welcome-title { font-family: 'Sora', sans-serif; font-size: 28px; margin: 0; display: flex; align-items: center; gap: 15px; }
.header-date { background: rgba(255,255,255,0.15); padding: 10px 20px; border-radius: 14px; display: flex; align-items: center; gap: 10px; font-size: 14px; }

/* Citas List */
.appointments-container { max-width: 10000px; margin: 0 auto; }
.section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.section-title { font-family: 'Sora', sans-serif; font-size: 20px; color: #1a2b2e; margin: 0; }
.count-tag { background: #1D9E75; color: white; padding: 2px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.appointments-list { display: flex; flex-direction: column; gap: 16px; }

/* Card Horizontal */
.appointment-card-horizontal {
  background: white;
  border-radius: 20px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  border: 1.5px solid #eef2f1;
  transition: transform 0.2s ease;
}
.appointment-card-horizontal:hover { transform: scale(1.01); border-color: #b2e8d6; }

/* Parte izquierda: Fecha y Hora */
.card-left-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 25px;
  border-right: 1.5px solid #f0f4f3;
  min-width: 80px;
}
.time-block { display: flex; align-items: center; gap: 5px; color: #0d7a63; font-weight: 700; font-size: 14px; margin-bottom: 5px; }
.date-block { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.date-block .day { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; color: #1a2b2e; }
.date-block .month { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #7a9aaa; }

/* Parte central: Paciente */
.card-main-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-left: 25px;
}
.patient-avatar {
  width: 50px; height: 50px; border-radius: 15px; background: #edfaf5; color: #1D9E75;
  display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700;
}
.patient-name { font-family: 'Sora', sans-serif; font-size: 16px; color: #1a2b2e; margin: 0; }
.patient-id { font-size: 12px; color: #7a9aaa; margin: 4px 0 0; }

/* Parte derecha: Status y Botón */
.card-status-area {
  display: flex;
  align-items: center;
  gap: 20px;
}
.status-badge { padding: 6px 14px; border-radius: 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.status-badge.today { background: #d6f5eb; color: #0d7a63; }
.status-badge.upcoming { background: #eef4fb; color: #2563eb; }

.btn-action {
  background: rgba(13, 148, 136, 1); color: white; border: none; padding: 10px 20px; border-radius: 12px;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s;
}
.btn-action:hover { background: #0f7a5a; }

/* Animación de la mano */
.icon-hand { animation: wave 2s infinite; transform-origin: bottom right; }
@keyframes wave {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
}

@media (max-width: 768px) {
  .appointment-card-horizontal { flex-direction: column; align-items: flex-start; gap: 15px; }
  .card-left-info { border-right: none; border-bottom: 1.5px solid #f0f4f3; width: 100%; padding: 0 0 10px 0; flex-direction: row; justify-content: space-between; }
  .card-main-content { padding-left: 0; }
  .card-status-area { width: 100%; justify-content: space-between; }
}
</style>