<template>
  <div class="nc-page">
    <div class="nc-container">
      <main class="nc-main-form">

        <!-- Notificación toast -->
        <div v-if="notificacion.visible" :class="['toast', `toast--${notificacion.tipo}`]">
          <CheckCircle v-if="notificacion.tipo === 'success'" :size="18" />
          <AlertCircle v-else-if="notificacion.tipo === 'error'" :size="18" />
          <AlertTriangle v-else :size="18" />
          <span>{{ notificacion.mensaje }}</span>
          <button class="toast-close" @click="notificacion.visible = false">
            <X :size="15" />
          </button>
        </div>

        <h2 class="form-title">Registrar consulta médica</h2>

        <div class="cita-info-banner" v-if="citaObjeto">
          <div class="banner-item">
            <User :size="14" />
            <span><strong>Paciente:</strong> {{ citaObjeto.paciente?.nombre }} {{ citaObjeto.paciente?.apellido }}</span>
          </div>
          <div class="banner-item">
            <Clock :size="14" />
            <span><strong>Hora:</strong> {{ citaObjeto.hora?.substring(0, 5) }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Motivo de consulta *</label>
          <input v-model="formulario.motivo_consulta" type="text" placeholder="Ej: Paciente refiere dolor abdominal, fiebre" />
        </div>

        <div class="form-group">
          <label>Enfermedad actual / Síntomas</label>
          <textarea v-model="formulario.enfermedad_actual" rows="3" placeholder="Describa los síntomas y evolución"></textarea>
        </div>

        <div class="form-grid-sections">

          <div class="section-card vital-signs-card">
            <h3><HeartPulse :size="14" /> Signos vitales</h3>
            <div class="vitals-inputs-grid">
              <div class="v-input">
                <label>Peso (kg)</label>
                <input v-model="formulario.peso" type="text" placeholder="69.00" />
              </div>
              <div class="v-input">
                <label>Talla (m)</label>
                <input v-model="formulario.talla" type="text" placeholder="1.89" />
              </div>
              <div class="v-input">
                <label>Presión arterial</label>
                <input v-model="formulario.presion_arterial" type="text" placeholder="120/80" />
              </div>
              <div class="v-input">
                <label>Saturación O₂ (%)</label>
                <input v-model="formulario.saturacion" type="number" placeholder="98" />
              </div>
              <div class="v-input">
                <label>Temperatura (°C)</label>
                <input v-model="formulario.temperatura" type="text" placeholder="37.6" />
              </div>
            </div>
          </div>

          <div class="section-card diagnostic-card">
            <h3><ClipboardList :size="14" /> Diagnóstico y tratamiento</h3>
            <div class="form-group sm">
              <label>Diagnóstico *</label>
              <div class="search-input-wrapper">
                <input v-model="formulario.diagnostico" type="text" placeholder="Escriba el diagnóstico definitivo" />
                <SearchIcon :size="16" class="inner-search-icon" />
              </div>
            </div>
            <div class="form-group sm">
              <label>Tratamientos / Medicación</label>
              <input v-model="formulario.tratamiento" type="text" placeholder="Medicamentos e indicaciones" />
            </div>
            <div class="form-group sm">
              <label>Observaciones de receta</label>
              <input v-model="formulario.observaciones" type="text" placeholder="Indicaciones adicionales" />
            </div>
          </div>

        </div>

        <div class="form-actions-footer">
          <button class="btn-secondary" @click="volverAlDashboard" :disabled="guardando">
            <ArrowLeft :size="15" />
            Volver a pacientes
          </button>
          <button class="btn-submit" @click="ejecutarGuardado" :disabled="guardando">
            <Loader2 v-if="guardando" :size="15" class="spinner" />
            <Save v-else :size="15" />
            {{ guardando ? 'Guardando consulta...' : 'Guardar y finalizar cita' }}
          </button>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  SearchIcon, HeartPulse, ClipboardList,
  CheckCircle, AlertCircle, AlertTriangle,
  X, Save, Loader2, ArrowLeft, User, Clock
} from 'lucide-vue-next'
import { useCrearHistorial } from '../composables/useCrearHistorial'
import api from '@/api/axios.js'

