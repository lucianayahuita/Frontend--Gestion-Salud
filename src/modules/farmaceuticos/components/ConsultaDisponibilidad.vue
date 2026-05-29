<template>
  <div class="inventario-container">
    
    <header class="page-header">
        <div class="header-info">
          <h1 class="page-title">Flujo de Movimientos</h1>
        </div>
        
        <div class="header-actions-global">
          <button class="btn-excel" @click="exportarAExcel" :disabled="cargando">
            <FileSpreadsheet :size="18" />
            Exportar Excel
          </button>

          <button class="btn-primary" @click="abrirModalRegistro">
            <ArrowUpDown :size="18" />
            Registrar Transacción
          </button>
        </div>
    </header>
    <section class="filters-card">
      <div class="filters-grid">
        <div class="select-box">
          <Filter :size="16" class="filter-icon" />
          <select v-model="filtros.tipo" class="input-select">
            <option value="">Todos los flujos</option>
            <option value="entrada">Entradas (Abastecimiento)</option>
            <option value="salida">Salidas (Despachos)</option>
          </select>
        </div>

        <div class="date-box">
          <span class="date-label">Desde:</span>
          <input type="date" v-model="filtros.fecha_desde" class="input-date" />
        </div>

        <div class="date-box">
          <span class="date-label">Hasta:</span>
          <input type="date" v-model="filtros.fecha_hasta" class="input-date" />
        </div>

        <button v-if="filtros.medicamento_id" class="btn-clear-filter" @click="limpiarFiltroMedicamento">
          Mostrar todos los medicamentos
        </button>
      </div>
      
      <div class="filter-actions">
        <div class="items-count-tag">
          <Activity :size="14" />
          <span>Total: {{ movimientos.length }} operaciones</span>
        </div>
      </div>
    </section>

    <main class="table-responsive-container">
      
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Consultando el historial de transacciones en tiempo real...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <AlertTriangle :size="32" class="text-danger-icon" />
        <p>{{ error }}</p>
        <button class="btn-retry" @click="cargarMovimientos">Reintentar conexión</button>
      </div>

      <table v-else class="custom-table">
        <thead>
          <tr>
            <th>Código TR</th>
            <th>Medicamento</th>
            <th>Tipo de Flujo</th>
            <th>Cantidad Operada</th>
            <th>Detalle / Justificación</th>
            <th>Fecha Operación</th>
            <th class="text-center">Accion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimientos" :key="mov.id" class="table-row">
            
            <td class="col-code">
              <span class="code-badge">#TR-{{ mov.id }}</span>
            </td>
            
            <td class="col-product">
              <div class="product-info-cell">
                <div class="product-avatar">
                  <Pill :size="18" />
                </div>
                <div class="product-texts">
                  <span class="product-name">{{ mov.medicamento?.nombre || 'Desconocido' }}</span>
                  <span class="product-desc">ID Ref: #{{ mov.medicamento_id }}</span>
                </div>
              </div>
            </td>
            
            <td>
              <span :class="['status-pill', mov.tipo === 'entrada' ? 'status-active' : 'status-inactive']">
                {{ mov.tipo === 'entrada' ? 'Entrada' : 'Salida' }}
              </span>
            </td>
            
            <td>
              <span :class="['stock-number', mov.tipo === 'entrada' ? 'text-success' : 'text-danger']">
                {{ mov.tipo === 'entrada' ? '+' : '-' }} {{ mov.cantidad }} uds
              </span>
            </td>
            
            <td class="col-motivo">
              <span class="motivo-text" :title="mov.detalle">
                {{ mov.detalle || 'Sin observaciones registradas' }}
              </span>
            </td>

            <td>
              <span class="date-text">{{ mov.fecha }}</span>
            </td>

            <td class="col-actions text-center">
              <div class="actions-wrapper">
                <button 
                  class="btn-action-view" 
                  @click="abrirDetalle(mov)" 
                  title="Ver detalle completo"
                >
                  <Eye :size="16" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="movimientos.length === 0">
            <td colspan="7" class="empty-table-cell">
              <div class="empty-box">
                <Inbox :size="40" />
                <p>No se encontraron movimientos registrados en este rango o tipo.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <RegistrarMovimientoFarmaciaModal 
      :isOpen="isModalOpen" 
      @close="isModalOpen = false" 
      @saved="sobreMovimientoGuardado" 
    />

    <VerDetalleMovimiento
      :isOpen="modalDetalleConfig.abierto"
      :movimientoId="modalDetalleConfig.idSeleccionado"
      @close="cerrarDetalle"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  ArrowUpDown, Filter, Activity, 
  Pill, Inbox, Eye, History, AlertTriangle,
  FileSpreadsheet 
} from 'lucide-vue-next';
import * as XLSX from 'xlsx'; // <── Importamos SheetJS
import { useListarMovimientosFarmacia } from '../composables/useListarMovimientosFarmacia.js';
import RegistrarMovimientoFarmaciaModal from './RegistrarMovimientoFarmacia.vue'; 
import VerDetalleMovimiento from './VerDetalleMovimiento.vue';

