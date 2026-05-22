<template>
  <div class="gp-page">

    <div class="gp-header">
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input v-model="busqueda" placeholder="Buscar por nombre o email..." />
      </div>
      <button class="btn-registrar" @click="mostrarModal = true">Registrar Farmacéutico</button>
    </div>

    <p v-if="error" class="error-banner">{{ error }}</p>

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cargando">
            <td colspan="5" class="estado-celda">Cargando...</td>
          </tr>
          <tr v-else-if="farmaceuticosFiltrados.length === 0">
            <td colspan="5" class="estado-celda">No hay farmacéuticos registrados</td>
          </tr>
          <tr v-for="farmaceutico in farmaceuticosFiltrados" :key="farmaceutico.id" class="fila">
            <td class="td-id">{{ farmaceutico.id }}</td>
            <td class="td-nombre">{{ farmaceutico.name }}</td>
            <td>{{ farmaceutico.email }}</td>
            <td>
              <span class="badge" :class="farmaceutico.deleted_at === null ? 'badge-activo' : 'badge-inactivo'">
                {{ farmaceutico.deleted_at === null ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="td-acciones">
              <button class="btn-accion btn-ver" @click="abrirVer(farmaceutico)" title="Ver">
                <Eye :size="15" />
              </button>
              <button class="btn-accion btn-editar" @click="abrirEditar(farmaceutico)" title="Editar" >
                <Pencil :size="15" />
              </button>
              <button class="btn-accion btn-eliminar" @click="abrirEliminar(farmaceutico)" title="Eliminar">
                <Trash2 :size="15" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <registrarFarmaceutico
      v-if="mostrarModal"
      @close="mostrarModal = false"
      @actualizar="cargarFarmaceuticos(); mostrarModal = false"
    />

    <VerFarmaceuticos
      v-if="mostrarVer && farmaceuticoSeleccionado"
      :farmaceuticoId="farmaceuticoSeleccionado.id"
      @close="mostrarVer = false"
    />

    <UpdateFarmaceuticos
      v-if="mostrarEditar && farmaceuticoEditar"
      :farmaceutico="farmaceuticoEditar"
      @close="mostrarEditar = false"
      @actualizar="cargarFarmaceuticos(); mostrarEditar = false"
    />

    <DeleteFarmaceuticos
      v-if="mostrarEliminar && farmaceuticoEliminar"
      :farmaceutico="farmaceuticoEliminar"
      @close="mostrarEliminar = false"
      @actualizar="cargarFarmaceuticos(); mostrarEliminar = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import api from '@/api/axios.js'

// Importación de componentes de la entidad farmacéuticos
import registrarFarmaceutico from './registrarFarmaceutico.vue'
import VerFarmaceuticos from './verFarmaceuticos.vue'
import UpdateFarmaceuticos from './actualizarFarmaceutico.vue'
//import DeleteFarmaceuticos from './DeleteFarmaceuticos.vue'

const farmaceuticos = ref([])
const cargando = ref(false)
const error = ref(null)
const busqueda = ref('')

const mostrarModal = ref(false)
const mostrarVer = ref(false)
const farmaceuticoSeleccionado = ref(null)
const mostrarEditar = ref(false)
const farmaceuticoEditar = ref(null)
const mostrarEliminar = ref(false)
const farmaceuticoEliminar = ref(null)

const cargarFarmaceuticos = async () => {
  cargando.value = true
  error.value = null
  try {
    const { data } = await api.get('/users')
    farmaceuticos.value = data.data.filter(u => u.rol_id === 5)
  } catch (e) {
    error.value = 'Error al cargar el listado de farmacéuticos'
  } finally {
    cargando.value = false
  }
}

const farmaceuticosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return farmaceuticos.value
  return farmaceuticos.value.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.email.toLowerCase().includes(q)
  )
})

const abrirVer = (farmaceutico) => {
  farmaceuticoSeleccionado.value = farmaceutico
  mostrarVer.value = true
}

const abrirEditar = (farmaceutico) => {
  farmaceuticoEditar.value = farmaceutico
  mostrarEditar.value = true
}

const abrirEliminar = (farmaceutico) => {
  farmaceuticoEliminar.value = farmaceutico
  mostrarEliminar.value = true
}

onMounted(cargarFarmaceuticos)
</script>

<style scoped>
@import '@/assets/global.css';
.gp-page { padding: 32px; max-width: 120%; margin: 0 auto; }

.gp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

.search-box { display: flex; align-items: center; gap: 10px; border: 1.5px solid #e0eeea; border-radius: 10px; padding: 0 14px; background: white; }
.search-box input { border: none; outline: none; padding: 10px 0; font-size: 14px; width: 260px; background: transparent; }
.search-icon { color: #1D9E75; }

.tabla-wrapper { background: white; border-radius: 16px; border: 1.5px solid #e0eeea; overflow: hidden; width: 100%; }
.tabla { width: 100%; border-collapse: collapse; }
.tabla thead tr { background: #1D9E75; }
.tabla th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-work); }
.tabla td { padding: 14px 16px; font-size: 14px; color: #1a2b2e; }
.fila { border-top: 1px solid #f0f7f4; transition: background 0.15s; }
.fila:hover { background: #f5fdf9; }

.td-id { color: #5a7a80; font-size: 13px; }
.td-nombre { font-weight: 600; }
.estado-celda { text-align: center; color: #5a7a80; padding: 40px; }

.badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-activo   { background: #d1fae5; color: #065f46; }
.badge-inactivo { background: #fee2e2; color: #991b1b; }

.td-acciones { display: flex; gap: 8px; align-items: center; }
.btn-accion { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s; }
.btn-ver      { background: #e0eeea; color: #0f6e56; }
.btn-editar   { background: #fef3c7; color: #92400e; }
.btn-eliminar { background: #fee2e2; color: #991b1b; }
.btn-ver:hover      { background: #1D9E75; color: white; }
.btn-editar:hover   { background: #f59e0b; color: white; }
.btn-eliminar:hover { background: #ef4444; color: white; }

.error-banner { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }

.btn-registrar { background: #1D9E75; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-family: var(--font-work); }
.btn-registrar:hover { background: #0f6e56; }
</style>