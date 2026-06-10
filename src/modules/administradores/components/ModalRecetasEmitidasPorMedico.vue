<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">

        <div class="modal-header">
          <div class="header-info">
            <h3>Recetas emitidas por médico</h3>
            <p class="header-sub">Consulta el total y desglose por estado de despacho</p>
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

        <!-- Estado: cargando -->
        <div v-if="loading" class="estado-box">
          <div class="spinner"></div>
          <p>Generando reporte...</p>
        </div>

        <!-- Estado: error -->
        <div v-else-if="error" class="estado-box estado-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="#e05757" stroke-width="1.8" width="32" height="32">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01" stroke-linecap="round"/>
          </svg>
          <p>{{ error }}</p>
        </div>

        <!-- Estado: sin médico -->
        <div v-else-if="!filtros.medico_id" class="estado-box">
          <p class="estado-hint">Selecciona un médico y presiona Consultar</p>
        </div>

        <!-- Estado: sin datos -->
        <div v-else-if="datos && datos.total_recetas_emitidas === 0" class="estado-box">
          <p class="estado-hint">No hay recetas en el período seleccionado</p>
        </div>

        <!-- Resultados -->
        <div v-else-if="datos" class="modal-resultados">

          <!-- Card resumen -->
          <div class="resumen-cards">
            <div class="resumen-card resumen-card--green">
              <span class="resumen-valor">{{ datos.total_recetas_emitidas }}</span>
              <span class="resumen-label">Total recetas emitidas</span>
            </div>
            <div class="resumen-card resumen-card--blue">
              <span class="resumen-valor">{{ datos.fecha_desde }}</span>
              <span class="resumen-label">Desde</span>
            </div>
            <div class="resumen-card resumen-card--purple">
              <span class="resumen-valor">{{ datos.fecha_hasta }}</span>
              <span class="resumen-label">Hasta</span>
            </div>
          </div>

          <!-- Tabla desglose por estado -->
          <div v-if="datos.por_estado_despacho && datos.por_estado_despacho.length > 0">
            <p class="tabla-titulo">Desglose por estado de despacho</p>
            <table class="tabla-reporte">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th class="text-right">Cantidad</th>
                  <th class="text-right">% del total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in datos.por_estado_despacho" :key="idx">
                  <td>
                    <span class="estado-badge" :class="badgeEstado(item.estado)">
                      {{ item.estado }}
                    </span>
                  </td>
                  <td class="text-right font-bold">{{ item.cantidad }}</td>
                  <td class="text-right text-muted">
                    {{ datos.total_recetas_emitidas > 0
                      ? ((item.cantidad / datos.total_recetas_emitidas) * 100).toFixed(1)
                      : 0 }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else class="estado-hint" style="margin-top: 12px;">
            No hay desglose por estado disponible
          </p>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRecetasEmitidasPorMedico } from '../composables/useRecetasEmitidasPorMedico.js';
import api from '@/api/axios.js';
import { ref } from 'vue';

const emit = defineEmits(['close']);

const { datos, loading, error, filtros, fetchReporte, limpiar } = useRecetasEmitidasPorMedico();

const medicos = ref([]);

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

const badgeEstado = (estado) => {
  const mapa = {
    'despachado':   'badge-green',
    'pendiente':    'badge-orange',
    'cancelado':    'badge-red',
    'en_proceso':   'badge-blue',
  };
  return mapa[estado?.toLowerCase()] || 'badge-gray';
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
  width: 90%; max-width: 620px;
  max-height: 88vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  font-family: 'DM Sans', sans-serif;
}

/* Header */
.modal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #e8f0ed;
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

/* Filtros */
.modal-filtros {
  display: flex; flex-wrap: wrap; align-items: flex-end;
  gap: 12px; padding: 18px 24px;
  border-bottom: 1px solid #f0f6f3;
  background: #f7fcf9;
}
.filtro-group {
  display: flex; flex-direction: column; gap: 5px;
}
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

/* Estados */
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

/* Resultados */
.modal-resultados { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 20px; }

.resumen-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.resumen-card {
  border-radius: 12px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 4px;
  border: 1.5px solid;
}
.resumen-card--green { background: #edfaf5; border-color: #a7e8d4; }
.resumen-card--blue  { background: #eef4fb; border-color: #bfdbfe; }
.resumen-card--purple{ background: #f3eefb; border-color: #ddd6fe; }
.resumen-valor {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #1a2b2e;
}
.resumen-label { font-size: 0.72rem; color: #7a9aaa; font-weight: 500; }

/* Tabla */
.tabla-titulo {
  font-size: 0.8rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
}
.tabla-reporte { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.tabla-reporte th {
  background: #f7fcf9; padding: 10px 14px;
  font-size: 0.72rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em;
  border-bottom: 1px solid #e8f0ed;
}
.tabla-reporte td {
  padding: 11px 14px; border-bottom: 1px solid #f0f6f3; color: #3d5260;
}
.tabla-reporte tbody tr:last-child td { border-bottom: none; }
.tabla-reporte tbody tr:hover { background: #f7fcf9; }
.text-right { text-align: right; }
.text-muted { color: #9dbfb3; }
.font-bold { font-weight: 600; color: #1a2b2e; }

/* Badges estado */
.estado-badge {
  font-size: 0.72rem; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; text-transform: capitalize;
}
.badge-green  { background: #d1fae5; color: #059669; }
.badge-orange { background: #fef3c7; color: #d97706; }
.badge-red    { background: #fcebeb; color: #b91c1c; }
.badge-blue   { background: #dbeafe; color: #2563eb; }
.badge-gray   { background: #f3f4f6; color: #6b7280; }
</style>