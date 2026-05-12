<template>
  <div class="perfil-viewport">
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    
    <div v-else-if="perfil" class="compact-card">
      <div class="card-aside">
        <div class="avatar-circle">
          {{ paciente ? paciente.nombre.charAt(0) : perfil.name.charAt(0) }}
        </div>
        <span class="role-pill">{{ perfil.role.nombre }}</span>
      </div>

      <div class="card-main">
        <div class="main-header">
          <h1 v-if="paciente">
            {{ paciente.nombre }} {{ paciente.apellido }} {{ paciente.segundo_apellido }}
          </h1>
          <h1 v-else>{{ perfil.name }}</h1>
        </div>

        <div class="data-grid">
          <div class="data-item">
            <label>Cédula de Identidad (CI)</label>
            <p>{{ paciente?.ci || 'No registrado' }}</p>
          </div>

          <div class="data-item">
            <label>Correo Electrónico</label>
            <p>{{ perfil.email }}</p>
          </div>

          <div class="data-item">
            <label>Teléfono</label>
            <p>{{ paciente?.telefono || 'No registrado' }}</p>
          </div>

          <div class="data-item">
            <label>Fecha de Nacimiento</label>
            <p>{{ paciente?.fecha_nacimiento || 'No registrado' }}</p>
          </div>

          <div class="data-item">
            <label>Estado de Seguro</label>
            <div>
              <span :class="['status-box', paciente?.seguro == 1 ? 'is-ok' : 'is-off']">
                {{ paciente?.seguro == 1 ? 'Vigente / Asegurado' : 'No Vigente' }}
              </span>
            </div>
          </div>

          <div class="data-item span-2">
            <label>Dirección de Domicilio</label>
            <p class="truncate">{{ paciente?.direccion || 'No registrada' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useVerMiPerfil } from '../composables/useVerMiPerfil';

const { perfil, paciente, loading, error, cargarInformacion } = useVerMiPerfil();

onMounted(() => {
  cargarInformacion();
});
</script>
<style scoped>
.perfil-viewport {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Ocupa casi toda la altura de la pantalla disponible */
  padding: 20px;
}
.main-header h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: black;
}
.compact-card {
  display: flex;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 1100px; /* Ancho extendido */
  min-height: 400px;
  overflow: hidden;
}

.card-aside {
  background: #f8fafc;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e2e8f0;
  min-width: 280px;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  background: #0d9488;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.card-main {
  flex: 1;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-header h1 {
  font-size: 2.2rem; /* Nombre mucho más grande */
  margin: 0 0 30px 0;
  color: #1e293b;
  border-bottom: 3px solid #f1f5f9;
  padding-bottom: 20px;
  text-transform: capitalize;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 35px;
}

.data-item label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.data-item p {
  margin: 0;
  font-size: 1.15rem;
  color: #334155;
  font-weight: 600;
}

.span-2 { grid-column: span 2; }

.status-box {
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
}

.is-ok { background: #ccfbf1; color: #0f766e; }
.is-off { background: #fef2f2; color: #ef4444; }

.spinner-container { padding: 100px; text-align: center; }
.spinner {
  width: 50px; height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #0d9488;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 950px) {
  .compact-card { flex-direction: column; }
  .card-aside { border-right: none; border-bottom: 1px solid #e2e8f0; }
  .data-grid { grid-template-columns: 1fr 1fr; }
}
</style>