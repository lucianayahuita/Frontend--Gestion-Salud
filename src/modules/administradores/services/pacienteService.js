import api from '@/api/axios.js';

export const pacienteService = {
  async registrarPacienteCompleto(datos) {
    try {
      // 1. Crear el usuario primero para obtener el user_id
      const resUser = await api.post('/users', {
        name: `${datos.nombre} ${datos.apellido}`,
        email: datos.email,
        password: datos.password,
        rol_id: 4
      });

      const user_id = resUser.data?.data?.id || resUser.data?.id;

      if (!user_id) {
        throw new Error('No se pudo obtener el ID del usuario creado');
      }

      // 2. Crear el paciente asociado al user_id
      const resPaciente = await api.post('/pacientes', {
        user_id,
        nombre: datos.nombre,
        apellido: datos.apellido,
        segundo_apellido: datos.segundo_apellido || '',
        ci: datos.ci,
        fecha_nacimiento: datos.fecha_nacimiento,
        telefono: datos.telefono,
        direccion: datos.direccion,
        seguro: datos.seguro,
        estado: 'Activo'
      });

      return resPaciente.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Error en el registro';
    }
  }
};