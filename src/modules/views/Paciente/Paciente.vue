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
          <template v-if="cargandoCitas">
            <p class="card-value">Cargando...</p>
          </template>
          <template v-else-if="proximaCita">
            <p class="card-value">{{ formatearFechaCorta(proximaCita.fecha) }}, {{ formatearHora(proximaCita.hora) }}</p>
            <span class="card-subtext">{{ proximaCita.medico?.name || 'Médico asignado' }}</span>
          </template>
          <template v-else>
            <p class="card-value" style="font-size: 0.95rem; color: #94a3b8;">Sin citas próximas</p>
          </template>
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

      <div v-if="cargandoCitas" class="appointment-list">
        <div class="skeleton-card" v-for="i in 2" :key="i"></div>
      </div>

      <div v-else-if="citasProximas.length === 0" class="empty-state">
        <CalendarXIcon :size="48" class="empty-icon" />
        <p>No tienes citas próximas agendadas</p>
        <router-link :to="{ name: 'PacienteCitas' }" class="btn-primary" style="margin-top: 12px;">
          Agendar mi primera cita
        </router-link>
      </div>

      <div v-else class="appointment-list">
        <div v-for="cita in citasProximas" :key="cita.id" class="appointment-card">
          <div class="date-box">
            <span class="month">{{ getMes(cita.fecha) }}</span>
            <span class="day">{{ getDia(cita.fecha) }}</span>
            <span class="time-tag-inner">{{ formatearHora(cita.hora) }}</span>
          </div>

          <div class="info-box">
            <h3>Consulta Médica</h3>
            <p class="doc-name">
              Médico: <span>{{ cita.medico?.name || 'Por asignar' }}</span>
            </p>
            <p class="location">
              <span :class="['estado-badge', cita.estado]">
                {{ capitalizarEstado(cita.estado) }}
              </span>
            </p>
          </div>

          <div class="actions-box">
            <button @click="abrirDetalle(cita.id)" class="btn-details">
              <EyeIcon :size="15" style="margin-right: 5px;" /> Detalles
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ MODAL DE DETALLE ══════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
          <div class="modal-box">

            <!-- Header del modal -->
            <div class="modal-header">
              <div class="modal-header-icon">
                <CalendarIcon :size="20" />
              </div>
              <div>
                <h2 class="modal-title">Detalle de la Cita</h2>
                <p class="modal-subtitle">Información completa de tu consulta</p>
              </div>
              <button class="modal-close-btn" @click="cerrarModal">
                <XIcon :size="20" />
              </button>
            </div>

            <!-- Contenido del modal -->
            <div class="modal-body">

              <!-- Loading state -->
              <div v-if="cargandoDetalle" class="modal-loading">
                <div class="spinner"></div>
                <p>Cargando información...</p>
              </div>

              <template v-else-if="citaDetalle">

                <!-- Badge de estado -->
                <div class="modal-estado-row">
                  <span :class="['estado-badge-lg', citaDetalle.estado]">
                    <span class="estado-dot"></span>
                    {{ capitalizarEstado(citaDetalle.estado) }}
                  </span>
                  <span class="cita-id-tag"># Cita {{ citaDetalle.id }}</span>
                </div>

                <!-- Fecha y hora -->
                <div class="modal-info-grid">
                  <div class="modal-info-card accent-teal">
                    <div class="mic-icon"><CalendarIcon :size="18" /></div>
                    <div>
                      <span class="mic-label">Fecha</span>
                      <p class="mic-value">{{ formatearFechaLarga(citaDetalle.fecha) }}</p>
                    </div>
                  </div>
                  <div class="modal-info-card accent-orange">
                    <div class="mic-icon"><ClockIcon :size="18" /></div>
                    <div>
                      <span class="mic-label">Hora</span>
                      <p class="mic-value">{{ formatearHora(citaDetalle.hora) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div class="modal-divider"></div>

                <!-- Médico -->
                <div class="modal-section-title">
                  <StethoscopeIcon :size="16" />
                  Médico asignado
                </div>
                <div class="modal-person-card">
                  <div class="avatar teal">
                    {{ getInitials(citaDetalle.medico?.name) }}
                  </div>
                  <div>
                    <p class="person-name">{{ citaDetalle.medico?.name || 'No asignado' }}</p>
                    <p class="person-sub">
                      <MailIcon :size="13" style="margin-right: 4px; vertical-align: middle;" />
                      {{ citaDetalle.medico?.email || '—' }}
                    </p>
                  </div>
                </div>

                <div class="modal-divider"></div>

                <!-- Paciente -->
                <div class="modal-section-title">
                  <UserIcon :size="16" />
                  Paciente
                </div>
                <div class="modal-person-card">
                  <div class="avatar blue">
                    {{ getInitials(citaDetalle.paciente?.nombre + ' ' + citaDetalle.paciente?.apellido) }}
                  </div>
                  <div>
                    <p class="person-name">
                      {{ citaDetalle.paciente?.nombre }} {{ citaDetalle.paciente?.apellido }} {{ citaDetalle.paciente?.segundo_apellido }}
                    </p>
                    <p class="person-sub">
                      <IdentificationIcon :size="13" style="margin-right: 4px; vertical-align: middle;" />
                      C.I.: {{ citaDetalle.paciente?.ci || '—' }}
                    </p>
                  </div>
                </div>

              </template>
            </div>

            <!-- Footer del modal -->
            <div class="modal-footer">
              <button class="btn-ghost" @click="cerrarModal">Cerrar</button>
              <router-link :to="{ name: 'PacienteCitas' }">
                <button class="btn-primary-modal">
                  <EditIcon :size="15" style="margin-right: 6px;" />
                  Reprogramar
                </button>
              </router-link>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios.js';
import { 
  ShieldCheckIcon, 
  AlarmClockIcon, 
  PlusIcon, 
  Hand,
  CalendarXIcon,
  EyeIcon,
  XIcon,
  CalendarIcon,
  ClockIcon,
  StethoscopeIcon,
  MailIcon,
  UserIcon,
  EditIcon,
} from 'lucide-vue-next';

// Icono de CI que no existe en lucide, usamos uno similar
const IdentificationIcon = UserIcon;

// ─── Estado principal ──────────────────────────────────────────────────────
const userName      = ref("...");
const tieneSeguro   = ref(false);
const cargandoSeguro = ref(true);
const cargandoCitas  = ref(true);
const citasProximas  = ref([]);
const pacienteId     = ref(null);

// ─── Estado del modal ──────────────────────────────────────────────────────
const modalVisible   = ref(false);
const cargandoDetalle = ref(false);
const citaDetalle    = ref(null);

// ─── Computed ──────────────────────────────────────────────────────────────
const proximaCita = computed(() => citasProximas.value[0] ?? null);

// ─── Helpers de fecha / hora ───────────────────────────────────────────────
const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

function getMes(fechaStr) {
  return MESES[new Date(fechaStr + 'T00:00:00').getMonth()];
}

function getDia(fechaStr) {
  return new Date(fechaStr + 'T00:00:00').getDate();
}

function formatearHora(horaStr) {
  if (!horaStr) return '';
  const [h, m] = horaStr.split(':');
  const hora = parseInt(h);
  const ampm = hora >= 12 ? 'PM' : 'AM';
  return `${hora % 12 || 12}:${m} ${ampm}`;
}

function formatearFechaCorta(fechaStr) {
  const fecha = new Date(fechaStr + 'T00:00:00');
  const hoy   = new Date(); hoy.setHours(0,0,0,0);
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1);
  if (fecha.toDateString() === hoy.toDateString())    return 'Hoy';
  if (fecha.toDateString() === manana.toDateString()) return 'Mañana';
  return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
}

function formatearFechaLarga(fechaStr) {
  const d = new Date(fechaStr + 'T00:00:00');
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
}

function capitalizarEstado(estado) {
  if (!estado) return '';
  return estado.charAt(0).toUpperCase() + estado.slice(1);
}

function getInitials(nombre) {
  if (!nombre) return '?';
  return nombre.trim().split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

// ─── Modal ─────────────────────────────────────────────────────────────────
async function abrirDetalle(citaId) {
  modalVisible.value   = true;
  cargandoDetalle.value = true;
  citaDetalle.value    = null;
  document.body.style.overflow = 'hidden';

  try {
    const res = await api.get(`/citas/${citaId}`);
    if (res.data.success) {
      citaDetalle.value = res.data.data;
    }
  } catch (err) {
    console.error('Error al cargar detalle de cita:', err);
  } finally {
    cargandoDetalle.value = false;
  }
}

function cerrarModal() {
  modalVisible.value = false;
  citaDetalle.value  = null;
  document.body.style.overflow = '';
}

// ─── Carga principal ───────────────────────────────────────────────────────
const cargarDatosDashboard = async () => {
  cargandoSeguro.value = true;
  cargandoCitas.value  = true;

  try {
    const resMe = await api.get('/me');
    if (!resMe.data.success) return;

    const userData = resMe.data.data;
    userName.value = userData.name.split(' ')[0];

    const resPacientes = await api.get('/pacientes');
    if (resPacientes.data.success) {
      const miPerfil = resPacientes.data.data.find(p => p.user_id === userData.id);
      if (miPerfil) {
        tieneSeguro.value = miPerfil.seguro == 1;
        pacienteId.value  = miPerfil.id;
      }
    }
  } catch (err) {
    console.error('Error al cargar datos del usuario:', err);
    userName.value = "Paciente";
  } finally {
    cargandoSeguro.value = false;
  }

  try {
    if (!pacienteId.value) return;
    const resCitas = await api.get(`/pacientes/${pacienteId.value}/citas`);
    if (resCitas.data.success) {
      const hoy = new Date(); hoy.setHours(0,0,0,0);
      citasProximas.value = resCitas.data.data
        .filter(c => new Date(c.fecha + 'T00:00:00') >= hoy && c.estado === 'pendiente')
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }
  } catch (err) {
    console.error('Error al cargar citas:', err);
  } finally {
    cargandoCitas.value = false;
  }
};

onMounted(cargarDatosDashboard);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap');

.dashboard-container {
  padding: 5px 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'DM Sans', sans-serif;
}

/* ── Header ── */
.dash-header { margin-bottom: 30px; }

.welcome-card-turquesa {
  background-color: #0d9488;
  padding: 24px 32px;
  border-radius: 16px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 20px rgba(13,148,136,0.15);
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
.welcome-card-turquesa p { margin: 0; font-size: 0.95rem; color: rgba(255,255,255,0.9); }

/* ── Mano ── */
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

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.card {
  background: white; padding: 20px; border-radius: 16px;
  display: flex; gap: 16px; align-items: center;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}
.card-icon-wrapper {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.blue      { background: #eff6ff; color: #3b82f6; }
.orange    { background: #fff7ed; color: #f97316; }
.red-light { background: #fef2f2; color: #ef4444; }
.card-label   { font-size: 0.7rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
.card-value   { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 2px 0; }
.card-subtext { font-size: 0.8rem; color: #64748b; }
.status-active   { color: #10b981; }
.status-inactive { color: #ef4444; }

/* ── Section Header ── */
.section-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px; gap: 20px;
}
.section-header h2 {
  font-family: 'Sora', sans-serif; font-size: 1.3rem; color: #1a2b2e; margin: 0;
}

/* ── Botón primario ── */
.btn-primary {
  background: #0d9488; color: white; padding: 10px 18px; border-radius: 10px;
  text-decoration: none; font-size: 0.85rem; font-weight: 600;
  display: inline-flex; align-items: center; white-space: nowrap;
  transition: all 0.2s ease; border: none; cursor: pointer;
  box-shadow: 0 4px 6px rgba(13,148,136,0.1);
}
.btn-primary:hover { background: #0b7a70; transform: translateY(-1px); }
.icon-margin { margin-right: 8px; }

/* ── Skeleton ── */
.skeleton-card {
  height: 100px;
  background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 16px; margin-bottom: 12px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty state ── */
.empty-state {
  text-align: center; padding: 48px 20px; color: #94a3b8;
  display: flex; flex-direction: column; align-items: center;
}
.empty-icon { margin-bottom: 12px; opacity: 0.4; }

/* ── Appointment cards ── */
.appointment-card {
  background: white; padding: 16px 20px; border-radius: 16px;
  display: flex; align-items: center; gap: 24px;
  margin-bottom: 12px; border: 1px solid #f1f5f9;
  transition: transform 0.2s;
}
.appointment-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.date-box {
  background: #f0faf7; color: #0d9488; padding: 12px; border-radius: 14px;
  text-align: center; min-width: 90px;
  display: flex; flex-direction: column; justify-content: center;
}
.date-box .month { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; opacity: 0.8; }
.date-box .day   { display: block; font-size: 1.5rem; font-weight: 800; line-height: 1; margin: 4px 0; }

.time-tag-inner {
  font-size: 0.7rem; font-weight: 700;
  background: rgba(13,148,136,0.1); padding: 2px 6px; border-radius: 6px;
  margin-top: 4px; color: #0d9488;
}
.info-box { flex: 1; }
.info-box h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; }
.doc-name { font-size: 0.85rem; color: #64748b; margin: 0 0 6px 0; }
.doc-name span { color: #1e293b; font-weight: 600; }

.estado-badge {
  display: inline-block; font-size: 0.75rem; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
}
.estado-badge.pendiente  { background: #fff7ed; color: #f97316; }
.estado-badge.confirmada { background: #f0fdf4; color: #16a34a; }
.estado-badge.cancelada  { background: #fef2f2; color: #ef4444; }

.actions-box { display: flex; gap: 10px; align-items: center; }

.btn-ghost {
  background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 14px;
  border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #64748b; cursor: pointer;
}
.btn-details {
  background: #0d9488; color: white; border: none; padding: 8px 16px;
  border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center; transition: background 0.2s;
}
.btn-details:hover { background: #0b7a70; }

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}

.modal-box {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header del modal */
.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-header-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: #f0faf7; color: #0d9488;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0;
}
.modal-subtitle { font-size: 0.8rem; color: #94a3b8; margin: 2px 0 0; font-family:'Sora', sans-serif; }

.modal-close-btn {
  margin-left: auto;
  background: #f8fafc; border: 1px solid #e2e8f0;
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #64748b; transition: all 0.2s;
}
.modal-close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

/* Body del modal */
.modal-body { padding: 24px; flex: 1; overflow-y: auto;  font-family: 'Sora', sans-serif;}

/* Loading */
.modal-loading {
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; padding: 30px 0; color: #94a3b8; font-size: 0.9rem;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Estado row */
.modal-estado-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.estado-badge-lg {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 0.85rem; font-weight: 700;
  padding: 6px 14px; border-radius: 20px;
}
.estado-badge-lg.pendiente  { background: #fff7ed; color: #f97316; }
.estado-badge-lg.confirmada { background: #f0fdf4; color: #16a34a; }
.estado-badge-lg.cancelada  { background: #fef2f2; color: #ef4444; }
.estado-dot {
  width: 7px; height: 7px; border-radius: 50%; background: currentColor;
  animation: pulse-dot 1.8s infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
}
.cita-id-tag {
  font-size: 0.8rem; font-weight: 600; color: #94a3b8;
  background: #f8fafc; padding: 4px 10px; border-radius: 8px;
}

/* Info grid (fecha + hora) */
.modal-info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-bottom: 20px;
}
.modal-info-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px; border-radius: 14px;
}
.accent-teal  { background: #f0faf7; }
.accent-orange { background: #fff7ed; }
.mic-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.accent-teal  .mic-icon { background: rgba(13,148,136,0.12); color: #0d9488; }
.accent-orange .mic-icon { background: rgba(249,115,22,0.12); color: #f97316; }
.mic-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.4px; text-transform: uppercase; }
.mic-value { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin: 2px 0 0; }

/* Divider */
.modal-divider { height: 1px; background: #f1f5f9; margin: 18px 0; }

/* Section title */
.modal-section-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.75rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.modal-person-card {
  display: flex; align-items: center; gap: 14px;
   font-family: 'Sora', sans-serif;
  padding: 14px; background: #f8fafc; border-radius: 14px;
  border: 1px solid #f1f5f9;
}
.avatar {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.95rem; flex-shrink: 0; color: white;
}
.avatar.teal { background: linear-gradient(135deg, #0d9488, #14b8a6); }
.avatar.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }

.person-name { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.person-sub  {
  font-size: 0.8rem; color: #64748b; margin: 0;
  display: flex; align-items: center;
}

.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px; border-top: 1px solid #f1f5f9;
}
.btn-primary-modal {
  background: #0d9488; color: white; border: none;
  padding: 10px 18px; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center;
  transition: background 0.2s;
}
.btn-primary-modal:hover { background: #0b7a70; }

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to   { opacity: 0; }
.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box { transform: translateY(16px) scale(0.97); opacity: 0; }

@media (max-width: 850px) {
  .appointment-card { flex-direction: column; text-align: center; padding: 20px; }
  .welcome-card-turquesa { flex-direction: column; gap: 16px; align-items: flex-start; }
  .date-box { width: 100%; max-width: 120px; margin: 0 auto; }
  .actions-box { width: 100%; justify-content: center; margin-top: 10px; }
  .modal-info-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .section-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .btn-primary    { width: 100%; justify-content: center; }
  .dashboard-container { padding: 16px; }
}
</style>