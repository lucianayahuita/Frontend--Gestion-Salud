import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
// 📦 Importamos Vuelidate y las reglas necesarias
import { useVuelidate } from '@vuelidate/core';
import { required, email as emailValidator, helpers } from '@vuelidate/validators';

export function useLoginForm() {
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const showErrorModal = ref(false);
  const showSuccessModal = ref(false);

  const { login, loading } = useAuth();

  // 1. Definimos las reglas personalizadas vinculadas a cada campo reactivo
  const rules = {
    email: {
      required: helpers.withMessage('El usuario / correo es obligatorio', required),
      email: helpers.withMessage('El formato del correo electrónico es inválido', emailValidator)
    },
    password: {
      required: helpers.withMessage('La contraseña es obligatoria', required),
    }
  };

  // 2. Inicializamos Vuelidate pasando la estructura de las variables
  // Como estamos usando variables ref sueltas, las agrupamos en un objeto dentro de useVuelidate
  const v$ = useVuelidate(rules, { email, password });

  const handleLogin = async () => {
    errorMessage.value = '';

    // 3. Forzamos a Vuelidate a verificar el estado de los inputs
    v$.value.$validate();

    // 4. Si el estado es inválido, frenamos el submit de inmediato
    if (v$.value.$invalid) {
      errorMessage.value = 'Por favor, corrige los errores en el formulario.';
      showErrorModal.value = true;
      return;
    }

    try {
      await login({
        email: email.value,
        password: password.value
      });

      showErrorModal.value = false;
      showSuccessModal.value = true;

    } catch (err) {
      showSuccessModal.value = false;
      errorMessage.value =
        err.response?.data?.message || err.message || 'Credenciales incorrectas';
      showErrorModal.value = true;
    }
  };

  const closeError = () => {
    showErrorModal.value = false;
  };

  const closeSuccess = () => {
    showSuccessModal.value = false;
    router.push('/admin/dashboard');
  };

  return {
    email,
    password,
    loading,
    errorMessage,
    showErrorModal,
    showSuccessModal,
    handleLogin,
    closeError,
    closeSuccess,
    //AQUI MODIFIQUE PARA AGREGAR VUELIDATE
    v$ 
  };
}