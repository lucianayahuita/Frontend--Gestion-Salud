import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/components/login.vue')
  },

  // ── Administrador (rol_id: 1) ──
  {
    path: '/admin',
    component: MainLayout,
    meta: { requiresAuth: true, rolId: 1 }, // Rol 1 = Admin
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/modules/views/Administrador/Administrador.vue')
      },
      // ─── Rutas de Gestión (Tus nuevos componentes) ───
      {
        path: 'gestion-pacientes',
        name: 'AdminPacientes',
        component: () => import('@/modules/administradores/components/gestionPacientes.vue')
      },
      {
        path: 'gestion-medicos',
        name: 'AdminMedicos',
        component: () => import('@/modules/administradores/components/gestionMedicos.vue')
      },
      {
        path: 'gestion-farmaceuticos',
        name: 'AdminFarmaceuticos',
        component: () => import('@/modules/administradores/components/gestionFarmaceuticos.vue')
      },
      {
        path: 'gestion-administradores',
        name: 'AdminGestionAdmins',
        component: () => import('@/modules/administradores/components/gestionAdministradores.vue')
      }
    ]
  },

  // ── Médico (rol_id: 2) ──
  {
    path: '/medico',
    component: MainLayout,
    meta: { requiresAuth: true, rolId: 2 },
    children: [
      {
        path: 'dashboard',
        name: 'MedicoDashboard',
        component: () => import('@/modules/views/Medico/Medico.vue')
      },
      {
        path: 'pacientes',
        name: 'MedicoPacientes',
        component: () => import('@/modules/views/Paciente/Paciente.vue')
      },
      {
        path: 'citas',
        name: 'MedicoCitas',
        component: () => import('@/modules/views/Medico/Medico.vue')
      }
    ]
  },

  // ── Farmacéutico (rol_id: 3) ──
  {
    path: '/farmaceutico',
    component: MainLayout,
    meta: { requiresAuth: true, rolId: 3 },
    children: [
      {
        path: 'dashboard',
        name: 'FarmaceuticoDashboard',
        component: () => import('@/modules/views/Farmaceutico/Farmaceutico.vue')
      }
    ]
  },

  // ── Paciente (rol_id: 4) ──
  {
    path: '/paciente',
    component: MainLayout,
    meta: { requiresAuth: true, rolId: 4 },
    children: [
      {
        path: 'dashboard',
        name: 'PacienteDashboard',
        component: () => import('@/modules/views/Paciente/Paciente.vue')
      },
      {
        path: 'citas',
        name: 'PacienteCitas',
        component: () => import('@/modules/views/Paciente/Paciente.vue')
      },
      {
        path: 'perfil',
        name: 'PacientePerfil',
        component: () => import('@/modules/views/Paciente/Paciente.vue')
      }
    ]
  },

  // ── 404 ──
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ── Guard de navegación ──
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const rolId = user?.rol_id || null;

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  if (to.meta.rolId && rolId !== to.meta.rolId) {
    const dashboards = {
      1: '/admin/dashboard',
      2: '/medico/dashboard',
      3: '/farmaceutico/dashboard',
      4: '/paciente/dashboard',
    };
    return next(dashboards[rolId] || '/login');
  }

  next();
});

export default router;