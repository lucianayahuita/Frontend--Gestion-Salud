<template>
  <div class="despacho-container animate-fade-in">
    
    <header class="section-header">
      <div>
        <h1 class="main-title">Flujo de Despacho de Recetas</h1>
        <p class="subtitle">Gestión de prescripciones médicas autorizadas y control de entrega de stock.</p>
      </div>
      <button class="btn-refresh" @click="obtenerRecetas" :disabled="cargando">
        <RefreshCw :size="15" :class="{ 'spin': cargando }" />
        <span>Actualizar Datos</span>
      </button>
    </header>

    <div class="filters-panel">
      <div class="filter-group-left">
        <div class="filter-select-wrapper">
          <Filter :size="14" class="icon-filter-prefix" />
          <select 
            v-model="filtroEstado" 
            @change="obtenerRecetas" 
            class="filter-select" 
            :disabled="cargando"
          >
            <option value="pendiente">Solo Pendientes</option>
            <option value="despachada">Solo Despachadas</option>
            <option value="">Ver Todo el Historial</option>
          </select>
        </div>
      </div>
      
      <div class="filter-group-right">
        <div class="counter-badge">
          <Activity :size="14" class="icon-pulse" />
          <span v-if="filtroEstado === 'pendiente'">Total: {{ recetas.length }} recetas pendientes</span>
          <span v-else-if="filtroEstado === 'despachada'">Total: {{ recetas.length }} recetas despachadas</span>
          <span v-else>Total: {{ recetas.length }} registros en lista</span>
        </div>
      </div>
    </div>

    <div v-if="cargando" class="state-container bg-card-panel">
      <div class="spinner"></div>
      <p>Sincronizando con el servidor médico...</p>
    </div>

    <div v-else-if="error" class="state-container error-box">
      <AlertCircle :size="28" />
      <p>{{ error }}</p>
      <button class="btn-retry" @click="obtenerRecetas">Reintentar Conexión</button>
    </div>

    <div v-else-if="recetas.length === 0" class="state-container empty-box">
      <CheckCircle :size="32" class="text-success" />
      <h3>Sin registros</h3>
      <p>No se encontraron recetas bajo el filtro seleccionado en este momento.</p>
    </div>

    <div v-else class="table-responsive table-card-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th>CÓDIGO RECETA</th>
            <th>MEDICAMENTO</th>
            <th>ESTADO DESPACHO</th>
            <th>TRATAMIENTO (DOSIS / DURACIÓN)</th>
            <th>INDICACIONES DE CONSULTA</th>
            <th class="text-center">ACCION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receta in recetas" :key="receta.id">
            
            <td>
              <span class="tr-code-badge">#REC-{{ receta.id }}</span>
            </td>
            
            <td>
              <div class="med-info-box">
                <div class="pill-icon-container">
                  <PillIcon :size="16" class="pill-svg" />
                </div>
                <div class="med-text-details">
                  <span class="med-name">{{ receta.medicamento?.nombre || 'No especificado' }}</span>
                  <span class="med-id">ID Ref: #{{ receta.medicamento_id }}</span>
                </div>
              </div>
            </td>
            
            <td>
              <span 
                :class="[
                  'status-badge', 
                  receta.estado_despacho === 'despachada' ? 'status-despachada' : 'status-pendiente'
                ]"
              >
                {{ receta.estado_despacho.toUpperCase() }}
              </span>
            </td>
            
            <td>
              <div class="treatment-box">
                <span class="treatment-main">{{ receta.dosis }} ({{ receta.frecuencia }})</span>
                <span class="treatment-sub">Durante {{ receta.duracion }}</span>
              </div>
            </td>
            
            <td>
              <p class="table-text-details" :title="receta.indicaciones">
                {{ receta.indicaciones || 'Sin especificaciones añadidas.' }}
              </p>
            </td>
            
            <td class="text-center">
              <button 
                v-if="receta.estado_despacho === 'pendiente'" 
                class="btn-action-truck" 
                @click="abrirDespacho(receta)"
              >
                <Truck :size="14" />
                <span>Despachar</span>
              </button>
              
              <span v-else class="text-completed-check" title="Transacción Finalizada">
                <Check :size="18" /> Listo
              </span>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
    <ModalDespachoReceta 
        :is-open="modalAbierto" 
        :receta="recetaSeleccionada" 
        @close="cerrarModal" 
        @saved="obtenerRecetas" 
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RefreshCw, AlertCircle, CheckCircle, Truck, Filter, Activity, Check, Pill as PillIcon } from 'lucide-vue-next';
import api from '@/api/axios.js';
import ModalDespachoReceta from './ModalDespachoReceta.vue';
const recetas = ref([]);
const cargando = ref(false);
const error = ref(null);