const { 
  movimientos, 
  cargando, 
  error, 
  filtros, 
  cargarMovimientos 
} = useListarMovimientosFarmacia();

const isModalOpen = ref(false);

onMounted(() => {
  cargarMovimientos(); 
});

const abrirModalRegistro = () => {
  isModalOpen.value = true; 
};

const sobreMovimientoGuardado = () => {
  cargarMovimientos(); 
};

const modalDetalleConfig = ref({
  abierto: false,
  idSeleccionado: null
});
const abrirDetalle = (item) => {
  const id = item && typeof item === 'object' ? item.id : item;

  if (!id) {
    console.warn("No se pudo abrir el detalle: El movimiento o ID proporcionado es inválido.");
    return;
  }

  modalDetalleConfig.value.idSeleccionado = id;
  modalDetalleConfig.value.abierto = true;
};

const cerrarDetalle = () => {
  modalDetalleConfig.value.abierto = false;
  modalDetalleConfig.value.idSeleccionado = null;
};

const filtrarPorMedicamento = (medicamentoId) => {
  filtros.medicamento_id = medicamentoId;
  cargarMovimientos(); 
};

const limpiarFiltroMedicamento = () => {
  filtros.medicamento_id = '';
  cargarMovimientos();
};
const exportarAExcel = () => {
  if (movimientos.value.length === 0) {
    alert("No hay datos disponibles en la tabla para exportar.");
    return;
  }
  const datosFormateados = movimientos.value.map(mov => ({
    "Código Transacción": `#TR-${mov.id}`,
    "Medicamento": mov.medicamento?.nombre || 'Desconocido',
    "ID Referencia Med.": mov.medicamento_id,
    "Tipo de Flujo": mov.tipo === 'entrada' ? 'Entrada' : 'Salida',
    "Cantidad": mov.cantidad,
    "Detalle / Justificación": mov.detalle || 'Sin observaciones',
    "Fecha Operación": mov.fecha
  }));
  const hoja = XLSX.utils.json_to_sheet(datosFormateados);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Historial de Movimientos");
  const fechaHoy = new Date().toISOString().split('T')[0];
  XLSX.writeFile(libro, `Kardex_Movimientos_Farmacia_${fechaHoy}.xlsx`);
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');

.inventario-container { padding: 5px; font-family: 'DM Sans', sans-serif; background: #f4f7f6; min-height: 100vh; color: #1a2b2e; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #115843; margin: 0; }
.page-subtitle { font-size: 14px; color: #6b8896; margin: 4px 0 0 0; }
/* Alineación de los botones del encabezado */
.header-actions-global {
  display: flex;
  align-items: center;
  gap: 12px; 
}

.btn-excel {
  background-color: #107c41; 
  color: white;
  border: none;
  padding: 11px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(16, 124, 65, 0.15);
  transition: all 0.2s ease;
}
.btn-excel:hover {
  background-color: #0b592e; 
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(16, 124, 65, 0.25);
}

.btn-excel:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(16, 124, 65, 0.15);
}

.btn-excel:disabled {
  background-color: #a7f3d0;
  color: #047857;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.btn-primary { background: #115843; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(17, 88, 67, 0.15); transition: all 0.2s ease; }
.btn-primary:hover { background: #073528; transform: translateY(-1px); }

.filters-card { background: white; border-radius: 16px; padding: 16px 20px; border: 1px solid #e3ede9; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.filters-grid { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.select-box { position: relative; }
.filter-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6b8896; pointer-events: none; }
.input-select { padding: 10px 24px 10px 36px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 13.5px; background-color: white; color: #4a5e68; outline: none; cursor: pointer; }

.date-box { display: flex; align-items: center; gap: 8px; }
.date-label { font-size: 12px; font-weight: 600; color: #6b8896; text-transform: uppercase; }
.input-date { padding: 8px 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-family: inherit; font-size: 13.5px; color: #1a2b2e; outline: none; }
.input-date:focus { border-color: #115843; }

.btn-clear-filter { background: #fffbeb; border: 1px solid #fde68a; color: #b45309; font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 10px; cursor: pointer; }
.btn-clear-filter:hover { background: #fef3c7; }

.filter-actions { display: flex; align-items: center; gap: 16px; }
.items-count-tag { background: #eefaf6; color: #115843; padding: 10px 14px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; }

/* ── TABLA UX ── */
.table-responsive-container { background: white; border-radius: 20px; border: 1px solid #e3ede9; box-shadow: 0 4px 20px rgba(0,0,0,0.01); overflow-x: auto; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
.custom-table th { background: #115843; font-family: 'Sora', sans-serif; color: #ffffff; font-weight: 600; padding: 16px 24px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.02em; }
.table-row { border-bottom: 1px solid #f1f5f9; transition: background-color 0.2s; }
.table-row:hover { background-color: #f8fafc; }
.custom-table td { padding: 16px 24px; vertical-align: middle; }

.code-badge { background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: 600; }
.product-info-cell { display: flex; align-items: center; gap: 14px; }
.product-avatar { width: 38px; height: 38px; border-radius: 10px; background: #eefaf6; color: #115843; display: flex; align-items: center; justify-content: center; }
.product-texts { display: flex; flex-direction: column; }
.product-name { font-family: 'Sora', sans-serif; font-weight: 600; color: #1a2b2e; }
.product-desc { font-size: 12px; color: #7a94a0; margin-top: 2px; }

.stock-number { font-family: 'Sora', sans-serif; font-weight: 700; }
.text-danger { color: #ef4444; }
.text-success { color: #10b981; }

.col-motivo { max-width: 250px; }
.motivo-text { font-size: 13px; color: #4a5e68; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.date-text { color: #64748b; font-weight: 500; font-size: 13.5px; }

.status-pill { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; }
.status-active { background: #d1fae5; color: #065f46; }
.status-inactive { background: #fee2e2; color: #991b1b; }

.actions-wrapper { display: flex; gap: 8px; justify-content: center; }
.btn-icon-action { border: none; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8fafc; color: #64748b; transition: all 0.15s ease; }
.btn-icon-action:hover { transform: translateY(-1px); }
.btn-icon-action.view:hover { background: #e0f2fe; color: #0369a1; }
.btn-icon-action.history:hover { background: #fef3c7; color: #b45309; }
.btn-action-view {
  background: #f1f5f9;       
  border: 1px solid #cbd5e1;color: #475569;padding: 8px;border-radius: 8px;cursor: pointer;display: inline-flex;align-items: center;justify-content: center;transition: all 0.2s ease;  
}

.btn-action-view:hover {
  background: #e2e8f0;color: #115843;border-color: #115843;      
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(17, 88, 67, 0.1); 
}

.btn-action-view:active {
  transform: translateY(0);  
  box-shadow: none;
}
.btn-action-view svg {
  display: block;
  flex-shrink: 0;            
}
.text-center { text-align: center; }

.loading-state { text-align: center; padding: 60px 20px; color: #6b8896; }
.spinner { width: 32px; height: 32px; border: 3px solid #dbf3ea; border-top-color: #115843; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

.error-state { text-align: center; padding: 40px 20px; color: #64748b; }
.text-danger-icon { color: #ef4444; margin-bottom: 8px; }
.btn-retry { background: white; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; margin-top: 12px; font-weight: 600; cursor: pointer; color: #475569; }
.btn-retry:hover { background: #f8fafc; }

.empty-table-cell { padding: 60px !important; }
.empty-box { display: flex; flex-direction: column; align-items: center; color: #94a3b8; gap: 12px; }

@media (max-width: 768px) {
  .filters-card { flex-direction: column; align-items: stretch; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .btn-primary { width: 100%; justify-content: center; }
}
</style>