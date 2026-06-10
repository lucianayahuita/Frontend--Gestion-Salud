<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">

        <div class="modal-header">
          <div class="header-info">
            <h3>Medicamentos más prescritos por médico</h3>
            <p class="header-sub">Ranking de medicamentos recetados en el período</p>
          </div>
          <button class="btn-cerrar" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Filtros -->
        <div class="modal-filtros">
          <div class="filtro-group">
            <label>Médico</label>
            <select v-model="filtros.medico_id" class="filtro-select">
              <option value="" disabled>Seleccione un médico...</option>
              <option v-for="m in medicos" :key="m.id" :value="m.id">
                Dr(a). {{ m.name }}
              </option>
            </select>
          </div>
          <div class="filtro-group">
            <label>Top</label>
            <select v-model.number="filtros.top" class="filtro-select filtro-select--sm">
              <option :value="3">Top 3</option>
              <option :value="5">Top 5</option>
              <option :value="10">Top 10</option>
            </select>
          </div>
          <div class="filtro-group">
            <label>Desde</label>
            <input type="date" v-model="filtros.fecha_desde" class="filtro-date">
          </div>
          <div class="filtro-group">
            <label>Hasta</label>
            <input type="date" v-model="filtros.fecha_hasta" class="filtro-date">
          </div>
          <button class="btn-consultar" @click="fetchReporte" :disabled="!filtros.medico_id || loading">
            {{ loading ? 'Consultando...' : 'Consultar' }}
          </button>
        </div>

        <!-- Cargando -->
        <div v-if="loading" class="estado-box">
          <div class="spinner"></div>
          <p>Generando reporte...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="estado-box estado-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="#e05757" stroke-width="1.8" width="32" height="32">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01" stroke-linecap="round"/>
          </svg>
          <p>{{ error }}</p>
        </div>

        <!-- Sin médico -->
        <div v-else-if="!filtros.medico_id" class="estado-box">
          <p class="estado-hint">Selecciona un médico y presiona Consultar</p>
        </div>

        <!-- Sin datos -->
        <div v-else-if="datos && (!datos.ranking || datos.ranking.length === 0)" class="estado-box">
          <p class="estado-hint">No hay prescripciones en el período seleccionado</p>
        </div>

        <!-- Resultados -->
        <div v-else-if="datos && datos.ranking" class="modal-resultados">

          <!-- Resumen -->
          <div class="resumen-cards">
            <div class="resumen-card resumen-card--blue">
              <span class="resumen-valor">{{ datos.ranking.length }}</span>
              <span class="resumen-label">Medicamentos distintos</span>
            </div>
            <div class="resumen-card resumen-card--green">
              <span class="resumen-valor">{{ totalPrescripciones }}</span>
              <span class="resumen-label">Total prescripciones</span>
            </div>
            <div class="resumen-card resumen-card--purple">
              <span class="resumen-valor">Top {{ datos.top }}</span>
              <span class="resumen-label">Mostrando</span>
            </div>
          </div>

          <!-- Tabla ranking -->
          <p class="tabla-titulo">Ranking de medicamentos</p>
          <table class="tabla-reporte">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicamento</th>
                <th class="text-right">Prescripciones</th>
                <th class="text-right">% del total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in datos.ranking" :key="item.medicamento_id">
                <td>
                  <span class="rank-badge" :class="rankClass(idx)">{{ idx + 1 }}</span>
                </td>
                <td class="td-nombre">{{ item.medicamento_nombre }}</td>
                <td class="text-right font-bold">{{ item.total_prescripciones }}</td>
                <td class="text-right text-muted">
                  {{ totalPrescripciones > 0
                    ? ((item.total_prescripciones / totalPrescripciones) * 100).toFixed(1)
                    : 0 }}%
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Barra visual -->
          <div class="barras-wrap">
            <p class="tabla-titulo">Distribución visual</p>
            <div
              v-for="(item, idx) in datos.ranking"
              :key="'barra-' + item.medicamento_id"
              class="barra-item"
            >
              <span class="barra-label">{{ item.medicamento_nombre }}</span>
              <div class="barra-track">
                <div
                  class="barra-fill"
                  :style="{
                    width: totalPrescripciones > 0
                      ? ((item.total_prescripciones / maxPrescripciones) * 100) + '%'
                      : '0%',
                    background: barraColor(idx)
                  }"
                ></div>
              </div>
              <span class="barra-valor">{{ item.total_prescripciones }}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMedicamentosMasPrescritosPorMedico } from '../composables/useMedicamentosPreescritosPorMedico.js';
import api from '@/api/axios.js';

const emit = defineEmits(['close']);

const { datos, loading, error, filtros, fetchReporte, limpiar } = useMedicamentosMasPrescritosPorMedico();

const medicos = ref([]);

const totalPrescripciones = computed(() => {
  if (!datos.value?.ranking) return 0;
  return datos.value.ranking.reduce((acc, item) => acc + item.total_prescripciones, 0);
});

const maxPrescripciones = computed(() => {
  if (!datos.value?.ranking || datos.value.ranking.length === 0) return 1;
  return Math.max(...datos.value.ranking.map(i => i.total_prescripciones));
});

const rankClass = (idx) => {
  if (idx === 0) return 'rank-oro';
  if (idx === 1) return 'rank-plata';
  if (idx === 2) return 'rank-bronce';
  return 'rank-default';
};

