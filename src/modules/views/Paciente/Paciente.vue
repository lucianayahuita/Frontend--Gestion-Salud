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
          <p>Aquí tienes un resumen de tus próximas citas y tu actividad</p>
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
            <span class="card-subtext">Dr/a {{ proximaCita.medico?.name || 'Médico asignado' }}</span>
          </template>
          <template v-else>
            <p class="card-value" style="font-size: 0.95rem; color: #94a3b8;">Sin citas próximas</p>
          </template>
        </div>
      </div>

      <div class="card">
        <div class="card-icon-wrapper purple-light">
          <Pill :size="22" />
        </div>
        <div class="card-content">
          <span class="card-label">RECETAS ASIGNADAS</span>
          <p v-if="cargandoRecetas" class="card-value">...</p>
          <p v-else class="card-value">{{ recetasPaciente.length }} Históricas</p>
          <span class="card-subtext">Registradas en sistema</span>
        </div>
      </div>
    </div>

    <section class="productivity-analytics-panel">
      <div class="analytics-header">
        <div class="analytics-title-box">
          <TrendingUp :size="20" class="analytics-icon-accent" />
          <div>
            <h2 class="analytics-main-title">Tu Historial de Consultas</h2>
            <p class="analytics-subtitle">Frecuencia de citas médicas agendadas mes a mes</p>
          </div>
        </div>
      </div>
      
      <div class="chart-wrapper-container">
        <div class="clinical-chart-container">
          <div class="chart-grid-lines">
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxCitasMes) }}</span></div>
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxCitasMes * 0.75) }}</span></div>
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxCitasMes * 0.5) }}</span></div>
            <div class="grid-line-row"><span class="grid-y-label">{{ Math.round(maxCitasMes * 0.25) }}</span></div>
            <div class="grid-line-row-base"><span class="grid-y-label">0</span></div>
          </div>

          <div class="chart-bars-timeline">
            <div 
              v-for="(mes, index) in datosGraficoCitas" 
              :key="index" 
              class="chart-timeline-column"
            >
              <div class="bar-tooltip-bubble">{{ mes.cantidad }} citas</div>
              <div class="bar-geometric-track">
                <div 
                  class="bar-geometric-fill"
                  :style="{ height: `${(mes.cantidad / maxCitasMes) * 100 || 4}%` }"
                  :class="{ 'bar-active-highlight': mes.esMesActual }"
                ></div>
              </div>
              <span class="axis-x-label">{{ mes.nombre }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

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

    <section class="recetas-section" style="margin-top: 40px; margin-bottom: 40px;">
      <div class="section-header">
        <h2>Mis Recetas Médicas</h2>
        <span class="count-tag-recetas">{{ recetasPaciente.length }} en Total</span>
      </div>

      <div v-if="cargandoRecetas" class="appointment-list">
        <div class="skeleton-card" v-for="i in 2" :key="'skeleton-r-'+i"></div>
      </div>

      <div v-else-if="recetasPaciente.length === 0" class="empty-state">
        <ClipboardList :size="48" class="empty-icon" />
        <p>No tienes recetas médicas emitidas hasta la fecha.</p>
      </div>

      <div v-else class="recetas-grid-layout">
        <div v-for="receta in recetasPaciente" :key="'receta-'+receta.id" class="receta-horizontal-card">
          <div class="receta-status-aside">
            <div :class="['status-icon-pill', receta.estado_despacho === 'despachada' ? 'entregado' : 'espera']">
              <CheckCircle v-if="receta.estado_despacho === 'despachada'" :size="18" />
              <Clock v-else :size="18" />
            </div>
            <span class="receta-badge-status-text">{{ receta.estado_despacho }}</span>
          </div>

          <div class="receta-main-body">
            <div class="receta-title-row">
              <h3 class="med-name">{{ receta.medicamento?.nombre?.toUpperCase() }}</h3>
              <span class="med-dosis-tag">{{ receta.dosis }}</span>
            </div>
            
            <p class="receta-timing-info">
              <strong>Frecuencia:</strong> {{ receta.frecuencia }} &middot; 
              <strong>Duración del Tratamiento:</strong> {{ receta.duracion }}
            </p>

            <div class="receta-instructions-block">
              <strong>Indicaciones:</strong> {{ receta.indicaciones || 'Tomar según orden' }}
            </div>

            <div class="receta-meta-footer">
              <span><strong>Fecha:</strong> {{ formatearFechaLargaSinDia(receta.created_at || receta.cita?.fecha) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
          <div class="modal-box">
            <div class="modal-header">
              <div class="modal-header-icon"><CalendarIcon :size="20" /></div>
              <div>
                <h2 class="modal-title">Detalle de la Cita</h2>
                <p class="modal-subtitle">Información completa de tu consulta</p>
              </div>
              <button class="modal-close-btn" @click="cerrarModal"><XIcon :size="20" /></button>
            </div>

            <div class="modal-body">
              <div v-if="cargandoDetalle" class="modal-loading">
                <div class="spinner"></div>
                <p>Cargando información...</p>
              </div>

              <template v-else-if="citaDetalle">
                <div class="modal-estado-row">
                  <span :class="['estado-badge-lg', citaDetalle.estado]">
                    <span class="estado-dot"></span>
                    {{ capitalizarEstado(citaDetalle.estado) }}
                  </span>
                  <span class="cita-id-tag"># Cita {{ citaDetalle.id }}</span>
                </div>

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

                <div class="modal-divider"></div>

                <div class="modal-section-title"><StethoscopeIcon :size="16" /> Médico asignado</div>
                <div class="modal-person-card">
                  <div class="avatar teal">{{ getInitials(citaDetalle.medico?.name) }}</div>
                  <div>
                    <p class="person-name">{{ citaDetalle.medico?.name || 'No asignado' }}</p>
                    <p class="person-sub"><MailIcon :size="13" style="margin-right: 4px; vertical-align: middle;" /> {{ citaDetalle.medico?.email || '—' }}</p>
                  </div>
                </div>

                <div class="modal-divider"></div>

                <div class="modal-section-title"><UserIcon :size="16" /> Paciente</div>
                <div class="modal-person-card">
                  <div class="avatar blue">{{ getInitials(citaDetalle.paciente?.nombre + ' ' + citaDetalle.paciente?.apellido) }}</div>
                  <div>
                    <p class="person-name">{{ citaDetalle.paciente?.nombre }} {{ citaDetalle.paciente?.apellido }}</p>
                    <p class="person-sub"><IdentificationIcon :size="13" style="margin-right: 4px; vertical-align: middle;" /> C.I.: {{ citaDetalle.paciente?.ci || '—' }}</p>
                  </div>
                </div>
              </template>
            </div>

            <div class="modal-footer">
              <button class="btn-ghost" @click="cerrarModal">Cerrar</button>
              <router-link :to="{ name: 'PacienteCitas' }">
                <button class="btn-primary-modal"><EditIcon :size="15" style="margin-right: 6px;" /> Reprogramar</button>
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
  ShieldCheckIcon, AlarmClockIcon, PlusIcon, Hand, CalendarXIcon,
  EyeIcon, XIcon, CalendarIcon, ClockIcon, StethoscopeIcon, MailIcon,
  UserIcon, EditIcon, Pill, TrendingUp, CheckCircle, ClipboardList
} from 'lucide-vue-next';

const IdentificationIcon = UserIcon;

const userName       = ref("...");
const tieneSeguro    = ref(false);
const cargandoSeguro = ref(true);
const cargandoCitas  = ref(true);
const citasProximas  = ref([]);
const pacienteId     = ref(null);

const cargandoRecetas   = ref(true);
const recetasPaciente   = ref([]);
const citasHistoricasRaw = ref(Array(12).fill(0));

const modalVisible    = ref(false);
const cargandoDetalle = ref(false);
const citaDetalle     = ref(null);

const proximaCita = computed(() => citasProximas.value[0] ?? null);

const nombresMesesCorta = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const mesActualIndex = new Date().getMonth();

const datosGraficoCitas = computed(() => {
  const resultado = [];
  for (let i = 5; i >= 0; i--) {
    let indexMes = mesActualIndex - i;
    if (indexMes < 0) indexMes += 12;
    
    resultado.push({
      nombre: nombresMesesCorta[indexMes],
      cantidad: citasHistoricasRaw.value[indexMes] || 0,
      esMesActual: indexMes === mesActualIndex
    });
  }
  return resultado;
});

const maxCitasMes = computed(() => {
  const cantidades = datosGraficoCitas.value.map(m => m.cantidad);
  const max = Math.max(...cantidades);
  return max > 0 ? max * 1.2 : 5; 
});

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

function getMes(fechaStr) { return MESES[new Date(fechaStr + 'T00:00:00').getMonth()]; }
function getDia(fechaStr) { return new Date(fechaStr + 'T00:00:00').getDate(); }

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

function formatearFechaLargaSinDia(fechaRaw) {
  if (!fechaRaw) return '---';
  const d = new Date(fechaRaw);
  if (isNaN(d.getTime())) return '---';
  return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
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
    if (res.data.success) citaDetalle.value = res.data.data;
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

const cargarDatosDashboard = async () => {
  cargandoSeguro.value = true;
  cargandoCitas.value  = true;
  cargandoRecetas.value = true;

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

    if (pacienteId.value) {
      const resCitas = await api.get(`/pacientes/${pacienteId.value}/citas`);
      if (resCitas.data.success) {
        const todasLasCitas = resCitas.data.data || [];
        
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        citasProximas.value = todasLasCitas
          .filter(c => new Date(c.fecha + 'T00:00:00') >= hoy && c.estado === 'pendiente')
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        const contadorMesesCitas = Array(12).fill(0);
        todasLasCitas.forEach(cita => {
          if (cita.fecha) {
            const fechaObj = new Date(cita.fecha + 'T00:00:00');
            if (!isNaN(fechaObj.getTime())) {
              const mes = fechaObj.getMonth();
              contadorMesesCitas[mes]++;
            }
          }
        });
        citasHistoricasRaw.value = contadorMesesCitas;
      }

      const resRecetas = await api.get(`/pacientes/${pacienteId.value}/recetas-medicas`);
      if (resRecetas.data.success) {
        recetasPaciente.value = resRecetas.data.data || [];
      }
    }
  } catch (err) {
    console.error('Error cargando la suite del dashboard:', err);
    userName.value = "Paciente";
  } finally {
    cargandoSeguro.value = false;
    cargandoCitas.value  = false;
    cargandoRecetas.value = false;
  }
};

onMounted(cargarDatosDashboard);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@400;600;700&display=swap');

.dashboard-container { padding: 5px 30px; max-width: 100%; margin: 0 auto; font-family: 'DM Sans', sans-serif; background: transparent; min-height: 100vh; }
.dash-header { margin-bottom: 30px; }

.welcome-card-turquesa {
  background-color: #0d9488; padding: 24px 32px; border-radius: 16px; color: white;
  display: flex; justify-content: space-between; align-items: center; box-shadow: 0 8px 20px rgba(13,148,136,0.15);
}
.welcome-card-turquesa h1 { font-family: 'Sora', sans-serif; font-size: 1.6rem; margin: 0 0 4px 0; display: flex; align-items: center; gap: 12px; color: white !important; }
.welcome-card-turquesa p { margin: 0; font-size: 0.95rem; color: rgba(255,255,255,0.9); }

.hand-wrapper { display: inline-flex; transform-origin: 70% 80%; animation: wave-animation 2.5s infinite ease-in-out; color: #FFD233; }
@keyframes wave-animation { 0%,100%{transform:rotate(0deg)} 10%{transform:rotate(14deg)} 20%{transform:rotate(-8deg)} 30%{transform:rotate(14deg)} 40%{transform:rotate(-4deg)} 50%{transform:rotate(10deg)} }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 35px; }
.card { background: white; padding: 20px; border-radius: 16px; display: flex; gap: 16px; align-items: center; border: 1px solid #e2e8f0; }
.card-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.blue { background: #eff6ff; color: #3b82f6; }
.orange { background: #fff7ed; color: #f97316; }
.red-light { background: #fef2f2; color: #ef4444; }
.purple-light { background: #faf5ff; color: #a855f7; }

.card-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
.card-value { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 2px 0; }
.card-subtext { font-size: 0.8rem; color: #64748b; }
.status-active { color: #10b981; }
.status-inactive { color: #ef4444; }

/* ── INTERFAZ GEOMÉTRICA DE GRÁFICO CLÍNICO (COHERENCIA CON MEDICO) ── */
.productivity-analytics-panel { background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); }
.analytics-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.analytics-title-box { display: flex; align-items: center; gap: 12px; }
.analytics-icon-accent { color: #0d9488; }
.analytics-main-title { font-family: 'Sora', sans-serif; font-size: 1.15rem; font-weight: 600; margin: 0; color: #0f172a; }
.analytics-subtitle { margin: 2px 0 0; font-size: 0.85rem; color: #64748b; }

.clinical-chart-container { height: 180px; position: relative; margin-left: 30px; margin-bottom: 25px; margin-top: 10px; }
.chart-grid-lines { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.grid-line-row { width: 100%; border-bottom: 1px dashed #e2e8f0; position: relative; height: 0; }
.grid-line-row-base { width: 100%; border-bottom: 2px solid #cbd5e1; position: relative; height: 0; }
.grid-y-label { position: absolute; left: -35px; top: -7px; font-size: 11px; font-weight: 600; color: #94a3b8; width: 26px; text-align: right; }

.chart-bars-timeline { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: space-around; align-items: flex-end; z-index: 2; }
.chart-timeline-column { width: 12%; display: flex; flex-direction: column; align-items: center; position: relative; height: 100%; justify-content: flex-end; }
.bar-geometric-track { width: 100%; max-width: 28px; height: 100%; display: flex; align-items: flex-end; }
.bar-geometric-fill { width: 100%; background: #cbd5e1; border-radius: 4px 4px 0 0; transition: height 0.6s ease; }
.bar-geometric-fill.bar-active-highlight { background: #0d9488; } /* Color turquesa institucional del paciente */

.bar-tooltip-bubble { position: absolute; top: -15px; background: #1e293b; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; opacity: 0; transition: all 0.15s ease; pointer-events: none; z-index: 10; }
.chart-timeline-column:hover .bar-tooltip-bubble { opacity: 1; transform: translateY(-6px); }
.axis-x-label { font-size: 11px; font-weight: 600; color: #64748b; position: absolute; bottom: -24px; }

/* ── SECCIÓN DE RECETAS MÉDICAS ── */
.count-tag-recetas { background: #7c3aed; padding: 4px 12px; border-radius: 30px; font-size: 11px; font-weight: 600; color: white; }
.recetas-grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 20px; }
.receta-horizontal-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; overflow: hidden; transition: all 0.2s; }
.receta-horizontal-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-color: #ddd6fe; }

.receta-status-aside { width: 85px; background: #fbfbfe; border-right: 1px solid #f1f5f9; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px; }
.status-icon-pill { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.status-icon-pill.entregado { background: #ecfdf5; color: #10b981; }
.status-icon-pill.espera { background: #fef3c7; color: #d97706; }
.receta-badge-status-text { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.3px; }

.receta-main-body { flex: 1; padding: 18px 20px; display: flex; flex-direction: column; gap: 8px; }
.receta-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.receta-title-row .med-name { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0; }
.med-dosis-tag { background: #f3f4f6; color: #374151; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; }
.receta-timing-info { font-size: 12.5px; color: #475569; margin: 0; }
.receta-instructions-block { background: #f8fafc; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #334155; border-left: 3px solid #bc95ea; margin: 2px 0; }
.receta-meta-footer { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 8px; margin-top: 4px; }

/* ── Estructuras Existentes Re-validadas ── */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header h2 { font-family: 'Sora', sans-serif; font-size: 1.2rem; color: #0f172a; margin: 0; }
.btn-primary { background: #0d9488; color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; transition: all 0.2s; border: none; cursor: pointer; }
.btn-primary:hover { background: #0b7a70; }
.appointment-list { display: flex; flex-direction: column; gap: 12px; }
.appointment-card { background: white; padding: 16px 20px; border-radius: 16px; display: flex; align-items: center; gap: 24px; border: 1px solid #e2e8f0; transition: transform 0.2s; }
.appointment-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.date-box { background: #f0faf7; color: #0d9488; padding: 12px; border-radius: 14px; text-align: center; min-width: 90px; }
.date-box .month { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.date-box .day { display: block; font-size: 1.5rem; font-weight: 800; line-height: 1; margin: 4px 0; }
.time-tag-inner { font-size: 0.7rem; font-weight: 700; background: rgba(13,148,136,0.1); padding: 2px 6px; border-radius: 6px; color: #0d9488; }
.info-box { flex: 1; }
.info-box h3 { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
.doc-name { font-size: 0.85rem; color: #64748b; margin: 0 0 4px 0; }
.doc-name span { color: #1e293b; font-weight: 600; }
.estado-badge { display: inline-block; font-size: 0.75rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.estado-badge.pendiente { background: #fff7ed; color: #f97316; }
.estado-badge.confirmada { background: #f0fdf4; color: #16a34a; }
.estado-badge.cancelada { background: #fef2f2; color: #ef4444; }
.btn-details { background: #0d9488; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; }

/* Modal styles (Mantenidos intactos según tu diseño de Sora) */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-box { background: white; border-radius: 24px; width: 100%; max-width: 480px; box-shadow: 0 25px 60px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; }
.modal-header { display: flex; align-items: center; gap: 14px; padding: 22px 24px 18px; border-bottom: 1px solid #f1f5f9; }
.modal-header-icon { width: 42px; height: 42px; border-radius: 12px; background: #f0faf7; color: #0d9488; display: flex; align-items: center; justify-content: center; }
.modal-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
.modal-subtitle { font-size: 0.8rem; color: #94a3b8; margin: 2px 0 0; font-family:'Sora', sans-serif; }
.modal-close-btn { margin-left: auto; background: #f8fafc; border: 1px solid #e2e8f0; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.modal-body { padding: 24px; flex: 1; overflow-y: auto; font-family: 'Sora', sans-serif;}
.modal-estado-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.estado-badge-lg { display: inline-flex; align-items: center; gap: 7px; font-size: 0.85rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; }
.estado-badge-lg.pendiente { background: #fff7ed; color: #f97316; }
.estado-badge-lg.confirmada { background: #f0fdf4; color: #16a34a; }
.estado-badge-lg.cancelada { background: #fef2f2; color: #ef4444; }
.estado-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: pulse-dot 1.8s infinite; }
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.cita-id-tag { font-size: 0.8rem; font-weight: 600; color: #94a3b8; background: #f8fafc; padding: 4px 10px; border-radius: 8px; }
.modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.modal-info-card { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 14px; }
.accent-teal { background: #f0faf7; }
.accent-orange { background: #fff7ed; }
.mic-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.accent-teal .mic-icon { background: rgba(13,148,136,0.12); color: #0d9488; }
.accent-orange .mic-icon { background: rgba(249,115,22,0.12); color: #f97316; }
.mic-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.mic-value { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin: 2px 0 0; }
.modal-divider { height: 1px; background: #f1f5f9; margin: 18px 0; }
.modal-section-title { display: flex; align-items: center; gap: 7px; font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px; }
.modal-person-card { display: flex; align-items: center; gap: 14px; font-family: 'Sora', sans-serif; padding: 14px; background: #f8fafc; border-radius: 14px; border: 1px solid #f1f5f9; }
.avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; color: white; }
.avatar.teal { background: linear-gradient(135deg, #0d9488, #14b8a6); }
.avatar.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
.person-name { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.person-sub { font-size: 0.8rem; color: #64748b; margin: 0; display: flex; align-items: center; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f1f5f9; }
.btn-primary-modal { background: #0d9488; color: white; border: none; padding: 10px 18px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; }
.btn-ghost { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #64748b; cursor: pointer; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.skeleton-card { height: 100px; background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 16px; margin-bottom: 12px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.empty-state { text-align: center; padding: 48px 20px; color: #94a3b8; display: flex; flex-direction: column; align-items: center; }
.empty-icon { margin-bottom: 12px; opacity: 0.4; }

@media (max-width: 850px) {
  .appointment-card { flex-direction: column; text-align: center; padding: 20px; }
  .recetas-grid-layout { grid-template-columns: 1fr; }
  .welcome-card-turquesa { flex-direction: column; gap: 16px; align-items: flex-start; }
}
</style>