<template>
  <div class="recetas-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Historial de Recetas Emitidas</h1>
        <p class="page-subtitle">
          Revisa y gestiona las recetas médicas que has emitido. Actualmente tienes
          <span class="count-tag">{{ recetas.length }} recetas registradas</span> en total.
        </p>
      </div>
      <button @click="recargarRecetas" class="btn-refresh" :disabled="loading">
        <RefreshCwIcon class="icon-spin" :class="{ 'spinning': loading }" :size="16" :stroke-width="2.5" />
        Sincronizar
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card total" @click="filtroEstado = 'todos'" :class="{ 'active-card': filtroEstado === 'todos' }">
        <div class="stat-content">
          <div class="stat-value">{{ recetas.length }}</div>
          <div class="stat-label">Total Emitidas</div>
        </div>
        <div class="stat-icon-wrapper">
          <FileTextIcon :size="24" :stroke-width="2" />
        </div>
      </div>

      <div class="stat-card pending" @click="filtroEstado = 'pendiente'" :class="{ 'active-card': filtroEstado === 'pendiente' }">
        <div class="stat-content">
          <div class="stat-value">{{ totalPendientes }}</div>
          <div class="stat-label">Pendientes en Farmacia</div>
        </div>
        <div class="stat-icon-wrapper">
          <ClockIcon :size="24" :stroke-width="2" />
        </div>
      </div>

      <div class="stat-card success" @click="filtroEstado = 'despachada'" :class="{ 'active-card': filtroEstado === 'despachada' }">
        <div class="stat-content">
          <div class="stat-value">{{ totalDespachadas }}</div>
          <div class="stat-label">Despachadas / Entregadas</div>
        </div>
        <div class="stat-icon-wrapper">
          <CheckCircle2Icon :size="24" :stroke-width="2" />
        </div>
      </div>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <SearchIcon class="search-icon" :size="18" :stroke-width="2" />
        <input 
          v-model="filtroBusqueda" 
          type="text" 
          placeholder="Buscar por medicamento, ID de cita o indicaciones..."
          class="input-search"
        />
      </div>

      <div class="filter-group">
        <label for="estado-filter">Filtrar por estado:</label>
        <select id="estado-filter" v-model="filtroEstado" class="select-filter">
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="despachada">Despachada</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="state-container loading-box">
      <div class="spinner"></div>
      <p class="state-text">Sincronizando con el servidor y cargando recetas...</p>
    </div>

    <div v-else-if="error" class="state-container error-box">
      <div class="error-icon">
        <AlertTriangleIcon :size="44" :stroke-width="2" />
      </div>
      <p class="error-text">{{ error }}</p>
      <button @click="recargarRecetas" class="btn-retry">Intentar de nuevo</button>
    </div>

    <div v-else-if="recetasFiltradas.length > 0" class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th>ID Receta</th>
            <th>Información de Cita</th>
            <th>Medicamento Prescrito</th>
            <th>Dosis y Frecuencia</th>
            <th>Duración</th>
            <th>Indicaciones Especiales</th>
            <th class="text-center">Estado de Despacho</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receta in recetasFiltradas" :key="receta.id">
            <td><span class="badge-id">#{{ receta.id }}</span></td>
            <td>
              <div class="cita-info">
                <span class="cita-id">Cita {{ receta.cita_id }}</span>
                <span class="cita-fecha">
                  <FileTextIcon class="inline-icon" :size="14" :stroke-width="2" />
                  {{ receta.cita?.fecha }}
                </span>
              </div>
            </td>
            <td>
              <span class="medicamento-tag">
                {{ receta.medicamento?.nombre }}
              </span>
            </td>
            <td>
              <div class="dosis-info">
                <span class="dosis-txt">{{ receta.dosis }}</span>
                <span class="frecuencia-badge">{{ receta.frecuencia }}</span>
              </div>
            </td>
            <td>
              <span class="duracion-txt">{{ receta.duracion }}</span>
            </td>
            <td class="col-indicaciones">
              <p class="text-truncate" :title="receta.indicaciones">{{ receta.indicaciones || 'Sin indicaciones adicionales' }}</p>
            </td>
            <td class="text-center">
              <span class="badge-status" :class="receta.estado_despacho.toLowerCase()">
                <span class="status-dot"></span>
                {{ receta.estado_despacho }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="state-container empty-box">
      <div class="empty-icon">
        <FolderOpenIcon :size="48" :stroke-width="1.5" />
      </div>
      <p class="state-text">No se encontraron registros médicos coincidentes.</p>
    </div>
  </div>
</template>

<script setup>
import { useVerRecetasEmitidas } from '../composables/useRecetasEmitidas.js';
import { 
  RefreshCw as RefreshCwIcon, 
  FileText as FileTextIcon, 
  Clock as ClockIcon, 
  CheckCircle2 as CheckCircle2Icon, 
  Search as SearchIcon, 
  AlertTriangle as AlertTriangleIcon, 
  FolderOpen as FolderOpenIcon 
} from 'lucide-vue-next';

const {
  recetas,
  recetasFiltradas,
  loading,
  error,
  filtroEstado,
  filtroBusqueda,
  totalPendientes,
  totalDespachadas,
  recargarRecetas
} = useVerRecetasEmitidas();
</script>

<style scoped>
.recetas-container {
  padding: 0.25rem 0rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  background-color: transparent;
  min-height: auto;
}

/* ── HEADER CORREGIDO Y COMPACTO ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; /* Añadimos espacio controlado hacia los KPIs inferiores */
}

