<template>
  <div class="dashboard-container">
    <header class="dash-header">
      <div class="header-left">
        <div class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C5.69 2 3 4.69 3 8c0 2.1 1.08 3.95 2.72 5.04L5.25 16h7.5l-.47-2.96C13.92 11.95 15 10.1 15 8c0-3.31-2.69-6-6-6z" fill="white"/>
          </svg>
        </div>
        <div>
          <h1 class="header-title">Panel farmaceutico</h1>
          <p class="header-sub">Gestion Salud · Sistema de salud</p>
        </div>
      </div>
      <button @click="logout" class="btn-logout">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2v10h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Cerrar sesión
      </button>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon stat-icon--teal">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="4" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M6 2v4M12 2v4M3 8h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-body">
          <span class="stat-label">Citas hoy</span>
          <span class="stat-value">8</span>
        </div>
        <div class="stat-trend">+2 vs ayer</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--blue">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M3 15c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-body">
          <span class="stat-label">Pacientes a cargo</span>
          <span class="stat-value">24</span>
        </div>
        <div class="stat-trend">Total activos</div>
      </div>
    </div>

    <section class="main-content">
      <div class="section-header">
        <h2 class="section-title">Próximas consultas</h2>
        <span class="section-badge">Hoy</span>
      </div>

      <div class="table-wrap">
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
            <tr v-for="i in 3" :key="i" class="table-row">
              <td>
                <div class="patient-cell">
                  <div class="avatar">P{{ i }}</div>
                  <span>Paciente Ejemplo {{ i }}</span>
                </div>
              </td>
              <td><span class="time-badge">10:00 AM</span></td>
              <td class="muted">Control General</td>
              <td>
                <button class="btn-action">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4 5.5h5M4 7.5h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                  Ver historial
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
// import { useAuth } from '../../auth/composables/useAuth';
// const { logout } = useAuth();

function logout() {}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

.dashboard-container {
  padding: 24px;
  font-family: 'DM Sans', sans-serif;
  background: #f5f7f5;
  min-height: 100vh;
  color: #1a2e1a;
}

/* ── Header ── */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1D9E75;
  border-radius: 12px;
  padding: 14px 20px;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.header-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  margin: 2px 0 0;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.22);
  color: #fff;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border: 0.5px solid #d8e8d8;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon--teal { background: #E1F5EE; color: #0F6E56; }
.stat-icon--blue { background: #E6F1FB; color: #185FA5; }

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7a6b;
}

.stat-value {
  font-size: 26px;
  font-weight: 500;
  color: #1a2e1a;
  line-height: 1;
}

.stat-trend {
  font-size: 11px;
  color: #0F6E56;
  background: #E1F5EE;
  padding: 2px 8px;
  border-radius: 20px;
  align-self: flex-start;
  margin-top: 4px;
  white-space: nowrap;
}

/* ── Section ── */
.main-content {
  background: #fff;
  border: 0.5px solid #d8e8d8;
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 0.5px solid #e8f0e8;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a2e1a;
  margin: 0;
}

.section-badge {
  font-size: 11px;
  background: #E1F5EE;
  color: #0F6E56;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
}

/* ── Table ── */
.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  padding: 10px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 500;
  color: #6b7a6b;
  background: #f8faf8;
  border-bottom: 0.5px solid #e8f0e8;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

tbody td {
  padding: 11px 18px;
  font-size: 13px;
  border-bottom: 0.5px solid #f0f5f0;
  color: #1a2e1a;
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover td {
  background: #f8faf8;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 9px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E1F5EE;
  color: #085041;
  font-size: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.time-badge {
  font-size: 12px;
  font-weight: 500;
  background: #f0f5f0;
  color: #3B6D11;
  padding: 2px 8px;
  border-radius: 6px;
}

.muted {
  color: #6b7a6b;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #0F6E56;
  background: #E1F5EE;
  border: 0.5px solid #9FE1CB;
  padding: 5px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-action:hover {
  background: #9FE1CB;
  color: #085041;
}
</style>