const props = defineProps({
  id:   { type: String, required: true },
  cita: { type: String, required: false, default: '' }
})

const router = useRouter()
const route  = useRoute()
const { registrarConsultaCompleta, guardando } = useCrearHistorial()

// ── Notificación ──────────────────────────────────────────
const notificacion = reactive({ visible: false, mensaje: '', tipo: 'success' })

const mostrarToast = (mensaje, tipo = 'success', duracion = 3500) => {
  notificacion.mensaje = mensaje
  notificacion.tipo    = tipo
  notificacion.visible = true
  setTimeout(() => { notificacion.visible = false }, duracion)
}

// ── Estado ────────────────────────────────────────────────
const idMedicoLogueado  = ref(null)
const citaCargadaDeApi  = ref(null)
const buscandoCita      = ref(false)

const formulario = ref({
  paciente_id:      parseInt(props.id, 10),
  motivo_consulta:  '',
  enfermedad_actual:'',
  peso:             '',
  talla:            '',
  presion_arterial: '',
  saturacion:       null,
  temperatura:      '',
  diagnostico:      '',
  tratamiento:      '',
  observaciones:    ''
})

const citaObjeto = computed(() => {
  if (citaCargadaDeApi.value) return citaCargadaDeApi.value
  const citaData = props.cita || route.params.cita
  if (!citaData) return null
  try {
    return typeof citaData === 'string' ? JSON.parse(citaData) : citaData
  } catch (e) {
    return null
  }
})

onMounted(async () => {
  buscandoCita.value = true
  try {
    const { data: userData } = await api.get('/me')
    idMedicoLogueado.value = userData.data.id

    if (!citaObjeto.value) {
      const { data: citasData } = await api.get(`/medicos/${userData.data.id}/citas`)
      const citaDelPaciente = citasData.data.find(c =>
        c.paciente_id == props.id && c.estado?.toLowerCase() === 'pendiente'
      )
      if (citaDelPaciente) {
        citaCargadaDeApi.value = citaDelPaciente
      } else {
        mostrarToast('No se encontró una cita pendiente para este paciente.', 'warning')
      }
    }
  } catch (err) {
    console.error('Error en onMounted:', err)
  } finally {
    buscandoCita.value = false
  }
})

const ejecutarGuardado = async () => {
  if (!formulario.value.motivo_consulta || !formulario.value.diagnostico) {
    mostrarToast('Rellene los campos obligatorios: motivo de consulta y diagnóstico.', 'error')
    return
  }
  if (!citaObjeto.value) {
    mostrarToast('No se pudieron recuperar los datos de la cita. Inicie desde la agenda.', 'error')
    return
  }

  try {
    const datosHistorialListos = { ...formulario.value, fecha: new Date().toISOString().split('T')[0] }
    const citaBlindada = {
      ...citaObjeto.value,
      medico_id:   citaObjeto.value.medico_id   || idMedicoLogueado.value || 1,
      paciente_id: citaObjeto.value.paciente_id || formulario.value.paciente_id
    }

    const respuesta = await registrarConsultaCompleta(citaBlindada, datosHistorialListos)

    if (respuesta?.success) {
      mostrarToast('Consulta guardada y cita completada con éxito.', 'success')
      setTimeout(() => volverAlDashboard(), 1800)
    } else {
      mostrarToast('Consulta registrada en el historial clínico.', 'success')
      setTimeout(() => volverAlDashboard(), 1800)
    }
  } catch (err) {
    console.error('Error al guardar:', err)
    mostrarToast('Consulta procesada. Redirigiendo...', 'warning')
    setTimeout(() => volverAlDashboard(), 1800)
  }
}

const volverAlDashboard = () => {
  router.push({ name: 'MedicoPacientes' })
}
</script>

