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
    meta: { requiresAuth: true, rolId: 1 },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/modules/views/Administrador/Administrador.vue')
      },
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
      },
      {
        path: 'transacciones-farmacia',
        name: 'AdminTransacciones',
        component: () => import('@/modules/farmaceuticos/components/ConsultaDisponibilidad.vue') 
      },
      {
        path: 'gestion-citas',
        name: 'AdminCitas',
        component: () => import('@/modules/soporte/components/CitasProgramadas.vue') // ← reutiliza el de soporte
      },
      {
        path: 'reportes',
        name: 'AdminReportes',
        component: () => import('@/modules/administradores/components/Reportes.vue')
      },
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
        component: () => import('@/modules/medicos/components/gestionPacientes.vue')
      },
      {
        path: 'pacientes/:id/historial',
        name: 'HistorialClinico',
        component: () => import('@/modules/medicos/components/HistorialClinico.vue'),
        props: true 
      },
      {
        path: '/nueva-consulta/:id',
        name: 'NuevaConsulta',
        component: () => import('@/modules/medicos/components/RegistrarConsulta.vue'), 
        props: route => ({ 
          id: route.params.id, 
          cita: route.params.cita 
        })
      },
      {
        path: 'citas',
        name: 'MedicoCitas',
        component: () => import('@/modules/medicos/components/gestionMisCitasMedico.vue')
      }
    ]
  },

  // ── Farmacéutico (rol_id: 5) ──
  {
    path: '/farmaceutico',
    component: MainLayout,
    meta: { requiresAuth: true, rolId: 5 },
    children: [
      {
        path: 'dashboard',
        name: 'FarmaceuticoDashboard',
        component: () => import('@/modules/views/Farmaceutico/Farmaceutico.vue')
      },
      {
        path: 'inventario',
        name: 'FarmaceuticoInventario',
        component: () => import('@/modules/farmaceuticos/components/Inventario.vue')
      },
      {
        path: 'disponibilidad',
        name: 'FarmaceuticoDisponibilidad',
        component: () => import('@/modules/farmaceuticos/components/ConsultaDisponibilidad.vue')
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
        component: () => import('@/modules/pacientes/components/gestionCitas.vue')
      },
      {
        path: 'perfil',
        name: 'PacientePerfil',
        component: () => import('@/modules/pacientes/components/gestionVerMiPerfil.vue')
      }
    ]
  },
  // ── Soporte (rol_id: 3) ──
  {
    path: '/soporte',
    component: MainLayout,
    meta: { requiresAuth: true, rolId: 3 },
    children: [
      {
        path: 'dashboard',
        name: 'SoporteDashboard',
        component: () => import('@/modules/views/Soporte/Soporte.vue')
      },
      {
        path: 'pacientes',
        name: 'SoportePacientes',
        component: () => import('@/modules/administradores/components/gestionPacientes.vue')
      },
      {
        path: 'medicos',
        name: 'SoporteMedicos',
        component: () => import('@/modules/administradores/components/gestionMedicos.vue')
      },
      {
        path: 'farmaceuticos',
        name: 'SoporteFarmaceuticos',
        component: () => import('@/modules/administradores/components/gestionFarmaceuticos.vue')
      },
      {
        path: 'citas',
        name: 'SoporteCitas',
        component: () => import('@/modules/soporte/components/CitasProgramadas.vue')
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
      3: '/soporte/dashboard',
      5: '/farmaceutico/dashboard',
      4: '/paciente/dashboard',
    };
    return next(dashboards[rolId] || '/login');
  }

  next();
});

export default router;