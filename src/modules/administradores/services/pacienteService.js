import api from '@/api/axios.js';

export const pacienteService = {
  async registrarPacienteCompleto(datos) {
    try {
      const resUser = await api.post('/users', {
        name: `${datos.nombre} ${datos.apellido}`,
        email: datos.email,
        password: datos.password,
        rol_id: 4 
      });

      const resPaciente = await api.post('/pacientes', {
        nombre: datos.nombre,
        apellido: datos.apellido,
        ci: datos.ci,
        fecha_nacimiento: datos.fecha_nacimiento,
        telefono: datos.telefono,
        direccion: datos.direccion,
        seguro: datos.seguro,
        estado: "Activo"
      });

      return resPaciente.data;
    } catch (error) {
      throw error.response?.data || "Error en el registro";
    }
  }
};