<template>
  <div class="dashboard-container">
    <header class="dash-header">
      <div class="welcome-card-turquesa">
        <div class="welcome-content">
          <h1>
            ¡Hola, {{ userName }}! 
            <span class="hand-wrapper">
              <Hand :size="24" :stroke-width="2.5" />
            </span>
          </h1>
          <p>Aquí tienes un resumen de tus próximas citas</p>
        </div>
      </div>
    </header>

    <div class="stats-grid">
        <div class="card">
          <div :class="['card-icon-wrapper', tieneSeguro ? 'blue' : 'red-light']">
            <ShieldCheckIcon :size="22" />
          </div>
          <div class="card-content">
            <span class="card-label">VIGENCIA DE DERECHOS</span>
            <p v-if="cargandoSeguro" class="card-value">Verificando...</p>
            <template v-else>
              <p :class="['card-value', tieneSeguro ? 'status-active' : 'status-inactive']">
                {{ tieneSeguro ? 'Vigente' : 'No Vigente' }}
              </p>
              <span class="card-subtext">
                {{ tieneSeguro ? 'Seguro Social Activo' : 'Sin cobertura detectada' }}
              </span>
            </template>
        </div>
      </div>

      <div class="card">
        <div class="card-icon-wrapper orange">
          <AlarmClockIcon :size="22" />
        </div>
        <div class="card-content">
          <span class="card-label">SIGUIENTE CITA</span>
          <p class="card-value">Mañana, 09:30 AM</p>
          <span class="card-subtext">Dr. Ricardo Pérez</span>
        </div>
      </div>
    </div>
    <section class="consultas-section">
      <div class="section-header">
        <h2>Mis Próximas Consultas</h2>
        <router-link :to="{ name: 'PacienteCitas' }" class="btn-primary">
          <PlusIcon :size="18" class="icon-margin" />
          Agendar Nueva Cita
        </router-link>
      </div>

      <div class="appointment-list">
        <div v-for="i in 2" :key="i" class="appointment-card">
          <div class="date-box">
            <span class="month">MAY</span>
            <span class="day">1{{ i }}</span>
            <span class="time-tag-inner">10:00 AM</span>
          </div>
          
          <div class="info-box">
            <h3>Consulta de Especialidad</h3>
            <p class="doc-name">Médico: <span>Dr. Carlos Ruiz (Cardiología)</span></p>
            <p class="location">
              <MapPinIcon :size="14" class="icon-inline" /> 
              Consultorio 302 – Clínica Central
            </p>
          </div>

          <div class="actions-box">
            <button class="btn-ghost">Reprogramar</button>
            <button @click="$router.push({ name: 'PacienteCitas' })" class="btn-details">Detalles</button>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios.js';
import { 
  ShieldCheckIcon, 
  AlarmClockIcon, 
  PlusIcon, 
  MapPinIcon,
  Hand 
} from 'lucide-vue-next';

const userName = ref("...");
const tieneSeguro = ref(false);
const cargandoSeguro = ref(true);

const cargarDatosDashboard = async () => {
  cargandoSeguro.value = true;
  try {
    const resMe = await api.get('/me');
    
    if (resMe.data.success) {
      const userData = resMe.data.data;
      userName.value = userData.name.split(' ')[0];
      const resPacientes = await api.get('/pacientes');
      
      if (resPacientes.data.success) {
        const miPerfil = resPacientes.data.data.find(p => p.user_id === userData.id);
        
        if (miPerfil) {
          tieneSeguro.value = miPerfil.seguro == 1;
          console.log(`Paciente encontrado: ${miPerfil.nombre}, Seguro: ${miPerfil.seguro}`);
        } else {
          console.warn("No se encontró perfil de paciente para este usuario.");
          tieneSeguro.value = false;
        }
      }
    }
  } catch (err) {
    console.error('Error al cargar datos:', err);
    userName.value = "Paciente";
  } finally {
    cargandoSeguro.value = false;
  }
};

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).format(new Date());
});

