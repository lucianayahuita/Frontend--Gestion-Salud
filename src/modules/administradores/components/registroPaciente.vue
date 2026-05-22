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

          <div class="grid-3">
            <div class="field-icon">
              <User :size="16" class="icon" />
              <input v-model="formulario.nombre" placeholder="Nombres" required />
            </div>
            <div class="field-icon">
              <Users :size="16" class="icon" />
              <input v-model="formulario.apellido" placeholder="Primer apellido" required />
            </div>
            <div class="field-icon">
              <Users :size="16" class="icon" />
              <input v-model="formulario.segundo_apellido" placeholder="Segundo apellido" />
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

          <div class="grid-2">
            <div class="field-icon">
              <Phone :size="16" class="icon" />
              <input v-model="formulario.telefono" placeholder="Teléfono / Celular" />
            </div>
            
            <div class="field-icon">
              <Droplet :size="16" class="icon" />
              <select 
                v-model="formulario.tipo_sangre_id" 
                required 
                class="select-blood"
                :disabled="cargandoTipos"
              >
                <option value="" disabled selected>
                  {{ cargandoTipos ? 'Cargando grupos...' : 'Tipo de sangre *' }}
                </option>
                <option v-for="grupo in listaTiposSangre" :key="grupo.id" :value="grupo.id">
                  {{ grupo.nombre }}
                </option>
              </select>
            </div>
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

        <p v-if="errores && typeof errores === 'string'" class="error-banner">{{ errores }}</p>

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
import { ref, onMounted } from 'vue';
import { Mail, Lock, User, Users, CreditCard, Calendar, Phone, MapPin, Droplet } from 'lucide-vue-next';
import { useRegistroPaciente } from '../composables/useRegistroPaciente';
import api from '@/api/axios.js';

const emit = defineEmits(['close', 'actualizar']);
const { formulario, cargando, errores, enviarRegistro } = useRegistroPaciente();

const listaTiposSangre = ref([]);
const cargandoTipos = ref(false);

const obtenerTiposSangre = async () => {
  cargandoTipos.value = true;
  try {
    const respuesta = await api.get('/tipos-sangre');
    listaTiposSangre.value = respuesta.data?.data || respuesta.data;
  } catch (error) {
    console.error('Error al cargar tipos de sangre de la API:', error);
    listaTiposSangre.value = [
      { id: 1, nombre: 'A+' }, { id: 2, nombre: 'A-' },
      { id: 3, nombre: 'B+' }, { id: 4, nombre: 'B-' },
      { id: 5, nombre: 'AB+' }, { id: 6, nombre: 'AB-' },
      { id: 7, nombre: 'O+' }, { id: 8, nombre: 'O-' }
    ];
  } finally {
    cargandoTipos.value = false;
  }
};

onMounted(() => {
  obtenerTiposSangre();
});

const handleSubmit = async () => {
  const exito = await enviarRegistro();
  if (exito) {
    emit('actualizar');
    emit('close');
  } else {
    if (errores.value && typeof errores.value === 'object') {
      const listaErrores = Object.values(errores.value).flat().join('\n');
      alert("Error de validación en el servidor:\n\n" + listaErrores);
    } else {
      alert(errores.value || 'Ocurrió un inconveniente al procesar el formulario.');
    }
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
  background: white; width: 580px; max-width: 90%;
  border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-size: 1.4rem; color: #1a2b2e; margin: 0; font-family: var(--font-work); }

.section-tag { display: block; font-size: 11px; font-weight: 700; color: #1D9E75; text-transform: uppercase; margin-bottom: 10px; }
.form-section { margin-bottom: 20px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }

input, .select-blood {
  width: 100%; padding: 12px; border: 1.5px solid #e0eeea; border-radius: 8px;
  font-family: inherit; transition: border-color 0.2s; margin-bottom: 12px;
  background-color: white; outline: none; box-sizing: border-box;
}
input:focus, .select-blood:focus { border-color: var(--secondary-color); }

.select-blood {
  padding-left: 36px;
  cursor: pointer;
  color: #5a7a80;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231D9E75' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.btn-close {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: #f4f8f7; color: #5a7a80; font-size: 1.2rem;
  cursor: pointer; transition: background 0.2s, color 0.2s;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.field-icon { position: relative; display: flex; align-items: center; width: 100%; }
.field-icon .icon { position: absolute; left: 12px; color: #1D9E75; pointer-events: none; top: 14px; z-index: 10; }
.field-icon input { padding-left: 36px; }

.checkbox-container {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; font-size: 14px; color: #5a7a80;
  cursor: pointer; width: 100%; margin: 0 auto; text-align: center;
}
.checkbox-container input[type="checkbox"] {
  width: 16px; height: 16px; flex-shrink: 0; margin: 0; accent-color: #1D9E75;
}

.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; }
.btn-primary { background: #1D9E75; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-secondary { background: #f4f8f7; color: #5a7a80; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; }
</style>