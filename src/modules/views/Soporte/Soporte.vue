<template>
  <div class="soporte-dashboard">

    <div class="bienvenida">
      <div>
        <h2 class="bienvenida-titulo">
          Bienvenido/a, {{ userName }} 
          <Hand class="mano-saludo" :size="24" color="#d97706" />
        </h2>
        <p class="bienvenida-sub">Aqui tienes un resumen de la actividad reciente del sistema</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">
          <component :is="stat.icon" :size="20" :stroke-width="1.8" :color="stat.color" />
        </div>
        <div class="stat-info">
          <span class="stat-value">
            <span v-if="loadingStats" class="skeleton"></span>
            <span v-else>{{ stat.value }}</span>
          </span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">Volumen Mensual de Citas</h3>
        <p class="chart-subtitle">Análisis comparativo del flujo de atenciones médicas por mes</p>
      </div>
      <div class="chart-container">
        <span v-if="loadingStats" class="chart-skeleton"></span>
        <Bar v-else :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <h3 class="seccion-titulo">Accesos rápidos</h3>
    
    <div class="accesos-grid">
      <router-link
        v-for="acceso in accesos"
        :key="acceso.label"
        :to="acceso.ruta"
        class="acceso-card"
      >
        <div class="acceso-icon" :style="{ background: acceso.bg }">
          <component :is="acceso.icon" :size="18" :stroke-width="1.8" :color="acceso.color" />
        </div>
        <div class="acceso-info">
          <span class="acceso-label">{{ acceso.label }}</span>
          <span class="acceso-desc">{{ acceso.desc }}</span>
        </div>
        <ChevronRight class="acceso-arrow" :size="16" :stroke-width="1.8" color="#b0c9bf" />
      </router-link>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth.js';
import api from '@/api/axios.js';
import { Users, Stethoscope, Pill, CalendarDays, ChevronRight, Hand } from 'lucide-vue-next';

