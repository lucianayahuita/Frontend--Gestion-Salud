<template>
  <div class="gp-page">

    <div class="gp-header">
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input v-model="busqueda" placeholder="Buscar por nombre, CI..." />
      </div>
      <button class="btn-registrar" @click="mostrarModal = true">Registrar Paciente</button>
    </div>

    <p v-if="error" class="error-banner">{{ error }}</p>

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>C.I</th>
            <th>Edad</th>
            <th>Grupo Sanguíneo</th> <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cargando">
            <td colspan="8" class="estado-celda">Cargando...</td> 
          </tr>
          <tr v-else-if="pacientesFiltrados().length === 0">
            <td colspan="8" class="estado-celda">No hay pacientes</td>
          </tr>
          <tr v-for="p in pacientesFiltrados()" :key="p.id" class="fila">
            <td class="td-id">{{ p.id }}</td>
            <td class="td-nombre">
              {{ p.nombre }} {{ p.apellido }}
              <span v-if="p.segundo_apellido" class="segundo-apellido"> {{ p.segundo_apellido }}</span>
            </td>
            <td>{{ p.ci }}</td>
            <td>{{ calcularEdad(p.fecha_nacimiento) }} años</td>
            
            <td>
              <span class="badge-sangre">
                {{ p.tipo_sangre?.nombre || p.tipo_sangre || '-' }}
              </span>
            </td>

            <td>{{ p.telefono || '-' }}</td>
            <td>
              <span class="badge" :class="p.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'">
                {{ p.estado }}
              </span>
            </td>
            <td class="td-acciones">
              <button class="btn-accion btn-ver" @click="abrirVer(p)" title="Ver">
                <Eye :size="15" />
              </button>
              <button class="btn-accion btn-editar" @click="abrirEditar(p)" title="Editar">
                <Pencil :size="15" />
              </button>
              <button class="btn-accion btn-eliminar" @click="abrirEliminar(p)" title="Eliminar">
                <Trash2 :size="15" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <RegistroPaciente
      v-if="mostrarModal"
      @close="mostrarModal = false"
      @actualizar="cargarPacientes(); mostrarModal = false"
    />
    <VerPaciente
      v-if="mostrarVer && pacienteSeleccionado"
      :pacienteId="Number(pacienteSeleccionado.id)"
      @close="mostrarVer = false"
    />
    <EliminarPaciente
      v-if="mostrarEliminar"
      :paciente="pacienteAEliminar"
      @close="mostrarEliminar = false"
      @actualizar="cargarPacientes"
    />
    <EditarPaciente
      v-if="mostrarEditar"
      :paciente="pacienteAEditar"
      @close="mostrarEditar = false"
      @actualizar="cargarPacientes(); mostrarEditar = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { useGestionPacientes } from '../composables/useGestionPacientes'
import RegistroPaciente from './registroPaciente.vue'
import VerPaciente from './verPaciente.vue'
import EliminarPaciente from './deletePaciente.vue'
import EditarPaciente from './updatePaciente.vue'

defineEmits(['ver', 'editar', 'eliminar'])

const { cargando, error, busqueda, pacientesFiltrados, calcularEdad, cargarPacientes } = useGestionPacientes()
const mostrarModal = ref(false)
const pacienteSeleccionado = ref(null)
const mostrarVer = ref(false)
const mostrarEliminar = ref(false)
const pacienteAEliminar = ref(null)
const mostrarEditar = ref(false)
const pacienteAEditar = ref(null)

const abrirVer = (p) => {
  pacienteSeleccionado.value = p
  mostrarVer.value = true
}

const abrirEliminar = (p) => {
  pacienteAEliminar.value = p
  mostrarEliminar.value = true
}

const abrirEditar = (p) => {
  pacienteAEditar.value = p
  mostrarEditar.value = true
}
</script>

<style scoped>
@import '@/assets/global.css';
.gp-page { padding: 32px; max-width: 120%; margin: 0 auto; }

.gp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

.search-box { display: flex; align-items: center; gap: 10px; border: 1.5px solid #e0eeea; border-radius: 10px; padding: 0 14px; background: white; }
.search-box input { border: none; outline: none; padding: 10px 0; font-size: 14px; width: 240px; background: transparent; }
.search-icon { color: #1D9E75; }

.tabla-wrapper { background: white; border-radius: 16px; border: 1.5px solid #e0eeea; overflow: hidden; height: 90%; width: 100%; }
.tabla { width: 100%; border-collapse: collapse; }
.tabla thead tr { background: #1D9E75; }
.tabla th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-work); }
.tabla td { padding: 14px 16px; font-size: 14px; color: #1a2b2e; }
.fila { border-top: 1px solid #f0f7f4; transition: background 0.15s; }
.fila:hover { background: #f5fdf9; }

.td-id { color: #5a7a80; font-size: 13px; }
.td-nombre { font-weight: 600; }
.segundo-apellido { color: #1a2b2e; }
.estado-celda { text-align: center; color: #5a7a80; padding: 40px; }

.badge-sangre {
  background: #f0fdf4;
  color: #111827;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #dcfce7;
}

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

.btn-registrar {
  background: #1D9E75; color: white; border: none;
  padding: 10px 20px; border-radius: 10px; font-size: 14px;
  font-weight: 600; cursor: pointer; transition: background 0.2s;
  font-family: var(--font-work);
}
.btn-registrar:hover { background: #0f6e56; }
</style>