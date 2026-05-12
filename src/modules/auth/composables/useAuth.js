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

      if (data.success && data.data) {
        const { user, token } = data.data;

        authStore.setToken(token);
        authStore.setUser(user);

        const nombreRol = user.role?.nombre;

        if (!nombreRol) {
          console.warn("Advertencia: El usuario no tiene un rol asignado en la BD.");
          return 'usuario';
        }

        return nombreRol.toLowerCase();
      } else {
        throw new Error("Respuesta del servidor inesperada");
      }

    } catch (err) {
      const mensajeError = err.response?.data?.message || "Credenciales incorrectas o error de conexión";
      error.value = mensajeError;
      console.error("Error en useAuth:", mensajeError);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Error al cerrar sesión en el servidor:', err.message);
    } finally {
      authStore.logout();
    }
  };

  return {
    login,
    logout,
    loading,
    error
  };
};