const barraColor = (idx) => {
  const colores = ['#1D9E75', '#2563eb', '#7c3aed', '#d97706', '#0d9488', '#e05757', '#059669', '#9333ea', '#dc2626', '#0891b2'];
  return colores[idx % colores.length];
};

const cargarMedicos = async () => {
  try {
    const { data } = await api.get('/users');
    const usuarios = data.data || data;
    if (Array.isArray(usuarios)) {
      medicos.value = usuarios.filter(u => u.rol_id === 2);
      if (medicos.value.length > 0) {
        filtros.value.medico_id = medicos.value[0].id;
      }
    }
  } catch (e) {
    console.error('Error cargando médicos:', e);
  }
};

onMounted(async () => {
  limpiar();
  await cargarMedicos();
  if (filtros.value.medico_id) await fetchReporte();
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
  width: 90%; max-width: 660px;
  max-height: 88vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  font-family: 'DM Sans', sans-serif;
}

.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 22px 24px 18px; border-bottom: 1px solid #e8f0ed;
}
.header-info h3 {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: #1a2b2e; margin-bottom: 3px;
}
.header-sub { font-size: 0.78rem; color: #7a9aaa; }
.btn-cerrar {
  background: none; border: none; cursor: pointer; color: #9dbfb3;
  padding: 4px; border-radius: 6px; transition: background 0.15s; flex-shrink: 0;
}
.btn-cerrar:hover { background: #f0f6f3; }

.modal-filtros {
  display: flex; flex-wrap: wrap; align-items: flex-end;
  gap: 12px; padding: 18px 24px;
  border-bottom: 1px solid #f0f6f3;
  background: #f7fcf9;
}
.filtro-group { display: flex; flex-direction: column; gap: 5px; }
.filtro-group label {
  font-size: 0.7rem; font-weight: 700;
  color: #2d5c46; text-transform: uppercase; letter-spacing: 0.08em;
}
.filtro-select, .filtro-date {
  padding: 8px 12px;
  border: 1.5px solid #d8e9e3; border-radius: 9px;
  font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
  color: #1a3a2a; background: #fff; outline: none;
  transition: border-color 0.2s;
}
.filtro-select--sm { width: 90px; }
.filtro-select:focus, .filtro-date:focus { border-color: #1D9E75; }
.btn-consultar {
  padding: 9px 20px;
  background: #1D9E75; color: white;
  border: none; border-radius: 9px;
  font-size: 0.875rem; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.2s; align-self: flex-end;
}
.btn-consultar:hover { background: #0f6e56; }
.btn-consultar:disabled { background: #b0c9bf; cursor: not-allowed; }

.estado-box {
  padding: 52px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  color: #9dbfb3; font-size: 0.88rem;
}
.estado-error { color: #e05757; }
.estado-hint { color: #b0c9bf; font-size: 0.85rem; }
.spinner {
  width: 30px; height: 30px;
  border: 3px solid #e1f5ee; border-top-color: #1D9E75;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.modal-resultados { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 20px; }

.resumen-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.resumen-card {
  border-radius: 12px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px; border: 1.5px solid;
}
.resumen-card--green  { background: #edfaf5; border-color: #a7e8d4; }
.resumen-card--blue   { background: #eef4fb; border-color: #bfdbfe; }
.resumen-card--purple { background: #f3eefb; border-color: #ddd6fe; }
.resumen-valor {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #1a2b2e;
}
.resumen-label { font-size: 0.72rem; color: #7a9aaa; font-weight: 500; }

.tabla-titulo {
  font-size: 0.8rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
}
.tabla-reporte { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.tabla-reporte th {
  background: #f7fcf9; padding: 10px 14px;
  font-size: 0.72rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em;
  border-bottom: 1px solid #e8f0ed; text-align: left;
}
.tabla-reporte td { padding: 11px 14px; border-bottom: 1px solid #f0f6f3; color: #3d5260; }
.tabla-reporte tbody tr:last-child td { border-bottom: none; }
.tabla-reporte tbody tr:hover { background: #f7fcf9; }
.td-nombre { font-weight: 500; color: #1a2b2e; }
.text-right { text-align: right; }
.text-muted { color: #9dbfb3; }
.font-bold { font-weight: 600; color: #1a2b2e; }

.rank-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px;
  font-size: 0.75rem; font-weight: 700;
}
.rank-oro    { background: #fef3c7; color: #b45309; }
.rank-plata  { background: #f3f4f6; color: #6b7280; }
.rank-bronce { background: #fef3e2; color: #92400e; }
.rank-default{ background: #eef4fb; color: #2563eb; }

/* Barras */
.barras-wrap { display: flex; flex-direction: column; gap: 10px; }
.barra-item { display: flex; align-items: center; gap: 10px; }
.barra-label {
  width: 130px; flex-shrink: 0;
  font-size: 0.8rem; color: #3d5260;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.barra-track {
  flex: 1; height: 10px;
  background: #f0f6f3; border-radius: 20px; overflow: hidden;
}
.barra-fill {
  height: 100%; border-radius: 20px;
  transition: width 0.4s ease;
}
.barra-valor {
  width: 28px; text-align: right;
  font-size: 0.78rem; font-weight: 600; color: #1a2b2e;
}
</style>