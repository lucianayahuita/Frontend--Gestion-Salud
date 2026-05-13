<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">

      
      <div class="modal-header">
        <h2 class="modal-title">Detalle del Administrador</h2>

        <button class="btn-close" @click="$emit('close')">
          &times;
        </button>
      </div>

      
      <div v-if="cargando" class="estado">
        <p>Buscando información del administrador...</p>
      </div>

      
      <div v-else-if="error" class="error-banner">
        {{ error }}
      </div>

      
      <div v-else-if="admin" class="detalle">

     
        <div class="admin-hero">

          <div class="avatar">
            {{ admin.name?.charAt(0).toUpperCase() }}
          </div>

          <div>
            <h3 class="admin-nombre">
              {{ admin.name }}
            </h3>

            <span
              class="badge"
              :class="admin.deleted_at === null ? 'badge-activo' : 'badge-inactivo'"
            >
              {{ admin.deleted_at === null ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

        </div>

        <div class="divider" />

       
        <div class="campos">

        
          <div class="campo">
            <Fingerprint :size="16" class="campo-icon" />

            <span class="campo-label">
              ID
            </span>

            <span class="campo-valor">
              {{ admin.id }}
            </span>
          </div>

         
          <div class="campo">
            <Mail :size="16" class="campo-icon" />

            <span class="campo-label">
              Correo
            </span>

            <span class="campo-valor">
              {{ admin.email }}
            </span>
          </div>

          
          <div class="campo">
            <Shield :size="16" class="campo-icon" />

            <span class="campo-label">
              Rol
            </span>

            <span class="campo-valor">
              {{ admin.role?.nombre || 'Administrador' }}
            </span>
          </div>

        </div>

      </div>

      
      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">
          Cerrar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'

import {
  Fingerprint,
  Mail,
  Shield
} from 'lucide-vue-next'

import { useVerAdministradores } from '../composables/useVerAdministradores'



const props = defineProps({
  adminId: {
    type: Number,
    required: true
  }
})



defineEmits(['close'])



const {
  admin,
  cargando,
  error,
  cargarAdministrador
} = useVerAdministradores()



onMounted(() => {
  if (props.adminId) {
    cargarAdministrador(props.adminId)
  }
})



watch(() => props.adminId, (newId) => {
  if (newId) {
    cargarAdministrador(newId)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2000;
}

.modal-content {
  background: white;

  width: 450px;
  max-width: 90%;

  border-radius: 16px;
  padding: 25px;

  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;

  color: #1f2937;
}

.btn-close {
  border: none;

  background: #f3f4f6;

  cursor: pointer;

  border-radius: 50%;

  width: 30px;
  height: 30px;

  font-size: 1.1rem;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
}



.admin-hero {
  display: flex;
  align-items: center;
  gap: 15px;

  margin-bottom: 20px;
}

.avatar {
  width: 50px;
  height: 50px;

  border-radius: 50%;

  background: #1D9E75;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.2rem;
  font-weight: bold;

  flex-shrink: 0;
}

.admin-nombre {
  font-size: 1.1rem;

  margin: 0 0 6px;

  color: #111827;

  font-weight: 600;
}



.badge {
  font-size: 0.75rem;

  padding: 2px 8px;

  border-radius: 12px;

  font-weight: 500;
}

.badge-activo {
  background: #d1fae5;
  color: #065f46;
}

.badge-inactivo {
  background: #fee2e2;
  color: #991b1b;
}



.divider {
  height: 1px;

  background: #e5e7eb;

  margin: 15px 0;
}



.campos {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.campo {
  display: flex;
  align-items: center;

  gap: 10px;
}

.campo-icon {
  color: #1D9E75;

  flex-shrink: 0;
}

.campo-label {
  font-size: 0.85rem;

  color: #6b7280;

  width: 110px;

  flex-shrink: 0;
}

.campo-valor {
  font-size: 0.9rem;

  color: #374151;

  font-weight: 500;
}

/* FOOTER */

.modal-footer {
  margin-top: 25px;

  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 8px 20px;

  border-radius: 8px;

  border: 1px solid #d1e2e1;

  cursor: pointer;

  background: #f4f8f7;
  color: #5a7a80;
}

.btn-secondary:hover {
  background: #e8f0ed;
}



.estado {
  text-align: center;

  padding: 30px;

  color: #6b7280;
}

.error-banner {
  color: #dc2626;

  background: #fee2e2;

  padding: 10px;

  border-radius: 8px;

  text-align: center;
}
</style>