import { createRouter, createWebHistory } from 'vue-router';
// 1. Corregido con ../ para salir de router e ir a store
import { useAuthStore } from '../store/auth.js';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    // 2. Corregido: Si está en componentes, usamos ../ para subir
    component: () => import('../modules/auth/components/login.vue')
  },
  // --- RUTAS MODULARES ---
  {
    path: '/paciente/dashboard',
    name: 'paciente-dash',
    // 3. Corregido: Ajustado a la ruta que me dijiste (views fuera de módulos)
    component: () => import('../modules/views/Paciente/Paciente.vue'),
    meta: { requiresAuth: true, role: 'paciente' }
  },
  {
    path: '/medico/dashboard',
    name: 'medico-dash',
    component: () => import('../modules/views/Medico/Medico.vue'),
    meta: { requiresAuth: true, role: 'medico' }
  },
  {
   path: '/admin',
  component: () => import('../Layouts/AdministradorLayout.vue'),
  children: [
       {
       path: '',
        redirect: 'dashboard'
       },
       {
          path: 'dashboard',
          component: () => import('../modules/views/Administrador/Dashboard.vue')
       },
       {
           path: 'pacientes',
           component: () => import('../modules/views/Administrador/Pacientes.vue')
       },
       {
           path: 'medicos',
           component: () => import('../modules/views/Administrador/Medicos.vue')
      },
       {
           path: 'administradores',
          component: () => import('../modules/views/Administrador/Administradores.vue')
       },
       {
         path: 'farmaceuticos',
          component: () => import('../modules/views/Administrador/Farmaceuticos.vue')
       }
        ]
    },
  {
    path: '/farmaceutico/dashboard',
    name: 'farmacia-dash',
    component: () => import('../modules/views/Farmaceutico/Farmaceutico.vue'),
    meta: { requiresAuth: true, role: 'farmaceutico' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- EL GUARDIÁN DE RUTAS ---

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  // const isAuthenticated = !!authStore.token;
  // const userRole = authStore.user?.role;

  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   return { name: 'login' };
  // }

  // if (to.name === 'login' && isAuthenticated) {
  //   return getDashboardPath(userRole);
  // }

  // if (to.meta.role && to.meta.role !== userRole) {
  //   return getDashboardPath(userRole);
  // }
});

function getDashboardPath(role) {
  const paths = {
    administrador: '/admin/dashboard',
    medico: '/medico/dashboard',
    paciente: '/paciente/dashboard',
    farmaceutico: '/farmaceutico/dashboard'
  };
  return paths[role] || '/login';
}

export default router;