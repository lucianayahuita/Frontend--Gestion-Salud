<template>
  <div class="fondo">
    <div class="logo-marca">
      <div class="gestion-salud">
        <img src="@/assets/gestion-salud-logo.png" alt="Logo de la marca">
        <p class="slogan">Tu salud, nuestro compromiso</p>
      </div>
    </div>

    <div class="login-card">
      <h2 class="titulo-login">INICIAR SESIÓN</h2>
      <div class="linea-separadora"></div>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Usuario:</label> 
          <input 
            id="email"
            v-model="email" 
            type="text" 
            placeholder="ej: luciana@correo.com"
          >
        </div>

        <div class="input-group">
          <label for="password">Contraseña:</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="****************"
          >
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Inicia Sesión' }}
        </button>
      </form>
    </div>

    <!-- Modal Error -->
    <Teleport to="body">
      <div v-if="showErrorModal" class="modal-overlay" @click="closeError">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <span style="font-size: 50px;">⚠️</span>
          </div>
          <h3 style="color: #333;">Atención</h3>
          <p style="color: #666;">{{ errorMessage }}</p>
          <p style="color: rgba(13, 148, 136, 1);">El usuario no se encuentra registrado</p>
          <button class="btn-entendido" @click="closeError">Entendido</button>
        </div>
      </div>
    </Teleport>

    <!-- Modal Éxito -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccess">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <span style="font-size: 50px;">✅</span>
          </div>
          <h3 style="color: #333;">Inicio de sesión exitoso</h3>
          <p style="color: rgba(13, 148, 136, 1);">Bienvenido a Gestión Salud</p>
          <button class="btn-entendido" @click="closeSuccess">Entendido</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { useLoginForm } from './loginForm.js';

const { 
  email, 
  password, 
  loading, 
  handleLogin, 
  errorMessage, 
  showErrorModal,
  showSuccessModal,
  closeError,
  closeSuccess // ✅ Agregado
} = useLoginForm();
</script>

<style src="./loginForm.css" scoped></style>