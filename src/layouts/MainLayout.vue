<template>
  <div class="main-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="brand-icon">
          <img src="@/assets/gestion-salud-logo.png" alt="Logo Gestión Salud" />
        </div>
        <div class="brand-text" v-if="!sidebarCollapsed">
          <span class="brand-name">Gestión</span>
          <span class="brand-sub">Salud</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="sidebarCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="user-badge" v-if="!sidebarCollapsed">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role-badge" :class="roleClass">{{ roleLabel }}</span>
        </div>
      </div>
      <div class="user-avatar-sm" v-else>{{ userInitial }}</div>

      <nav class="sidebar-nav">
        <div class="nav-section-label" v-if="!sidebarCollapsed">Principal</div>

        <router-link :to="dashboardPath" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>

        <!-- Administrador -->
        <template v-if="rolId === 1">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Administración</div>

          <router-link :to="{ name: 'AdminPacientes' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M3 20c0-3.3 2.7-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="17" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M21 20c0-3.3-2.7-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Pacientes</span>
          </router-link>

          <router-link :to="{ name: 'AdminMedicos' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 11V7M10 9h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Médicos</span>
          </router-link>

          <router-link :to="{ name: 'AdminGestionAdmins' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                  stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Soporte</span>
          </router-link>
          <router-link :to="{ name: 'AdminRoles' }" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Gestión de Roles</span>
        </router-link>
          <router-link :to="{ name: 'AdminFarmaceuticos' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Farmacéuticos</span>
          </router-link>

          <div class="nav-section-label" v-if="!sidebarCollapsed">Operaciones</div>

          <router-link :to="{ name: 'AdminTransacciones' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v4m0 0l-8-4m8 4l8-4"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Transacciones Farmacia</span>
          </router-link>

          <router-link :to="{ name: 'AdminCitas' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Gestión de Citas</span>
          </router-link>

          <div class="nav-section-label" v-if="!sidebarCollapsed">Análisis</div>

          <router-link :to="{ name: 'AdminReportes' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3v18h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M7 16l4-4 4 4 4-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Reportes</span>
          </router-link>
        </template>

        <!-- Médico -->
        <template v-if="rolId === 2">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Gestión</div>
          <router-link to="/medico/pacientes" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M3 20c0-3.3 2.7-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="17" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M21 20c0-3.3-2.7-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Pacientes</span>
          </router-link>
          <router-link to="/medico/citas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Citas</span>
          </router-link>
          <router-link to="/medico/recetas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Recetas Emitidas</span>
          </router-link>
        </template>

        <!-- Paciente -->
        <template v-if="rolId === 4">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Mi Espacio</div>
          <router-link to="/paciente/citas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Programar una cita</span>
          </router-link>
          <router-link to="/paciente/perfil" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Mi Perfil</span>
          </router-link>
          <router-link to="/paciente/recetas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Mis recetas</span>
          </router-link>
        </template>

        <!-- Farmacéutico -->
        <template v-if="rolId === 5">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Farmacia</div>
          <router-link to="/farmaceutico/inventario" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v4m0 0l-8-4m8 4l8-4"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Inventario</span>
          </router-link>

          <router-link to="/farmaceutico/disponibilidad" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M11 8v3l2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Consulta Disponibilidad</span>
          </router-link>

          <router-link to="/farmaceutico/recetas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Recetas Por Despachar</span>
          </router-link>
        </template>

        <!-- Soporte -->
        <template v-if="rolId === 3">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Gestión</div>

          <router-link to="/soporte/pacientes" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M3 20c0-3.3 2.7-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="17" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M21 20c0-3.3-2.7-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Pacientes</span>
          </router-link>

          <router-link to="/soporte/medicos" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 11V7M10 9h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Médicos</span>
          </router-link>

          <div class="nav-section-label" v-if="!sidebarCollapsed">Farmacia</div>

          <router-link to="/soporte/farmaceuticos" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Farmacéuticos</span>
          </router-link>

          <div class="nav-section-label" v-if="!sidebarCollapsed">Citas</div>

          <router-link to="/soporte/citas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Ver Citas</span>
          </router-link>
        </template>
      </nav>

      <!-- ── Footer ── -->
      <div class="sidebar-footer">
        <!-- Botón cambiar contraseña -->
        <button class="change-pwd-btn" @click="showChangePassword = true" :title="sidebarCollapsed ? 'Cambiar contraseña' : ''">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Cambiar Contraseña</span>
        </button>

        <!-- Botón cerrar sesión -->
        <button class="logout-btn" @click="logout" :disabled="loggingOut" :title="sidebarCollapsed ? 'Cerrar sesión' : ''">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">
            {{ loggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}
          </span>
        </button>
      </div>
    </aside>

    <!-- ── Layout body ── -->
    <div class="layout-body">
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        <div class="topbar-right">
          <div class="topbar-date">{{ formattedDate }}</div>
          <div class="topbar-user">
            <div class="topbar-avatar">{{ userInitial }}</div>
            <div class="topbar-user-info">
              <span class="topbar-user-name">{{ userName }}</span>
              <span class="topbar-user-role">{{ roleLabel }}</span>
            </div>
          </div>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>

    <!-- ── Modal Cambiar Contraseña ── -->
    <CambiarContrasena
      v-if="showChangePassword"
      @close="showChangePassword = false"
    />
  </div>
</template>

<script>
import { useAuthStore } from '../store/auth.js';
import api from '../api/axios.js';
import CambiarContrasena from '../components/CambiarContrasena.vue';

export default {
  name: 'MainLayout',
  components: { CambiarContrasena },
  data() {
    return {
      sidebarCollapsed: false,
      loggingOut: false,
      showChangePassword: false,
    };
  },
  computed: {
    rolId() {
      const authStore = useAuthStore();
      return authStore.user?.rol_id || null;
    },
    userName() {
      const authStore = useAuthStore();
      return authStore.user?.name || 'Usuario';
    },
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    },
    roleLabel() {
      const labels = { 1: 'Administrador', 2: 'Médico', 3: 'Soporte', 4: 'Paciente', 5: 'Farmacéutico' };
      return labels[this.rolId] || 'Usuario';
    },
    roleClass() {
      const classes = { 1: 'administrador', 2: 'medico', 3: 'soporte', 4: 'paciente', 5: 'farmaceutico' };
      return classes[this.rolId] || 'guest';
    },
    dashboardPath() {
      const paths = { 1: '/admin/dashboard', 2: '/medico/dashboard', 3: '/soporte/dashboard', 4: '/paciente/dashboard', 5: '/farmaceutico/dashboard' };
      return paths[this.rolId] || '/login';
    },
    currentPageTitle() {
      const titles = {
        '/admin/dashboard': 'Dashboard',
        '/admin/gestion-pacientes': 'Gestión de Pacientes',
        '/admin/gestion-medicos': 'Gestión de Médicos',
        '/admin/gestion-administradores': 'Gestión de Administradores',
        '/admin/gestion-farmaceuticos': 'Gestión Farmacéutica',
        '/admin/gestion-roles': 'Gestión de Roles',
        '/admin/transacciones-farmacia': 'Transacciones de Farmacia',  
        '/admin/gestion-citas': 'Gestión de Citas',                   
        '/admin/reportes': 'Reportes',                                 
        '/soporte/dashboard': 'Dashboard',
        '/soporte/pacientes': 'Gestión de Pacientes',
        '/soporte/medicos': 'Gestión de Médicos',
        '/soporte/farmaceuticos': 'Gestión de Farmacéuticos',
        '/soporte/citas': 'Ver Citas Médicas',
        '/farmaceutico/dashboard': 'Dashboard',
        '/farmaceutico/inventario': 'Inventario de Medicamentos',
        '/farmaceutico/disponibilidad': 'Consulta de Disponibilidad',
        '/farmacia/inventario': 'Inventario de Medicamentos',
        '/farmacia/recetas': 'Recetas Médicas',
        '/medico/recetas': 'Recetas Emitidas',
        'farmaceutico/recetas': 'Recetas Por Despachar',
        'paciente/recetas': 'Mis Recetas',
      };
      return titles[this.$route?.path] || 'Panel';
    },
    formattedDate() {
      return new Date().toLocaleDateString('es-BO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  },
  methods: {
    async logout() {
      if (this.loggingOut) return;
      this.loggingOut = true;
      try {
        await api.post('/logout');
      } catch (err) {
        console.warn('Error al cerrar sesión en el servidor:', err.message);
      } finally {
        const authStore = useAuthStore();
        authStore.logout();
        this.$router.push('/login');
        this.loggingOut = false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Layout shell ── */
.main-layout {
  display: flex;
  height: 100vh;
  background: #f4f8f7;
  font-family: 'DM Sans', sans-serif;
  color: #3d5260;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8f0ed;
  box-shadow: 0 1px 4px rgba(30,60,70,0.07);
  transition: width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
  z-index: 100;
}
.sidebar.collapsed {
  width: 70px;
  min-width: 70px;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 14px 16px;
  border-bottom: 1px solid #eef3f1;
}
.brand-icon img {
  width: 38px;
  height: 38px;
  object-fit: contain;
  flex-shrink: 0;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  overflow: hidden;
  white-space: nowrap;
}
.brand-name {
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1a2b2e;
}
.brand-sub {
  font-size: 11px;
  font-weight: 500;
  color: #4EB89D;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.collapse-btn {
  margin-left: auto;
  background: #f0faf7;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #3aa085;
  transition: background 0.22s ease;
}
.collapse-btn:hover { background: #d6f5eb; }
.collapse-btn svg { width: 16px; height: 16px; stroke: #3aa085; }

/* User badge */
.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 14px;
  padding: 10px 12px;
  background: #f0faf7;
  border-radius: 12px;
  overflow: hidden;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4EB89D;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4EB89D;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px auto;
}
.user-info {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a2b2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}
.user-role-badge.administrador { background: #dbeafe; color: #2563eb; }
.user-role-badge.medico        { background: #d1fae5; color: #059669; }
.user-role-badge.paciente      { background: #fce7f3; color: #be185d; }
.user-role-badge.farmaceutico  { background: #fef3c7; color: #d97706; }
.user-role-badge.guest         { background: #f3f4f6; color: #6b7280; }

/* Nav */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar-nav::-webkit-scrollbar { width: 4px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background: #d0e8e0; border-radius: 4px; }

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a9aaa;
  padding: 10px 10px 4px;
}

/* ── Nav items — color hardcodeado para que scoped funcione ── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: #3d5260;
  font-size: 13.5px;
  font-weight: 500;
  transition: background 0.22s ease, color 0.22s ease;
  white-space: nowrap;
  overflow: hidden;
}
.nav-item:hover {
  background: #0f7a5a;
  color: #ffffff;
}
.nav-item:hover .nav-icon svg {
  stroke: #ffffff;
}
.nav-item--active {
  background: #4EB89D !important;
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(78,184,157,0.3);
}
.nav-item--active .nav-icon svg {
  stroke: #ffffff !important;
}

/* Íconos — stroke explícito heredado del padre */
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
}
.nav-icon svg {
  width: 18px;
  height: 18px;
  stroke: #3d5260;        /* color base mismo que .nav-item */
  transition: stroke 0.22s ease;
  flex-shrink: 0;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Footer ── */
.sidebar-footer {
  padding: 10px;
  border-top: 1px solid #eef3f1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Botón cambiar contraseña */
.change-pwd-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: #2e8a72;
  font-size: 13.5px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: background 0.22s ease;
  overflow: hidden;
}
.change-pwd-btn:hover { background: #f0faf7; }
.change-pwd-btn .nav-icon svg { stroke: #2e8a72; }

/* Botón cerrar sesión */
.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: #e05757;
  font-size: 13.5px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: background 0.22s ease, opacity 0.22s ease;
  overflow: hidden;
}
.logout-btn:hover { background: #fef2f2; }
.logout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.logout-btn .nav-icon svg { stroke: #e05757; }

/* ── Layout body ── */
.layout-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* ── Topbar ── */
.topbar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e8f0ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(30,60,70,0.07);
}
.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a2b2e;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.topbar-date {
  font-size: 12px;
  color: #7a9aaa;
  font-weight: 400;
  text-transform: capitalize;
}
.topbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0faf7;
  border: 1.5px solid #d6f5eb;
  border-radius: 40px;
  padding: 6px 14px 6px 6px;
}
.topbar-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #4EB89D;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.topbar-user-info { display: flex; flex-direction: column; line-height: 1.2; }
.topbar-user-name { font-size: 13px; font-weight: 600; color: #1a2b2e; }
.topbar-user-role { font-size: 11px; color: #3aa085; font-weight: 500; }

/* ── Content ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  background: #f4f8f7;
}
.content::-webkit-scrollbar { width: 6px; }
.content::-webkit-scrollbar-track { background: transparent; }
.content::-webkit-scrollbar-thumb { background: #c5ddd7; border-radius: 6px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .topbar-date { display: none; }
  .content { padding: 16px; }
}
.user-role-badge.soporte { background: #ede9fe; color: #7c3aed; }
</style>