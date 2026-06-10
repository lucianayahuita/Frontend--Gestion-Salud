<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-content">
      
      <div class="modal-header">
        <div class="header-info">
          <h3 class="modal-title">Historial Clínico de Recetas</h3>
          <p class="header-sub">Consulte el histórico de medicamentos prescritos por paciente</p>
        </div>
        <button class="btn-cerrar" @click="cerrarModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        
        <div class="modal-filtros">
          <div class="filtro-group">
            <label>Paciente</label>
            <select v-model="filtros.paciente_id" @change="fetchReporte" class="filtro-select">
              <option value="" disabled>Seleccione un paciente...</option>
              <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
                {{ paciente.nombre || paciente.name || `Paciente #${paciente.id}` }}
              </option>
            </select>
          </div>

          <div class="filtro-group">
            <label>Desde</label>
            <input type="date" v-model="filtros.fecha_desde" @change="fetchReporte" class="filtro-date" />
          </div>

          <div class="filtro-group">
            <label>Hasta</label>
            <input type="date" v-model="filtros.fecha_hasta" @change="fetchReporte" class="filtro-date" />
          </div>
        </div>

        <div v-if="error" class="estado-box estado-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="#e05757" stroke-width="1.8" width="32" height="32">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01" stroke-linecap="round"/>
          </svg>
          <p>{{ error }}</p>
        </div>

        <div v-if="loading" class="estado-box">
          <div class="spinner"></div>
          <p>Extrayendo expediente histórico del paciente...</p>
        </div>

        <div v-else-if="!filtros.paciente_id" class="estado-box">
          <p class="estado-hint">Por favor, seleccione un paciente de la lista para cargar su historial de recetas.</p>
        </div>

        <div v-else-if="listaRecetas.length === 0" class="estado-box">
          <p class="estado-hint">No se encontraron recetas emitidas para este paciente dentro del periodo seleccionado.</p>
        </div>

        <div v-else class="modal-resultados">
          
          <div class="analytics-wrapper">
            <div class="resumen-cards">
              <div class="resumen-card resumen-card--green">
                <span class="resumen-valor">{{ totalRecetas }}</span>
                <span class="resumen-label">Total Recetas Emitidas</span>
              </div>
            </div>

            <div class="chart-wrapper-box">
              <p class="tabla-titulo">Frecuencia de Medicamentos Prescritos</p>
              <div class="chart-container">
                <Bar v-if="chartDataMapeada" :data="chartDataMapeada" :options="chartOptions" />
              </div>
            </div>
          </div>

          <div class="table-wrapper">
            <p class="tabla-titulo">Detalle de Medicación Histórica</p>
            <table class="tabla-reporte">
              <thead>
                <tr>
                  <th>Fecha / Cita</th>
                  <th>Medicamento e Indicaciones</th>
                  <th>Posología / Frecuencia</th>
                  <th>Duración</th>
                  <th class="text-right">Estado Despacho</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="receta in listaRecetas" :key="receta.id">
                  <td>
                    <div class="cell-date">{{ receta.cita?.fecha || 'N/A' }}</div>
                    <div class="cell-sub">Cita #{{ receta.cita_id }}</div>
                  </td>
                  <td>
                    <span class="med-name">{{ receta.medicamento?.nombre || 'No especificado' }}</span>
                    <div class="cell-sub indicaciones">{{ receta.indicaciones || 'Sin indicaciones adicionales' }}</div>
                  </td>
                  <td>
                    <div class="font-bold">{{ receta.dosis }}</div>
                    <div class="cell-sub">{{ receta.frecuencia }}</div>
                  </td>
                  <td>
                    <span class="duracion-txt">{{ receta.duracion }}</span>
                  </td>
                  <td class="text-right">
                    <span class="estado-badge" :class="badgeEstado(receta.estado_despacho)">
                      {{ receta.estado_despacho || 'pendiente' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secundario" @click="cerrarModal">Cerrar Historial</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRecetasEmitidasPorPaciente } from '../composables/useRecetasEmitidasPorPaciente.js'; 
import api from '@/api/axios.js'; 

import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

const {
  filtros,
  loading,
  error,
  listaRecetas,
  totalRecetas,
  chartDataMapeada,
  fetchReporte,
  limpiar
} = useRecetasEmitidasPorPaciente();

const pacientes = ref([]);

const cargarPacientes = async () => {
  try {
    const { data } = await api.get('/pacientes'); 
    pacientes.value = data.data || data;
  } catch (err) {
    console.error('Error al cargar catálogo de pacientes en modal:', err);
  }
};

const badgeEstado = (estado) => {
  const mapa = {
    'despachado':   'badge-green',
    'pendiente':    'badge-orange',
    'cancelado':    'badge-red',
    'en_proceso':   'badge-blue',
  };
  return mapa[estado?.toLowerCase()] || 'badge-gray';
};

const cerrarModal = () => {
  limpiar(); 
  emit('close');
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#edf4f1' } },
    x: { grid: { display: false } }
  }
};

onMounted(() => {
  cargarPacientes();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
}

.modal-content {
  background: #fff; border-radius: 18px;
  width: 92%; max-width: 980px;
  max-height: 88vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  font-family: 'DM Sans', sans-serif;
  display: flex; flex-direction: column;
}

/* Header */
.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #e8f0ed;
}
.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: #1a2b2e; margin-bottom: 3px;
}
.header-sub { font-size: 0.78rem; color: #7a9aaa; }

.btn-cerrar {
  background: none; border: none; cursor: pointer; color: #9dbfb3;
  padding: 4px; border-radius: 6px; transition: background 0.15s; flex-shrink: 0;
}
.btn-cerrar:hover { background: #f0f6f3; }

.modal-body { 
  overflow-y: auto; 
  background: #fff;
}

/* Filtros */
.modal-filtros {
  display: flex; flex-wrap: wrap; align-items: flex-end;
  gap: 16px; padding: 18px 24px;
  border-bottom: 1px solid #f0f6f3;
  background: #f7fcf9;
}
.filtro-group {
  display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 200px;
}
.filtro-group label {
  font-size: 0.7rem; font-weight: 700;
  color: #2d5c46; text-transform: uppercase; letter-spacing: 0.08em;
}
.filtro-select, .filtro-date {
  padding: 8px 12px; width: 100%;
  border: 1.5px solid #d8e9e3; border-radius: 9px;
  font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
  color: #1a3a2a; background: #fff; outline: none;
  transition: border-color 0.2s;
}
.filtro-select:focus, .filtro-date:focus { border-color: #1D9E75; }

/* Estados */
.estado-box {
  padding: 60px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  color: #9dbfb3; font-size: 0.88rem;
}
.estado-error { color: #e05757; padding: 30px; }
.estado-hint { color: #b0c9bf; font-size: 0.88rem; max-width: 450px; line-height: 1.5; }
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e1f5ee; border-top-color: #1D9E75;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Resultados */
.modal-resultados { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 24px; }

.analytics-wrapper { display: grid; grid-template-columns: 240px 1fr; gap: 20px; align-items: start; }
@media(max-width: 768px) { .analytics-wrapper { grid-template-columns: 1fr; } }

.resumen-cards { display: flex; flex-direction: column; width: 100%; }
.resumen-card {
  border-radius: 14px; padding: 22px 20px;
  display: flex; flex-direction: column; gap: 4px;
  border: 1.5px solid; text-align: center;
}
.resumen-card--green { background: #edfaf5; border-color: #a7e8d4; }
.resumen-valor {
  font-family: 'Sora', sans-serif;
  font-size: 1.8rem; font-weight: 700; color: #1a2b2e;
}
.resumen-label { font-size: 0.74rem; color: #7a9aaa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

.chart-wrapper-box { 
  background: #fbfdfc; border: 1px solid #edf4f1; border-radius: 14px; padding: 16px;
}
.chart-container { height: 140px; position: relative; width: 100%; }

/* Tabla Estilo Analítico */
.tabla-titulo {
  font-size: 0.75rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px;
}
.table-wrapper { overflow-x: auto; width: 100%; }
.tabla-reporte { width: 100%; border-collapse: collapse; font-size: 0.875rem; text-align: left; }
.tabla-reporte th {
  background: #f7fcf9; padding: 12px 14px;
  font-size: 0.72rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em;
  border-bottom: 1px solid #e8f0ed;
}
.tabla-reporte td {
  padding: 12px 14px; border-bottom: 1px solid #f0f6f3; color: #3d5260; vertical-align: top;
}
.tabla-reporte tbody tr:hover { background: #fbfdfc; }

.cell-date { font-weight: 600; color: #1a2b2e; }
.cell-sub { font-size: 0.75rem; color: #7a9aaa; margin-top: 2px; }
.med-name { font-weight: 600; color: #106e54; font-size: 0.9rem; }
.indicaciones { color: #527065; font-style: italic; max-width: 280px; line-height: 1.4; }
.duracion-txt { font-size: 0.85rem; color: #4a5d68; font-weight: 500; }

.text-right { text-align: right; }
.font-bold { font-weight: 600; color: #1a2b2e; }

/* Badges de Estado Sincronizados */
.estado-badge {
  font-size: 0.7rem; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; text-transform: capitalize; display: inline-block;
}
.badge-green   { background: #d1fae5; color: #059669; }
.badge-orange { background: #fef3c7; color: #d97706; }
.badge-red    { background: #fcebeb; color: #b91c1c; }
.badge-blue   { background: #dbeafe; color: #2563eb; }
.badge-gray   { background: #f3f4f6; color: #6b7280; }

/* Footer */
.modal-footer { 
  padding: 16px 24px; border-top: 1px solid #e8f0ed; 
  display: flex; justify-content: flex-end; background: #fafdfc;
}
.btn-secundario { 
  background: #fff; border: 1.5px solid #d8e9e3; color: #335243; 
  padding: 8px 20px; border-radius: 9px; font-weight: 600; font-size: 0.85rem;
  cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
}
.btn-secundario:hover { background: #f0f6f3; border-color: #b0c9bf; }
</style>