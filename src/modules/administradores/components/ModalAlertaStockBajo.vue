<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content large-modal">
      
      <div class="modal-header">
        <div class="header-title-wrapper">
          <svg class="icon-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3>Control de Inventario: Alertas de Stock Bajo</h3>
        </div>
        <button class="btn-cerrar" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-filters">
          <div class="filter-input-group">
            <label>Definición de Umbral Crítico:</label>
            <select v-if="filtros" v-model="filtros.umbral" @change="ejecutarBusqueda" class="custom-select blueprint-select">
              <option :value="5">Menos de 5 unidades (Crítico)</option>
              <option :value="10">Menos de 10 unidades (Estándar)</option>
              <option :value="20">Menos de 20 unidades (Preventivo)</option>
              <option :value="50">Menos de 50 unidades (Abastecimiento Global)</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="state-container mini-state">
          <div class="spinner"></div>
          <p>Evaluando niveles de inventario en tiempo real...</p>
        </div>

        <div v-else-if="!datosReporte || datosReporte.length === 0" class="state-container mini-state empty-box">
          <svg class="icon-success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <p class="success-text">¡Todo en orden! Ningún medicamento se encuentra por debajo del umbral seleccionado.</p>
        </div>

        <div v-else class="modal-data-layout">
          <div class="table-wrapper">
            <table class="report-table">
              <thead>
                <tr>
                  <th style="width: 80px;">ID</th>
                  <th>Medicamento / Fármaco</th>
                  <th>Precio Ref.</th>
                  <th class="text-right" style="width: 150px;">Stock Actual</th>
                  <th class="text-center" style="width: 130px;">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in datosReporte" :key="item.id">
                  <td class="font-mono text-muted">#{{ item.id }}</td>
                  <td class="font-medium color-dark capitalized">
                    {{ item.nombre }}
                  </td>
                  <td class="font-mono">
                    ${{ parseFloat(item.precio || 0).toFixed(2) }}
                  </td>
                  <td class="text-right">
                    <span class="stock-badge-critical">
                      {{ item.stock }} {{ item.stock === 1 ? 'unidad' : 'unidades' }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="status-pill active-pill">
                      {{ item.estado }}
                    </span>
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
import { useAlertaStockBajo } from '../composables/useAlertasStockBajo.js';

const props = defineProps({
  isOpen: { type: Boolean, required: true }
});
defineEmits(['close']);

const { isOpen } = toRefs(props);
const { filtros, loading, datosReporte, fetchReporte } = useAlertaStockBajo(isOpen);

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
  max-width: 800px !important; 
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

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-warning {
  color: #ea580c;
  width: 22px;
  height: 22px;
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
  gap: 16px; 
  margin-bottom: 24px; 
  background: #ffffff; 
  padding: 0 0 20px 0;
  border-bottom: 1px solid #edf4f1;
}

.filter-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: #3d5260;
  width: 100%;
}

.blueprint-select {
  min-width: 280px;
}

.custom-select { 
  padding: 8px 14px; 
  border: 1px solid #dce8e4; 
  border-radius: 8px; 
  font-family: 'DM Sans', sans-serif; 
  color: #1a2b2e; 
  background-color: #fff; 
  outline: none; 
}
.custom-select:focus { 
  border-color: #0d9488; 
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
.report-table tbody tr:hover {
  background-color: #fffdfd; 
}

.color-dark { color: #1e293b; }
.font-medium { font-weight: 500; }
.font-mono { font-family: monospace; font-size: 0.95rem; }
.text-muted { color: #94a3b8; }
.capitalized { text-transform: capitalize; }

.stock-badge-critical {
  background: #fef2f2;
  color: #dc2626;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #fee2e2;
  display: inline-block;
}

.status-pill {
  padding: 3px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
}
.active-pill {
  background: #ecfdf5;
  color: #059669;
}

.text-center { text-align: center; }
.text-right { text-align: right; }

.state-container { padding: 60px 20px; text-align: center; color: #7a9aaa; font-size: 0.95rem; }
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.icon-success-check {
  color: #10b981;
  width: 44px;
  height: 44px;
}
.success-text {
  color: #0f766e;
  font-weight: 500;
}

.spinner { width: 36px; height: 36px; border: 3.5px solid #edfaf5; border-top-color: #1D9E75; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .modal-filters { flex-direction: column; align-items: stretch; }
}
</style>