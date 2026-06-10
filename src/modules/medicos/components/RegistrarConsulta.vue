<template>
  <div class="nc-page">
    <div class="nc-container">
      <main class="nc-main-form">

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
            <span><strong>Paciente:</strong> {{ citaObjeto.paciente?.nombre }} {{ citaObjeto.paciente?.apellido }} {{ citaObjeto.paciente?.segundo_apellido || '' }}</span>
          </div>
          <div class="banner-item">
            <Clock :size="14" />
            <span><strong>Hora:</strong> {{ citaObjeto.hora?.substring(0, 5) }}</span>
          </div>
        </div>

        <!-- Motivo de consulta -->
        <div class="form-group">
          <label>Motivo de consulta *</label>
          <input
            v-model="formulario.motivo_consulta"
            type="text"
            placeholder="Ej: Paciente refiere dolor abdominal, fiebre"
            :class="{ 'input-error': v$.motivo_consulta.$error }"
            @blur="v$.motivo_consulta.$touch()"
          />
          <span class="field-error" v-if="v$.motivo_consulta.$error">
            {{ v$.motivo_consulta.$errors[0].$message }}
          </span>
        </div>

        <!-- Enfermedad actual -->
        <div class="form-group">
          <label>Enfermedad actual / Síntomas</label>
          <textarea
            v-model="formulario.enfermedad_actual"
            rows="3"
            placeholder="Describa los síntomas y evolución"
          ></textarea>
        </div>

        <div class="form-grid-sections">

          <!-- SIGNOS VITALES -->
          <div class="section-card vital-signs-card">
            <h3><HeartPulse :size="14" /> Signos vitales</h3>
            <div class="vitals-inputs-grid">

              <!-- Peso -->
              <div class="v-input">
                <label>Peso (kg)</label>
                <input
                  v-model="formulario.peso"
                  type="text"
                  placeholder="69.00"
                  :class="{ 'input-error': v$.peso.$error }"
                  @blur="v$.peso.$touch()"
                />
                <span class="field-error" v-if="v$.peso.$error">
                  {{ v$.peso.$errors[0].$message }}
                </span>
              </div>

              <!-- Talla -->
              <div class="v-input">
                <label>Talla (m)</label>
                <input
                  v-model="formulario.talla"
                  type="text"
                  placeholder="1.75"
                  :class="{ 'input-error': v$.talla.$error }"
                  @blur="v$.talla.$touch()"
                />
                <span class="field-error" v-if="v$.talla.$error">
                  {{ v$.talla.$errors[0].$message }}
                </span>
              </div>

              <!-- Presión arterial -->
              <div class="v-input">
                <label>Presión arterial</label>
                <input
                  v-model="formulario.presion_arterial"
                  type="text"
                  placeholder="120/80"
                  :class="{ 'input-error': v$.presion_arterial.$error }"
                  @blur="v$.presion_arterial.$touch()"
                />
                <span class="field-error" v-if="v$.presion_arterial.$error">
                  {{ v$.presion_arterial.$errors[0].$message }}
                </span>
              </div>

              <!-- Saturación -->
              <div class="v-input">
                <label>Saturación O₂ (%)</label>
                <input
                  v-model.number="formulario.saturacion"
                  type="number"
                  placeholder="98"
                  min="1"
                  max="100"
                  :class="{ 'input-error': v$.saturacion.$error }"
                  @blur="v$.saturacion.$touch()"
                />
                <span class="field-error" v-if="v$.saturacion.$error">
                  {{ v$.saturacion.$errors[0].$message }}
                </span>
              </div>

              <!-- Temperatura -->
              <div class="v-input">
                <label>Temperatura (°C)</label>
                <input
                  v-model="formulario.temperatura"
                  type="text"
                  placeholder="37.6"
                  :class="{ 'input-error': v$.temperatura.$error }"
                  @blur="v$.temperatura.$touch()"
                />
                <span class="field-error" v-if="v$.temperatura.$error">
                  {{ v$.temperatura.$errors[0].$message }}
                </span>
              </div>

            </div>
          </div>

          <!-- DIAGNÓSTICO Y TRATAMIENTO -->
          <div class="section-card diagnostic-card">
            <h3><ClipboardList :size="14" /> Diagnóstico y tratamiento</h3>

            <!-- Diagnóstico -->
            <div class="form-group sm">
              <label>Diagnóstico *</label>
              <div class="search-input-wrapper">
                <input
                  v-model="formulario.diagnostico"
                  type="text"
                  placeholder="Ej: Gastritis aguda leve"
                  :class="{ 'input-error': v$.diagnostico.$error }"
                  @blur="v$.diagnostico.$touch()"
                />
                <SearchIcon :size="16" class="inner-search-icon" />
              </div>
              <div class="field-footer">
                <span class="field-error" v-if="v$.diagnostico.$error">
                  {{ v$.diagnostico.$errors[0].$message }}
                </span>
                <span
                  class="char-counter"
                  :class="{ 'char-counter--warn': formulario.diagnostico?.length > 70 }"
                >
                  {{ formulario.diagnostico?.length || 0 }}/80
                </span>
              </div>
            </div>

            <!-- Medicamentos -->
            <div class="form-group sm">
              <label>Tratamientos / Medicación</label>
              <div class="med-search-wrapper">
                <input
                  v-model="busquedaMed"
                  type="text"
                  placeholder="Buscar medicamento..."
                  class="med-search-input"
                  @focus="dropdownAbierto = true"
                  @blur="cerrarDropdownConDelay"
                />
                <div v-if="cargandoMeds" class="med-loading-dot"></div>
                <div v-if="dropdownAbierto && medicamentosFiltrados.length > 0" class="med-dropdown">
                  <div
                    v-for="med in medicamentosFiltrados"
                    :key="med.id"
                    class="med-option"
                    @mousedown.prevent="agregarMedicamento(med)"
                  >
                    <div class="med-option-info">
                      <span class="med-option-nombre">{{ med.nombre }}</span>
                      <span class="med-option-desc">{{ med.descripcion }}</span>
                    </div>
                    <div class="med-option-meta">
                      <span :class="['med-stock-badge', med.stock <= 10 ? 'low' : 'ok']">
                        Stock: {{ med.stock }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-if="dropdownAbierto && busquedaMed && medicamentosFiltrados.length === 0 && !cargandoMeds" class="med-empty">
                  Sin resultados para "{{ busquedaMed }}"
                </div>
              </div>
              <div v-if="medicamentosSeleccionados.length > 0" class="med-chips">
                <div v-for="med in medicamentosSeleccionados" :key="med.id" class="med-chip">
                  <Pill :size="12" />
                  <span>{{ med.nombre }}</span>
                  <button class="chip-remove" @click="quitarMedicamento(med.id)">
                    <X :size="11" />
                  </button>
                </div>
              </div>
              <p v-if="medicamentosSeleccionados.length === 0" class="med-hint">
                Selecciona uno o más medicamentos de la lista
              </p>
            </div>

            <!-- Observaciones -->
            <div class="form-group sm">
              <label>Observaciones de receta</label>
              <textarea
                v-model="formulario.observaciones"
                rows="3"
                placeholder="Indicaciones adicionales de ingesta (máx. 300 caracteres)"
                :class="{ 'input-error': v$.observaciones.$error }"
                @blur="v$.observaciones.$touch()"
              ></textarea>
              <div class="field-footer">
                <span class="field-error" v-if="v$.observaciones.$error">
                  {{ v$.observaciones.$errors[0].$message }}
                </span>
                <span
                  class="char-counter"
                  :class="{ 'char-counter--warn': formulario.observaciones?.length > 260 }"
                >
                  {{ formulario.observaciones?.length || 0 }}/300
                </span>
              </div>
            </div>

            <!-- Emitir receta -->
            <div class="form-group sm" v-if="citaObjeto">
              <button type="button" class="btn-trigger-receta" @click="modalRecetaAbierto = true">
                <Pill :size="13" /> Emitir Receta Digital para esta Cita
              </button>
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

  <ModalCrearReceta
    :is-open="modalRecetaAbierto"
    :cita-id="citaObjeto?.id"
    :medicamentos="todosMedicamentos"
    @close="modalRecetaAbierto = false"
    @receta-creada="handleRecetaCreadaExitosamente"
  />
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import {
  SearchIcon, HeartPulse, ClipboardList,
  CheckCircle, AlertCircle, AlertTriangle,
  X, Save, Loader2, ArrowLeft, User, Clock, Pill
} from 'lucide-vue-next'
import { useCrearHistorial } from '../composables/useCrearHistorial'
import api from '@/api/axios.js'
import ModalCrearReceta from './ModalCrearReceta.vue'

const props = defineProps({
  id:   { type: String, required: true },
  cita: { type: String, required: false, default: '' }
})

const router = useRouter()
const route  = useRoute()
const { registrarConsultaCompleta, guardando } = useCrearHistorial()

const notificacion = reactive({ visible: false, mensaje: '', tipo: 'success' })
const modalRecetaAbierto = ref(false)

const presionFmt = helpers.withMessage(
  'Use el formato 120/80 (sistólica/diastólica).',
  (val) => !helpers.req(val) || /^\d{2,3}\/\d{2,3}$/.test(val.trim())
)

const pesoFmt = helpers.withMessage(
  'Ingrese un peso válido (ej: 70 o 70.50, máx 3 dígitos enteros).',
  (val) => {
    if (!helpers.req(val)) return true
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(val.trim())) return false
    const n = parseFloat(val)
    return n > 0 && n <= 300
  }
)

