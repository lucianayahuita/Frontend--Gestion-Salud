<template>
  <div class="inventario-container">
    
    <header class="page-header">
      <div class="header-info">
        <h1 class="page-title">Medicamentos en almacen</h1>
      </div>
      
      <button class="btn-primary" @click="abrirModalCrear">
        <Plus :size="18" />
        Registrar Medicamento
      </button>
    </header>

    <section class="filters-card">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="filtros.search" 
          type="text" 
          placeholder="Buscar por nombre, código o descripción..." 
          class="input-search"
        />
      </div>
      
      <div class="filter-actions">
        <div class="select-box">
          <Filter :size="16" class="filter-icon" />
          <select v-model="filtros.estado" class="input-select">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div class="items-count-tag">
          <Layers :size="14" />
          <span>Total: {{ totalItems }} productos</span>
        </div>
      </div>
    </section>

    <main class="table-responsive-container">
      
      <div v-if="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Actualizando catálogo de almacén...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <AlertTriangle :size="32" />
        <p>{{ error }}</p>
      </div>

      <table v-else class="custom-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Stock Actual</th>
            <th>Estado</th>
            <th>Precio Unitario</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="med in medicamentos" :key="med.id" class="table-row">
            
            <td class="col-code">
              <span class="code-badge">#{{ med.id }}</span>
            </td>
            
            <td class="col-product">
              <div class="product-info-cell">
                <div class="product-avatar">
                  <Pill :size="18" />
                </div>
                <div class="product-texts">
                  <span class="product-name">{{ med.nombre }}</span>
                  <span class="product-desc">{{ med.descripcion || 'Sin descripción' }}</span>
                </div>
              </div>
            </td>
            
            <td class="col-stock">
              <div class="stock-info">
                <span :class="['stock-number', esStockCritico(med) ? 'text-danger' : 'text-success']">
                  {{ med.stock }} unidades
                </span>
                <span class="stock-min">Mín: {{ med.stock_minimo || 10 }}</span>
              </div>
            </td>
            
            <td class="col-status">
              <span :class="['status-pill', med.estado === 'activo' ? 'status-active' : 'status-inactive']">
                {{ med.estado }}
              </span>
            </td>
            
            <td class="col-price">
              <span class="price-value">${{ Number(med.precio).toFixed(2) }}</span>
            </td>
            
            <td class="col-actions text-center">
              <div class="actions-wrapper">
                <button class="btn-icon-action view" title="Ver Detalle" @click="verDetalle(med)">
                  <Eye :size="16" />
                </button>
                <button class="btn-icon-action edit" title="Modificar" @click="solicitarEdicion(med)">
                  <Edit3 :size="16" />
                </button>
                <button class="btn-icon-action delete" title="Eliminar" @click="solicitarEliminacion(med)">
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>

          </tr>

          <tr v-if="medicamentos.length === 0">
            <td colspan="6" class="empty-table-cell">
              <div class="empty-box">
                <Inbox :size="40" />
                <p>No se encontraron medicamentos que coincidan con la búsqueda.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
    <VerDetalleMedicamento 
      :visible="modalVisible" 
      :medicamento="medDetalle" 
      :cargando="modalCargando" 
      :error="modalError" 
      @close="cerrarDetalle" 
    />
    <RegistrarMedicamento
      :visible="modalCrearVisible"
      :formulario="formCrear"
      :guardando="modalCrearGuardando"
      :error="modalCrearError"
      @close="cerrarModalCrear"
      @submit="procesarNuevoMedicamento"
    />
    <ModificarMedicamento
      :visible="visibleModificar"
      :formulario="formularioModificar"
      :modificando="modificando"
      :error="errorModificar"
      @close="cerrarModalEditar"
      @submit="procesarModificacion"
    />
    <EliminarMedicamento
      :visible="visibleEliminar"
      :medicamento="medicamentoParaEliminar"
      :eliminando="eliminando"
      :error="errorEliminar"
      @close="cerrarModalEliminar"
      @confirm="procesarEliminacion"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { 
  Plus, Search, Filter, Layers, Pill, 
  Eye, Edit3, Trash2, Inbox, AlertTriangle 
} from 'lucide-vue-next';

// Importación de Composables
import { useListarMedicamentos } from '../composables/useListarMedicamentos.js';
import { useVerDetalleMedicamento } from '../composables/useVerDetalleMedicamento.js';
import { useRegistrarMedicamento } from '../composables/useRegistrarMedicamento.js';
import { useModificarMedicamento } from '../composables/useModificarMedicamento.js';
import { useEliminarMedicamento } from '../composables/useEliminarMedicamento.js';

// Importación de Componentes Modales
import VerDetalleMedicamento from '../components/VerDetalleMedicamento.vue';
import RegistrarMedicamento from '../components/RegistrarMedicamento.vue';
import ModificarMedicamento from '../components/ModificarMedicamento.vue';
import EliminarMedicamento from '../components/EliminarMedicamento.vue'; 

const { medicamentos, totalItems, cargando, error, filtros, cargarMedicamentos } = useListarMedicamentos();

const { 
  medicamento: medDetalle, cargando: modalCargando, error: modalError, 
  visible: modalVisible, abrirDetalle, cerrarDetalle 
} = useVerDetalleMedicamento();

