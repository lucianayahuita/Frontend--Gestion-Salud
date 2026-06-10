<template>
  <div class="recetas-page">
    <div class="page-header">
      <h1 class="page-title">Mis Recetas Médicas</h1>
      <p class="page-description">
        Consulta el historial de medicamentos recetados por tus médicos, las indicaciones de dosificación y descarga tus órdenes vigentes.
      </p>
    </div>

    <div style="display: none;">
      <div id="receta-pdf-template" class="pdf-template">
        <div class="pdf-header">
          <h2>RECETA MÉDICA</h2>
          <p class="pdf-folio"><strong>Folio:</strong> #{{ recetaActiva?.id }}</p>
        </div>
        <div class="pdf-body">
          <p><strong>Médico Tratante:</strong> Dr/Dra. {{ obtenerNombreMedico(recetaActiva?.cita?.medico_id) || 'Especialista Asignado' }}</p>
          <p><strong>Fecha de Emisión:</strong> {{ recetaActiva?.cita?.fecha || 'No especificada' }}</p>
          <hr class="pdf-hr" />
          <div class="pdf-prescripcion">
            <h3 class="pdf-rp">RP.</h3>
            <p class="pdf-med"><strong>{{ recetaActiva?.medicamento?.nombre?.toUpperCase() }}</strong></p>
            <p><strong>Dosificación:</strong> {{ recetaActiva?.dosis }}</p>
            <p><strong>Frecuencia:</strong> {{ recetaActiva?.frecuencia }}</p>
            <p><strong>Duración del tratamiento:</strong> {{ recetaActiva?.duracion }}</p>
            <p v-if="recetaActiva?.indicaciones" class="pdf-ind">
              <strong>Indicaciones adicionales:</strong> {{ recetaActiva?.indicaciones }}
            </p>
          </div>
        </div>
        <div class="pdf-footer">
          <div class="pdf-firma">
            <div class="pdf-linea-firma"></div>
            <p>Firma y Timbre Médico</p>
          </div>
        </div>
      </div>
    </div>

    <div class="recetas-container">
      <div v-if="cargando" class="recetas-empty">
        <span class="spinner spinner--green" />
        <p>Buscando tus recetas médicas...</p>
      </div>

      <div v-else-if="recetas.length === 0" class="recetas-empty no-recetas-box">
        <FileText :size="40" class="empty-icon" />
        <p>No tienes recetas médicas registradas en este momento.</p>
      </div>

      <div v-else class="recetas-lista">
        <div v-for="receta in recetas" :key="receta.id" class="receta-card-horizontal">
          <div class="receta-info-detalle">
            <div class="icon-bg">
              <Pill :size="24" />
            </div>
            <div class="textos">
              <div class="receta-header-line">
                <h3 class="medico-name">
                  Dr/Dra. {{ obtenerNombreMedico(receta.cita?.medico_id) || 'Especialista Asignado' }}
                </h3>
                <span class="folio-badge">Folio #{{ receta.id }}</span>
              </div>
              
              <p class="receta-meta">
                <strong>Fecha Emisión:</strong> {{ receta.cita?.fecha || 'No especificada' }} 
                <span class="despacho-tag" :class="receta.estado_despacho">
                  {{ receta.estado_despacho }}
                </span>
              </p>
              
              <div class="medicamentos-box">
                <span class="medicamento-tag">
                  <span class="nombre-med">{{ receta.medicamento?.nombre?.toUpperCase() }}</span> 
                  — {{ receta.dosis }} | {{ receta.frecuencia }} por {{ receta.duracion }}
                </span>
              </div>
              
              <p v-if="receta.indicaciones" class="indicaciones-texto">
                *Ind.: {{ receta.indicaciones }}
              </p>
            </div>
          </div>

          <div class="receta-actions">
            <button class="btn-ver-detalle" :disabled="exportandoId === receta.id" @click="descargarPDFDirecto(receta)">
              <span v-if="exportandoId === receta.id" class="spinner-btn" />
              <Download v-else :size="16" />
              {{ exportandoId === receta.id ? 'Generando...' : 'Descargar PDF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { FileText, Pill, Download } from 'lucide-vue-next'
import api from '@/api/axios.js'
import { useAuthStore } from '@/store/auth'
import html2pdf from 'html2pdf.js' 

const authStore = useAuthStore()
const recetas = ref([])
const medicos = ref([])
const cargando = ref(true)
const exportandoId = ref(null)
const idPacienteActual = ref(null)
const recetaActiva = ref(null)

const obtenerNombreMedico = (medicoId) => {
  if (!medicos.value || medicos.value.length === 0) return null
  const medicoEncontrado = medicos.value.find(m => m.id === medicoId)
  return medicoEncontrado ? medicoEncontrado.name : null
}

const cargarRecetasPaciente = async (pacienteId) => {
  cargando.value = true
  try {
    const res = await api.get(`/pacientes/${pacienteId}/recetas-medicas`)
    recetas.value = res.data.data || []
  } catch (error) {
    console.error("Error al obtener las recetas del paciente:", error)
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  try {
    const resMedicos = await api.get('/medicos')
    medicos.value = resMedicos.data.data || resMedicos.data

    const resPacientes = await api.get('/pacientes')
    const miPerfil = resPacientes.data.data.find(p => p.user_id === authStore.user.id)
    
    if (miPerfil) {
      idPacienteActual.value = miPerfil.id
      await cargarRecetasPaciente(miPerfil.id)
    } else {
      console.error("No se encontró un perfil de paciente para este usuario.")
      cargando.value = false
    }
  } catch (error) {
    console.error("Error al inicializar módulo de recetas:", error)
    cargando.value = false
  }
})

const descargarPDFDirecto = async (receta) => {
  exportandoId.value = receta.id
  recetaActiva.value = receta
  
  await nextTick()
  
  const elemento = document.getElementById('receta-pdf-template')
  const opciones = {
    margin:       15,
    filename:     `receta_folio_${receta.id}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
  }

  html2pdf().set(opciones).from(elemento).save().then(() => {
    exportandoId.value = null
    recetaActiva.value = null
  }).catch((err) => {
    console.error("Error generando PDF:", err)
    exportandoId.value = null
  })
}
</script>

<style scoped>
@import '@/assets/global.css';

.recetas-page {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'DM Sans', sans-serif;
}

.page-header {
  border-bottom: 1px solid rgba(224, 238, 234, 0.6);
  padding-bottom: 24px;
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a2b2e;
  margin: 0 0 8px 0;
  letter-spacing: -0.03em;
  font-family: var(--font-work), sans-serif;
}

.page-description {
  font-size: 16px;
  color: #5a7a80;
  line-height: 1.6;
  margin: 0;
}

.recetas-container {
  width: 100%;
}

.recetas-lista {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.receta-card-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1.5px solid #e0eeea;
  transition: transform 0.2s, box-shadow 0.2s;
}

.receta-card-horizontal:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(29, 158, 117, 0.05);
}

.receta-info-detalle {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.receta-header-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.folio-badge {
  font-size: 12px;
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.icon-bg {
  background: #e6f6f1;
  color: #1D9E75;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medico-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0;
}

.receta-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #5a7a80;
  margin: 4px 0 10px 0;
}

.despacho-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  background: #ebebeb;
  color: #666;
}

.despacho-tag.despachada {
  background: #d1fae5;
  color: #065f46;
}

.medicamentos-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.medicamento-tag {
  font-size: 13.5px;
  font-weight: 500;
  color: #1a2b2e;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 6px 14px;
  border-radius: 8px;
}

.nombre-med {
  font-weight: 700;
  color: #115e59;
}

.indicaciones-texto {
  font-size: 12.5px;
  font-style: italic;
  color: #6b7280;
  margin: 6px 0 0 0;
}

.receta-actions {
  display: flex;
  gap: 12px;
}

.btn-ver-detalle {
  background: white;
  border: 1.5px solid #1D9E75;
  color: #1D9E75;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-ver-detalle:hover:not(:disabled) {
  background: #1D9E75;
  color: white;
}

.btn-ver-detalle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recetas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #7a9aaa;
  text-align: center;
  padding: 60px 20px;
}

.no-recetas-box {
  background: white;
  border: 1.5px dashed #cedbd7;
  border-radius: 16px;
}

.empty-icon {
  color: #b2e8d6;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(29, 158, 117, 0.3);
  border-top-color: #1D9E75;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.spinner-btn {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(29, 158, 117, 0.3);
  border-top-color: #1D9E75;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── ESTILOS MAQUETACIÓN DEL PDF DESCARGABLE ─── */
.pdf-template {
  padding: 40px;
  color: #1a2b2e;
  font-family: Arial, sans-serif;
  background: #ffffff;
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #1D9E75;
  padding-bottom: 12px;
  margin-bottom: 25px;
}

.pdf-header h2 {
  margin: 0;
  color: #1a2b2e;
  font-size: 24px;
}

.pdf-folio {
  font-size: 16px;
  margin: 0;
}

.pdf-body {
  font-size: 14px;
  line-height: 1.8;
}

.pdf-hr {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 20px 0;
}

.pdf-prescripcion {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.pdf-rp {
  font-size: 28px;
  color: #1D9E75;
  margin: 0 0 10px 0;
}

.pdf-med {
  font-size: 18px;
  margin-bottom: 12px;
  color: #115e59;
}

.pdf-ind {
  margin-top: 15px;
  font-style: italic;
  color: #475569;
}

.pdf-footer {
  margin-top: 80px;
  display: flex;
  justify-content: flex-end;
}

.pdf-firma {
  text-align: center;
  width: 200px;
}

.pdf-linea-firma {
  border-top: 1px solid #94a3b8;
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .receta-card-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .receta-actions {
    width: 100%;
  }
  .btn-ver-detalle {
    width: 100%;
    justify-content: center;
  }
}
</style>