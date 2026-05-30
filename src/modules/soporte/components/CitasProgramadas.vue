<template>
  <div class="citas-container">
    
    <div class="citas-header">
      <div>
        <h2 class="titulo-vista">Filtrar Citas y gestionarlas</h2>
      </div>
    </div>

    <div class="resumen-grid">
      <div class="resumen-card">
        <div class="resumen-icon" style="background: #ede9fe;">
          <CalendarDays :size="20" color="#7c3aed" />
        </div>
        <div class="resumen-info">
          <span class="resumen-valor">{{ totalCitasHoy }}</span>
          <span class="resumen-etiqueta">Citas de Hoy</span>
        </div>
      </div>
      <div class="resumen-card">
        <div class="resumen-icon" style="background: #fef3c7;">
          <Clock :size="20" color="#d97706" />
        </div>
        <div class="resumen-info">
          <span class="resumen-valor">{{ totalPendientes }}</span>
          <span class="resumen-etiqueta">Pendientes Globales</span>
        </div>
      </div>
      <div class="resumen-card">
        <div class="resumen-icon" style="background: #e1f5ee;">
          <CheckCircle2 :size="20" color="#1D9E75" />
        </div>
        <div class="resumen-info">
          <span class="resumen-valor">{{ citasFiltradas.length }}</span>
          <span class="resumen-etiqueta">Resultados Filtrados</span>
        </div>
      </div>
    </div>

    <div class="filtros-bar">
      <div class="filtro-item buscador-wrapper">
        <Search class="buscar-icon" :size="16" color="#7a9aaa" />
        <input 
          type="text" 
          v-model="filtroMedico" 
          placeholder="Buscar por médico..."
          class="input-control"
        >
      </div>

      <div class="filtro-item">
        <input 
          type="date" 
          v-model="filtroFecha" 
          class="input-control"
        >
      </div>

      <button 
        :class="['btn-toggle-proximas', { 'active': mostrarSoloProximas }]"
        @click="mostrarSoloProximas = !mostrarSoloProximas"
      >
        <ListFilter :size="16" />
        {{ mostrarSoloProximas ? 'Viendo Próximas' : 'Filtrar Próximas' }}
      </button>

      <button v-if="filtroMedico || filtroFecha || mostrarSoloProximas" class="btn-limpiar" @click="limpiarFiltros">
        Limpiar
      </button>
    </div>

    <div v-if="error" class="error-alert">
      {{ error }}
    </div>

    <div class="tabla-contenedor">
      <table class="tabla-citas">
        <thead>
          <tr>
            <th class="col-fecha-hora">Fecha / Hora</th>
            <th class="col-paciente">Paciente</th>
            <th class="col-medico">Médico</th>
            <th class="col-estado">Estado</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" v-for="n in 3" :key="'sk-'+n">
            <td colspan="5"><div class="table-skeleton"></div></td>
          </tr>

          <tr v-else-if="citasFiltradas.length > 0" v-for="cita in citasFiltradas" :key="cita.id">
            <td class="col-fecha-hora">
              <div class="fecha-hora-wrapper">
                <span class="fecha-texto">{{ cita.fecha }}</span>
                <span class="hora-badge">{{ cita.hora }}</span>
              </div>
            </td>
            <td class="col-paciente">
              <div class="paciente-info">
                <span class="nombre-principal">
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }} {{ cita.paciente?.segundo_apellido || '' }}
                </span>
                <span class="sub-detalle">Paciente ID: {{ cita.paciente_id }}</span>
              </div>
            </td>
            <td class="col-medico">
              <div class="medico-info">
                <span class="nombre-principal-medico">
                  {{ medicosMap[cita.medico_id] || 'Cargando médico...' }}
                </span>
              </div>
            </td>
            <td class="col-estado">
              <span :class="['estado-badge', cita.estado?.toLowerCase()]">
                {{ cita.estado }}
              </span>
            </td>
            <td class="col-acciones">
              <div class="acciones-botones">
                <button 
                  class="btn-accion" 
                  title="Ver detalles" 
                  @click="abrirModalDetalle(cita.id)"
                >
                  <Eye :size="16" color="#378ADD" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-else>
            <td colspan="5" class="tabla-vacia">
              <CalendarX :size="40" color="#7a9aaa" />
              <p>No se encontraron citas con los filtros aplicados.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <VerDetalleCitaModal 
    :is-open="modalOpen"
    :cita="citaDetalle"
    :loading="loadingDetalle"
    :error="errorDetalle"
    :nombre-medico="citaDetalle ? medicosMap[citaDetalle.medico_id] : ''"
    @close="cerrarModalDetalle"
  />
</template>