const {
  formulario: formCrear, guardando: modalCrearGuardando, error: modalCrearError,
  visible: modalCrearVisible, abrirModal: abrirHookCrear, cerrarModal: cerrarModalCrear,
  ejecutarRegistro
} = useRegistrarMedicamento();

const {
  formularioModificar, modificando, errorModificar, visibleModificar,
  abrirModalEditar, cerrarModalEditar, ejecutarActualizacion
} = useModificarMedicamento();

const {
  eliminando, errorEliminar, visibleEliminar, medicamentoParaEliminar,
  abrirModalEliminar, cerrarModalEliminar, ejecutarEliminacion
} = useEliminarMedicamento();

const esStockCritico = (med) => {
  const min = med.stock_minimo || 10;
  return Number(med.stock) <= Number(min);
};

const abrirModalCrear = () => {
  abrirHookCrear();
};

const procesarNuevoMedicamento = async () => {
  try {
    await ejecutarRegistro();
    await cargarMedicamentos(); 
  } catch (err) {}
};

const verDetalle = (med) => {
  abrirDetalle(med.id);
};

const solicitarEdicion = (med) => {
  abrirModalEditar(med);
};

const procesarModificacion = async () => {
  try {
    await ejecutarActualizacion();
    await cargarMedicamentos();
  } catch (err) {}
};

const solicitarEliminacion = (med) => {
  abrirModalEliminar(med);
};

const procesarEliminacion = async () => {
  try {
    await ejecutarEliminacion();
    await cargarMedicamentos();
  } catch (err) {}
};

onMounted(() => {
  cargarMedicamentos();
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');

.inventario-container {
  padding: 2px;
  font-family: 'DM Sans', sans-serif;
  background: #f4f7f6;
  min-height: 100vh;
  color: #1a2b2e;
}

/* ── HEADER ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #115843; /* Verde marca corporativo */
  margin: 0;
}
.page-subtitle {
  font-size: 14px;
  color: #6b8896;
  margin: 4px 0 0 0;
}

.btn-primary {
  background: #115843;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(17, 88, 67, 0.15);
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #073528;
  transform: translateY(-1px);
}

/* ── COMPONENTE FILTROS ── */
.filters-card {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  border: 1px solid #e3ede9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.search-box {
  flex: 1;
  position: relative;
  max-width: 450px;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}
.input-search {
  width: 100%;
  padding: 11px 16px 11px 42px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.input-search:focus {
  border-color: #115843;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.select-box {
  position: relative;
}
.filter-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b8896;
}
.input-select {
  padding: 10px 16px 10px 36px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 13.5px;
  background-color: white;
  color: #4a5e68;
  outline: none;
  cursor: pointer;
}

.items-count-tag {
  background: #eefaf6;
  color: #115843;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── DISEÑO DE LA TABLA ESTILO UX ── */
.table-responsive-container {
  background: white;
  border-radius: 20px;
  border: 1px solid #e3ede9;
  box-shadow: 0 4px 20px rgba(0,0,0,0.01);
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.custom-table th {
  background: rgba(15, 122, 90, 1);
  font-family: 'Sora', sans-serif;
  color: #ffffff;
  font-weight: 600;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}
.table-row:hover {
  background-color: #f8fafc;
}

.custom-table td {
  padding: 16px 24px;
  vertical-align: middle;
}

/* BADGES Y CELDAS PERSONALIZADAS */
.code-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-weight: 600;
}

.product-info-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}
.product-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eefaf6;
  color: #115843;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-texts {
  display: flex;
  flex-direction: column;
}
.product-name {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  color: #1a2b2e;
}
.product-desc {
  font-size: 12px;
  color: #7a94a0;
  margin-top: 2px;
}

.stock-info {
  display: flex;
  flex-direction: column;
}
.stock-number {
  font-weight: 600;
}
.stock-min {
  font-size: 11px;
  color: #94a3b8;
}

.text-danger { color: #ef4444; }
.text-success { color: #10b981; }

/* BADGES DE ESTADO */
.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}
.status-active {
  background: #d1fae5;
  color: #065f46;
}
.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.price-value {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  color: #1a2b2e;
}

/* ACCIONES */
.actions-wrapper {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.btn-icon-action {
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f8fafc;
  color: #64748b;
  transition: all 0.15s ease;
}
.btn-icon-action:hover {
  transform: translateY(-1px);
}
.btn-icon-action.view:hover { background: #e0f2fe; color: #0369a1; }
.btn-icon-action.edit:hover { background: #fef3c7; color: #b45309; }
.btn-icon-action.delete:hover { background: #fee2e2; color: #b91c1c; }

.text-center { text-align: center; }

/* RECTANGULOS DE CARGA / VACÍO */
.loading-state, .error-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b8896;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #dbf3ea;
  border-top-color: #115843;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-table-cell {
  padding: 60px !important;
}
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
  gap: 12px;
}

@media (max-width: 768px) {
  .filters-card { flex-direction: column; align-items: stretch; }
  .search-box { max-width: 100%; }
  .filter-actions { justify-content: space-between; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .btn-primary { width: 100%; justify-content: center; }
}
</style>