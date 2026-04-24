import { ref } from 'vue';
import { useAuthStore } from '../../../store/auth.js'; 
import { useRouter } from 'vue-router';
import api from '../../../api/axios.js'; // ✅ Cambiado

export const useAuth = () => {
  const authStore = useAuthStore(); 
  const router = useRouter();
  const loading = ref(false);
  const error = ref(null);

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.post('/login', { // ✅ Cambiado
        email: credentials.email, 
        password: credentials.password
      });

      authStore.setToken(data.data.token);
      authStore.setUser(data.data.user);

      const routes = {
        administrador: '/admin/dashboard',
        admin: '/admin/dashboard', 
        medico: '/medico/dashboard',
        paciente: '/paciente/dashboard',
        farmaceutico: '/farmaceutico/dashboard'
      };

      const role = data.data.user.role.nombre.toLowerCase();
      const target = routes[role] || '/login';
      
      router.push(target);

    } catch (err) {
      error.value = err.response?.data?.message || "Credenciales incorrectas";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    authStore.logout();
    router.push('/login');
  };

  return {
    login,
    logout,
    loading,
    error
  };
};