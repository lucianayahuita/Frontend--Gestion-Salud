import { ref } from 'vue';
import { getMyProfile, getPatientDetails } from '../services/verMiPerfil';
import api from '@/api/axios.js';

export function useVerMiPerfil() {
    const perfil = ref(null);
    const paciente = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const cargarInformacion = async () => {
        loading.value = true;
        error.value = null;
        try {
            const resMe = await getMyProfile();
            if (resMe.success) {
                perfil.value = resMe.data;
                const resTodos = await api.get('/pacientes');
                if (resTodos.data.success) {
                    const miPerfilPaciente = resTodos.data.data.find(
                        p => p.user_id === perfil.value.id
                    );

                    if (miPerfilPaciente) {
                        paciente.value = miPerfilPaciente;
                    } else {
                        console.warn("No se encontró un perfil de paciente para este usuario");
                    }
                }
            }
        } catch (err) {
            error.value = "Error al cargar los datos del perfil";
        } finally {
            loading.value = false;
        }
    };

    return { perfil, paciente, loading, error, cargarInformacion };
}