const tallaFmt = helpers.withMessage(
  'Ingrese talla en formato 1.XX (ej: 1.75).',
  (val) => !helpers.req(val) || /^1\.\d{2}$/.test(val.trim())
)

const tempFmt = helpers.withMessage(
  'Temperatura entre 35.0°C y 42.0°C (ej: 37.5).',
  (val) => {
    if (!helpers.req(val)) return true
    if (!/^\d{2}(\.\d)?$/.test(val.trim())) return false
    const n = parseFloat(val)
    return n >= 35 && n <= 42
  }
)

const saturacionFmt = helpers.withMessage(
  'La saturación debe ser un número entero entre 1 y 100.',
  (val) => {
    if (val === null || val === '' || val === undefined) return true
    const n = Number(val)
    return Number.isInteger(n) && n >= 1 && n <= 100
  }
)

const sinSaltoLinea = helpers.withMessage(
  'El diagnóstico debe ser breve, sin saltos de línea.',
  (val) => !helpers.req(val) || !val.includes('\n')
)

const formulario = ref({
  paciente_id:       parseInt(props.id, 10),
  motivo_consulta:   '',
  enfermedad_actual: '',
  peso:              '',
  talla:             '',
  presion_arterial:  '',
  saturacion:        null,
  temperatura:       '',
  diagnostico:       '',
  tratamiento:       '',
  observaciones:     ''
})