const filtroEstado = ref('pendiente');

const modalAbierto = ref(false);
const recetaSeleccionada = ref(null);

const obtenerRecetas = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const params = {};
    if (filtroEstado.value) {
      params.estado_despacho = filtroEstado.value;
    }

    const response = await api.get('recetas-medicas', { params });
    
    if (response.data && response.data.success) {
      recetas.value = response.data.data;
    } else {
      error.value = "No se pudo recuperar el listado del servidor de farmacia.";
    }
  } catch (err) {
    console.error(err);
    error.value = "Error al intentar comunicarse con el servidor.";
  } finally {
    cargando.value = false;
  }
};

const abrirDespacho = (receta) => {
  recetaSeleccionada.value = { ...receta };
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
  recetaSeleccionada.value = null;
};

onMounted(() => {
  obtenerRecetas();
});
</script>

<style scoped>
.despacho-container { padding: 4px; font-family: 'Inter', sans-serif; background-color: transparent; min-height: 85vh; }

/* Header Superior */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.main-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; color: #083b2c; margin: 0; }
.subtitle { font-size: 13px; color: #64748b; margin: 4px 0 0 0; }

.btn-refresh { background: #115843; border: none; padding: 10px 18px; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(17, 88, 67, 0.1); transition: background-color 0.2s; }
.btn-refresh:hover { background: #083b2c; }

/* Panel de Filtros Habilitado */
.filters-panel { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.filter-select-wrapper { display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0 12px; height: 38px; min-width: 200px; }
.icon-filter-prefix { color: #94a3b8; margin-right: 8px; }
.filter-select { background: transparent; border: none; font-size: 13px; color: #334155; font-weight: 600; outline: none; width: 100%; cursor: pointer; }

/* Contador Lateral */
.counter-badge { background: #e6f4f0; color: #115843; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.icon-pulse { animation: pulse 2s infinite; }

/* Tabla Estilo Tarjeta */
.table-card-wrapper { background: white; border: 1px solid #e2e8f0; border-radius: 12px 12px 0 0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
.custom-table th { background: #115843; padding: 14px 16px; font-weight: 600; color: white; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; }
.custom-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.custom-table tbody tr:hover { background-color: #f8fafc; }

.tr-code-badge { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: 700; color: #475569; font-size: 12px; }

/* Celda de Medicamento */
.med-info-box { display: flex; align-items: center; gap: 12px; }
.pill-icon-container { width: 32px; height: 32px; background: #e6f4f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.pill-svg { color: #115843; }
.med-text-details { display: flex; flex-direction: column; }
.med-name { font-weight: 700; color: #1e293b; font-size: 13.5px; }
.med-id { font-size: 11px; color: #94a3b8; margin-top: 1px; }

/* Cápsulas de Estado Dinámicas */
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; width: max-content; display: inline-block; }
.status-pendiente { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.status-despachada { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }

/* Detalles adicionales */
.treatment-box { display: flex; flex-direction: column; }
.treatment-main { font-weight: 600; color: #334155; }
.treatment-sub { font-size: 11px; color: #64748b; }
.table-text-details { color: #64748b; font-size: 13px; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; }

/* Botón Despachar (Solo pendientes) */
.btn-action-truck { background: #115843; border: none; padding: 8px 14px; border-radius: 6px; color: white; font-weight: 600; font-size: 12.5px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(17, 88, 67, 0.15); transition: all 0.2s ease; }
.btn-action-truck:hover { background: #083b2c; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(17, 88, 67, 0.2); }

/* Texto alternativo para las ya Despachadas */
.text-completed-check { display: inline-flex; align-items: center; gap: 4px; color: #047857; font-weight: 700; font-size: 13px; background: #f0fdf4; padding: 6px 12px; border-radius: 6px; border: 1px solid #dcfce7; }

/* Auxiliares */
.state-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 20px; text-align: center; color: #64748b; border-radius: 12px; margin-top: 10px; }
.bg-card-panel { background: white; border: 1px solid #e2e8f0; }
.spinner { width: 24px; height: 24px; border: 2.5px solid #e2e8f0; border-top-color: #115843; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 12px; }
.error-box { border: 1px solid #fca5a5; color: #991b1b; background: #fff5f5; }
.empty-box { border: 1px solid #bbf7d0; background: #f0fdf4; }
.empty-box h3 { margin: 10px 0 4px; color: #166534; font-family: 'Sora', sans-serif; font-size: 18px; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-fade-in { animation: fadeIn 0.22s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.995); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.text-center { text-align: center; }
</style>