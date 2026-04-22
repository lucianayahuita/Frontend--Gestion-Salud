<template>
  <div class="dashboard-container">
    <header class="dash-header">
      <h1>Panel Paciente</h1>
      <!-- <button @click="logout" class="btn-logout">Cerrar Sesión</button> -->
    </header>

    <div class="stats-grid">
      <div class="card"><h3>Citas Hoy</h3><p>8</p></div>
      <div class="card"><h3>Pacientes a Cargo</h3><p>24</p></div>
    </div>

    <section class="main-content">
      <h2>Próximas Consultas</h2>
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Hora</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 3" :key="i">
            <td>Paciente Ejemplo {{ i }}</td>
            <td>10:00 AM</td>
            <td>Control General</td>
            <td><button class="btn-action">Ver Historial</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
// import { useAuth } from '../../auth/composables/useAuth';
// const { logout } = useAuth();
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.main-content h2 {
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.btn-logout, .btn-action {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover, .btn-action:hover {
  background: #0056b3;
}
</style>