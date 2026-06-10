<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">

        <div class="modal-header">
          <div class="header-info">
            <h3>Balance de Recetas por Estado</h3>
            <p class="header-sub">Visualice el volumen general y su distribución de entrega</p>
          </div>
          <button class="btn-cerrar" @click="cerrarModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-filtros">
          <div class="filtro-group">
            <label>Desde</label>
            <input type="date" v-model="filtros.fecha_desde" class="filtro-date">
          </div>
          <div class="filtro-group">
            <label>Hasta</label>
            <input type="date" v-model="filtros.fecha_hasta" class="filtro-date">
          </div>
          <button class="btn-consultar" @click="fetchReporte" :disabled="loading">
            {{ loading ? 'Consultando...' : 'Consultar' }}
          </button>
        </div>

        <div class="modal-body">
          <div v-if="loading" class="estado-box">
            <div class="spinner"></div>
            <p>Generando balance de recetas...</p>
          </div>

          <div v-else-if="error" class="estado-box estado-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e05757" stroke-width="1.8" width="32" height="32">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01" stroke-linecap="round"/>
            </svg>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="datos && datos.total_recetas === 0" class="estado-box">
            <p class="estado-hint">No se registraron movimientos en el período seleccionado</p>
          </div>

          <div v-else-if="datos" class="modal-resultados">

            <div class="resumen-cards">
              <div class="resumen-card resumen-card--green">
                <span class="resumen-valor">{{ datos.total_recetas }}</span>
                <span class="resumen-label">Total Recetas</span>
              </div>
              <div class="resumen-card resumen-card--blue">
                <span class="resumen-valor formated-date">{{ datos.fecha_desde }}</span>
                <span class="resumen-label">Desde</span>
              </div>
              <div class="resumen-card resumen-card--purple">
                <span class="resumen-valor formated-date">{{ datos.fecha_hasta }}</span>
                <span class="resumen-label">Hasta</span>
              </div>
            </div>

            <div v-if="datos.balance">
              <p class="tabla-titulo">Proporción por Estado de Surtido</p>
              <table class="tabla-reporte">
                <thead>
                  <tr>
                    <th>Estado de Despacho</th>
                    <th class="text-right">Cantidad</th>
                    <th class="text-right">% Rendimiento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(cantidad, estado) in datos.balance" :key="estado">
                    <td>
                      <span class="estado-badge" :class="badgeEstado(estado)">
                        {{ estado }}
                      </span>
                    </td>
                    <td class="text-right font-bold">{{ cantidad }}</td>
                    <td class="text-right text-muted">
                      {{ datos.total_recetas > 0 
                        ? ((cantidad / datos.total_recetas) * 100).toFixed(1) 
                        : 0 }}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secundario" @click="cerrarModal">Cerrar Balance</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useBalanceRecetas } from '../composables/useBalancePorEstadoDespacho.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);
const { datos, loading, error, filtros, fetchReporte, limpiar } = useBalanceRecetas();

const cerrarModal = () => {
  limpiar();
  emit('close');
};

const badgeEstado = (estado) => {
  const mapa = {
    'despachada':   'badge-green',
    'despachado':   'badge-green',
    'pendiente':    'badge-orange',
    'parcial':      'badge-blue',
    'en_proceso':   'badge-blue',
    'cancelado':    'badge-red',
  };
  return mapa[estado?.toLowerCase()] || 'badge-gray';
};

// Cargar reporte automáticamente al abrir el modal
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    limpiar();
    await fetchReporte();
  }
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
  display: flex; flex-direction: column;
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
.filtro-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 140px;}
.filtro-group label {
  font-size: 0.7rem; font-weight: 700;
  color: #2d5c46; text-transform: uppercase; letter-spacing: 0.08em;
}
.filtro-date {
  padding: 8px 12px; width: 100%;
  border: 1.5px solid #d8e9e3; border-radius: 9px;
  font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
  color: #1a3a2a; background: #fff; outline: none;
  transition: border-color 0.2s;
}
.filtro-date:focus { border-color: #1D9E75; }
.btn-consultar {
  padding: 9px 20px;
  background: #1D9E75; color: white;
  border: none; border-radius: 9px;
  font-size: 0.875rem; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.2s; align-self: flex-end;
}
.btn-consultar:hover { background: #0f6e56; }

.modal-body { padding: 0; overflow-y: auto; }

/* Estados alternos */
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
  border: 1.5px solid; text-align: center;
}
.resumen-card--green { background: #edfaf5; border-color: #a7e8d4; }
.resumen-card--blue  { background: #eef4fb; border-color: #bfdbfe; }
.resumen-card--purple{ background: #f3eefb; border-color: #ddd6fe; }
.resumen-valor {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #1a2b2e;
}
.resumen-valor.formated-date { font-size: 0.85rem; padding: 5px 0; color: #3d5260; }
.resumen-label { font-size: 0.72rem; color: #7a9aaa; font-weight: 500; }

/* Tabla */
.tabla-titulo {
  font-size: 0.8rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
}
.tabla-reporte { width: 100%; border-collapse: collapse; font-size: 0.875rem; text-align: left; }
.tabla-reporte th {
  background: #f7fcf9; padding: 10px 14px;
  font-size: 0.72rem; font-weight: 700; color: #2d5c46;
  text-transform: uppercase; letter-spacing: 0.07em;
  border-bottom: 1px solid #e8f0ed;
}
.tabla-reporte td { padding: 11px 14px; border-bottom: 1px solid #f0f6f3; color: #3d5260; }
.tabla-reporte tbody tr:last-child td { border-bottom: none; }
.tabla-reporte tbody tr:hover { background: #f7fcf9; }
.text-right { text-align: right; }
.text-muted { color: #9dbfb3; }
.font-bold { font-weight: 600; color: #1a2b2e; }

/* Badges */
.estado-badge {
  font-size: 0.72rem; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; text-transform: capitalize; display: inline-block;
}
.badge-green   { background: #d1fae5; color: #059669; }
.badge-orange { background: #fef3c7; color: #d97706; }
.badge-red     { background: #fcebeb; color: #b91c1c; }
.badge-blue   { background: #dbeafe; color: #2563eb; }
.badge-gray   { background: #f3f4f6; color: #6b7280; }

/* Footer */
.modal-footer { padding: 16px 24px; border-top: 1px solid #e8f0ed; display: flex; justify-content: flex-end; }
.btn-secundario {
  background: #fff; border: 1.5px solid #d8e9e3; color: #335243;
  padding: 8px 20px; border-radius: 9px; font-weight: 600; font-size: 0.85rem;
  cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
}
.btn-secundario:hover { background: #f0f6f3; border-color: #b0c9bf; }
</style>