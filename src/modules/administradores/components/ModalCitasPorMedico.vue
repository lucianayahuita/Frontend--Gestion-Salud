<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content medium-modal">
      
      <div class="modal-header">
        <div class="header-title-wrapper">
          <svg class="icon-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>Productividad: Total de Citas por Médico</h3>
        </div>
        <button class="btn-cerrar" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-filters-grid">
          <div class="filter-input-group full-width">
            <label>Médico Especialista:</label>
            <select v-model="filtros.medico_id" @change="ejecutarBusqueda" class="custom-select blueprint-select">
              <option value="" disabled>Seleccione un médico...</option>
              <option v-for="medico in medicos" :key="medico.id" :value="medico.id">
                Dr(a). {{ medico.name || medico.nombre }}
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

        <div v-if="loading || loadingMedicos" class="state-container mini-state">
          <div class="spinner"></div>
          <p>Consolidando agenda de citas médicas...</p>
        </div>

        <div v-else-if="medicos.length === 0" class="empty-inline-notice">
          No se encontraron usuarios registrados con el rol de médico (Rol 3) en el sistema.
        </div>

        <div v-else class="modal-data-layout animate-fade-in">
          
          <div class="kpi-scorecard">
            <span class="kpi-label">Total Citas Agendadas</span>
            <h2 class="kpi-value">{{ totalCitas }}</h2>
            <p class="kpi-subtext">En el periodo seleccionado</p>
          </div>

          <h4 class="section-subtitle">Distribución por Estado de Gestión</h4>
          
          <div class="distribution-list">
            
            <div class="distribution-item">
              <div class="item-meta">
                <span class="bullet-status completed"></span>
                <span class="status-name">Citas Completadas</span>
              </div>
              <span class="status-counter font-bold text-emerald">{{ desgloseEstados.completada }}</span>
            </div>

            <div class="distribution-item">
              <div class="item-meta">
                <span class="bullet-status pending"></span>
                <span class="status-name">Citas Pendientes</span>
              </div>
              <span class="status-counter font-bold text-amber">{{ desgloseEstados.pendiente }}</span>
            </div>

          </div>

          <div v-if="totalCitas === 0" class="empty-inline-notice">
            El profesional seleccionado no registra citas agendadas dentro del rango temporal provisto.
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch } from 'vue';
import api from '@/api/axios.js'; 
import { useTotalCitasPorMedico } from '../composables/useTotalCitasPorMedico.js';

const props = defineProps({
  isOpen: { type: Boolean, required: true }
});
defineEmits(['close']);

const { isOpen } = toRefs(props);
const { filtros, loading, totalCitas, desgloseEstados, fetchReporte } = useTotalCitasPorMedico(isOpen);

const medicos = ref([]);
const loadingMedicos = ref(false);
const cargarMedicosDelSistema = async () => {
  loadingMedicos.value = true;
  try {
    const { data } = await api.get('/users');
    const usuarios = data.data || data;
    
    if (Array.isArray(usuarios)) {
      medicos.value = usuarios.filter(u => String(u.rol_id || u.row_id) === '2');
      if (medicos.value.length > 0 && !filtros.value.medico_id) {
        filtros.value.medico_id = medicos.value[0].id;
      }
    }
  } catch (error) {
    console.error('Error al cargar médicos en el modal:', error);
  } finally {
    loadingMedicos.value = false;
  }
};

const ejecutarBusqueda = () => {
  if (typeof fetchReporte === 'function' && filtros.value.medico_id) {
    fetchReporte();
  }
};

watch(isOpen, async (newVal) => {
  if (newVal) {
    await cargarMedicosDelSistema();
    ejecutarBusqueda();
  }
});

onMounted(async () => {
  await cargarMedicosDelSistema();
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

.medium-modal { 
  font-family: 'DM Sans', sans-serif;
  max-width: 520px !important; 
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
  padding: 20px 24px; 
  border-bottom: 1px solid #edf4f1; 
  background: #ffffff;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-calendar {
  color: #0d9488;
  width: 20px;
  height: 20px;
}

.modal-header h3 {
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem;
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
  padding: 24px; 
  max-height: 82vh; 
  overflow-y: auto; 
}

.modal-filters-grid { 
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 22px; 
  background: #ffffff; 
  padding-bottom: 18px;
  border-bottom: 1px solid #edf4f1;
}

.full-width {
  grid-column: span 2;
}

.filter-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.82rem;
  color: #4a5d6b;
  font-weight: 500;
}

.custom-select, .custom-date { 
  padding: 8px 12px; 
  border: 1px solid #dce8e4; 
  border-radius: 8px; 
  font-family: 'DM Sans', sans-serif; 
  color: #1a2b2e; 
  background-color: #fff; 
  outline: none; 
  font-size: 0.88rem;
}
.custom-select:focus, .custom-date:focus { 
  border-color: #0d9488; 
}

.kpi-scorecard {
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  border: 1px solid #99f6e4;
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  margin-bottom: 22px;
}
.kpi-label {
  font-size: 0.85rem;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}
.kpi-value {
  font-family: 'Sora', sans-serif;
  font-size: 2.5rem;
  color: #115e59;
  margin: 6px 0;
  font-weight: 700;
}
.kpi-subtext {
  font-size: 0.8rem;
  color: #14b8a6;
  margin: 0;
}

.section-subtitle {
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  color: #1e293b;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.distribution-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fafdfc;
  border: 1px solid #f0f6f4;
  border-radius: 10px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bullet-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.completed { background-color: #10b981; }
.pending { background-color: #f59e0b; }

.status-name {
  font-size: 0.9rem;
  color: #334155;
  font-weight: 500;
}

.status-counter {
  font-size: 1rem;
}

.text-emerald { color: #0d9488; }
.text-amber { color: #d97706; }
.font-bold { font-weight: 600; }

.empty-inline-notice {
  margin-top: 16px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.5;
}

.state-container { padding: 40px 20px; text-align: center; color: #7a9aaa; font-size: 0.9rem; }
.spinner { width: 32px; height: 32px; border: 3px solid #edfaf5; border-top-color: #1D9E75; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>