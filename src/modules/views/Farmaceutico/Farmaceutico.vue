<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">
            ¡Hola, {{ nombreFarmaceutica }}! 
            <Hand class="icon-hand" :size="28" :stroke-width="2.5" />
          </h1>
          <p class="page-sub">Tienes {{ recetasPendientes.length }} recetas médicas en cola esperando tu validación y despacho.</p>
        </div>
        <div class="header-date">
          <Calendar :size="18" />
          <span>{{ fechaActual }}</span>
        </div>
      </div>
    </div>

    <section class="appointments-container">
      <div class="section-header">
        <h2 class="section-title">Cola de Recetas por Validar</h2>
        <span class="count-tag">{{ recetasPendientes.length }} Pendientes</span>
      </div>

      <div class="appointments-list">
        <div v-for="receta in recetasPendientes" :key="receta.id" class="appointment-card-horizontal">
          
          <div class="card-left-info">
            <div class="time-block">
              <Clock :size="15" />
              <span>{{ receta.horaEmitida }}</span>
            </div>
            <div class="date-block">
              <span class="day">{{ receta.prioridad }}</span>
            </div>
          </div>

          <div class="card-main-content">
            <div class="patient-avatar">
              <Pill :size="22" />
            </div>
            <div class="patient-info">
              <h3 class="patient-name">{{ receta.medicamento }}</h3>
              <p class="patient-id"><strong>Paciente:</strong> {{ receta.paciente }}</p>
              <p class="doctor-sub"><strong>Prescribe:</strong> {{ receta.medico }}</p>
            </div>
          </div>

          <div class="card-status-area">
            <span :class="['status-badge', receta.stockDisponible ? 'today' : 'upcoming']">
              {{ receta.stockDisponible ? 'Stock Disponible' : 'Stock Crítico' }}
            </span>
            
            <button class="btn-action" @click="validarReceta(receta.id)">
              Validar y Despachar
            </button>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Hand, Clock, Calendar, Pill } from 'lucide-vue-next';

const nombreFarmaceutica = ref('Farmacéutica de Turno');
const fechaActual = ref('');

const recetasPendientes = ref([
  {
    id: 1,
    medicamento: 'Amoxicilina + Ácido Clavulánico 875/125mg',
    paciente: 'Laura Torrico Melgar',
    medico: 'Dr. Sergio Rostrán (Pediatría)',
    horaEmitida: '08:15',
    prioridad: 'ALTA',
    stockDisponible: true
  },
  {
    id: 2,
    medicamento: 'Insulina Glargina 100 UI/ml (Inyectable)',
    paciente: 'Carlos Mendoza Mendoza',
    medico: 'Dra. Elena Rioja (Endocrinología)',
    horaEmitida: '08:42',
    prioridad: 'CRÍTICA',
    stockDisponible: false
  },
  {
    id: 3,
    medicamento: 'Metformina 850mg (60 Comprimidos)',
    paciente: 'Juana Vda. de Quispe',
    medico: 'Dr. Carlos Martínez (Medicina General)',
    horaEmitida: '09:05',
    prioridad: 'MEDIA',
    stockDisponible: true
  }
]);

const validarReceta = (id) => {
  alert(`Procesando validación del lote para la receta N°: ${id}`);
};

