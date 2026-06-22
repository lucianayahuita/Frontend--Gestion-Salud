<template>
  <div class="logs-container">

    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Logs de Seguridad</h1>
        <p class="dashboard-sub">Registro de eventos críticos del sistema</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="analytics-card">
      <div class="analytics-header">
        <h2 class="section-title">Filtros</h2>
        <div class="filter-box">
          <div class="filter-input-group">
            <label>Tipo de evento:</label>
            <select v-model="filtros.tipo_evento" @change="fetchLogs(1)" class="custom-select">
              <option value="">Todos</option>
              <option value="login_exitoso">Login exitoso</option>
              <option value="login_fallido">Login fallido</option>
              <option value="logout">Logout</option>
              <option value="acceso_denegado">Acceso denegado</option>
              <option value="cambio_password_exitoso">Cambio de contraseña exitoso</option>
              <option value="cambio_password_fallido">Cambio de contraseña fallido</option>
              <option value="usuario_creado">Usuario creado</option>
              <option value="usuario_actualizado">Usuario actualizado</option>
              <option value="usuario_eliminado">Usuario eliminado</option>
            </select>
          </div>
          <div class="filter-input-group">
            <label>Desde:</label>
            <input type="date" v-model="filtros.fecha_desde" @change="fetchLogs(1)" class="custom-date" />
          </div>
          <div class="filter-input-group">
            <label>Hasta:</label>
            <input type="date" v-model="filtros.fecha_hasta" @change="fetchLogs(1)" class="custom-date" />
          </div>
          <button class="btn-reset" @click="resetFiltros">Limpiar</button>
        </div>
      </div>

      <!-- Estado cargando -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Cargando eventos de seguridad...</p>
      </div>

      <!-- Sin resultados -->
      <div v-else-if="logs.length === 0" class="state-container">
        <p class="empty-text">No se encontraron eventos para los filtros seleccionados.</p>
      </div>

      <!-- Tabla -->
      <div v-else class="table-wrapper">
        <table class="report-table">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Evento</th>
              <th>Usuario</th>
              <th>IP</th>
              <th>Endpoint</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td class="td-date">{{ formatFecha(log.created_at) }}</td>
              <td>
                <span class="badge" :class="badgeClass(log.tipo_evento)">
                  {{ formatEvento(log.tipo_evento) }}
                </span>
              </td>
              <td>{{ log.user?.name || 'Desconocido' }}<br><small>{{ log.user?.email || '—' }}</small></td>
              <td class="td-mono">{{ log.ip || '—' }}</td>
              <td class="td-mono">{{ log.metodo }} /{{ log.endpoint }}</td>
              <td class="td-desc">{{ log.descripcion }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="pagination" v-if="paginacion.lastPage > 1">
          <button
            class="btn-page"
            :disabled="paginacion.currentPage === 1"
            @click="fetchLogs(paginacion.currentPage - 1)"
          >← Anterior</button>
          <span class="page-info">Página {{ paginacion.currentPage }} de {{ paginacion.lastPage }}</span>
          <button
            class="btn-page"
            :disabled="paginacion.currentPage === paginacion.lastPage"
            @click="fetchLogs(paginacion.currentPage + 1)"
          >Siguiente →</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLogs } from '../composables/useLogs.js';

const { logs, loading, filtros, paginacion, fetchLogs, resetFiltros } = useLogs();

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-BO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatEvento = (tipo) => {
  const labels = {
    login_exitoso:           'Login exitoso',
    login_fallido:           'Login fallido',
    logout:                  'Logout',
    acceso_denegado:         'Acceso denegado',
    cambio_password_exitoso: 'Cambio contraseña ✓',
    cambio_password_fallido: 'Cambio contraseña ✗',
    usuario_creado:          'Usuario creado',
    usuario_actualizado:     'Usuario actualizado',
    usuario_eliminado:       'Usuario eliminado',
  };
  return labels[tipo] || tipo;
};

const badgeClass = (tipo) => {
  if (['login_exitoso', 'cambio_password_exitoso', 'usuario_creado'].includes(tipo)) return 'badge--green';
  if (['login_fallido', 'acceso_denegado', 'cambio_password_fallido', 'usuario_eliminado'].includes(tipo)) return 'badge--red';
  if (['logout'].includes(tipo)) return 'badge--gray';
  return 'badge--blue';
};

onMounted(() => fetchLogs());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

.logs-container {
  font-family: 'DM Sans', sans-serif;
  display: flex; flex-direction: column; gap: 16px;
  padding: 16px; color: #1a2b2e;
  background-color: #fafdfc; min-height: 100vh;
}

.dashboard-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; color: #162427; margin: 0 0 4px 0; }
.dashboard-sub { font-size: 0.74rem; color: #7a9aaa; margin: 0; }

.analytics-card { background: white; border: 1.5px solid #e8f0ed; border-radius: 20px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
.analytics-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; border-bottom: 1px solid #edf4f1; padding-bottom: 16px; }
.section-title { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 600; color: #1a2b2e; margin: 0; }

.filter-box { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.filter-input-group { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #3d5260; }
.custom-select, .custom-date { padding: 6px 12px; border: 1px solid #dce8e4; border-radius: 8px; font-family: 'DM Sans', sans-serif; color: #1a2b2e; background-color: #fff; outline: none; }
.custom-select:focus, .custom-date:focus { border-color: #1D9E75; }

.btn-reset { padding: 7px 16px; border-radius: 8px; border: 1.5px solid #dce8e4; background: #f4f8f7; color: #3d5260; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
.btn-reset:hover { background: #e8f0ed; }

.table-wrapper { overflow-x: auto; }
.report-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.report-table th { background: rgba(13,148,136,1); color: white; padding: 12px 14px; font-weight: 600; text-align: left; }
.report-table td { padding: 12px 14px; border-bottom: 1px solid #f4f8f6; color: #3d5260; vertical-align: top; }
.report-table tbody tr:hover { background: #fafdfc; }

.td-date { white-space: nowrap; font-size: 0.82rem; color: #7a9aaa; }
.td-mono { font-family: monospace; font-size: 0.82rem; }
.td-desc { max-width: 260px; font-size: 0.82rem; }

small { color: #9dbfb3; font-size: 0.75rem; }

.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
.badge--green { background: #edfaf5; color: #0f6e56; }
.badge--red   { background: #fcebeb; color: #b91c1c; }
.badge--gray  { background: #f3f4f6; color: #6b7280; }
.badge--blue  { background: #eef4fb; color: #2563eb; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 20px; }
.btn-page { padding: 7px 16px; border-radius: 8px; border: 1.5px solid #dce8e4; background: #f4f8f7; color: #3d5260; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
.btn-page:hover:not(:disabled) { background: #1D9E75; color: white; border-color: #1D9E75; }
.btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 0.85rem; color: #7a9aaa; }

.state-container { padding: 60px 20px; text-align: center; color: #7a9aaa; }
.empty-text { color: #9dbfb3; }
.spinner { width: 36px; height: 36px; border: 3.5px solid #edfaf5; border-top-color: #1D9E75; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>