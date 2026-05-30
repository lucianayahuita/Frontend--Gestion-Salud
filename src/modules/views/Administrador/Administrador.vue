<template>
  <div class="dashboard">

    <div class="page-header">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">¡Hola, {{ nombreUsuario }}! <Hand class="icon-hand" :size="28" :stroke-width="2.5" /> </h1>
          <p class="page-sub">Resumen General del Sistema</p>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card stat-card--green">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/><path d="M12 11V7M10 9h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>
        </div>
        <div class="stat-number">{{ cargando ? '...' : conteos.medicos }}</div>
        <div class="stat-label">Médicos activos</div>
      </div>

      <div class="stat-card stat-card--blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-number">{{ cargando ? '...' : conteos.administradores }}</div>
        <div class="stat-label">Administradores activos</div>
      </div>

      <div class="stat-card stat-card--teal">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div class="stat-number">{{ cargando ? '...' : conteos.soporte }}</div>
        <div class="stat-label">Personal de Soporte</div>
      </div>

      <div class="stat-card stat-card--yellow">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-number">{{ cargando ? '...' : conteos.pacientes }}</div>
        <div class="stat-label">Pacientes registrados</div>
      </div>

      <div class="stat-card stat-card--purple">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-number">{{ cargando ? '...' : conteos.farmaceuticos }}</div>
        <div class="stat-label">Farmacéuticos activos</div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Usuarios Recientemente Registrados</h2>
        </div>
        <div class="user-list">
          <div v-if="cargando" class="empty">Cargando...</div>
          <div v-else-if="usuariosRecientes.length === 0" class="empty">Sin usuarios recientes</div>
          <div class="user-item" v-for="user in usuariosRecientes" :key="user.id">
            <div class="user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.role?.nombre || 'Sin rol' }}</span>
            </div>
            <span class="badge badge--active">Activo</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title card-title--accent">Acciones Rápidas</h2>
        </div>
        <div class="action-list">
          <button class="action-btn action-btn--dark" @click="mostrarModalMedico = true">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Médico
          </button>

          <button class="action-btn action-btn--teal" @click="mostrarModalPaciente = true">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Paciente
          </button>

          <button class="action-btn action-btn--soft" @click="mostrarModalAdmin = true">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Personal de Soporte
          </button>

          <button class="action-btn action-btn--outline" @click="mostrarModalFarmaceutico = true">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Farmacéutico
          </button>
        </div>
      </div>
    </div>

    <registroPaciente
      v-if="mostrarModalPaciente"
      @close="mostrarModalPaciente = false"
      @actualizar="cargarUsuarios"
    />

    <registrarMedico
      v-if="mostrarModalMedico"
      @close="mostrarModalMedico = false"
      @actualizar="cargarUsuarios"
    />
  </div>

  <registrarAdministrador
    v-if="mostrarModalAdmin"
    @close="mostrarModalAdmin = false"
    @actualizar="cargarUsuarios"
  />
  <registrarFarmaceutico
    v-if="mostrarModalFarmaceutico"
    @close="mostrarModalFarmaceutico = false"
    @actualizar="cargarUsuarios"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Hand } from 'lucide-vue-next';
import api from '@/api/axios.js';

import registroPaciente from '@/modules/administradores/components/registroPaciente.vue';
import registrarAdministrador from '@/modules/administradores/components/registrarAdministradores.vue';
import registrarMedico from '@/modules/administradores/components/registrarMedico.vue';
import registrarFarmaceutico from '@/modules/administradores/components/registrarFarmaceutico.vue';

defineEmits(['ver', 'editar', 'eliminar'])

const nombreUsuario = ref('Administrador');
const fechaActual = ref('');

const cargando = ref(false);
const usuarios = ref([]);

const mostrarModalAdmin = ref(false);
const mostrarModalPaciente = ref(false);
const mostrarModalMedico = ref(false); 
const mostrarModalFarmaceutico = ref(false);

const cargarUsuarios = async () => {
  cargando.value = true;
  try {
    const { data } = await api.get('/users');
    usuarios.value = data.data;
  } catch (err) {
    console.error('Error al cargar usuarios', err);
  } finally {
    cargando.value = false;
  }
};

const conteos = computed(() => {
  const activos = usuarios.value.filter(u => u.deleted_at === null);
  return {
    administradores: activos.filter(u => u.rol_id === 1).length, 
    medicos:         activos.filter(u => u.rol_id === 2).length, 
    soporte:         activos.filter(u => u.rol_id === 3).length, 
    pacientes:       activos.filter(u => u.rol_id === 4).length, 
    farmaceuticos:   activos.filter(u => u.rol_id === 5).length, 
  };
});

const usuariosRecientes = computed(() =>
  usuarios.value
    .filter(u => u.deleted_at === null)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
);

