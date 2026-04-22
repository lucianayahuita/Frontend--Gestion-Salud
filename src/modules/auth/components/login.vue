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
      <div class="input-group">
        <label for="username">Usuario:</label>
        <input 
          id="username"
          v-model="username" 
          type="text" 
          placeholder="ej: luciana.yahuita"
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

      <button class="btn-login" @click="handleLogin" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Inicia Sesión' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLoginForm } from './loginForm.js';

const { username, password, loading, handleLogin } = useLoginForm();
</script>

<style src="./loginForm.css" scoped></style>