const rules = {
  motivo_consulta: {
    required:  helpers.withMessage('El motivo de consulta es obligatorio.', required),
    maxLength: helpers.withMessage('Máximo 200 caracteres.', maxLength(200))
  },
  peso: {
    pesoFmt
  },
  talla: {
    tallaFmt
  },
  presion_arterial: {
    presionFmt
  },
  saturacion: {
    saturacionFmt
  },
  temperatura: {
    tempFmt
  },
  diagnostico: {
    required:      helpers.withMessage('El diagnóstico es obligatorio.', required),
    maxLength:     helpers.withMessage('Máximo 80 caracteres — diagnóstico conciso.', maxLength(80)),
    sinSaltoLinea
  },
  observaciones: {
    maxLength: helpers.withMessage('Máximo 300 caracteres (un párrafo).', maxLength(300))
  }
}

const v$ = useVuelidate(rules, formulario)

const todosMedicamentos         = ref([])
const medicamentosSeleccionados = ref([])
const busquedaMed               = ref('')
const dropdownAbierto           = ref(false)
const cargandoMeds              = ref(false)

const medicamentosFiltrados = computed(() => {
  const q = busquedaMed.value.trim().toLowerCase()
  const idsSeleccionados = medicamentosSeleccionados.value.map(m => m.id)
  return todosMedicamentos.value
    .filter(m => !idsSeleccionados.includes(m.id))
    .filter(m => !q || m.nombre.toLowerCase().includes(q) || m.descripcion?.toLowerCase().includes(q))
    .slice(0, 8)
})

