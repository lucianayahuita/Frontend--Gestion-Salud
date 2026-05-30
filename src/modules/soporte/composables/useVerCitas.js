import { ref, computed } from 'vue';
import { verCitasService } from '../services/verCitasService.js';
import api from '@/api/axios.js'; 

export function useVerCitas() {
  const citas = ref([]);
  const medicosMap = ref({}); 
  const loading = ref(false);
  const error = ref(null);

  // Estados reactivos para los criterios de filtrado
  const filtroMedico = ref('');
  const filtroFecha = ref('');
  const mostrarSoloProximas = ref(false);

  /**
   * Carga las citas y los datos de los médicos en paralelo
   */
  const cargarCitas = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [citasData, usersRes] = await Promise.all([
        verCitasService.obtenerCitas(),
        api.get('/users')
      ]);

      const listaUsuarios = usersRes.data?.data || usersRes.data || [];
      const mapaMedicos = {};
      
      listaUsuarios.forEach(user => {
        if (user.rol_id === 2 || user.id) { 
          mapaMedicos[user.id] = `${user.name || 'Dr.'} ${user.apellido || ''}`.trim();
        }
      });
      
      medicosMap.value = mapaMedicos;
      citas.value = citasData;

    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.message || 'Error al obtener las citas médicas';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Propiedad Computada: Aplica todos los filtros vinculando el nombre del médico
   */
  const citasFiltradas = computed(() => {
    const ahora = new Date();

    return citas.value.filter(cita => {
      const nombreMedicoCita = medicosMap.value[cita.medico_id] || `Médico ID: ${cita.medico_id}`;
      if (filtroMedico.value) {
        const busqueda = filtroMedico.value.toLowerCase();
        if (!nombreMedicoCita.toLowerCase().includes(busqueda)) {
          return false;
        }
      }
      if (filtroFecha.value && cita.fecha !== filtroFecha.value) {
        return false;
      }

      if (mostrarSoloProximas.value) {
        const fechaCita = new Date(`${cita.fecha}T${cita.hora || '00:00:00'}`);
        if (cita.estado?.toLowerCase() === 'completada' || fechaCita < ahora) {
          return false;
        }
      }

      return true;
    });
  });

  const totalCitasHoy = computed(() => {
    const hoyStr = new Date().toISOString().split('T')[0];
    return citas.value.filter(c => c.fecha === hoyStr).length;
  });

  const totalPendientes = computed(() => {
    return citas.value.filter(c => c.estado?.toLowerCase() === 'pendiente').length;
  });

  return {
    citas,
    citasFiltradas,
    medicosMap, 
    loading,
    error,
    filtroMedico,
    filtroFecha,
    mostrarSoloProximas,
    totalCitasHoy,
    totalPendientes,
    cargarCitas
  };
}