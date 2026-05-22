<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      
      <div class="modal-header">
        <h2 class="modal-title">Detalles del Médico</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <div v-if="cargando" class="estado-contenedor">
        <p class="animacion-carga">Cargando información del servidor...</p>
      </div>

      <div v-else-if="error" class="error-banner">
        {{ error }}
      </div>

      <div v-else-if="medico" class="detalle-cuerpo">
        
        <div class="perfil-resumen">
          <div class="avatar-grande">
            {{ medico.name ? medico.name.charAt(0).toUpperCase() : 'M' }}
          </div>
          <h3>{{ medico.name }}</h3>
          <span class="badge-rol">Médico Personal</span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Identificador (ID)</span>
            <div class="info-valor-caja">
              <User :size="16" class="info-icon" />
              <span>{{ medico.id }}</span>
            </div>
          </div>

          <div class="info-item">
            <span class="info-label">Correo Electrónico</span>
            <div class="info-valor-caja">
              <Mail :size="16" class="info-icon" />
              <span>{{ medico.email }}</span>
            </div>
          </div>

          <div class="info-item">
            <span class="info-label">Estado en el Sistema</span>
            <div class="info-valor-caja">
              <span class="indicador-estado" :class="medico.deleted_at === null ? 'activo' : 'inactivo'"></span>
              <span>{{ medico.deleted_at === null ? 'Cuenta Activa' : 'Dado de Baja' }}</span>
            </div>
          </div>
        </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn-secondary" @click="$emit('close')">Cerrar Ventana</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { User, Mail } from 'lucide-vue-next';
import { useVerMedico } from '../composables/useVerMedico';

const props = defineProps({
  medicoId: {
    type: [Number, String],
    required: true
  }
});

defineEmits(['close']);

const { medico, cargando, error, cargarDetalle } = useVerMedico();

onMounted(() => {
  if (props.medicoId) {
    cargarDetalle(props.medicoId);
  }
});
</script>

<style scoped>
@import '@/assets/global.css';

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.modal-content {
  background: white; width: 460px; max-width: 90%;
  border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-title { font-size: 1.35rem; color: #1a2b2e; margin: 0; font-family: var(--font-work); font-weight: 700; }

.btn-close {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: #f4f8f7; color: #5a7a80; font-size: 1.2rem;
  cursor: pointer; transition: background 0.2s, color 0.2s;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

/* Cuerpo del Detalle */
.perfil-resumen {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; margin-bottom: 24px; padding-bottom: 20px;
  border-bottom: 1.5px dashed #e0eeea;
}
.avatar-grande {
  width: 70px; height: 70px; border-radius: 50%;
  background: #d6f5eb; color: #0d7a63; font-size: 24px;
  font-weight: 700; display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px; box-shadow: 0 4px 10px rgba(29, 158, 117, 0.15);
}
.perfil-resumen h3 { margin: 0 0 6px 0; font-size: 1.15rem; color: #1a2b2e; font-weight: 600; }
.badge-rol { font-size: 11px; background: #edfaf5; color: #1D9E75; font-weight: 700; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; }

/* Grid de Información */
.info-grid { display: flex; flex-direction: column; gap: 16px; }
.info-item { display: flex; flex-direction: column; gap: 6px; }
.info-label { font-size: 11px; font-weight: 700; color: #5a7a80; text-transform: uppercase; letter-spacing: 0.03em; }

.info-valor-caja {
  display: flex; align-items: center; gap: 10px;
  background: #f8fdfb; border: 1px solid #e0eeea;
  padding: 12px 14px; border-radius: 8px;
  color: #1a2b2e; font-size: 14px; font-weight: 500;
}
.info-icon { color: #1D9E75; }

/* Indicadores de Estado */
.indicador-estado { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.indicador-estado.activo { background: #10b981; box-shadow: 0 0 8px #10b981; }
.indicador-estado.inactivo { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

.modal-footer { display: flex; justify-content: flex-end; margin-top: 28px; }
.btn-secondary { background: #f4f8f7; color: #5a7a80; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-secondary:hover { background: #e8f0ed; }

/* Estados de carga y error */
.estado-contenedor { padding: 40px 0; text-align: center; }
.animacion-carga { color: #5a7a80; font-size: 14px; font-weight: 500; }
.error-banner { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 8px; font-size: 13.5px; text-align: center; }
</style>