onMounted(() => {
  fechaActual.value = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');

.dashboard { 
  padding: 30px; 
  font-family: 'DM Sans', sans-serif; 
  background: #f4f7f6; 
  min-height: 100vh; 
  color: #1a2b2e;
}

/* ── HEADER & WELCOME CARD ── */
.welcome-card {
  background: linear-gradient(135deg, #12634c 0%, #0a4132 100%);
  padding: 35px 40px;
  border-radius: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  box-shadow: 0 12px 35px rgba(18, 99, 76, 0.15);
  position: relative;
  overflow: hidden;
}

.welcome-title { 
  font-family: 'Sora', sans-serif; 
  font-size: 28px; 
  font-weight: 700;
  margin: 0; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  letter-spacing: -0.02em;
}

.page-sub {
  margin: 8px 0 0 0;
  font-size: 14.5px;
  color: #b9ebd9;
}

.header-date { 
  background: rgba(255, 255, 255, 0.12); 
  backdrop-filter: blur(4px);
  padding: 10px 18px; 
  border-radius: 14px; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 13.5px; 
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-transform: capitalize;
}

/* ── CONTENEDOR RECTAS ── */
.appointments-container { 
  max-width: 1200px; 
  margin: 0 auto; 
}

.section-header { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  margin-bottom: 22px; 
}

.section-title { 
  font-family: 'Sora', sans-serif; 
  font-size: 20px; 
  font-weight: 600;
  color: #1a2b2e; 
  margin: 0; 
}

.count-tag { 
  background: #1D9E75; 
  color: white; 
  padding: 3px 12px; 
  border-radius: 30px; 
  font-size: 11.5px; 
  font-weight: 600; 
}

.appointments-list { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}

/* ── CARDS HORIZONTALES FARMACIA ── */
.appointment-card-horizontal {
  background: white;
  border-radius: 20px;
  padding: 18px 28px;
  display: flex;
  align-items: center;
  border: 1px solid #e3ede9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.appointment-card-horizontal:hover { 
  transform: translateY(-2px); 
  border-color: #addccb; 
  box-shadow: 0 8px 20px rgba(18, 99, 76, 0.05);
}

/* Sección izquierda (Hora y Prioridad) */
.card-left-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 28px;
  border-right: 1.5px solid #edf3f1;
  min-width: 90px;
}

.time-block { 
  display: flex; 
  align-items: center; 
  gap: 5px; 
  color: #12634c; 
  font-weight: 700; 
  font-size: 14px; 
  margin-bottom: 6px; 
}

.date-block .day { 
  font-family: 'Sora', sans-serif; 
  font-size: 11px; 
  font-weight: 700; 
  color: #6b8896; 
  background: #f0f4f3;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

/* Sección Central (Medicamento y Paciente) */
.card-main-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 22px;
  padding-left: 28px;
}

.patient-avatar {
  width: 48px; 
  height: 48px; 
  border-radius: 14px; 
  background: #eefaf6; 
  color: #1d9e75;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border: 1px solid #dbf3ea;
  flex-shrink: 0;
}

.patient-name { 
  font-family: 'Sora', sans-serif; 
  font-size: 16px; 
  font-weight: 600;
  color: #1a2b2e; 
  margin: 0; 
}

.patient-id { 
  font-size: 13px; 
  color: #4a5e68; 
  margin: 4px 0 0; 
}

.doctor-sub {
  font-size: 12px;
  color: #7a94a0;
  margin: 2px 0 0;
}

/* Sección Derecha (Stock y Botón) */
.card-status-area {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-badge { 
  padding: 6px 14px; 
  border-radius: 10px; 
  font-size: 11px; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 0.02em;
}
.status-badge.today { background: #d6f5eb; color: #0d7a63; }
.status-badge.upcoming { background: #fff0f0; color: #de4343; }

.btn-action {
  background: #12634c; 
  color: white; 
  border: none; 
  padding: 10px 22px; 
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: background 0.2s;
}

.btn-action:hover { 
  background: #094132; 
}

/* Animación del saludo */
.icon-hand { 
  animation: wave 2.2s infinite; 
  transform-origin: 70% 70%; 
  display: inline-block;
}

@keyframes wave {
  0%, 100% { transform: rotate(0); }
  12% { transform: rotate(14deg); }
  24% { transform: rotate(-8deg); }
  36% { transform: rotate(10deg); }
  48% { transform: rotate(-4deg); }
  60% { transform: rotate(0); }
}

/* Responsive */
@media (max-width: 850px) {
  .appointment-card-horizontal { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 20px; 
    padding: 20px;
  }
  .card-left-info { 
    border-right: none; 
    border-bottom: 1.5px solid #edf3f1; 
    width: 100%; 
    padding: 0 0 14px 0; 
    flex-direction: row; 
    justify-content: space-between; 
    min-width: auto;
  }
  .time-block { margin-bottom: 0; }
  .card-main-content { padding-left: 0; width: 100%; }
  .card-status-area { width: 100%; justify-content: space-between; }
  .welcome-card { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header-date { width: 100%; justify-content: center; box-sizing: border-box; }
}
</style>