<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">
            ¡Hola, {{ nombreFarmaceutica }}! 
            <Hand class="icon-hand" :size="28" :stroke-width="2.5" />
          </h1>
          <p class="page-sub">Aqui tienes un resumen de la actividad farmaceutica. </p>
        </div>
      </div>
    </div>

    <section class="metrics-grid">
      <div class="metric-card alert-stock">
        <div class="metric-icon"><AlertTriangle :size="24" /></div>
        <div class="metric-info">
          <h3>{{ stockCritico.length }}</h3>
          <p>Stock Bajo / Crítico</p>
        </div>
      </div>
      <div class="metric-card total-products">
        <div class="metric-icon"><Layers :size="24" /></div>
        <div class="metric-info">
          <h3>{{ totalMedicamentos }}</h3>
          <p>Ítems en Catálogo</p>
        </div>
      </div>
      <div class="metric-card total-movements">
        <div class="metric-icon"><ArrowUpDown :size="24" /></div>
        <div class="metric-info">
          <h3>{{ ultimosMovimientos.length }}</h3>
          <p>Movimientos Recientes</p>
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
          <div v-for="med in stockCritico" :key="'critico-' + med.id" class="appointment-card-horizontal alert-border">
            
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
                <Pill :size="22" />
              </div>
              <div class="patient-info">
                <h3 class="patient-name">{{ med.nombre }}</h3>
                <p class="patient-id"><strong>Código:</strong> #{{ med.id }}</p>
                <p class="doctor-sub"><strong>Precio:</strong> ${{ med.precio }}</p>
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
          <div v-for="mov in ultimosMovimientos" :key="'mov-' + mov.id" class="appointment-card-horizontal movement-border">
            
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
              <span class="status-badge critical">Reponer</span>
              <button class="btn-action order-btn" @click="solicitarPedido(med)">
                Pedir Lote
              </button>
            </div>
          </div>

          <div v-if="ultimosMovimientos.length === 0" class="empty-state">
            <ArrowUpDown :size="32" style="color: #6b8896; margin-bottom: 8px;" />
            <p>No se registran movimientos de inventario el día de hoy.</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { 
  Hand, Calendar, Pill, AlertTriangle, Layers, 
  CheckCircle, ArrowUpDown, TrendingUp, TrendingDown 
} from 'lucide-vue-next';
import api from '@/api/axios.js';

const nombreFarmaceutica = ref('Cargando...');
const fechaActual = ref('');
const cargando = ref(true);

const totalMedicamentos = ref(0);
const stockCritico = ref([]);
const ultimosMovimientos = ref([]);

const cargarDashboard = async () => {
  cargando.value = true;
  try {
    const resUser = await api.get('/me');
    const usuario = resUser.data?.data || resUser.data; 
    
    if (usuario && usuario.name) {
      nombreFarmaceutica.value = usuario.name.split(' ')[0];
    } else {
      nombreFarmaceutica.value = 'Farmacéutica';
    }
    const { data: resMed } = await api.get('/medicamentos');
    const medicamentos = resMed.data || [];
    totalMedicamentos.value = medicamentos.length;
    stockCritico.value = medicamentos.filter(med => Number(med.stock) <= Number(med.stock_minimo || 10));
    
    const { data: resMov } = await api.get('/movimientos-farmacia');
    ultimosMovimientos.value = resMov.data || [];
  } catch (error) {
    console.error('Error cargando los datos reales del backend:', error);
    nombreFarmaceutica.value = 'Farmacéutica';
  } finally {
    cargando.value = false;
  }
};

const esIngreso = (tipo) => {
  if (!tipo) return false;
  const t = tipo.toLowerCase();
  return t === 'entrada';
};