const obtenerDatosSesion = () => {
  const sesion = JSON.parse(localStorage.getItem('user')); 
  if (sesion && sesion.name) {
    nombreUsuario.value = sesion.name.split(' ')[0]; 
  }
  
  const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
  fechaActual.value = new Intl.DateTimeFormat('es-ES', opciones).format(new Date());
};

onMounted(() => {
  cargarUsuarios();
  obtenerDatosSesion();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@600;700&display=swap');

.dashboard { display: flex; flex-direction: column; gap: 22px; font-family: 'DM Sans', sans-serif; }
.page-header { margin-bottom: 8px; }

.welcome-card {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  background: rgba(15, 122, 90, 1); padding: 24px 30px; border-radius: 20px;
  color: white; box-shadow: 0 10px 25px rgba(26, 43, 46, 0.15);
}

.welcome-title {
  display: flex; align-items: center; gap: 12px;
  font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;
}

.icon-hand {
  color: #fbbf24; animation: wave 2s infinite origin-bottom; transform-origin: bottom right;
}

@keyframes wave {
  0% { transform: rotate( 0.0deg) }
  10% { transform: rotate(14.0deg) }
  20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) }
  40% { transform: rotate(-4.0deg) }
  50% { transform: rotate(10.0deg) }
  60% { transform: rotate( 0.0deg) }
  100% { transform: rotate( 0.0deg) }
}

@media (max-width: 600px) {
  .welcome-card { flex-direction: column; align-items: flex-start; gap: 15px; padding: 20px; }
}
.page-sub { font-size: 13px; color: whitesmoke; font-weight: 600; margin: 0; }

.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 750px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  border-radius: 16px; padding: 20px 18px; display: flex; flex-direction: column; gap: 6px;
  border: 1.5px solid transparent; transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(30,80,70,0.1); }
.stat-card--green  { background: #edfaf5; border-color: #b2e8d6; }
.stat-card--blue   { background: #eef4fb; border-color: #b8d4f0; }
.stat-card--teal   { background: #e6f6f4; border-color: #a3e0d3; }
.stat-card--yellow { background: #fefaed; border-color: #f0e0a0; }
.stat-card--purple { background: #f3f0fb; border-color: #c9bff0; }

.stat-icon {
  width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
}
.stat-card--green  .stat-icon { color: #1D9E75; }
.stat-card--blue   .stat-icon { color: #2563eb; }
.stat-card--teal   .stat-icon { color: #0d7a63; }
.stat-card--yellow .stat-icon { color: #b45309; }
.stat-card--purple .stat-icon { color: #6d28d9; }
.stat-icon svg { width: 20px; height: 20px; }

.stat-number { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 700; color: #1a2b2e; line-height: 1; }
.stat-label { font-size: 12px; font-weight: 500; color: #5a7a80; }

.bottom-grid { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
@media (max-width: 820px) { .bottom-grid { grid-template-columns: 1fr; } }

.card { background: #fff; border: 1.5px solid #e0eeea; border-radius: 16px; overflow: hidden; }
.card-header { padding: 16px 20px; border-bottom: 1px solid #edf4f1; }
.card-title { font-size: 14px; font-weight: 600; color: #1a2b2e; margin: 0; }
.card-title--accent { color: #1D9E75; }

.user-list { display: flex; flex-direction: column; }
.user-item { display: flex; align-items: center; gap: 12px; padding: 13px 20px; border-bottom: 1px solid #f2f7f5; transition: background 0.15s; }
.user-item:last-child { border-bottom: none; }
.user-item:hover { background: #f8fdfb; }

.user-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: #d6f5eb; color: #0d7a63;
  font-family: 'Sora', sans-serif; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.user-name { font-size: 13.5px; font-weight: 600; color: #1a2b2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 11.5px; color: #3aa085; font-weight: 500; }

.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge--active { background: #d6f5eb; color: #0d7a63; }

.empty { padding: 32px; text-align: center; color: #7a9aaa; font-size: 13.5px; }

.action-list { display: flex; flex-direction: column; gap: 8px; padding: 12px; }
.action-btn {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 11px 16px; border-radius: 10px; border: none;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.16s ease;
}
.action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
.action-btn--dark    { background: #1a2b2e; color: #fff; }
.action-btn--dark:hover { background: #243638; }
.action-btn--teal    { background: #1D9E75; color: #fff; }
.action-btn--teal:hover { background: #179063; }
.action-btn--soft    { background: #edfaf5; color: #0d7a63; border: 1.5px solid #b2e8d6; }
.action-btn--soft:hover { background: #d6f5eb; }
.action-btn--outline { background: #f4f8f7; color: #3d5260; border: 1.5px solid #dce8e4; }
.action-btn--outline:hover { background: #e8f0ed; }
</style>