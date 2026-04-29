<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Logo & Brand -->
      <div class="sidebar-header">
        <div class="brand-icon">
          <div class="brand-icon">
            <img src="@/assets/gestion-salud-logo.png" alt="Logo Gestión Salud" />
          </div>
        </div>
        <div class="brand-text" v-if="!sidebarCollapsed">
          <span class="brand-name">Gestión</span>
          <span class="brand-sub">Salud</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none">
            <path :d="sidebarCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- User Badge -->
      <div class="user-badge" v-if="!sidebarCollapsed">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role-badge" :class="roleClass">{{ roleLabel }}</span>
        </div>
      </div>
      <div class="user-avatar-sm" v-else>{{ userInitial }}</div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-label" v-if="!sidebarCollapsed">Principal</div>

        <!-- Dashboard siempre visible -->
        <router-link :to="dashboardPath" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>

        <!-- ── Administrador (rol_id: 1) ── -->
        <template v-if="rolId === 1">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Administración</div>

          <router-link :to="{ name: 'AdminPacientes' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="17" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M21 20c0-3.3-2.7-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Pacientes</span>
          </router-link>

          <router-link :to="{ name: 'AdminMedicos' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/><path d="M12 11V7M10 9h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Médicos</span>
          </router-link>

          <router-link :to="{ name: 'AdminGestionAdmins' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Administradores</span>
          </router-link>

          <router-link :to="{ name: 'AdminFarmaceuticos' }" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Farmacéuticos</span>
          </router-link>
        </template>

        <!-- ── Médico (rol_id: 2) ── -->
        <template v-if="rolId === 2">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Gestión</div>
          <router-link to="/medico/pacientes" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
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
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Citas</span>
          </router-link>
        </template>

        <!-- ── Recepcionista (rol_id: 3) ── -->
        <template v-if="rolId === 3">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Gestión</div>
          <router-link to="/recepcionista/citas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Citas</span>
          </router-link>
          <router-link to="/recepcionista/pacientes" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Pacientes</span>
          </router-link>
        </template>

        <!-- ── Paciente (rol_id: 4) ── -->
        <template v-if="rolId === 4">
          <div class="nav-section-label" v-if="!sidebarCollapsed">Mi Espacio</div>
          <router-link to="/paciente/citas" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Mis Citas</span>
          </router-link>
          <router-link to="/paciente/perfil" class="nav-item" active-class="nav-item--active">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label" v-if="!sidebarCollapsed">Mi Perfil</span>
          </router-link>
        </template>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
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
  </div>
</template>

<script>
import { useAuthStore } from '../store/auth.js';

export default {
  name: 'MainLayout',
  data() {
    return {
      sidebarCollapsed: false,
    };
  },
  computed: {
    // ✅ Usa rol_id directamente para comparar
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
      const labels = {
        1: 'Administrador',
        2: 'Médico',
        3: 'Recepcionista',
        4: 'Paciente',
      };
      return labels[this.rolId] || 'Usuario';
    },
    roleClass() {
      const classes = {
        1: 'administrador',
        2: 'medico',
        3: 'recepcionista',
        4: 'paciente',
      };
      return classes[this.rolId] || 'guest';
    },
    dashboardPath() {
      const paths = {
        1: '/admin/dashboard',
        2: '/medico/dashboard',
        3: '/recepcionista/dashboard',
        4: '/paciente/dashboard',
      };
      return paths[this.rolId] || '/login';
    },
    currentPageTitle() {
      const titles = {
        '/admin/dashboard': 'Dashboard',
        '/admin/gestion-pacientes': 'Gestión de Pacientes', // Nombre actualizado
        '/admin/gestion-medicos': 'Gestión de Médicos',     // Nombre actualizado
        '/admin/gestion-administradores': 'Gestión de Admins',
        '/admin/gestion-farmaceuticos': 'Gestión Farmacéutica',
        '/admin/reportes': 'Reportes',
        // ... los demás se mantienen igual
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
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push('/login');
    }
  }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@500;600;700&display=swap');

/* ── Variables ── */
:root {
  --sidebar-w: 240px;
  --sidebar-w-sm: 70px;
  --topbar-h: 64px;

  --green-50: #f0faf7;
  --green-100: #d6f5eb;
  --green-400: #4EB89D;
  --green-500: #3aa085;
  --green-600: #2e8a72;

  --teal-light: #e8f7f3;
  --yellow-soft: #fef9ec;
  --blue-soft: #eef4fb;

  --text-heading: #1a2b2e;
  --text-body: #3d5260;
  --text-muted: #7a9aaa;

  --bg-page: #f4f8f7;
  --bg-sidebar: #ffffff;
  --bg-topbar: #ffffff;

  --shadow-sm: 0 1px 4px rgba(30,60,70,0.07);
  --shadow-md: 0 4px 16px rgba(30,60,70,0.1);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;

  --transition: 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Layout shell ── */
.main-layout {
  display: flex;
  height: 100vh;
  background: rgba(255,255,255,0.65);
  font-family: 'DM Sans', sans-serif;
  color: var(--text-body);
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8f0ed;
  box-shadow: var(--shadow-sm);
  transition: width var(--transition), min-width var(--transition);
  overflow: hidden;
  z-index: 100;
}

.sidebar.collapsed {
  width: var(--sidebar-w-sm);
  min-width: var(--sidebar-w-sm);
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
  color: var(--text-heading);
}
.brand-sub {
  font-size: 11px;
  font-weight: 500;
  color: var(--green-400);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.collapse-btn {
  margin-left: auto;
  background: var(--green-50);
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--green-500);
  transition: background var(--transition);
}
.collapse-btn:hover { background: var(--green-100); }
.collapse-btn svg { width: 16px; height: 16px; }

/* User badge */
.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 14px;
  padding: 10px 12px;
  background: var(--green-50);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--green-400);
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
  background: var(--green-400);
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px auto;
  flex-shrink: 0;
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
  color: var(--text-heading);
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
  color: var(--text-muted);
  padding: 10px 10px 4px;
}

/* ── Nav ── */
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
  background: rgba(15, 122, 90, 1); 
  color: #ffffff;      
}

.nav-item--active {
  background: #4EB89D !important;
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(78,184,157,0.3);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-icon svg {
  width: 18px;
  height: 18px;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer / Logout */
.sidebar-footer {
  padding: 10px;
  border-top: 1px solid #eef3f1;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  background: transparent;
  color: #e05757;
  font-size: 13.5px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  transition: background var(--transition);
  overflow: hidden;
}
.logout-btn:hover {
  background: #fef2f2;
}
.logout-btn .nav-icon svg { width: 18px; height: 18px; }

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
  height: var(--topbar-h);
  background: var(--bg-topbar);
  border-bottom: 1px solid #e8f0ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-heading);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar-date {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 400;
  text-transform: capitalize;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--green-50);
  border: 1.5px solid var(--green-100);
  border-radius: 40px;
  padding: 6px 14px 6px 6px;
  cursor: default;
}

.topbar-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--green-400);
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.topbar-user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
}
.topbar-user-role {
  font-size: 11px;
  color: var(--green-500);
  font-weight: 500;
}

/* ── Content ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  background: var(--bg-page);
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
</style>