const formatearFechaHora = (fechaRaw) => {
  if (!fechaRaw) return 'Hace un momento';
  
  const fechaObjeto = new Date(fechaRaw);
  const opciones = { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  
  return new Intl.DateTimeFormat('es-ES', opciones).format(fechaObjeto) + ' hrs';
};

const solicitarPedido = (med) => {
  router.push({ name: 'FarmaceuticoDisponibilidad' });
};

onMounted(() => {
  cargarDashboard();
  fechaActual.value = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');

.dashboard { 
  padding: 5px; 
  font-family: 'DM Sans', sans-serif; 
  background: #f4f7f6; 
  min-height: 100vh; 
  color: #1a2b2e;
}

/* ── WELCOME CARD ── */
.welcome-card {
  background: rgba(191, 210, 248, 0.5);
  padding: 30px 40px;
  border-radius: 24px;
  color: #115843;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(17, 88, 67, 0.15);
}

.welcome-title { 
  font-family: 'Sora', sans-serif; 
  font-size: 26px; 
  font-weight: 700;
  margin: 0; 
  color: #115843;
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.page-sub { margin: 6px 0 0 0; font-size: 14px; color: black; }
.header-date { background: rgba(255, 255, 255, 0.12); padding: 10px 18px; border-radius: 14px; display: flex; align-items: center; gap: 8px; font-size: 13px; }

/* ── KPIs GRID ── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
}

.metric-card { background: white; border-radius: 18px; padding: 20px; display: flex; align-items: center; gap: 18px; border: 1px solid #e3ede9; }
.metric-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

.alert-stock .metric-icon { background: #fff0f0; color: #de4343; }
.total-products .metric-icon { background: #eefaf6; color: #1d9e75; }
.total-movements .metric-icon { background: #f0f4ff; color: #3b82f6; }

.metric-info h3 { font-family: 'Sora', sans-serif; font-size: 24px; margin: 0; color: #1a2b2e; }
.metric-info p { margin: 2px 0 0; font-size: 13px; color: #6b8896; font-weight: 500; }

/* ── LAYOUT DE PANELES DE CONTROL ── */
.dashboard-content-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 30px;
}

.panel-section { background: transparent; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.section-title { font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 600; margin: 0; color: rgba(15, 122, 90, 1); }

.count-tag { padding: 3px 12px; border-radius: 30px; font-size: 11px; font-weight: 600; color: white;}
.count-tag.urgent { background: #de4343; }
.count-tag.info { background: #3b82f6; }

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

.appointment-card-horizontal.alert-border:hover { border-color: #fca5a5; transform: translateY(-1px); }
.appointment-card-horizontal.movement-border:hover { border-color: #bfdbfe; transform: translateY(-1px); }

.card-left-info { display: flex; flex-direction: column; align-items: center; padding-right: 24px; border-right: 1.5px solid #edf3f1; min-width: 90px; text-align: center;}
.time-block.stock-danger { color: #de4343; font-weight: 700; font-size: 15px; }

.amount-badge { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; }

/* Colores de Texto */
.text-ingreso { color: #10b981 !important; }
.text-egreso { color: #f43f5e !important; }

/* Fondos de los Avatares/Iconos */
.bg-ingreso { background: #e6fbf3 !important; color: #10b981 !important; border: 1px solid #a7f3d0; }
.bg-egreso { background: #fff1f2 !important; color: #f43f5e !important; border: 1px solid #fecdd3; }

/* Estilos de las etiquetas de la derecha (Badges) */
.badge-ingreso { background: #d1fae5 !important; color: #065f46 !important; }
.badge-egreso { background: #ffe4e6 !important; color: #991b1b !important; }

.day-label { font-size: 11px; color: #7a94a0; font-weight: 600; margin-top: 4px; }
.uppercase-text { text-transform: uppercase; letter-spacing: 0.03em; }

/* Main Content columns */
.card-main-content { flex: 1; display: flex; align-items: center; gap: 20px; padding-left: 24px; }
.patient-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.patient-avatar.status-critical { background: #fff0f0; color: #de4343; border: 1px solid #fecaca; }

.patient-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; margin: 0; color: #1a2b2e; }
.patient-id { font-size: 12.5px; color: #4a5e68; margin: 3px 0 0; }
.doctor-sub { font-size: 11.5px; color: #7a94a0; margin: 1px 0 0; }

/* Actions column */
.card-status-area { display: flex; align-items: center; gap: 20px; }
.status-badge { padding: 5px 12px; border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.status-badge.critical { background: #fecaca; color: #b91c1c; }

.btn-action { border: none; padding: 9px 18px; border-radius: 10px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-action.order-btn { background: #115843; color: white; }
.btn-action.order-btn:hover { background: #073528; }

/* States & Loaders */
.loading-state { text-align: center; padding: 40px; color: #6b8896; grid-column: 1 / -1; }
.spinner { width: 28px; height: 28px; border: 3px solid #dbf3ea; border-top-color: #115843; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { background: white; padding: 35px; border-radius: 16px; text-align: center; color: #6b8896; font-size: 13.5px; border: 1px dashed #cedcd7; }
.success-icon { color: #1d9e75; margin-bottom: 8px; }

.icon-hand { animation: wave 2.2s infinite; transform-origin: 70% 70%; display: inline-block; }
@keyframes wave { 0%, 100% { transform: rotate(0); } 12% { transform: rotate(14deg); } 24% { transform: rotate(-8deg); } 36% { transform: rotate(10deg); } 48% { transform: rotate(-4deg); } 60% { transform: rotate(0); } }

@media (max-width: 1024px) {
  .dashboard-content-layout { grid-template-columns: 1fr; }
}
@media (max-width: 650px) {
  .appointment-card-horizontal { flex-direction: column; align-items: flex-start; gap: 16px; padding: 18px; }
  .card-left-info { border-right: none; border-bottom: 1.5px solid #edf3f1; width: 100%; padding: 0 0 10px 0; flex-direction: row; justify-content: space-between; min-width: auto; }
  .card-main-content { padding-left: 0; width: 100%; }
  .card-status-area { width: 100%; justify-content: space-between; }
}
</style>