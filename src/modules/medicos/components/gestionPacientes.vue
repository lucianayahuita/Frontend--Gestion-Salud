<template>
  <div class="gp-page">

    <div class="gp-header-container">
      <div class="gp-header-left">
        <h1 class="gp-title">Gestión de Pacientes</h1>
        <p class="gp-subtitle">
          Panel de administración médica. Existen
          <span class="count-tag">{{ pacientes.length }} pacientes registrados</span> en total.
        </p>
      </div>
      
      <div class="gp-header-right">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input v-model="busqueda" placeholder="Buscar por nombre o CI..." />
        </div>
      </div>
    </div>

    <p v-if="errorPacientes" class="error-banner">{{ errorPacientes }}</p>

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Cédula (CI)</th>
            <th>Teléfono</th>
            <th>Tipo Sangre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cargando">
            <td colspan="7" class="estado-celda">Cargando registros...</td>
          </tr>
  
          <tr v-else-if="pacientesFiltrados.length === 0">
            <td colspan="7" class="estado-celda">No se encontraron pacientes registrados</td>
          </tr>
          
          <tr v-else v-for="paciente in pacientesFiltrados" :key="paciente.id" class="fila">
            <td class="td-id">{{ paciente.id }}</td>
            <td class="td-nombre">
              {{ paciente.nombre }} {{ paciente.apellido }} {{ paciente.segundo_apellido || '' }}
            </td>
            <td><span class="ci-texto">{{ paciente.ci }}</span></td>
            <td>{{ paciente.telefono || 'No registrado' }}</td>
            <td>
              <span class="sangre-tag" v-if="paciente.tipo_sangre">
                {{ typeof paciente.tipo_sangre === 'object' ? (paciente.tipo_sangre.nombre || paciente.tipo_sangre.denominacion) : paciente.tipo_sangre }}
              </span>
              <span class="sin-dato" v-else>--</span>
            </td>
            <td>
              <span class="badge" :class="paciente.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'">
                {{ paciente.estado || 'Activo' }}
              </span>
            </td>
            <td class="td-acciones">
              <button class="btn-accion-texto btn-ver" @click="abrirVer(paciente)" title="Ver Historial Clínico">
                <Eye :size="15" />
                <span>Ver Historial</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Eye } from 'lucide-vue-next' 
import { useVerPacientes } from '../composables/useVerPacientes' 

const router = useRouter()
const { pacientes, cargando, errorPacientes, cargarPacientes } = useVerPacientes()

const busqueda = ref('')

const pacientesFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return pacientes.value
  
  return pacientes.value.filter(p => {
    const nombreCompleto = `${p.nombre} ${p.apellido} ${p.segundo_apellido || ''}`.toLowerCase()
    const ci = p.ci ? p.ci.toString() : ''
    
    return nombreCompleto.includes(q) || ci.includes(q)
  })
})

const abrirVer = (paciente) => {
  console.log("Redirigiendo al historial del paciente ID:", paciente.id)
  router.push({ name: 'HistorialClinico', params: { id: String(paciente.id) } })
}


onMounted(cargarPacientes)
</script>

<style scoped>
@import '@/assets/global.css';

.gp-page { padding: 4px; max-width: 1200px; margin: 0 auto; }

.gp-header-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; 
  margin-bottom: 28px;
  gap: 20px;
}
.gp-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gp-title {
  font-family: 'Sora', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0;
}
.gp-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}
.count-tag {
  background: #e6f6f1;
  color: #0f6e56;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
}
.gp-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box { display: flex; align-items: center; gap: 10px; border: 1.5px solid #e0eeea; border-radius: 10px; padding: 0 14px; background: white; height: 42px; }
.search-box input { border: none; outline: none; font-size: 14px; width: 240px; background: transparent; }
.search-icon { color: #1D9E75; }

/* ── TABLA Y FILAS ── */
.tabla-wrapper { background: white; border-radius: 16px; border: 1.5px solid #e0eeea; overflow: hidden; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
.tabla { width: 100%; border-collapse: collapse; }
.tabla thead tr { background: #1D9E75; }
.tabla th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-work); }
.tabla td { padding: 14px 16px; font-size: 14px; color: #1a2b2e; }
.fila { border-top: 1px solid #f0f7f4; transition: background 0.15s; }
.fila:hover { background: #f5fdf9; }

.td-id { color: #5a7a80; font-size: 13px; }
.td-nombre { font-weight: 600; }
.estado-celda { text-align: center; color: #5a7a80; padding: 40px; }

.ci-texto { font-family: var(--font-work); font-weight: 500; }
.sangre-tag { background: #eff6ff; color: #1e40af; font-weight: bold; padding: 2px 8px; border-radius: 6px; font-size: 12px; }
.sin-dato { color: #94a3b8; font-size: 13px; }

.badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
.badge-activo   { background: #d1fae5; color: #065f46; }
.badge-inactivo { background: #fee2e2; color: #991b1b; }
.td-acciones { display: flex; align-items: center; justify-content: flex-start; }

.btn-accion-texto {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-work);
}
.btn-ver { background: #e0eeea; color: #0f6e56; }
.btn-ver:hover { background: #1D9E75; color: white; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }

/* Responsive rápido para el encabezado */
@media (max-width: 768px) {
  .gp-header-container { flex-direction: column; align-items: flex-start; gap: 16px; }
  .gp-header-right { width: 100%; flex-direction: column; align-items: transform; }
  .search-box, .btn-registrar { width: 100%; }
}
</style>