const agregarMedicamento = (med) => {
  medicamentosSeleccionados.value.push(med)
  busquedaMed.value = ''
  dropdownAbierto.value = false
}
const quitarMedicamento = (id) => {
  medicamentosSeleccionados.value = medicamentosSeleccionados.value.filter(m => m.id !== id)
}
const cerrarDropdownConDelay = () => {
  setTimeout(() => { dropdownAbierto.value = false }, 150)
}

const mostrarToast = (mensaje, tipo = 'success', duracion = 3500) => {
  notificacion.mensaje = mensaje
  notificacion.tipo    = tipo
  notificacion.visible = true
  setTimeout(() => { notificacion.visible = false }, duracion)
}

const idMedicoLogueado = ref(null)
const citaCargadaDeApi = ref(null)
const buscandoCita     = ref(false)

const citaObjeto = computed(() => {
  if (citaCargadaDeApi.value) return citaCargadaDeApi.value
  const citaData = props.cita || route.params.cita
  if (!citaData) return null
  try {
    return typeof citaData === 'string' ? JSON.parse(citaData) : citaData
  } catch { return null }
})

onMounted(async () => {
  buscandoCita.value = true
  cargandoMeds.value = true
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
    console.error('Error cargando cita:', err)
  } finally {
    buscandoCita.value = false
  }

  try {
    const { data } = await api.get('/medicamentos')
    if (data.success) {
      todosMedicamentos.value = data.data.filter(m => m.estado === 'activo')
    }
  } catch (err) {
    console.error('Error cargando medicamentos:', err)
    mostrarToast('No se pudo cargar la lista de medicamentos.', 'warning')
  } finally {
    cargandoMeds.value = false
  }
})

const handleRecetaCreadaExitosamente = () => {
  mostrarToast('Receta emitida y registrada con éxito.', 'success')
}

