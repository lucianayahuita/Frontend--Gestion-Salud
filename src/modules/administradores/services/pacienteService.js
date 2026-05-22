import api from '@/api/axios.js';

export const pacienteService = {
  async registrarPacienteCompleto(datos) {
    try {
      // 1. Crear el usuario primero para obtener el user_id
      let resUser;
      try {
        resUser = await api.post('/users', {
          name: `${datos.nombre} ${datos.apellido}`,
          email: datos.email,
          password: datos.password,
          rol_id: 4
        });
      } catch (userError) {
        if (userError.response?.status === 422 && userError.response?.data?.errors) {
          throw userError.response.data.errors;
        }
        throw userError.response?.data?.message || userError.message || 'Error al crear las credenciales del usuario';
      }

      const user_id = resUser.data?.data?.id || resUser.data?.id;

      if (!user_id) {
        throw new Error('No se pudo obtener el ID del usuario creado');
      }

      const resPaciente = await api.post('/pacientes', {
        user_id: parseInt(user_id, 10),
        nombre: datos.nombre,
        apellido: datos.apellido,
        segundo_apellido: datos.segundo_apellido || '',
        ci: datos.ci,
        fecha_nacimiento: datos.fecha_nacimiento, 
        telefono: datos.telefono || '',
        direccion: datos.direccion || '',
        tipo_sangre_id: parseInt(datos.tipo_sangre_id, 10),
        seguro: datos.seguro ? true : false, 
        estado: 'Activo',
        estatura: 0.00,             // Decimal/Float
        peso: 0.0,                  // Decimal/Float
        presion_arterial: '0/0',    // String
        temperatura: 36.0,          // Decimal/Float
        oxigeno_sangre: 0           // Integer
      });

      return resPaciente.data;
    } catch (error) {
      if (typeof error === 'object' && !error.response) {
        throw error;
      }
      if (error.response?.status === 422 && error.response?.data?.errors) {
        throw error.response.data.errors; 
      }
      throw error.response?.data?.message || error.message || 'Error en el registro del paciente';
    }
  }
};