<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div v-if="formulario" class="modal-content">
      
      <div class="modal-header">
        <h2 class="modal-title">Registrar Nuevo Paciente</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="registration-form">
        
        <div class="form-section">
          <span class="section-tag">Datos de Acceso</span>
          <div class="input-group">
            <div class="field-icon">
              <Mail :size="16" class="icon" />
              <input 
                v-model="formulario.email" 
                type="email" 
                placeholder="Correo electrónico" 
                autocomplete="username" 
                required 
              />
            </div>
            <div class="field-icon">
              <Lock :size="16" class="icon" />
              <input 
                v-model="formulario.password" 
                type="password" 
                placeholder="Contraseña para el paciente" 
                autocomplete="new-password" 
                required 
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <span class="section-tag">Información Personal</span>
          <div class="grid-2">
            <div class="field-icon">
              <User :size="16" class="icon" />
              <input v-model="formulario.nombre" placeholder="Nombres" required />
            </div>
            <div class="field-icon">
              <Users :size="16" class="icon" />
              <input v-model="formulario.apellido" placeholder="Apellidos" required />
            </div>
          </div>
          
          <div class="grid-2">
            <div class="field-icon">
              <CreditCard :size="16" class="icon" />
              <input v-model="formulario.ci" placeholder="CI / Documento" required />
            </div>
            <div class="field-icon">
              <Calendar :size="16" class="icon" />
              <input v-model="formulario.fecha_nacimiento" type="date" required />
            </div>
          </div>

          <div class="field-icon">
            <Phone :size="16" class="icon" />
            <input v-model="formulario.telefono" placeholder="Teléfono / Celular" />
          </div>

          <div class="field-icon">
            <MapPin :size="16" class="icon" />
            <input v-model="formulario.direccion" placeholder="Dirección de domicilio" />
          </div>
          
          <label class="checkbox-container">
            <input type="checkbox" v-model="formulario.seguro" />
            <span>¿Cuenta con seguro médico?</span>
          </label>
        </div>

        <p v-if="errores" class="error-banner">{{ errores }}</p>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="cargando">
            {{ cargando ? 'Procesando...' : 'Guardar Paciente' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Mail, Lock, User, Users, CreditCard, Calendar, Phone, MapPin } from 'lucide-vue-next';
import { useRegistroPaciente } from '../composables/useRegistroPaciente';

const emit = defineEmits(['close', 'actualizar']);
const { formulario, cargando, errores, enviarRegistro } = useRegistroPaciente();

const handleSubmit = async () => {
  const exito = await enviarRegistro();
  if (exito) {
    emit('actualizar'); 
    emit('close');     
  }
};
</script>

<style scoped>
@import '@/assets/global.css';
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.modal-content {
  background: white; width: 550px; max-width: 90%;
  border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-size: 1.4rem; color: #1a2b2e; margin: 0; font-family:var(--font-work) ; align-items:center}

.section-tag { display: block; font-size: 11px; font-weight: 700; color: #1D9E75; text-transform: uppercase; margin-bottom: 10px; }
.form-section { margin-bottom: 20px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
input { 
  width: 100%; padding: 12px; border: 1.5px solid #e0eeea; border-radius: 8px; 
  font-family: inherit; transition: border-color 0.2s; margin-bottom: 12px;
}
input:focus { outline: none; border-color: var(--secondary-color); }
.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f4f8f7;
  color: #5a7a80;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
}
.field-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon .icon {
  position: absolute;
  left: 12px;
  color: #1D9E75;
  pointer-events: none;
  top: 14px;
}
.field-icon input {
  padding-left: 36px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #5a7a80;
  cursor: pointer;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.checkbox-container input[type="checkbox"] {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin: 0;
  accent-color: #1D9E75;
}
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; }

.btn-primary { background: #1D9E75; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-secondary { background: #f4f8f7; color: #5a7a80; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; }
</style>