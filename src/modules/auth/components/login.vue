<template>
  <div class="fondo">
    <div class="panel-izquierdo">
      <div class="overlay-imagen"></div>
      <img
        src="@/assets/medico.jpg"
        alt="Profesional de salud"
        class="imagen-lateral"
      >
      <div class="badge-top">
        <img src="@/assets/cns-removebg-preview.png" alt="CNS" class="logo-badge-cns">
        <span>Gestión Salud</span>
      </div>
      <div class="info-marca">
        <img src="@/assets/gestion-salud-logo.png" alt="Gestión Salud" class="logo-img">
        <p class="slogan">Tu salud, nuestro compromiso.<br>Tus registros, tu control.</p>
      </div>
    </div>

    <div class="panel-derecho">
      <div class="cabecera">
        <h2 class="titulo-login">Bienvenido a Gestion Salud</h2>
        <p class="subtitulo-login">Ingresa tus datos para continuar</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Usuario</label>
          <div class="input-wrap">
            <input
              id="email"
              v-model="email"
              type="text"
              placeholder="ej: luciana@correo.com"
            >
            <User class="input-ico" :size="16" />
          </div>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <div class="input-wrap">
            <input
              id="password"
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="••••••••••••"
            >
            <button
              type="button"
              class="toggle-pass"
              @click="mostrarPassword = !mostrarPassword"
            >
              <component :is="mostrarPassword ? EyeOff : Eye" :size="16" />
            </button>
          </div>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <div class="divider"><span>acceso seguro</span></div>

      <p class="registro-link">
        No olvides cambiar tu contraseña periódicamente 
      </p>
    </div>

    <Teleport to="body">
      <div v-if="showErrorModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <AlertTriangle :size="50" color="#f59e0b" />
          </div>
          <h3>Atención</h3>
          <p>{{ errorMessage }}</p>
          <button class="btn-entendido" @click="closeError">Entendido</button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <CheckCircle :size="50" color="#1D9E75" />
          </div>
          <h3>Inicio de sesión exitoso</h3>
          <p class="p-success">Bienvenido a Gestión Salud</p>
          <button class="btn-entendido" @click="closeSuccess">Entendido</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginForm } from './loginForm.js';
import { AlertTriangle, CheckCircle, Eye, EyeOff, User } from 'lucide-vue-next';

const mostrarPassword = ref(false);

const {
  email,
  password,
  loading,
  handleLogin,
  errorMessage,
  showErrorModal,
  showSuccessModal,
  closeError,
  closeSuccess
} = useLoginForm();
</script>

<style src="./loginForm.css" scoped></style>