/* Agrupador de texto con Flexbox interno */
.page-header > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Controla la separación exacta entre el título y el subtítulo */
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0; /* ¡CRUCIAL! Eliminamos el margen nativo que empujaba todo hacia abajo */
  line-height: 1.2;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px; /* Subimos de 10px a 14px para que sea legible y corporativo */
  margin: 0; /* Limpiamos márgenes */
  line-height: 1.4;
}

.count-tag {
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

/* ── BOTÓN SINCRONIZAR ── */
.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.625rem 1.25rem;
  background: rgba(15, 122, 90, 1);
  border: 1px solid rgba(15, 122, 90, 1);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.btn-refresh:hover:not(:disabled) {
  background: #0f7a5a;
  opacity: 0.9;
}
.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinning { animation: spin 1s linear infinite; }

/* ── DASHBOARD GRID KPIS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.08);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value { 
  font-size: 2.5rem; 
  font-weight: 800; 
  color: #0f172a; 
  line-height: 1; 
}
.stat-label { 
  font-size: 0.875rem; 
  color: #64748b; 
  font-weight: 600; 
}

.stat-card.total { border-left: 5px solid #0284c7; background: #fdfefe; }
.stat-card.total .stat-icon-wrapper { background: #e0f2fe; color: #0369a1; }

.stat-card.pending { border-left: 5px solid #d97706; background: #fffdfa; }
.stat-card.pending .stat-icon-wrapper { background: #fef3c7; color: #b45309; }

.stat-card.success { border-left: 5px solid #059669; background: #fafdfb; }
.stat-card.success .stat-icon-wrapper { background: #d1fae5; color: #047857; }

.stat-icon-wrapper {
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.total.active-card {
  border: 2px solid #0284c7;
  border-left-width: 6px;
  background: #f0f9ff;
}
.stat-card.pending.active-card {
  border: 2px solid #d97706;
  border-left-width: 6px;
  background: #fffbeb;
}
.stat-card.success.active-card {
  border: 2px solid #059669;
  border-left-width: 6px;
  background: #ecfdf5;
}

/* ── TOOLBAR & INPUTS ── */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}
.input-search {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
  font-size: 0.925rem;
  color: #1e293b;
  transition: all 0.2s ease;
}
.input-search:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}
.select-filter {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: white;
  min-width: 200px;
  outline: none;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
}

/* ── TABLA MODERNA CORREGIDA (CON CONTRASTE OSCURO) ── */
.table-responsive {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.925rem;
}
.custom-table th {
  background: rgba(13, 148, 136, 1);
  padding: 1.15rem 1rem;
  font-weight: 600;
  color: white;
  border-bottom: 1px solid #e2e8f0;
}
.custom-table td {
  padding: 1.15rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155; /* CORREGIDO: Cambiado de whitesmoke a slate oscuro para legibilidad */
}
.custom-table tbody tr:hover {
  background-color: #f8fafc;
}

/* ── BADGES E IDENTIFICADORES ── */
.badge-id {
  background: #f1f5f9;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}
.cita-info { display: flex; flex-direction: column; gap: 0.25rem; }
.cita-id { font-weight: 700; color: #1e293b; }
.cita-fecha { font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 0.35rem; }
.inline-icon { color: #94a3b8; }

.medicamento-tag {
  background-color: #f0fdf4;
  color: #166534;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #bbf7d0;
  display: inline-block;
}

.dosis-info { display: flex; flex-direction: column; gap: 0.35rem; }
.dosis-txt { font-weight: 600; color: #334155; }
.frecuencia-badge {
  font-size: 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  width: max-content;
}
.duracion-txt { font-weight: 500; color: #475569; }

.col-indicaciones { max-width: 260px; }
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* ── BADGES DE ESTADOS ── */
.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; }

.badge-status.pendiente { background: #fef3c7; color: #92400e; }
.badge-status.pendiente .status-dot { background: #d97706; }

.badge-status.despachada { background: #d1fae5; color: #065f46; }
.badge-status.despachada .status-dot { background: #059669; }

/* ── CONTENEDORES DE ESTADO GLOBAL ── */
.state-container {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}
.state-text { color: #64748b; margin-top: 1.25rem; font-size: 0.95rem; }

.error-box { border-color: #fee2e2; background-color: #fff5f5; }
.error-icon { display: flex; justify-content: center; color: #ef4444; margin-bottom: 1rem; }
.error-text { color: #991b1b; font-weight: 600; margin-bottom: 1.5rem; }
.btn-retry {
  padding: 0.625rem 1.25rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-retry:hover { background-color: #b91c1c; }

.empty-icon { display: flex; justify-content: center; color: #cbd5e1; }

.spinner {
  width: 44px;
  height: 44px;
  border: 3.5px solid #e2e8f0;
  border-top: 3.5px solid #0284c7;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.text-center { text-align: center; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>