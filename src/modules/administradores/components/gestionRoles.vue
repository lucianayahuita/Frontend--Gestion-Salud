<template>
  <div class="gestion-roles">

    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="page-sub">Administra los roles del sistema</p>
      </div>
      <button class="btn-nuevo" @click="abrirModalCrear">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
        </svg>
        Nuevo Rol
      </button>
    </div>

    <!-- Tabla -->
    <div class="tabla-wrap">
      <div v-if="loading" class="estado-carga">
        <div class="spinner"></div>
        <span>Cargando roles...</span>
      </div>

      <div v-else-if="roles.length === 0" class="estado-vacio">
        <svg viewBox="0 0 24 24" fill="none" stroke="#b0c9bf" stroke-width="1.5" width="40" height="40">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke-linejoin="round"/>
        </svg>
        <p>No hay roles registrados</p>
      </div>

      <table v-else class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rol in roles" :key="rol.id">
            <td class="td-id">{{ rol.id }}</td>
            <td>
              <span class="rol-badge" :class="badgeClass(rol.nombre)">
                {{ rol.nombre }}
              </span>
            </td>
            <td class="td-desc">{{ rol.descripcion || '—' }}</td>
            <td class="td-fecha">{{ formatFecha(rol.created_at) }}</td>
            <td class="td-acciones">
              <button class="btn-accion editar" @click="abrirModalEditar(rol)" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round"/>
                </svg>
              </button>
              <button
                class="btn-accion eliminar"
                @click="confirmarEliminar(rol)"
                title="Eliminar"
                :disabled="rolesProtegidos.includes(rol.nombre)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
                  <polyline points="3 6 5 6 21 6" stroke-linecap="round"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round"/>
                  <path d="M10 11v6M14 11v6" stroke-linecap="round"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke-linecap="round"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear / Editar -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modoEditar ? 'Editar Rol' : 'Nuevo Rol' }}</h3>
            <button class="btn-cerrar" @click="cerrarModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="campo">
              <label>Nombre del rol <span class="requerido">*</span></label>
              <input
                v-model="form.nombre"
                type="text"
                placeholder="ej: Enfermero"
                :class="{ error: errores.nombre }"
              >
              <span v-if="errores.nombre" class="msg-error">{{ errores.nombre }}</span>
            </div>
            <div class="campo">
              <label>Descripción</label>
              <textarea
                v-model="form.descripcion"
                placeholder="Describe las responsabilidades de este rol..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
            <button class="btn-guardar" @click="guardar" :disabled="guardando">
              {{ guardando ? 'Guardando...' : modoEditar ? 'Guardar cambios' : 'Crear rol' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Confirmar Eliminar -->
    <Teleport to="body">
      <div v-if="showConfirmar" class="modal-overlay" @click.self="showConfirmar = false">
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h3>Eliminar rol</h3>
            <button class="btn-cerrar" @click="showConfirmar = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="confirmar-texto">
              ¿Estás seguro de eliminar el rol
              <strong>{{ rolAEliminar?.nombre }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancelar" @click="showConfirmar = false">Cancelar</button>
            <button class="btn-eliminar" @click="eliminar" :disabled="eliminando">
              {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toast.visible" class="toast" :class="toast.tipo">
        <svg v-if="toast.tipo === 'exito'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" stroke-linecap="round"/>
        </svg>
        {{ toast.mensaje }}
      </div>
    </Teleport>

  </div>
</template>

<script>
import api from '@/api/axios.js';

export default {
  name: 'GestionRoles',
  data() {
    return {
      roles: [],
      loading: true,
      showModal: false,
      showConfirmar: false,
      modoEditar: false,
      guardando: false,
      eliminando: false,
      rolAEliminar: null,
      rolesProtegidos: ['Administrador', 'Medico', 'Paciente', 'Farmaceutico', 'Soporte'],
      form: { nombre: '', descripcion: '' },
      errores: { nombre: '' },
      toast: { visible: false, mensaje: '', tipo: 'exito' },
    };
  },
  async mounted() {
    await this.cargarRoles();
  },
  methods: {
    async cargarRoles() {
      this.loading = true;
      try {
        const res = await api.get('/roles');
        this.roles = res.data?.data || res.data || [];
      } catch (err) {
        this.mostrarToast('Error al cargar roles', 'error');
      } finally {
        this.loading = false;
      }
    },

    abrirModalCrear() {
      this.modoEditar = false;
      this.form = { nombre: '', descripcion: '' };
      this.errores = { nombre: '' };
      this.showModal = true;
    },

    abrirModalEditar(rol) {
      this.modoEditar = true;
      this.form = { id: rol.id, nombre: rol.nombre, descripcion: rol.descripcion || '' };
      this.errores = { nombre: '' };
      this.showModal = true;
    },

    cerrarModal() {
      this.showModal = false;
    },

    validar() {
      this.errores.nombre = '';
      if (!this.form.nombre.trim()) {
        this.errores.nombre = 'El nombre es obligatorio';
        return false;
      }
      return true;
    },

    async guardar() {
      if (!this.validar()) return;
      this.guardando = true;
      try {
        if (this.modoEditar) {
          await api.put(`/roles/${this.form.id}`, {
            nombre: this.form.nombre,
            descripcion: this.form.descripcion,
          });
          this.mostrarToast('Rol actualizado correctamente', 'exito');
        } else {
          await api.post('/roles', {
            nombre: this.form.nombre,
            descripcion: this.form.descripcion,
          });
          this.mostrarToast('Rol creado correctamente', 'exito');
        }
        this.cerrarModal();
        await this.cargarRoles();
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al guardar el rol';
        this.mostrarToast(msg, 'error');
      } finally {
        this.guardando = false;
      }
    },

    confirmarEliminar(rol) {
      this.rolAEliminar = rol;
      this.showConfirmar = true;
    },

    async eliminar() {
      this.eliminando = true;
      try {
        await api.delete(`/roles/${this.rolAEliminar.id}`);
        this.mostrarToast('Rol eliminado correctamente', 'exito');
        this.showConfirmar = false;
        await this.cargarRoles();
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al eliminar el rol';
        this.mostrarToast(msg, 'error');
      } finally {
        this.eliminando = false;
      }
    },

    mostrarToast(mensaje, tipo = 'exito') {
      this.toast = { visible: true, mensaje, tipo };
      setTimeout(() => { this.toast.visible = false; }, 3500);
    },

    formatFecha(fecha) {
      if (!fecha) return '—';
      return new Date(fecha).toLocaleDateString('es-BO', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    },

    badgeClass(nombre) {
      const mapa = {
        'Administrador': 'badge-admin',
        'Medico':        'badge-medico',
        'Soporte':       'badge-soporte',
        'Paciente':      'badge-paciente',
        'Farmaceutico':  'badge-farma',
      };
      return mapa[nombre] || 'badge-default';
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.gestion-roles {
  font-family: 'Sora', sans-serif;
  color: #3d5260;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  font-family: 'Sora', sans-serif;
  border: 1px solid #e8f0ed;
  border-radius: 14px;
  padding: 18px 24px;
}
.page-sub {
  font-size: 1.3rem;
  color: #1a2b2e;
  font-family: 'Sora', sans-serif;
}
.btn-nuevo {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #1D9E75;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}
.btn-nuevo svg { width: 16px; height: 16px; stroke: white; }
.btn-nuevo:hover { background: #0f6e56; }

/* ── Tabla ── */
.tabla-wrap {
  background: #fff;
  border: 1px solid #e8f0ed;
  border-radius: 14px;
  overflow: hidden;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.tabla thead tr {
  background: #1D9E75;
  border-bottom: 1px solid #e8f0ed;
}
.tabla th {
  padding: 13px 18px;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: whitesmoke;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.tabla tbody tr {
  border-bottom: 1px solid #f0f6f3;
  transition: background 0.15s;
}
.tabla tbody tr:last-child { border-bottom: none; }
.tabla tbody tr:hover { background: #f7fcf9; }
.tabla td { padding: 13px 18px; color: #3d5260; vertical-align: middle; }
.td-id { color: #b0c9bf; font-size: 0.8rem; font-weight: 600; width: 48px; }
.td-desc { color: #7a9aaa; font-size: 0.83rem; max-width: 280px; }
.td-fecha { color: #9dbfb3; font-size: 0.8rem; white-space: nowrap; }

/* Badges rol */
.rol-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-admin   { background: #dbeafe; color: #2563eb; }
.badge-medico  { background: #d1fae5; color: #059669; }
.badge-soporte { background: #ede9fe; color: #7c3aed; }
.badge-paciente{ background: #fce7f3; color: #be185d; }
.badge-farma   { background: #fef3c7; color: #d97706; }
.badge-default { background: #f0f6f3; color: #3d5260; }

/* Acciones */
.td-acciones { display: flex; gap: 6px; align-items: center; }
.btn-accion {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid #e8f0ed;
  background: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, border-color 0.15s;
}
.btn-accion.editar:hover { background: #e1f5ee; border-color: #1D9E75; }
.btn-accion.editar:hover svg { stroke: #1D9E75; }
.btn-accion.eliminar:hover:not(:disabled) { background: #fcebeb; border-color: #e05757; }
.btn-accion.eliminar:hover:not(:disabled) svg { stroke: #e05757; }
.btn-accion:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-accion svg { stroke: #9dbfb3; }

/* Estados */
.estado-carga, .estado-vacio {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; padding: 52px;
  color: #9dbfb3; font-size: 0.875rem;
}
.spinner {
  width: 28px; height: 28px;
  border: 3px solid #e1f5ee;
  border-top-color: #1D9E75;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%; max-width: 460px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-sm { max-width: 380px; }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e8f0ed;
}
.modal-header h3 {
  font-family: 'Sora', sans-serif;
  font-size: 1rem; font-weight: 700; color: #1a2b2e;
}
.btn-cerrar {
  background: none; border: none; cursor: pointer;
  color: #9dbfb3; display: flex; align-items: center;
  padding: 4px; border-radius: 6px;
  transition: background 0.15s;
}
.btn-cerrar:hover { background: #f0f6f3; }
.modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; font-family: 'Sora', sans-serif; }
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e8f0ed;
  display: flex; justify-content: flex-end; gap: 10px;
}

/* Campos */
.campo { display: flex; flex-direction: column; gap: 7px; }
.campo label {
  font-size: 0.75rem; font-weight: 700;
  color: #2d5c46; text-transform: uppercase; letter-spacing: 0.08em;
}
.requerido { color: #e05757; }
.campo input, .campo textarea {
  padding: 11px 14px;
  border: 1.5px solid #d8e9e3;
  border-radius: 10px;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a3a2a;
  background: #f7fcf9;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}
.campo input:focus, .campo textarea:focus { border-color: #1D9E75; background: #fff; }
.campo input.error { border-color: #e05757; }
.msg-error { font-size: 0.76rem; color: #e05757; }

.confirmar-texto {
  font-size: 0.88rem; color: #3d5260; line-height: 1.6;
}
.confirmar-texto strong { color: #1a2b2e; }

/* Botones modal */
.btn-cancelar {
  padding: 9px 20px;
  border: 1.5px solid #d8e9e3;
  border-radius: 9px;
  background: #fff;
  color: #3d5260;
  font-size: 0.875rem; font-weight: 500;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;
}
.btn-cancelar:hover { background: #f7fcf9; }
.btn-guardar {
  padding: 9px 20px;
  background: #1D9E75; color: white;
  border: none; border-radius: 9px;
  font-size: 0.875rem; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}
.btn-guardar:hover { background: #0f6e56; }
.btn-guardar:disabled { background: #b0c9bf; cursor: not-allowed; }
.btn-eliminar {
  padding: 9px 20px;
  background: #e05757; color: white;
  border: none; border-radius: 9px;
  font-size: 0.875rem; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}
.btn-eliminar:hover { background: #c04040; }
.btn-eliminar:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 28px; right: 28px;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.875rem; font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  z-index: 100000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  animation: slideIn 0.25s ease;
}
.toast.exito { background: #1D9E75; color: white; }
.toast.error { background: #e05757; color: white; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>