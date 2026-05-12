<template>
  <div class="agendar-page">

    <div class="agendar-grid">

      <!-- ── Panel izquierdo: formulario de búsqueda ── -->
      <div class="panel-form">
        <h2 class="panel-title">Agenda una cita</h2>
        <div class="divider-line" />

        <div class="field-group">
          <label class="field-label">Médico</label>
          <div class="select-wrapper">
            <select v-model="medicoId" :disabled="cargandoMedicos">
              <option :value="null" disabled>
                {{ cargandoMedicos ? 'Cargando...' : 'Selecciona un médico' }}
              </option>
              <option v-for="m in medicos" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
            </select>
            <ChevronDown :size="16" class="select-icon" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Fecha</label>
          <input
            v-model="fechaSeleccionada"
            type="date"
            :min="fechaMin"
            class="date-input"
          />
        </div>

        <button
          class="btn-buscar"
          @click="buscarDisponibilidad"
          :disabled="cargandoHorarios || !medicoId || !fechaSeleccionada"
        >
          <span v-if="cargandoHorarios" class="spinner" />
          {{ cargandoHorarios ? 'Buscando...' : 'Buscar' }}
        </button>
      </div>

      <!-- ── Panel derecho: horarios disponibles ── -->
      <div class="panel-horarios">

        <div v-if="!disponibilidad.length && !cargandoHorarios" class="horarios-empty">
          <CalendarSearch :size="40" class="empty-icon" />
          <p>Selecciona un médico y una fecha para ver los horarios disponibles</p>
        </div>

        <div v-else-if="cargandoHorarios" class="horarios-empty">
          <span class="spinner spinner--green" />
          <p>Buscando horarios...</p>
        </div>

        <template v-else>
          <p class="horarios-label">CITAS MÉDICAS DISPONIBLES</p>
          <p class="horarios-fecha">{{ fechaFormateada }}</p>

          <div v-if="disponibilidad.length === 0" class="horarios-empty">
            <p>No hay horarios disponibles para esta fecha</p>
          </div>

          <div v-else class="horarios-grid">
            <button
              v-for="(slot, i) in disponibilidad"
              :key="i"
              class="hora-btn"
              :class="{ 'hora-btn--selected': horaSeleccionada === slot.hora }"
              @click="seleccionarHora(slot.hora)"
            >
              {{ slot.hora }}
            </button>
          </div>

          <button
            v-if="disponibilidad.length > 0"
            class="btn-agendar"
            @click="confirmarCita"
            :disabled="!horaSeleccionada || agendando"
          >
            {{ agendando ? 'Agendando...' : 'Agendar Nueva Cita' }}
          </button>
        </template>

      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="error" class="alert alert--error">{{ error }}</div>
    <div v-if="exito" class="alert alert--success">
      ¡Cita agendada correctamente para el {{ fechaFormateada }} 
    </div>
    <div class="panel-cita-actual">
      <h2 class="panel-title">Mi Cita Programada</h2>
      <div class="divider-line" />

      <div v-if="cargandoCita" class="horarios-empty">
        <span class="spinner spinner--green" />
        <p>Buscando tu información...</p>
      </div>

      <div v-else-if="cita" class="cita-card-horizontal">
        <div class="cita-info-detalle">
          <div class="icon-bg">
            <CalendarSearch :size="24" />
          </div>
          <div class="textos">
            <p class="medico-name">Dr. {{ cita.medico.name }}</p>
            <p class="cita-meta">
              {{ cita.fecha }} • {{ cita.hora.substring(0, 5) }} hrs
            </p>
            <span class="estado-tag">{{ cita.estado }}</span>
          </div>
        </div>
        
        <div class="cita-actions">
          <button class="btn-repro" @click="handleReprogramar">
            Reprogramar
          </button>
          <button 
            class="btn-cancel" 
            @click="handleCancelar(cita.id)"
            :disabled="estaCancelando"
          >
            <span v-if="estaCancelando" class="spinner spinner--white" />
            {{ estaCancelando ? 'Cancelando...' : 'Cancelar Cita' }}
          </button>
        </div>
      </div>

      <div v-else class="horarios-empty no-cita-box">
        <p>No tienes citas pendientes para este paciente.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ChevronDown, CalendarSearch } from 'lucide-vue-next'
import { useAgendarCita } from '../composables/useAgendarCita'
import { useAuthStore } from '@/store/auth' 
import { useVerMiCita } from '../composables/useVerMiCita'
import { useCancelarCita } from '../composables/useCancelarCita'
const authStore = useAuthStore()
// 2. Composables de citas
const { cita, cargando: cargandoCita, cargarCita } = useVerMiCita()
const { cancelar, estaCancelando } = useCancelarCita()

onMounted(async () => {
    if (authStore.user?.id) {
        await cargarCita(authStore.user.id)
    }
})

const handleCancelar = async (idCita) => {
    if (confirm("¿Seguro que quieres cancelar tu cita?")) {
        const ok = await cancelar(idCita) 
        if (ok) {
            cita.value = null 
            alert("Cita cancelada correctamente")
        }
    }
}
const {
  medicos,
  disponibilidad,
  medicoId,
  fechaSeleccionada,
  horaSeleccionada,
  fechaMin,
  fechaFormateada,
  cargandoMedicos,
  cargandoHorarios,
  agendando,
  error,
  exito,
  cargarMedicos,
  buscarDisponibilidad,
  seleccionarHora,
  confirmarCita,
} = useAgendarCita()