// IMPORTACIÓN DE COMPONENTES PARA REGISTRO DE CHART.JS
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'SoporteDashboard',
  components: {
    ChevronRight,
    Hand,
    Bar
  },
  data() {
    return {
      loadingStats: true,
      totalPacientes: 0,
      totalMedicos: 0,
      totalFarmaceuticos: 0,
      citasHoy: 0,
      citasMensuales: Array(12).fill(0),
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a2b2e',
            titleFont: { family: 'Sora', size: 12 },
            bodyFont: { family: 'DM Sans', size: 13 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            grid: { color: '#f1f5f9', drawBorder: false },
            ticks: { color: '#7a9aaa', font: { family: 'DM Sans', size: 11 }, stepSize: 1 }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#3d5260', font: { family: 'DM Sans', size: 12, weight: '500' } }
          }
        }
      }
    };
  },
  computed: {
    userName() {
      const authStore = useAuthStore();
      return authStore.user?.name || 'Usuario';
    },
    formattedDate() {
      return new Date().toLocaleDateString('es-BO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    },
    stats() {
      return [
        {
          label: 'Pacientes registrados',
          value: this.totalPacientes,
          icon: Users,
          color: '#1D9E75', bg: '#e1f5ee'
        },
        {
          label: 'Médicos activos',
          value: this.totalMedicos,
          icon: Stethoscope,
          color: '#378ADD', bg: '#e6f1fb'
        },
        {
          label: 'Farmacéuticos',
          value: this.totalFarmaceuticos,
          icon: Pill,
          color: '#d97706', bg: '#faeeda'
        },
        {
          label: 'Citas hoy',
          value: this.citasHoy,
          icon: CalendarDays,
          color: '#7c3aed', bg: '#ede9fe'
        },
      ];
    },
    accesos() {
      return [
        {
          label: 'Gestión de Pacientes',
          desc: 'Ver y administrar pacientes registrados',
          ruta: '/soporte/pacientes',
          icon: Users,
          color: '#1D9E75', bg: '#e1f5ee'
        },
        {
          label: 'Gestión de Médicos',
          desc: 'Consultar el listado de médicos',
          ruta: '/soporte/medicos',
          icon: Stethoscope,
          color: '#378ADD', bg: '#e6f1fb'
        },
        {
          label: 'Gestión de Farmacéuticos',
          desc: 'Ver personal farmacéutico registrado',
          ruta: '/soporte/farmaceuticos',
          icon: Pill,
          color: '#d97706', bg: '#faeeda'
        },
        {
          label: 'Ver Citas Médicas',
          desc: 'Consultar todas las citas programadas',
          ruta: '/soporte/citas',
          icon: CalendarDays,
          color: '#7c3aed', bg: '#ede9fe'
        },
      ];
    },
    // Datos reactivos inyectados directamente al componente del gráfico
    chartData() {
      return {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Citas Concretadas',
            backgroundColor: '#1D9E75',
            hoverBackgroundColor: '#178562',
            borderRadius: 6,
            data: this.citasMensuales
          }
        ]
      };
    }
  },
  async mounted() {
    await this.cargarEstadisticas();
  },
  methods: {
    async cargarEstadisticas() {
      this.loadingStats = true;
      try {
        const [usersRes, pacientesRes, citasRes] = await Promise.all([
          api.get('/users'),
          api.get('/pacientes'),
          api.get('/citas'),
        ]);

        const users = usersRes.data?.data || usersRes.data || [];
        this.totalMedicos      = users.filter(u => u.rol_id === 2).length;
        this.totalFarmaceuticos = users.filter(u => u.rol_id === 5).length;

        const pacientes = pacientesRes.data?.data || pacientesRes.data || [];
        this.totalPacientes = Array.isArray(pacientes) ? pacientes.length : 0;

        const citas = citasRes.data?.data || citasRes.data || [];
        const hoy = new Date().toISOString().split('T')[0];
        this.citasHoy = Array.isArray(citas)
          ? citas.filter(c => c.fecha && c.fecha.startsWith(hoy)).length
          : 0;

        // PROCESAMIENTO DE HISTORIAL MENSUAL PARA EL GRÁFICO
        const conteoMensual = Array(12).fill(0);
        if (Array.isArray(citas)) {
          citas.forEach(cita => {
            if (cita.fecha) {
              // Extrae el índice del mes (formato esperado YYYY-MM-DD)
              const partes = cita.fecha.split('-');
              if (partes.length >= 2) {
                const mesIndice = parseInt(partes[1], 10) - 1;
                if (mesIndice >= 0 && mesIndice < 12) {
                  conteoMensual[mesIndice]++;
                }
              }
            }
          });
        }
        this.citasMensuales = conteoMensual;

      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      } finally {
        this.loadingStats = false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.soporte-dashboard {
  font-family: 'DM Sans', sans-serif;
  color: #3d5260;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bienvenida {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f6f9;
  border: 1px solid #d1e3ec; 
  border-radius: 14px;
  padding: 20px 24px;
}

.bienvenida-titulo {
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a2b2e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px; 
}

.mano-saludo {
  transform-origin: bottom right;
  animation: wave 1.5s ease-in-out infinite alternate;
}

@keyframes wave {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(15deg); }
}

.bienvenida-sub {
  font-size: 0.82rem;
  color: #7a9aaa;
  text-transform: capitalize;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}
.stat-card {
  background: #ffffff;
  border: 1px solid #e8f0ed;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a2b2e;
  line-height: 1;
  min-height: 1.4rem;
}
.skeleton {
  display: inline-block;
  width: 40px;
  height: 1.2rem;
  background: linear-gradient(90deg, #e8f0ed 25%, #f4faf7 50%, #e8f0ed 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 6px;
  vertical-align: middle;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.stat-label {
  font-size: 0.78rem;
  color: #7a9aaa;
  font-weight: 400;
}

/* ESTILOS ESTRUCTURALES DEL CONTENEDOR ANALÍTICO */
.chart-card {
  background: #ffffff;
  border: 1px solid #e8f0ed;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chart-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.chart-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a2b2e;
}
.chart-subtitle {
  font-size: 0.78rem;
  color: #7a9aaa;
}
.chart-container {
  position: relative;
  height: 220px;
  width: 100%;
}
.chart-skeleton {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 8px;
}

.seccion-titulo {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a2b2e;
  margin-bottom: -10px;
}

.accesos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.acceso-card {
  background: #ffffff;
  border: 1px solid #e8f0ed;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.acceso-card:hover {
  border-color: #4EB89D;
  box-shadow: 0 2px 12px rgba(78, 184, 157, 0.12);
}
.acceso-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.acceso-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.acceso-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a2b2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.acceso-desc {
  font-size: 0.75rem;
  color: #7a9aaa;
}
.acceso-arrow {
  flex-shrink: 0;
}
</style>