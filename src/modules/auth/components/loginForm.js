import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

export function useLoginForm() {
  const username = ref('');
  const password = ref('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!username.value || !password.value) return;
    await login({
      usuario: username.value,
      password: password.value
    });
  };

  return {
    username,
    password,
    loading,
    handleLogin
  };
}