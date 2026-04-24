import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

export function useLoginForm() {
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const showErrorModal = ref(false);
  const showSuccessModal = ref(false);

  const { login, loading } = useAuth();

  const handleLogin = async () => {
    errorMessage.value = '';

    if (!email.value || !password.value) {
      errorMessage.value = "Por favor, completa todos los campos";
      showErrorModal.value = true;
      return; // ✅ Sin redirect aquí
    }

    try {
      await login({
        email: email.value,
        password: password.value
      });

      showSuccessModal.value = true; 

    } catch (err) {
      errorMessage.value = err.message || "Credenciales incorrectas";
      showErrorModal.value = true; 
    }
  };

  const closeError = () => {
    showErrorModal.value = false;
  };

  const closeSuccess = () => {
    showSuccessModal.value = false;
    router.push('/admin/dashboard'); // ✅ Redirige solo al cerrar éxito
    
  };

  return {
    email,
    password,
    loading,
    errorMessage,
    showErrorModal,
    showSuccessModal, // ✅ Agregado
    handleLogin,
    closeError,
    closeSuccess // ✅ Agregado
  };
}