onMounted(cargarDatosDashboard); 
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap');

.dashboard-container {
  padding: 20px 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'DM Sans', sans-serif;
}

/* --- Header Card Turquesa --- */
.dash-header {
  margin-bottom: 30px;
}

.welcome-card-turquesa {
  background-color: rgba(13, 148, 136, 1);
  padding: 24px 32px;
  border-radius: 16px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 20px rgba(13, 148, 136, 0.15);
}

.welcome-card-turquesa h1 {
  font-family: 'Sora', sans-serif;
  font-size: 1.6rem;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white !important;
}

.welcome-card-turquesa p {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

/* --- Animación de la Mano --- */
.hand-wrapper {
  display: inline-flex;
  transform-origin: 70% 80%;
  animation: wave-animation 2.5s infinite ease-in-out;
  color: #FFD233;
}

@keyframes wave-animation {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
}


/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blue { background: #eff6ff; color: #3b82f6; }
.orange { background: #fff7ed; color: #f97316; }

.card-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 2px 0;
}

.status-active { color: #10b981; }

.card-subtext {
  font-size: 0.8rem;
  color: #64748b;
}


.appointment-card {
  background: white;
  padding: 16px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center; /* Alineación central vertical */
  gap: 24px;
  margin-bottom: 12px;
  border: 1px solid #f1f5f9;
  transition: transform 0.2s;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.date-box {
  background: #f0faf7;
  color: #0d9488;
  padding: 12px;
  border-radius: 14px;
  text-align: center;
  min-width: 90px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.date-box .month { 
  font-size: 0.75rem; 
  font-weight: 700; 
  text-transform: uppercase;
  opacity: 0.8;
}

.date-box .day { 
  display: block; 
  font-size: 1.5rem; 
  font-weight: 800; 
  line-height: 1;
  margin: 4px 0;
}

/* El nuevo estilo para la hora dentro de la caja de fecha */
/* --- Ajuste de la Cabecera de Sección --- */
.section-header {
  display: flex;
  justify-content: space-between; /* Manda el título a la izquierda y el botón a la derecha */
  align-items: center;           /* Los centra verticalmente */
  margin-bottom: 24px;
  gap: 20px;                     /* Espacio mínimo si se acercan mucho */
}

.section-header h2 {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem;             /* Tamaño un poco más ajustado */
  color: #1a2b2e;
  margin: 0;
}

/* --- Mejora del Botón de Agendar --- */
.btn-primary {
  background: #0d9488;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  white-space: nowrap;          /* Evita que el texto del botón se rompa en dos líneas */
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 4px 6px rgba(13, 148, 136, 0.1);
}

.btn-primary:hover {
  background: #0b7a70;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(13, 148, 136, 0.2);
}

.icon-margin {
  margin-right: 8px;
}

/* --- Fix para el Responsive --- */
@media (max-width: 600px) {
  .section-header {
    flex-direction: column;    /* En celulares pequeños, uno sobre otro */
    align-items: flex-start;
    gap: 15px;
  }
  
  .btn-primary {
    width: 100%;               /* Botón ancho completo en móvil */
    justify-content: center;
  }
}
.time-tag-inner {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(13, 148, 136, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  margin-top: 4px;
  color: #0d9488;
}

.info-box {
  flex: 1; /* Ocupa el espacio restante */
}

.actions-box { 
  display: flex; 
  gap: 10px; 
}

/* Modificación para móvil */
@media (max-width: 850px) {
  .appointment-card { 
    flex-direction: column; 
    text-align: center; 
    padding: 20px;
  }
  .date-box {
    width: 100%;
    max-width: 120px;
    margin: 0 auto;
  }
  .actions-box {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
}

.btn-ghost {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.btn-details {
  background: #0d9488;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 850px) {
  .appointment-card { flex-direction: column; text-align: center; }
  .welcome-card-turquesa { flex-direction: column; gap: 16px; align-items: flex-start; }
}
</style>