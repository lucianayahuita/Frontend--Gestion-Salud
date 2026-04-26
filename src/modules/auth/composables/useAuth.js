import { ref } from 'vue';
import { useAuthStore } from '../../../store/auth.js'; 
import api from '../../../api/axios.js';

export const useAuth = () => {
  const authStore = useAuthStore(); 
  const loading = ref(false);
  const error = ref(null);

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.post('/login', {
        email: credentials.email, 
        password: credentials.password
      });

      authStore.setToken(data.data.token);
      authStore.setUser(data.data.user);
      return data.data.user.role.nombre.toLowerCase();

    } catch (err) {
      error.value = err.response?.data?.message || "Credenciales incorrectas";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    authStore.logout();
  };

  return {
    login,
    logout,
    loading,
    error
  };
};