<script setup>
import { onMounted } from 'vue';
import { useVerCitas } from '../composables/useVerCitas.js';
import { useVerDetalleCita } from '../composables/useVerDetalleCita.js';
import VerDetalleCitaModal from './VerDetalleCitaModal.vue';
import { 
  CalendarDays, CheckCircle2, Clock, Search, ListFilter, 
  Eye, CalendarX 
} from 'lucide-vue-next';

const {
  citasFiltradas,
  medicosMap, 
  loading,
  error,
  filtroMedico,
  filtroFecha,
  mostrarSoloProximas,
  totalCitasHoy,
  totalPendientes,
  cargarCitas
} = useVerCitas();

const {
  isOpen: modalOpen,
  citaDetalle,
  loadingDetalle,
  errorDetalle,
  abrirModalDetalle,
  cerrarModalDetalle
} = useVerDetalleCita();

onMounted(() => {
  cargarCitas();
});

const limpiarFiltros = () => {
  filtroMedico.value = '';
  filtroFecha.value = '';
  mostrarSoloProximas.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

.citas-container {
  font-family: 'DM Sans', sans-serif;
  color: #3d5260;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.citas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.titulo-vista {
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a2b2e;
}

/* Grid superior */
.resumen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.resumen-card {
  background: white;
  border: 1px solid #e8f0ed;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.resumen-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resumen-info { display: flex; flex-direction: column; }
.resumen-valor {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a2b2e;
  line-height: 1.1;
}
.resumen-etiqueta { font-size: 0.75rem; color: #7a9aaa; }

/* Barra de Filtros */
.filtros-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: white;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e8f0ed;
  align-items: center;
}
.filtro-item {
  min-width: 200px;
}
.buscador-wrapper {
  position: relative;
}
.buscar-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.input-control {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e8f0ed;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #3d5260;
  outline: none;
  background: #fdfdfd;
}
.buscador-wrapper .input-control {
  padding-left: 36px;
}
.input-control:focus { border-color: #1D9E75; background: white; }

/* Botones de filtro */
.btn-toggle-proximas {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  transition: all 0.2s;
}
.btn-toggle-proximas.active {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0369a1;
}
.btn-limpiar {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.error-alert {
  padding: 12px;
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
  border-radius: 4px;
  font-size: 0.85rem;
}

/*  CONFIGURACIÓN DE ESTRUCTURA DE LA TABLA */
.tabla-contenedor {
  background: white;
  border: 1px solid #e8f0ed;
  border-radius: 12px;
  overflow: hidden;
}
.tabla-citas {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
  table-layout: fixed; 
}

.col-fecha-hora { width: 18%; }
.col-paciente   { width: 32%; }
.col-medico     { width: 20%; }
.col-estado     { width: 12%; }
.col-acciones   { width: 8%; } 

.tabla-citas th.col-acciones,
.tabla-citas td.col-acciones { 
  text-align: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.tabla-citas th {
  background: rgba(13, 148, 136, 1);
  padding: 14px 16px;
  color: white;
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e8f0ed;
}

.tabla-citas td {
  padding: 14px 16px;
  border-bottom: 1px solid #f4faf7;
  vertical-align: middle; 
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Contenidos Internos */
.fecha-hora-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
  align-items: flex-start;
}
.fecha-texto { font-size: 0.82rem; color: #475569; font-weight: 500; }
.hora-badge {
  background: #f0fdf4;
  color: #16a34a;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-block;
}

.paciente-info { 
  display: flex; 
  flex-direction: column; 
  gap: 2px; 
  align-items: flex-start;
}
.medico-info {
  display: flex;
  align-items: center;
}

.nombre-principal { font-weight: 600; color: #1a2b2e; font-size: 0.9rem; }
.nombre-principal-medico { font-weight: 500; color: #475569; font-size: 0.9rem; }
.sub-detalle { font-size: 0.75rem; color: #7a9aaa; }

.estado-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  text-transform: capitalize;
  text-align: center;
}
.estado-badge.pendiente { background: #fef3c7; color: #d97706; }
.estado-badge.completada, .estado-badge.atendido { background: #d1fae5; color: #065f46; }
.estado-badge.cancelado { background: #fee2e2; color: #991b1b; }

.acciones-botones { 
  display: flex; 
  justify-content: center; 
  align-items: center;
  width: 100%;
}

.btn-accion {
  border: 1px solid #e8f0ed;
  background: white;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-accion:hover { 
  background: #f8faf9; 
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.tabla-vacia { text-align: center; padding: 40px !important; color: #7a9aaa; }
.tabla-vacia p { margin-top: 10px; font-size: 0.9rem; }

.table-skeleton {
  height: 20px;
  background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>