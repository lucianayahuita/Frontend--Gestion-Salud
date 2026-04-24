<template>
  <div class="admin-layout">

    <aside class="sidebar">

      
      <div class="logo-section">
        <img src="@/assets/gestion-salud-logo.png" alt="logo" />
        <span class="logo-text">Gestión Salud</span>
      </div>

     
      <p class="panel-title">Panel Administrador</p>

      
      <nav class="menu">
        <router-link to="/admin/dashboard">Dashboard</router-link>
        <router-link to="/admin/medicos">Médicos</router-link>
        <router-link to="/admin/administradores">Administradores</router-link>
        <router-link to="/admin/farmaceuticos">Farmacéuticos</router-link>
      </nav>

      
      <button class="logout-btn" @click="logout">Salir</button>

    </aside>

    
    <main class="content">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function logout() {
    localStorage.clear()
  sessionStorage.clear()
  router.push('/login')
}
</script>
<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: white;
}


.sidebar {
  width: 23%;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  justify-content: space-between;
  border-right: 1px solid #e5e5e5;
}

/* LOGO */
.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-section img {
  width: 60px;
  height: auto;
}

.logo-text {
  font-family: var(--font-work);
  font-size: 18px;
  font-weight: 700;
  color: var(--secondary-color);
}

/* TÍTULO PANEL */
.panel-title {
  margin-top: 25px;
  margin-bottom: 25px;
  font-family: var(--font-work);
  font-weight: 600;
  font-size: 16px;
  color: var(--secondary-color);
}

/* MENÚ */
.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu a {
  text-decoration: none;
  color: var(--secondary-color);
  padding: 12px 14px;
  border-radius: 10px;
  font-family: var(--font-work);
  font-size: 15px;
  transition: 0.2s;
}

/* Hover verde tenue */
.menu a:hover {
  background: var(--hover-color);
}

/* Ruta activa */
.menu a.router-link-active {
  background: var(--hover-color);
  font-weight: 600;
}

/* CONTENIDO DERECHO */
.content {
  width: 70%;
  background: white;
  padding: 30px;
}

/* BOTÓN SALIR */
.logout-btn {
  margin-top: auto;
  padding: 13px;
  border: none;
  border-radius: 20px;
  background: var(--secondary-color);
  color: white;
  cursor: pointer;
  font-family: var(--font-work);
  font-weight: 600;
  transition: 0.2s;
}

.logout-btn:hover {
  opacity: 0.9;
}
</style>