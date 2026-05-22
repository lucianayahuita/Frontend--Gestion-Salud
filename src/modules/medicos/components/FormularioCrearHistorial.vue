<template>
  <div class="formulario-historial-container">

    <div class="form-header">
      <div class="header-top">
        <div class="header-icon">
          <FileText :size="18" />
        </div>
        <h3>Nueva historia clínica</h3>
      </div>
      <p class="paciente-sub">
        Paciente: <strong>{{ paciente.nombre }} {{ paciente.apellido }} {{ paciente.segundo_apellido }}</strong>
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-scrollable">

      <div class="section-label">
        <HeartPulse :size="14" />
        Signos vitales
      </div>

      <div class="vitals-grid">
        <div class="field-group">
          <label class="field-label">Peso (kg)</label>
          <input v-model.number="form.peso" type="number" step="0.1" placeholder="68.5" required class="input-styled" />
        </div>
        <div class="field-group">
          <label class="field-label">Talla (cm)</label>
          <input v-model.number="form.talla" type="number" placeholder="165" required class="input-styled" />
        </div>
        <div class="field-group">
          <label class="field-label">Presión arterial</label>
          <input v-model="form.presion_arterial" type="text" placeholder="120/80" required class="input-styled" />
        </div>
        <div class="field-group">
          <label class="field-label">Saturación (%)</label>
          <input v-model.number="form.saturacion" type="number" placeholder="98" required class="input-styled" />
        </div>
        <div class="field-group">
          <label class="field-label">Temperatura (°C)</label>
          <input v-model.number="form.temperatura" type="number" step="0.1" placeholder="36.5" required class="input-styled" />
        </div>
      </div>

      <div class="section-label">
        <ClipboardList :size="14" />
        Evaluación clínica
      </div>

      <div class="field-group">
        <label class="field-label">Motivo de consulta</label>
        <textarea v-model="form.motivo_consulta" required rows="2" class="textarea-styled" placeholder="Describe el motivo principal de la consulta…" />
      </div>
      <div class="field-group">
        <label class="field-label">Enfermedad actual</label>
        <textarea v-model="form.enfermedad_actual" required rows="2" class="textarea-styled" placeholder="Descripción de la enfermedad o sintomatología actual…" />
      </div>
      <div class="field-group">
        <label class="field-label">Diagnóstico</label>
        <textarea v-model="form.diagnostico" required rows="2" class="textarea-styled" placeholder="Diagnóstico clínico…" />
      </div>
      <div class="field-group">
        <label class="field-label">Tratamiento</label>
        <textarea v-model="form.tratamiento" required rows="2" class="textarea-styled" placeholder="Plan de tratamiento indicado…" />
      </div>
      <div class="field-group">
        <label class="field-label">Observaciones</label>
        <textarea v-model="form.observaciones" rows="2" class="textarea-styled" placeholder="Notas adicionales (opcional)…" />
      </div>

      <div v-if="errorHistorial" class="alert alert--error">
        <CircleAlert :size="15" />
        {{ errorHistorial }}
      </div>
      <div v-if="exitoHistorial" class="alert alert--success">
        <CircleCheck :size="15" />
        Consulta guardada y cita completada con éxito.
      </div>

      <div class="actions-row">
        <button type="button" class="btn-cancelar" @click="irAPacientes" :disabled="guardando">
            <X :size="15" />
            Volver a pacientes
            </button>
        <button type="submit" class="btn-guardar" :disabled="guardando">
          <Loader2 v-if="guardando" :size="15" class="spinner" />
          <Save v-else :size="15" />
          {{ guardando ? 'Guardando...' : 'Registrar consulta' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  FileText, HeartPulse, ClipboardList,
  CircleAlert, CircleCheck, X, Save, Loader2
} from 'lucide-vue-next';
import { useCrearHistorial } from '../composables/useCrearHistorial';
const router = useRouter();
const irAPacientes = () => {
  router.push({ name: 'MedicoPacientes' });
};
const props = defineProps({
  cita:     { type: Object,          required: true },
  paciente: { type: Object,          required: true },
  medicoId: { type: [Number, String], required: true }
});

const emit = defineEmits(['guardado', 'cancelar']);
const { registrarConsultaCompleta, guardando, errorHistorial, exitoHistorial } = useCrearHistorial();

const form = reactive({
  paciente_id:      props.paciente.id,
  motivo_consulta:  '',
  enfermedad_actual:'',
  peso:             null,
  talla:            null,
  presion_arterial: '',
  saturacion:       null,
  temperatura:      null,
  diagnostico:      '',
  tratamiento:      '',
  observaciones:    '',
  fecha:            new Date().toISOString().split('T')[0]
});

const handleSubmit = async () => {
  const payloadSanitizado = {
    ...form,
    paciente_id: parseInt(props.paciente?.id || props.paciente?.id_paciente || props.cita?.paciente_id, 10),
    peso:        parseFloat(form.peso),
    talla:       form.talla ? parseFloat(form.talla) / 100 : 0,
    saturacion:  parseInt(form.saturacion, 10),
    temperatura: parseFloat(form.temperatura)
  };

  if (!payloadSanitizado.peso || !payloadSanitizado.talla || !payloadSanitizado.temperatura) {
    alert('Por favor, rellene correctamente los campos numéricos de signos vitales.');
    return;
  }

  const result = await registrarConsultaCompleta(props.cita, payloadSanitizado);
  if (result.success) {
    setTimeout(() => emit('guardado'), 1500);
  }
};
</script>

<style scoped>
/* ── Token base ── */
:root {
  --font: 'Sora', sans-serif;
  --green-600: #1D9E75;
  --green-700: #0F6E56;
  --green-50:  #E1F5EE;
  --green-100: #9FE1CB;
  --border:    #E0EEEA;
  --surface:   #F5FAF8;
  --text:      #1a2b2e;
  --muted:     #6b8f9a;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

/* ── Contenedor ── */
.formulario-historial-container {
  font-family: var(--font);
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

/* ── Header ── */
.form-header {
  padding: 18px 22px 16px;
  border-bottom: 1px solid var(--border);
}
.header-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}
.header-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--green-50);
  color: var(--green-700);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.form-header h3 {
  font-family: var(--font);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}
.paciente-sub {
  font-family: var(--font);
  font-size: 13px;
  color: var(--muted);
  margin: 0;
  padding-left: 44px;
}
.paciente-sub strong {
  font-weight: 500;
  color: var(--text);
}

/* ── Form scroll ── */
.form-scrollable {
  max-height: 70vh;
  overflow-y: auto;
  padding: 18px 22px 22px;
  scrollbar-width: thin;
  scrollbar-color: var(--green-100) transparent;
}

/* ── Section labels ── */
.section-label {
  font-family: var(--font);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--green-700);
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 12px;
}
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ── Vitals grid ── */
.vitals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}
.vitals-grid .field-group {
  margin-bottom: 0;
}

