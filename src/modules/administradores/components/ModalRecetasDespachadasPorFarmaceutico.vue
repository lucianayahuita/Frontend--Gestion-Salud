<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content large-modal">
      
      <!-- Encabezado Estilizado -->
      <div class="modal-header">
        <h3>Análisis de Datos: Flujo Histórico de Despacho</h3>
        <button class="btn-cerrar" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Caja de Filtros con Estilo Dashboard -->
        <div class="modal-filters">
          <div class="filter-input-group">
            <label>Farmacéutico:</label>
            <select v-model="filtros.farmaceutico_id" @change="ejecutarBusqueda" class="custom-select">
              <option value="" disabled>Seleccione un farmacéutico...</option>
              <option v-for="farmaceutico in farmaceuticos" :key="farmaceutico.id" :value="farmaceutico.id">
                {{ farmaceutico.name }}
              </option>
            </select>
          </div>
          <div class="filter-input-group">
            <label>Desde:</label>
            <input type="date" v-model="filtros.fecha_desde" @change="ejecutarBusqueda" class="custom-date" />
          </div>
          <div class="filter-input-group">
            <label>Hasta:</label>
            <input type="date" v-model="filtros.fecha_hasta" @change="ejecutarBusqueda" class="custom-date" />
          </div>
        </div>

        <!-- Estados de Carga y Mensajes -->
        <div v-if="loading" class="state-container mini-state">
          <div class="spinner"></div>
          <p>Consultando métricas de despacho en tiempo real...</p>
        </div>

        <div v-else-if="!filtros.farmaceutico_id" class="state-container mini-state">
          <p class="empty-text">Por favor seleccione un farmacéutico para evaluar su flujo histórico.</p>
        </div>

        <div v-else-if="!datosReporte" class="state-container mini-state">
          <p class="empty-text">No se encontraron registros de despacho en el periodo configurado.</p>
        </div>

        <!-- Layout de Datos Limpio en Ancho Completo -->
        <div v-else class="modal-data-layout">
          <div class="table-wrapper">
            <table class="report-table">
              <thead>
                <tr>
                  <th>Concepto Analizado</th>
                  <th class="text-right">Valor Obtenido</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="rank-badge badge-blue">1</span>
                    Total Movimientos de Despacho
                  </td>
                  <td class="text-right font-bold text-blue">
                    {{ datosReporte.total_movimientos_despacho || 0 }} mvtos.
                  </td>
                </tr>
                <tr class="row-highlight">
                  <td>
                    <span class="rank-badge badge-purple">2</span>
                    Recetas Únicas Despachadas
                  </td>
                  <td class="text-right font-bold text-purple">
                    {{ datosReporte.total_recetas_unicas_despachadas || 0 }} rec.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch } from 'vue';
import api from '@/api/axios.js';
import { useRecetasDespachadasPorFarmaceutico } from '../composables/useRecetasDespachadasPorFarmaceutico.js';

const props = defineProps({
  isOpen: { type: Boolean, required: true }
});
defineEmits(['close']);

const { isOpen } = toRefs(props);
const farmaceuticos = ref([]);

const { filtros, loading, datosReporte, fetchReporte } = useRecetasDespachadasPorFarmaceutico(isOpen);

const ejecutarBusqueda = () => {
  if (filtros.value.farmaceutico_id && typeof fetchReporte === 'function') {
    fetchReporte();
  }
};

const cargarFarmaceuticos = async () => {
  try {
    const { data } = await api.get('/users');
    const usuarios = data.data || data;
    if (Array.isArray(usuarios)) {
      farmaceuticos.value = usuarios.filter(u => String(u.row_id || u.rol_id) === '5');
      if (farmaceuticos.value.length > 0) {
        filtros.value.farmaceutico_id = farmaceuticos.value[0].id;
        ejecutarBusqueda();
      }
    }
  } catch (error) {
    console.error('Error inicializando catálogo de farmacia:', error);
  }
};

watch(isOpen, (newVal) => {
  if (newVal) {
    ejecutarBusqueda();
  }
});

onMounted(() => {
  cargarFarmaceuticos();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  backdrop-filter: blur(4px);
}

.large-modal { 
  font-family: 'DM Sans', sans-serif;
  max-width: 700px !important; 
  width: 90%; 
  background: #ffffff; 
  border: 1.5px solid #e8f0ed;
  border-radius: 20px; 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 20px 28px; 
  border-bottom: 1px solid #edf4f1; 
  background: #ffffff;
}

.modal-header h3 {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  color: #162427;
  font-weight: 700;
  margin: 0;
}

.btn-cerrar { 
  background: transparent; 
  border: none; 
  cursor: pointer; 
  color: #9dbfb3; 
  transition: all 0.2s;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.btn-cerrar:hover {
  background: #f0f6f3;
  color: #e05757;
}

.modal-body { 
  padding: 28px; 
  max-height: 80vh; 
  overflow-y: auto; 
}

.modal-filters { 
  display: flex; 
  flex-wrap: wrap;
  gap: 16px; 
  margin-bottom: 24px; 
  background: #ffffff; 
  padding: 0 0 20px 0;
  border-bottom: 1px solid #edf4f1;
}

.filter-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #3d5260;
}

.custom-select, .custom-date { 
  padding: 6px 12px; 
  border: 1px solid #dce8e4; 
  border-radius: 8px; 
  font-family: 'DM Sans', sans-serif; 
  color: #1a2b2e; 
  background-color: #fff; 
  outline: none; 
}
.custom-select:focus, .custom-date:focus { 
  border-color: #1D9E75; 
}

.modal-data-layout { 
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #edf4f1;
  border-radius: 12px;
}

.report-table { 
  width: 100%; 
  border-collapse: collapse; 
  text-align: left; 
  font-size: 0.9rem; 
}
.report-table th { 
  background: #0d9488; 
  color: white; 
  padding: 14px 16px; 
  font-weight: 600; 
}
.report-table td { 
  padding: 16px; 
  border-bottom: 1px solid #f4f8f6; 
  color: #3d5260; 
}
.report-table tbody tr:last-child td {
  border-bottom: none;
}
.report-table tbody tr:hover { 
  background: #fafdfc; 
}
.row-highlight { 
  background-color: #f9fafb; 
  font-weight: 500; 
}

.rank-badge { 
  padding: 2px 7px; 
  font-size: 11px; 
  font-weight: bold; 
  border-radius: 6px; 
  margin-right: 8px; 
}
.badge-blue { background: #eef4fb; color: #2563eb; }
.badge-purple { background: #f3eefb; color: #7c3aed; }

.text-right { text-align: right; }
.font-bold { font-weight: 600; }
.text-blue { color: #2563eb; }
.text-purple { color: #7c3aed; }

.state-container { padding: 60px 20px; text-align: center; color: #7a9aaa; font-size: 0.95rem; }
.empty-text { color: #9dbfb3; }
.spinner { width: 36px; height: 36px; border: 3.5px solid #edfaf5; border-top-color: #1D9E75; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .modal-filters { flex-direction: column; align-items: stretch; }
}
</style>