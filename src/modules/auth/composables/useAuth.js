import { ref } from 'vue';
import { useAuthStore } from '../../../store/auth.js'; // Importas el almacén que acabas de crear
import { useRouter } from 'vue-router';

export const useAuth = () => {
  //const authStore = useAuthStore();
  const router = useRouter();
  const loading = ref(false);
  const error = ref(null);

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      // 1. Simulación de la respuesta de Laravel
      // Cuando el back esté listo, aquí usarás: const { data } = await axios.post('/login', credentials);
      const mockResponse = await simulateApiCall(credentials);

      // 2. Guardamos en el STORE (esto actualiza el token y localStorage)
      //authStore.setAuth(mockResponse.user, mockResponse.token);

      // 3. Redirigimos según el rol que vino en el DTO
      const routes = {
        administrador: '/admin/dashboard',
        medico: '/medico/dashboard',
        paciente: '/paciente/dashboard',
        farmaceutico: '/farmaceutico/dashboard'
      };

      const target = routes[mockResponse.user.role] || '/paciente/dashboard';
      router.push(target);

    } catch (err) {
      error.value = "Error al iniciar sesión. Revisa tus datos.";
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    authStore.clearAuth();
    router.push('/login');
  };

  // Función interna para simular el retraso del servidor
  const simulateApiCall = (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = credentials.usuario.toLowerCase();
        let role = 'paciente';
        
        if (user.includes('admin')) role = 'administrador';
        if (user.includes('doc')) role = 'medico';
        if (user.includes('farma')) role = 'farmaceutico';

        resolve({
          token: 'token-generado-por-laravel-2026',
          user: { name: credentials.usuario, role: role }
        });
      }, 1000);
    });
  };

  return {
    login,
    logout,
    loading,
    error
  };
};