/* ── Field group ── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

/* ── Labels ── */
.field-label {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}

/* ── Inputs & textareas ── */
.input-styled,
.textarea-styled {
  font-family: var(--font);
  font-size: 13px;
  font-weight: 400;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 12px;
  outline: none;
  width: 100%;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}
.input-styled:focus,
.textarea-styled:focus {
  border-color: var(--green-600);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.10);
}
.textarea-styled {
  font-family: var(--font);
  resize: vertical;
  min-height: 64px;
  line-height: 1.55;
}

/* ── Alerts ── */
.alert {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  margin: 4px 0 14px;
}
.alert--error {
  background: #FCEBEB;
  color: #791F1F;
  border: 1px solid #F7C1C1;
}
.alert--success {
  background: var(--green-50);
  color: var(--green-700);
  border: 1px solid var(--green-100);
}

/* ── Actions ── */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.btn-cancelar,
.btn-guardar {
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.btn-cancelar:active,
.btn-guardar:active {
  transform: scale(0.98);
}
.btn-cancelar {
  background: var(--surface);
  color: var(--muted);
  border: 1px solid var(--border);
}
.btn-cancelar:hover { color: var(--text); }
.btn-guardar {
  background: var(--green-600);
  color: #fff;
}
.btn-guardar:hover { background: var(--green-700); }
.btn-guardar:disabled,
.btn-cancelar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Spinner ── */
.spinner {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>