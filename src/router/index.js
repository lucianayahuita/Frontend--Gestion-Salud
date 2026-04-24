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
  {
    // RUTA PADRE: Admin
    path: '/admin',
    component: MainLayout,
    meta: { requiresAuth: true, role: 'administrador' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/modules/views/Administrador/Administrador.vue')
      },
      {
        path: 'pacientes',
        name: 'AdminPacientes',
        component: () => import('@/modules/views/Paciente/Paciente.vue')
      },
    ]
  },
  {
    path: '/medico',
    component: MainLayout,
    meta: { requiresAuth: true, role: 'medico' },
    children: [
      {
        path: 'dashboard',
        name: 'MedicoDashboard',
        component: () => import('@/modules/views/Medico/Medico.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// GUARD DE NAVEGACIÓN 
router.beforeEach((to, from, next) => {
  /* 
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.role && to.meta.role !== userRole) {
    next('/login'); 
  } else {
    next();
  }
  */
  next(); 
});

export default router;