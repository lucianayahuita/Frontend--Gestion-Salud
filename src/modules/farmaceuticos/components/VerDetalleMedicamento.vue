<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div class="modal-card">
      
      <header class="modal-header">
        <div class="header-title-group">
          <div class="avatar-pill">
            <Pill :size="20" />
          </div>
          <h2 class="modal-title">Detalles del Medicamento</h2>
        </div>
        <button class="btn-close" @click="cerrar">
          <X :size="18" />
        </button>
      </header>

      <main class="modal-body">
        <div v-if="cargando" class="modal-loading">
          <div class="spinner"></div>
          <p>Consultando lote en almacén...</p>
        </div>

        <div v-else-if="error" class="modal-error">
          <AlertTriangle :size="28" />
          <p>{{ error }}</p>
        </div>

        <div v-else-if="medicamento" class="detail-grid">
          
          <div class="detail-section full-width text-center-header">
            <h3 class="med-name">{{ medicamento.nombre }}</h3>
            <span :class="['status-pill', medicamento.estado === 'activo' ? 'status-active' : 'status-inactive']">
              {{ medicamento.estado }}
            </span>
          </div>

          <hr class="divider full-width" />

          <div class="detail-item">
            <span class="label">Código de Registro</span>
            <span class="value code">#{{ medicamento.id }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Precio Unitario</span>
            <span class="value price">${{ Number(medicamento.precio).toFixed(2) }}</span>
          </div>

          <div class="detail-item">
            <span class="label">Existencias en Almacén</span>
            <span :class="['value weight-600', Number(medicamento.stock) <= 10 ? 'text-danger' : 'text-success']">
              {{ medicamento.stock }} unidades
            </span>
          </div>

          <div class="detail-item">
            <span class="label">Fecha de Alta</span>
            <span class="value">{{ formatearFecha(medicamento.created_at) }}</span>
          </div>

          <div class="detail-item full-width">
            <span class="label">Descripción / Acción Terapéutica</span>
            <p class="value description-block">
              {{ medicamento.descripcion || 'Sin descripción terapéutica registrada.' }}
            </p>
          </div>

        </div>
      </main>

      <footer class="modal-footer">
        <button class="btn-secondary" @click="cerrar">Cerrar Ventana</button>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { Pill, X, AlertTriangle } from 'lucide-vue-next';

// Definimos las propiedades para controlarlo desde Inventario.vue
defineProps({
  visible: Boolean,
  medicamento: Object,
  cargando: Boolean,
  error: String
});

const emit = defineEmits(['close']);

const cerrar = () => {
  emit('close');
};

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return 'N/A';
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date(fechaRaw));
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  padding: 18px 24px;
  background: rgba(13, 148, 136, 1);
  border-bottom: 1px solid #edf2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-pill {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #eefaf6;
  color: #115843;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  margin-left: 20px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}
.btn-close:hover { background: #fee2e2; color: #ef4444; }

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.full-width { grid-column: span 2; }
.text-center-header { text-align: center; padding-bottom: 8px; }

.med-name {
  font-family: 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #115843;
  margin: 0 0 6px 0;
}

.divider {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #7a94a0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.value {
  font-size: 14.5px;
  color: #1a2b2e;
  font-weight: 500;
}

.value.code { font-family: monospace; font-weight: 600; color: #475569; }
.value.price { font-family: 'Sora', sans-serif; font-weight: 600; }
.weight-600 { font-weight: 600; }

.description-block {
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  color: #4a5e68;
  font-size: 13.5px;
  line-height: 1.5;
  margin: 4px 0 0 0;
}

/* BADGES DE ESTADO */
.status-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}
.status-active { background: #d1fae5; color: #065f46; }
.status-inactive { background: #fee2e2; color: #991b1b; }
.text-danger { color: #ef4444; }
.text-success { color: #10b981; }

.modal-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background: rgba(15, 122, 90, 1);
  border: 1px solid #cbd5e1;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { background: #f1f5f9; color: #1e293b; }

/* LOADERS */
.modal-loading, .modal-error { text-align: center; padding: 30px 0; color: #6b8896; }
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #dbf3ea;
  border-top-color: #115843;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>