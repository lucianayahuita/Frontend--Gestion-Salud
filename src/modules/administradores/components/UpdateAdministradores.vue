<template>
  <div class="modal-overlay" @click.self="$emit('close')">

    <div class="modal-content">

      
      <div class="modal-header">

        <div>
          <h3 class="modal-title">
            Actualizar datos del Personal de Soporte
          </h3>

         
          <p class="subtitle">
            {{ props.admin.name }}
          </p>
        </div>

        <button
          class="btn-close"
          @click="$emit('close')"
        >
          &times;
        </button>

      </div>

     
      <form @submit.prevent="handleUpdate">

       
        
            <div class="field-group">

            <label>
                <User :size="16" class="field-icon" />
                Nombre
            </label>

            <input
                :value="props.admin.name"
                disabled
                class="input-disabled"
            />
            </div>


            <div class="field-group">

            <label>
                <Shield :size="16" class="field-icon" />
                Rol
            </label>

            <input
                :value="props.admin.role?.nombre || 'Administrador'"
                disabled
                class="input-disabled"
            />
            </div>



            <div class="field-group">

            <label>
                <Mail :size="16" class="field-icon" />
                Correo electrónico
            </label>

            <input
                v-model="form.email"
                type="email"
                placeholder="Ingrese el correo"
            />
            </div>
        
        <p v-if="error" class="error">
          {{ error }}
        </p>

        
        <div class="actions">

          <button
            type="button"
            class="btn-cancelar"
            @click="$emit('close')"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-guardar"
            :disabled="loading"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar Correo' }}
          </button>

        </div>

      </form>

    </div>

  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

import {
  User,
  Mail,
  Shield
} from 'lucide-vue-next'

import { useUpdateAdministradores } from '../composables/useUpdateAdministradores'


const props = defineProps({
  admin: {
    type: Object,
    required: true
  }
})


const emit = defineEmits([
  'close',
  'actualizar'
])


const {
  ejecutarActualizacion,
  loading,
  error
} = useUpdateAdministradores()


const form = reactive({
  email: ''
})


onMounted(() => {

  if (props.admin) {
    form.email = props.admin.email || ''
  }

})


const handleUpdate = async () => {

  try {

   

    await ejecutarActualizacion(props.admin.id, {

      name: props.admin.name,

      email: form.email,
    

    })

   
    emit('actualizar')

    emit('close')

  } catch (err) {

    console.error(
      'Error al actualizar administrador:',
      err.response?.data || err.message
    )

  }

}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2000;
}

.modal-content {
  background: white;

  width: 420px;
  max-width: 90%;

  border-radius: 16px;

  padding: 24px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 20px;
}

.modal-title {
  margin: 0;

  font-size: 1.2rem;
  font-weight: 700;

  color: #111827;
}

.subtitle {
  margin-top: 6px;

  color: #6b7280;
  font-size: 0.9rem;
}

.btn-close {
  border: none;
  background: #f3f4f6;

  width: 32px;
  height: 32px;

  border-radius: 50%;

  cursor: pointer;

  font-size: 1.2rem;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.field-group {
  display: flex;
  flex-direction: column;

  margin-bottom: 16px;
}

.field-group label {
  margin-bottom: 6px;

  font-size: 0.9rem;
  font-weight: 600;

  color: #374151;
}

.field-group input {
  padding: 10px 12px;

  border-radius: 10px;

  border: 1px solid #d1d5db;

  font-size: 0.95rem;
}

.input-disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.error {
  margin-top: 10px;

  background: #fee2e2;
  color: #b91c1c;

  padding: 10px;

  border-radius: 8px;

  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 24px;
}

.btn-cancelar {
  padding: 10px 16px;

  border: 1px solid #d1d5db;

  background: #f9fafb;

  border-radius: 10px;

  cursor: pointer;
}

.btn-guardar {
  padding: 10px 16px;

  border: none;

  background: #1D9E75;
  color: white;

  border-radius: 10px;

  cursor: pointer;

  font-weight: 600;
}

.btn-guardar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-icon {
  color: #1D9E75;
}
</style>