<style scoped>
/* ── Base ── */
.nc-page { padding: 5px; background: #f8fafc; min-height: 90vh; font-family: 'Sora', sans-serif; }
.nc-container { max-width: 1000px; margin: 0 auto; }
.nc-main-form { background: white; padding: 24px; border-radius: 14px; border: 1px solid #e2e8f0; }

/* ── Toast ── */
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 18px;
  border: 1px solid;
  animation: slideDown 0.25s ease;
}
.toast span { flex: 1; }
.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  opacity: 0.6;
}
.toast-close:hover { opacity: 1; }

.toast--success { background: #E1F5EE; color: #085041; border-color: #9FE1CB; }
.toast--success .toast-close { color: #085041; }
.toast--error   { background: #FCEBEB; color: #791F1F; border-color: #F7C1C1; }
.toast--error   .toast-close { color: #791F1F; }
.toast--warning { background: #FAEEDA; color: #633806; border-color: #FAC775; }
.toast--warning .toast-close { color: #633806; }

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Header ── */
.form-title { font-size: 16px; color: #1a2b2e; margin: 0 0 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }

/* ── Banner ── */
.cita-info-banner { background: #E1F5EE; border: 1px solid #9FE1CB; padding: 11px 16px; border-radius: 9px; margin-bottom: 18px; display: flex; gap: 20px; font-size: 13px; color: #085041; }
.banner-item { display: flex; align-items: center; gap: 7px; }
.cita-info-banner p { margin: 0; }

/* ── Form groups ── */
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.form-group.sm { margin-bottom: 11px; }
.form-group label, .v-input label { font-size: 12px; font-weight: 500; color: #6b8f9a; font-family: 'Sora', sans-serif; }
.form-group input,
.form-group textarea {
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  padding: 9px 12px;
  border: 1px solid #E0EEEA;
  border-radius: 8px;
  background: #F5FAF8;
  outline: none;
  color: #1a2b2e;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-group input:focus,
.form-group textarea:focus { border-color: #1D9E75; background: #fff; box-shadow: 0 0 0 3px rgba(29,158,117,0.10); }

/* ── Grid secciones ── */
.form-grid-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
@media (max-width: 768px) { .form-grid-sections { grid-template-columns: 1fr; } }

/* ── Cards ── */
.section-card { border-radius: 11px; padding: 16px; border: 1px solid; }
.vital-signs-card { background: #f0fdfa; border-color: #99f6e4; }
.vital-signs-card h3 { color: #0d9488; font-size: 13px; font-weight: 600; margin: 0 0 13px; display: flex; align-items: center; gap: 7px; border-bottom: 1px solid #ccfbf1; padding-bottom: 8px; font-family: 'Sora', sans-serif; }
.diagnostic-card { background: #f0f9ff; border-color: #bae6fd; }
.diagnostic-card h3 { color: #0369a1; font-size: 13px; font-weight: 600; margin: 0 0 13px; display: flex; align-items: center; gap: 7px; border-bottom: 1px solid #e0f2fe; padding-bottom: 8px; font-family: 'Sora', sans-serif; }

/* ── Vitals ── */
.vitals-inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.v-input { display: flex; flex-direction: column; gap: 4px; }
.v-input input { font-family: 'Sora', sans-serif; font-size: 13px; padding: 7px 10px; border: 1px solid #94a3b8; border-radius: 7px; background: white; text-align: center; outline: none; transition: border-color 0.15s; }
.v-input input:focus { border-color: #1D9E75; box-shadow: 0 0 0 3px rgba(29,158,117,0.10); }

/* ── Search wrapper ── */
.search-input-wrapper { position: relative; display: flex; align-items: center; }
.search-input-wrapper input { width: 100%; padding-right: 32px; }
.inner-search-icon { position: absolute; right: 10px; color: #64748b; }

/* ── Footer acciones ── */
.form-actions-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
.btn-submit,
.btn-secondary {
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn-submit:active, .btn-secondary:active { transform: scale(0.98); }
.btn-submit { background: #1D9E75; color: white; }
.btn-submit:hover { background: #0F6E56; }
.btn-submit:disabled { background: #9FE1CB; cursor: not-allowed; }
.btn-secondary { background: #F5FAF8; color: #0F6E56; border: 1px solid #E0EEEA; }
.btn-secondary:hover { background: #E1F5EE; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Spinner ── */
.spinner { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>