onMounted(async () => {
  cargarMedicos();
  
  if (authStore.user?.id) {
    await cargarCita(authStore.user.id);
  }
});
</script>

<style scoped>
@import '@/assets/global.css';

.agendar-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'DM Sans', sans-serif;
}

.agendar-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 768px) { .agendar-grid { grid-template-columns: 1fr; } }

/* ── Panel formulario ── */
.panel-form {
  background: white;
  border: 1.5px solid #e0eeea;
  border-radius: 16px;
  padding: 28px 24px;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0 0 12px;
  font-family: var(--font-work);
}

.divider-line { height: 1px; background: #e0eeea; margin-bottom: 20px; }

.field-group { margin-bottom: 16px; }
.field-label { display: block; font-size: 12px; font-weight: 600; color: #5a7a80; margin-bottom: 6px; }

.select-wrapper { position: relative; }
.select-wrapper select {
  width: 100%; padding: 11px 36px 11px 14px;
  border: 1.5px solid #e0eeea; border-radius: 10px;
  font-size: 14px; font-family: inherit; color: #1a2b2e;
  background: #f8fcfb; appearance: none; outline: none;
  cursor: pointer; transition: border-color 0.2s;
}
.select-wrapper select:focus { border-color: #1D9E75; }
.select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #1D9E75; pointer-events: none; }

.date-input {
  width: 100%; padding: 11px 14px;
  border: 1.5px solid #e0eeea; border-radius: 10px;
  font-size: 14px; font-family: inherit; color: #1a2b2e;
  background: #f8fcfb; outline: none; transition: border-color 0.2s;
}
.date-input:focus { border-color: #1D9E75; }

.btn-buscar {
  width: 100%; padding: 12px;
  background: #1D9E75; color: white; border: none;
  border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 8px; transition: background 0.2s; margin-top: 4px;
}
.btn-buscar:hover:not(:disabled) { background: #0f6e56; }
.btn-buscar:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.6s linear infinite; flex-shrink: 0;
}
.spinner--green {
  border-color: rgba(29,158,117,0.3);
  border-top-color: #1D9E75;
  width: 28px; height: 28px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Panel horarios ── */
.panel-horarios {
  background: white; border: 1.5px solid #e0eeea;
  border-radius: 16px; padding: 28px 24px; min-height: 300px;
  display: flex; flex-direction: column;
}

.horarios-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; color: #7a9aaa; text-align: center; padding: 40px 20px;
}
.empty-icon { color: #b2e8d6; }

.horarios-label {
  font-size: 11px; font-weight: 700; color: #1D9E75;
  text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 4px;
}
.horarios-fecha {
  font-size: 15px; font-weight: 700; color: #1a2b2e;
  margin: 0 0 20px; text-transform: capitalize;
}

.horarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px; margin-bottom: 24px;
}

.hora-btn {
  padding: 10px 8px; border-radius: 30px;
  border: 1.5px solid #e0eeea; background: white;
  font-size: 13.5px; font-weight: 600; color: #1a2b2e;
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.hora-btn:hover { border-color: #1D9E75; color: #1D9E75; }
.hora-btn--selected {
  background: #1D9E75; border-color: #1D9E75; color: white;
  box-shadow: 0 2px 10px rgba(29,158,117,0.3);
}

.btn-agendar {
  align-self: flex-start; padding: 11px 28px;
  background: #1D9E75; color: white; border: none;
  border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-agendar:hover:not(:disabled) { background: #0f6e56; }
.btn-agendar:disabled { opacity: 0.6; cursor: not-allowed; }

.alert {
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease-out;
}

.alert--error { 
  background: #fee2e2; 
  color: #dc2626;
  border-left: 4px solid #dc2626;
}

.alert--success { 
  background: #d1fae5; 
  color: #065f46;
  border-left: 4px solid #065f46;
}
/* Contenedor principal */
.panel-cita-actual {
  background: white;
  border: 1.5px solid #e0eeea;
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  width: 100%;
}

/* Card horizontal */
.cita-card-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fcfb;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0eeea;
}

.cita-info-detalle {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-bg {
  background: #e6f6f1;
  color: #1D9E75;
  padding: 12px;
  border-radius: 12px;
}

.medico-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0;
}

.cita-meta {
  font-size: 14px;
  color: #5a7a80;
  margin: 4px 0;
}

.estado-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1D9E75;
  background: #e6f6f1;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Botones */
.cita-actions {
  display: flex;
  gap: 12px;
}

.btn-repro {
  background: white;
  border: 1.5px solid #1D9E75;
  color: #1D9E75;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-repro:hover {
  background: #f0f9f6;
}

.btn-cancel {
  background: #fee2e2;
  border: none;
  color: #dc2626;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel:hover:not(:disabled) {
  background: #fecaca;
}

.no-cita-box {
  min-height: 100px !important;
  border: 1px dashed #cedbd7;
  border-radius: 12px;
}

.spinner--white {
  border-color: rgba(220, 38, 38, 0.2);
  border-top-color: #dc2626;
  width: 14px;
  height: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .cita-card-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .cita-actions {
    width: 100%;
  }
  .btn-repro, .btn-cancel {
    flex: 1;
    justify-content: center;
  }
}
</style>