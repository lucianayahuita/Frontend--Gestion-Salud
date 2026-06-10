<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content large-modal">
      
      <!-- Encabezado Estilizado -->
      <div class="modal-header">
        <h3>Análisis de Demanda: Medicamentos Más Prescritos</h3>
        <button class="btn-cerrar" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Barra de Filtros Temporal y de Rango -->
        <div class="modal-filters">
          <div class="filter-input-group">
            <label>Desde:</label>
            <input type="date" v-model="filtros.fecha_desde" @change="ejecutarBusqueda" class="custom-date" />
          </div>
          <div class="filter-input-group">
            <label>Hasta:</label>
            <input type="date" v-model="filtros.fecha_hasta" @change="ejecutarBusqueda" class="custom-date" />
          </div>
          <div class="filter-input-group">
            <label>Mostrar Top:</label>
            <select v-model="filtros.top" @change="ejecutarBusqueda" class="custom-select short-select">
              <option :value="3">3</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
          </div>
        </div>

        <!-- Estados de Carga y Mensajes -->
        <div v-if="loading" class="state-container mini-state">
          <div class="spinner"></div>
          <p>Calculando ranking de prescripciones en tiempo real...</p>
        </div>

        <div v-else-if="!datosReporte || datosReporte.length === 0" class="state-container mini-state">
          <p class="empty-text">No se registraron recetas médicas emitidas en el rango de fechas seleccionado.</p>
        </div>

        <!-- Tabla de Datos Adaptada a tu API -->
        <div v-else class="modal-data-layout">
          <div class="table-wrapper">
            <table class="report-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 90px;">Posición</th>
                  <th>Medicamento / Fármaco</th>
                  <th class="text-right">Total Prescripciones</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in datosReporte" 
                  :key="item.medicamento_id || index"
                  :class="{ 'row-top-three': index < 3 }"
                >
                  <td class="text-center">
                    <span class="rank-badge" :class="'badge-rank-' + (index + 1)">
                      #{{ index + 1 }}
                    </span>
                  </td>
                  <td class="font-medium color-dark capitalized">
                    {{ item.medicamento_nombre }}
                  </td>
                  <td class="text-right font-bold text-emerald">
                    {{ item.total_prescripciones }} {{ item.total_prescripciones === 1 ? 'receta' : 'recetas' }}
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
import { onMounted, toRefs, watch } from 'vue';
import { useMedicamentosMasPrescritosPorPeriodo } from '../composables/useMedicamentosMasPrescritosPorPeriodo.js';

const props = defineProps({
  isOpen: { type: Boolean, required: true }
});
defineEmits(['close']);

const { isOpen } = toRefs(props);

const { filtros, loading, datosReporte, fetchReporte } = useMedicamentosMasPrescritosPorPeriodo(isOpen);

const ejecutarBusqueda = () => {
  if (typeof fetchReporte === 'function') {
    fetchReporte();
  }
};

watch(isOpen, (newVal) => {
  if (newVal) {
    ejecutarBusqueda();
  }
});

onMounted(() => {
  ejecutarBusqueda();
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
  max-width: 750px !important; 
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

.short-select {
  padding-right: 28px;
  min-width: 70px;
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
  padding: 14px 16px; 
  border-bottom: 1px solid #f4f8f6; 
  color: #4a5d6b; 
}
.report-table tbody tr:last-child td {
  border-bottom: none;
}

.row-top-three {
  background-color: #fafdfc;
}
.color-dark {
  color: #1e293b;
}
.font-medium {
  font-weight: 500;
}
.capitalized {
  text-transform: capitalize;
}

/* Badges de Medallas para el Ranking */
.rank-badge {
  display: inline-block;
  padding: 3px 9px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
}
.badge-rank-1 { background: #fef3c7; color: #d97706; } 
.badge-rank-2 { background: #f1f5f9; color: #475569; } 
.badge-rank-3 { background: #ffedd5; color: #ea580c; } 
.badge-rank-4, .badge-rank-5, .badge-rank-6, .badge-rank-7, .badge-rank-8, .badge-rank-9, .badge-rank-10, .badge-rank-20 {
  background: #f0fdf4; color: #16a34a;
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.font-bold { font-weight: 600; }
.text-emerald { color: #0d9488; }

.state-container { padding: 60px 20px; text-align: center; color: #7a9aaa; font-size: 0.95rem; }
.empty-text { color: #9dbfb3; }
.spinner { width: 36px; height: 36px; border: 3.5px solid #edfaf5; border-top-color: #1D9E75; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .modal-filters { flex-direction: column; align-items: stretch; }
}
</style>