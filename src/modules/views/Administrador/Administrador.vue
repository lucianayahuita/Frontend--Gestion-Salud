<template>
  <div class="dashboard">

    <!-- Título -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Resumen General del Sistema</p>
      </div>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="stats-grid">
      <div class="stat-card stat-card--green">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/><path d="M12 11V7M10 9h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>
        </div>
        <div class="stat-number">24</div>
        <div class="stat-label">Médicos activos</div>
      </div>

      <div class="stat-card stat-card--blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-number">12</div>
        <div class="stat-label">Administradores activos</div>
      </div>

      <div class="stat-card stat-card--yellow">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 11l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-number">4</div>
        <div class="stat-label">Administradores activos</div>
      </div>

      <div class="stat-card stat-card--teal">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-number">7</div>
        <div class="stat-label">Farmacéuticos activos</div>
      </div>
    </div>

    <!-- Sección central -->
    <div class="bottom-grid">

      <!-- Usuarios recientes -->
      <div class="card card--users">
        <div class="card-header">
          <h2 class="card-title">Usuarios Recientemente Registrados</h2>
        </div>
        <div class="user-list">
          <div class="user-item" v-for="user in recentUsers" :key="user.id">
            <div class="user-avatar">{{ user.initial }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.role }}</span>
            </div>
            <span class="status-badge" :class="user.status === 'Activo' ? 'status-badge--active' : 'status-badge--inactive'">
              {{ user.status }}
            </span>
          </div>

          <!-- Empty state -->
          <div class="empty-state" v-if="recentUsers.length === 0">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <p>Sin usuarios registrados recientemente</p>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="card card--actions">
        <div class="card-header">
          <h2 class="card-title card-title--accent">Acciones Rápidas</h2>
        </div>
        <div class="action-list">
          <button class="action-btn action-btn--dark" @click="$router.push('/admin/medicos/nuevo')">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Médico
          </button>
          <button class="action-btn action-btn--teal" @click="$router.push('/admin/pacientes/nuevo')">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Paciente
          </button>
          <button class="action-btn action-btn--soft" @click="$router.push('/admin/administradores/nuevo')">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Administrador
          </button>
          <button class="action-btn action-btn--outline" @click="$router.push('/admin/farmaceuticos/nuevo')">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Registrar Farmacéutico
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const recentUsers = ref([
  { id: 1, name: 'Laura Yahuita Lazarte', role: 'Médico',         initial: 'L', status: 'Activo' },
  { id: 2, name: 'Carlos Quispe Mamani', role: 'Farmacéutico',    initial: 'C', status: 'Activo' },
  { id: 3, name: 'Ana Flores Condori',   role: 'Administrador',   initial: 'A', status: 'Activo' },
  { id: 4, name: 'Pedro Salinas Roca',   role: 'Médico',          initial: 'P', status: 'Inactivo' },
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@600;700&display=swap');

.dashboard {
  font-family: 'DM Sans', sans-serif;
  color: #1a2b2e;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Page header ── */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0 0 2px;
}

.page-sub {
  font-size: 13px;
  color: #3aa085;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.01em;
}

/* ── Stats grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  border-radius: 16px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1.5px solid transparent;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30,80,70,0.1);
}

.stat-card--green  { background: #edfaf5; border-color: #b2e8d6; }
.stat-card--blue   { background: #eef4fb; border-color: #b8d4f0; }
.stat-card--yellow { background: #fefaed; border-color: #f0e0a0; }
.stat-card--teal   { background: #e8f7f3; border-color: #a8dece; }

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.stat-card--green  .stat-icon { color: #1D9E75; }
.stat-card--blue   .stat-icon { color: #2563eb; }
.stat-card--yellow .stat-icon { color: #b45309; }
.stat-card--teal   .stat-icon { color: #0d7a63; }

.stat-icon svg { width: 20px; height: 20px; }

.stat-number {
  font-family: 'Sora', sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  color: #1a2b2e;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #5a7a80;
  line-height: 1.3;
}

/* ── Bottom grid ── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;
}

@media (max-width: 820px) { .bottom-grid { grid-template-columns: 1fr; } }

/* ── Cards ── */
.card {
  background: #fff;
  border: 1.5px solid #e0eeea;
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #edf4f1;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a2b2e;
  margin: 0;
}

.card-title--accent {
  color: #1D9E75;
}

/* ── User list ── */
.user-list {
  display: flex;
  flex-direction: column;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 20px;
  border-bottom: 1px solid #f2f7f5;
  transition: background 0.15s;
}

.user-item:last-child { border-bottom: none; }
.user-item:hover { background: #f8fdfb; }

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #d6f5eb;
  color: #0d7a63;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #1a2b2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11.5px;
  color: #3aa085;
  font-weight: 500;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}

.status-badge--active   { background: #d6f5eb; color: #0d7a63; }
.status-badge--inactive { background: #fde8e8; color: #b91c1c; }

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: #8aafaa;
}
.empty-state svg { width: 36px; height: 36px; opacity: 0.4; }
.empty-state p { font-size: 13px; margin: 0; }

/* ── Action buttons ── */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 10px;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
  text-align: left;
}

.action-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

.action-btn--dark {
  background: #1a2b2e;
  color: #fff;
}
.action-btn--dark:hover { background: #243638; box-shadow: 0 4px 12px rgba(26,43,46,0.25); }

.action-btn--teal {
  background: #1D9E75;
  color: #fff;
}
.action-btn--teal:hover { background: #179063; box-shadow: 0 4px 12px rgba(29,158,117,0.3); }

.action-btn--soft {
  background: #edfaf5;
  color: #0d7a63;
  border: 1.5px solid #b2e8d6;
}
.action-btn--soft:hover { background: #d6f5eb; }

.action-btn--outline {
  background: #f4f8f7;
  color: #3d5260;
  border: 1.5px solid #dce8e4;
}
.action-btn--outline:hover { background: #e8f0ed; }
</style>