const ejecutarGuardado = async () => {
  // Forzar validación de todos los campos
  const esValido = await v$.value.$validate()

  if (!esValido) {
    mostrarToast('Corrige los errores en el formulario antes de continuar.', 'error')
    return
  }

  if (!citaObjeto.value) {
    mostrarToast('No se pudieron recuperar los datos de la cita. Inicie desde la agenda.', 'error')
    return
  }

  formulario.value.tratamiento = medicamentosSeleccionados.value.map(m => m.nombre).join(', ') || ''

  try {
    const datosHistorialListos = {
      ...formulario.value,
      fecha: new Date().toISOString().split('T')[0]
    }
    const citaBlindada = {
      ...citaObjeto.value,
      medico_id:   citaObjeto.value.medico_id   || idMedicoLogueado.value || 1,
      paciente_id: citaObjeto.value.paciente_id || formulario.value.paciente_id
    }
    const respuesta = await registrarConsultaCompleta(citaBlindada, datosHistorialListos)
    if (respuesta?.success) {
      mostrarToast('Consulta guardada y cita completada con éxito.', 'success')
    } else {
      mostrarToast('Consulta registrada en el historial clínico.', 'success')
    }
    setTimeout(() => volverAlDashboard(), 1800)
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
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500;
  margin-bottom: 18px; border: 1px solid; animation: slideDown 0.25s ease;
}
.toast span { flex: 1; }
.toast-close { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; opacity: 0.6; }
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

/* ── Banner cita ── */
.cita-info-banner {
  background: #E1F5EE; border: 1px solid #9FE1CB;
  padding: 11px 16px; border-radius: 9px; margin-bottom: 18px;
  display: flex; gap: 20px; font-size: 13px; color: #085041;
}
.banner-item { display: flex; align-items: center; gap: 7px; }

/* ── Form groups ── */
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.form-group.sm { margin-bottom: 11px; }
.form-group label, .v-input label { font-size: 12px; font-weight: 500; color: #6b8f9a; font-family: 'Sora', sans-serif; }
.form-group input,
.form-group textarea {
  font-family: 'Sora', sans-serif; font-size: 13px; padding: 9px 12px;
  border: 1px solid #E0EEEA; border-radius: 8px; background: #F5FAF8;
  outline: none; color: #1a2b2e; transition: border-color 0.15s, box-shadow 0.15s;
}
.form-group input:focus,
.form-group textarea:focus { border-color: #1D9E75; background: #fff; box-shadow: 0 0 0 3px rgba(29,158,117,0.10); }
.form-group textarea { resize: vertical; }

/* ── Errores y contadores ── */
.field-error { font-size: 11px; color: #c0392b; font-weight: 500; }
.input-error { border-color: #e74c3c !important; background: #fff8f8 !important; box-shadow: 0 0 0 3px rgba(231,76,60,0.10) !important; }
.field-footer { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; min-height: 16px; }
.char-counter { font-size: 11px; color: #94a3b8; margin-left: auto; white-space: nowrap; }
.char-counter--warn { color: #e67e22; font-weight: 600; }

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
.v-input input.input-error { border-color: #e74c3c !important; background: #fff8f8 !important; }

/* ── Search diagnóstico ── */
.search-input-wrapper { position: relative; display: flex; align-items: center; }
.search-input-wrapper input { width: 100%; padding-right: 32px; }
.inner-search-icon { position: absolute; right: 10px; color: #64748b; }

/* ── Medicamentos ── */
.med-search-wrapper { position: relative; display: flex; align-items: center; margin-bottom: 6px; }
.med-search-input { width: 100%; padding: 9px 12px; border: 1px solid #E0EEEA; border-radius: 8px; background: #F5FAF8; font-family: 'Sora', sans-serif; font-size: 13px; color: #1a2b2e; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
.med-search-input:focus { border-color: #1D9E75; background: #fff; box-shadow: 0 0 0 3px rgba(29,158,117,0.10); }
.med-loading-dot { position: absolute; right: 10px; width: 8px; height: 8px; border-radius: 50%; background: #1D9E75; animation: pulse-dot 1s infinite; }
@keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.7); } }
.med-dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #E0EEEA; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.10); z-index: 50; max-height: 240px; overflow-y: auto; }
.med-dropdown::-webkit-scrollbar { width: 4px; }
.med-dropdown::-webkit-scrollbar-thumb { background: #d0e8e0; border-radius: 4px; }
.form-group.sm { position: relative; }
.med-option { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f1f5f9; gap: 10px; }
.med-option:last-child { border-bottom: none; }
.med-option:hover { background: #f0fdf9; }
.med-option-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.med-option-nombre { font-size: 13px; font-weight: 600; color: #1a2b2e; }
.med-option-desc { font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.med-option-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.med-stock-badge { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px; }
.med-stock-badge.ok  { background: #d1fae5; color: #065f46; }
.med-stock-badge.low { background: #fef3c7; color: #92400e; }
.med-empty { padding: 12px 14px; font-size: 13px; color: #94a3b8; text-align: center; font-style: italic; }
.med-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.med-chip { display: inline-flex; align-items: center; gap: 5px; background: #E1F5EE; color: #085041; border: 1px solid #9FE1CB; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.chip-remove { background: none; border: none; cursor: pointer; display: flex; align-items: center; color: #085041; padding: 0; opacity: 0.6; transition: opacity 0.15s; }
.chip-remove:hover { opacity: 1; }
.med-hint { font-size: 11px; color: #94a3b8; font-style: italic; margin: 6px 0 0; }

/* ── Receta ── */
.btn-trigger-receta { margin-top: 10px; width: 100%; background: #ffffff; color: #1D9E75; border: 1.5px dashed #9FE1CB; padding: 10px; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; }
.btn-trigger-receta:hover { background: #E1F5EE; border-color: #1D9E75; }

/* ── Footer ── */
.form-actions-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
.btn-submit,
.btn-secondary { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; transition: background 0.15s, transform 0.1s; }
.btn-submit:active, .btn-secondary:active { transform: scale(0.98); }
.btn-submit { background: #1D9E75; color: white; }
.btn-submit:hover { background: #0F6E56; }
.btn-submit:disabled { background: #9FE1CB; cursor: not-allowed; }
.btn-secondary { background: #F5FAF8; color: #0F6E56; border: 1px solid #E0EEEA; }
.btn-secondary:hover { background: #E1F5EE; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>