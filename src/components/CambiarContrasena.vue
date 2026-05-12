<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="handleClose">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <!-- Header -->
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#3aa085" stroke-width="1.8"/>
                <path d="M8 11V7a4 4 0 018 0v4" stroke="#3aa085" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="#3aa085"/>
              </svg>
            </div>
            <div>
              <h2 id="modal-title" class="modal-title">Cambiar Contraseña</h2>
              <p class="modal-subtitle">Actualiza tu contraseña de acceso</p>
            </div>
          </div>
          <button class="modal-close" @click="handleClose" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#7a9aaa" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Cuerpo -->
        <div class="modal-body">

          <!-- Alerta éxito -->
          <transition name="slide-down">
            <div v-if="successMsg" class="alert alert--success">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              {{ successMsg }}
            </div>
          </transition>

          <!-- Alerta error general -->
          <transition name="slide-down">
            <div v-if="errorMsg" class="alert alert--error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#dc2626" stroke-width="1.8"/>
                <path d="M12 8v4m0 4h.01" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              {{ errorMsg }}
            </div>
          </transition>

          <!-- Campo: contraseña actual -->
          <div class="field">
            <label class="field-label" for="current_password">Contraseña actual</label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.current_password }">
              <span class="input-prefix">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a9aaa" stroke-width="1.8"/>
                  <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a9aaa" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <input
                id="current_password"
                v-model="form.current_password"
                :type="show.current ? 'text' : 'password'"
                class="field-input"
                placeholder="Tu contraseña actual"
                autocomplete="current-password"
                :disabled="loading"
              />
              <button type="button" class="eye-btn" @click="show.current = !show.current">
                <svg v-if="!show.current" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#7a9aaa" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="#7a9aaa" stroke-width="1.8"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="#7a9aaa" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <span class="field-error" v-if="errors.current_password">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#dc2626" stroke-width="1.6"/><path d="M12 8v4m0 4h.01" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/></svg>
              {{ errors.current_password }}
            </span>
          </div>

          <!-- Divider -->
          <div class="section-divider"><span>Nueva contraseña</span></div>

          <!-- Campo: nueva contraseña -->
          <div class="field">
            <label class="field-label" for="new_password">Nueva contraseña</label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.new_password }">
              <span class="input-prefix">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#7a9aaa" stroke-width="1.8" stroke-linejoin="round"/>
                </svg>
              </span>
              <input
                id="new_password"
                v-model="form.new_password"
                :type="show.new ? 'text' : 'password'"
                class="field-input"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
                :disabled="loading"
              />
              <button type="button" class="eye-btn" @click="show.new = !show.new">
                <svg v-if="!show.new" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#7a9aaa" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="#7a9aaa" stroke-width="1.8"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="#7a9aaa" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="strength-row" v-if="form.new_password">
              <div class="strength-bar">
                <div class="strength-fill" :style="{ width: strengthPercent + '%' }" :class="strengthClass"></div>
              </div>
              <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
            </div>
            <span class="field-error" v-if="errors.new_password">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#dc2626" stroke-width="1.6"/><path d="M12 8v4m0 4h.01" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/></svg>
              {{ errors.new_password }}
            </span>
          </div>

          <!-- Campo: confirmar contraseña -->
          <div class="field">
            <label class="field-label" for="new_password_confirmation">Confirmar contraseña</label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.new_password_confirmation, 'input-wrap--ok': passwordsMatch }">
              <span class="input-prefix">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="#7a9aaa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a9aaa" stroke-width="1.8"/>
                  <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a9aaa" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <input
                id="new_password_confirmation"
                v-model="form.new_password_confirmation"
                :type="show.confirm ? 'text' : 'password'"
                class="field-input"
                placeholder="Repite la nueva contraseña"
                autocomplete="new-password"
                :disabled="loading"
              />
              <button type="button" class="eye-btn" @click="show.confirm = !show.confirm">
                <svg v-if="!show.confirm" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#7a9aaa" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="#7a9aaa" stroke-width="1.8"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="#7a9aaa" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <span class="field-error" v-if="errors.new_password_confirmation">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#dc2626" stroke-width="1.6"/><path d="M12 8v4m0 4h.01" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round"/></svg>
              {{ errors.new_password_confirmation }}
            </span>
          </div>

        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn--ghost" @click="handleClose" :disabled="loading">Cancelar</button>
          <button class="btn btn--primary" @click="submit" :disabled="loading || !isFormValid">
            <span v-if="loading" class="spinner"></span>
            <svg v-else viewBox="0 0 24 24" fill="none" class="btn-icon">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" stroke-width="1.8"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="white"/>
            </svg>
            {{ loading ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>

      </div>
    </div>
  </teleport>
</template>

<script>
import api from '../api/axios.js';

export default {
  name: 'CambiarContrasena',
  emits: ['close'],

  data() {
    return {
      form: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      show: { current: false, new: false, confirm: false },
      errors: { current_password: '', new_password: '', new_password_confirmation: '' },
      loading: false,
      successMsg: '',
      errorMsg: '',
    };
  },

  computed: {
    isFormValid() {
      return (
        this.form.current_password.length > 0 &&
        this.form.new_password.length >= 8 &&
        this.form.new_password_confirmation.length > 0
      );
    },
    passwordsMatch() {
      return (
        this.form.new_password.length >= 8 &&
        this.form.new_password_confirmation.length > 0 &&
        this.form.new_password === this.form.new_password_confirmation
      );
    },
    passwordStrength() {
      const p = this.form.new_password;
      if (!p) return 0;
      let s = 0;
      if (p.length >= 8)  s++;
      if (p.length >= 12) s++;
      if (/[A-Z]/.test(p)) s++;
      if (/[0-9]/.test(p)) s++;
      if (/[^A-Za-z0-9]/.test(p)) s++;
      return s;
    },
    strengthPercent() { return (this.passwordStrength / 5) * 100; },
    strengthClass() {
      if (this.passwordStrength <= 1) return 'strength--weak';
      if (this.passwordStrength <= 3) return 'strength--medium';
      return 'strength--strong';
    },
    strengthLabel() {
      if (this.passwordStrength <= 1) return 'Débil';
      if (this.passwordStrength <= 3) return 'Media';
      return 'Fuerte';
    },
  },

  methods: {
    clearMessages() {
      this.successMsg = '';
      this.errorMsg = '';
      this.errors = { current_password: '', new_password: '', new_password_confirmation: '' };
    },

    validateLocal() {
      this.clearMessages();
      let ok = true;
      if (!this.form.current_password) {
        this.errors.current_password = 'Ingresa tu contraseña actual.';
        ok = false;
      }
      if (this.form.new_password.length < 8) {
        this.errors.new_password = 'Debe tener al menos 8 caracteres.';
        ok = false;
      } else if (this.form.new_password === this.form.current_password) {
        this.errors.new_password = 'Debe ser diferente a la contraseña actual.';
        ok = false;
      }
      if (this.form.new_password !== this.form.new_password_confirmation) {
        this.errors.new_password_confirmation = 'Las contraseñas no coinciden.';
        ok = false;
      }
      return ok;
    },

    async submit() {
      if (!this.validateLocal()) return;
      this.loading = true;
      try {
        await api.post('/change-password', {
          current_password: this.form.current_password,
          new_password: this.form.new_password,
          new_password_confirmation: this.form.new_password_confirmation,
        });
        this.successMsg = '¡Contraseña actualizada correctamente!';
        this.form = { current_password: '', new_password: '', new_password_confirmation: '' };
        setTimeout(() => this.$emit('close'), 1800);
      } catch (err) {
        const status = err.response?.status;
        const data   = err.response?.data;
        if (status === 401) {
          this.errors.current_password = 'La contraseña actual es incorrecta.';
        } else if (status === 422) {
          const se = data?.errors || {};
          if (se.current_password)          this.errors.current_password = se.current_password[0];
          if (se.new_password)              this.errors.new_password = se.new_password[0];
          if (se.new_password_confirmation) this.errors.new_password_confirmation = se.new_password_confirmation[0];
          if (!Object.keys(se).length)      this.errorMsg = data?.message || 'Datos inválidos.';
        } else {
          this.errorMsg = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }
      } finally {
        this.loading = false;
      }
    },

    handleClose() {
      if (!this.loading) this.$emit('close');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@500;600;700&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 30, 35, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: overlayIn 0.2s ease;
}
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

.modal-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(10,40,50,0.2), 0 4px 16px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 430px;
  overflow: hidden;
  animation: cardIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes cardIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 18px;
  border-bottom: 1px solid #eef3f1;
  background: #f9fdfc;
}
.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.modal-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #f0faf7;
  border: 1.5px solid #d6f5eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.modal-icon svg { width: 20px; height: 20px; }
.modal-title {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a2b2e;
  margin: 0 0 2px;
  line-height: 1.2;
}
.modal-subtitle {
  font-size: 12px;
  color: #7a9aaa;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}
.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f0f4f3;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease;
  flex-shrink: 0;
}
.modal-close:hover { background: #fde8e8; }
.modal-close svg { width: 15px; height: 15px; }

/* Body */
.modal-body {
  padding: 20px 20px 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Alertas */
.alert {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
}
.alert svg { width: 17px; height: 17px; flex-shrink: 0; }
.alert--success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.alert--error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

/* Divider */
.section-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7a9aaa;
  font-family: 'DM Sans', sans-serif;
  margin: 2px 0 -4px;
}
.section-divider::before,
.section-divider::after { content: ''; flex: 1; height: 1px; background: #e8f0ed; }

/* Fields */
.field { display: flex; flex-direction: column; gap: 5px; }
.field-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #1a2b2e;
  font-family: 'DM Sans', sans-serif;
}
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #dde8e5;
  border-radius: 9px;
  background: #f8fbfa;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.input-wrap:focus-within {
  border-color: #4EB89D;
  box-shadow: 0 0 0 3px rgba(78,184,157,0.13);
  background: #ffffff;
}
.input-wrap--error { border-color: #fca5a5 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
.input-wrap--ok    { border-color: #6ee7b7 !important; }

.input-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  flex-shrink: 0;
}
.input-prefix svg { width: 15px; height: 15px; }

.field-input {
  flex: 1;
  padding: 10px 6px 10px 0;
  border: none;
  background: transparent;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  color: #1a2b2e;
  outline: none;
}
.field-input::placeholder { color: #aabcc4; }
.field-input:disabled { opacity: 0.55; cursor: not-allowed; }

.eye-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  flex-shrink: 0;
  transition: background 0.15s ease;
}
.eye-btn:hover { background: #f0faf7; }
.eye-btn svg { width: 15px; height: 15px; }

.field-error {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #dc2626;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
}
.field-error svg { width: 13px; height: 13px; flex-shrink: 0; }

/* Strength */
.strength-row { display: flex; align-items: center; gap: 8px; }
.strength-bar {
  flex: 1;
  height: 4px;
  background: #e8f0ed;
  border-radius: 4px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.35s ease, background 0.35s ease;
}
.strength-fill.strength--weak   { background: #ef4444; }
.strength-fill.strength--medium { background: #f59e0b; }
.strength-fill.strength--strong { background: #10b981; }
.strength-label {
  font-size: 11px;
  font-weight: 700;
  min-width: 38px;
  text-align: right;
  font-family: 'DM Sans', sans-serif;
}
.strength-label.strength--weak   { color: #ef4444; }
.strength-label.strength--medium { color: #d97706; }
.strength-label.strength--strong { color: #059669; }

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px 20px;
  margin-top: 4px;
  border-top: 1px solid #eef3f1;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 20px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  border: none;
  transition: background 0.18s ease, transform 0.1s ease, opacity 0.18s ease;
  line-height: 1;
}
.btn:active:not(:disabled) { transform: scale(0.97); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-icon { width: 15px; height: 15px; flex-shrink: 0; }

.btn--ghost { background: #f0f4f3; color: #3d5260; }
.btn--ghost:hover:not(:disabled) { background: #e4edea; }

.btn--primary {
  background: #4EB89D;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(78,184,157,0.35);
}
.btn--primary:hover:not(:disabled) {
  background: #3aa085;
  box-shadow: 0 4px 14px rgba(78,184,157,0.4);
}

/* Spinner */
.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.slide-down-enter-active { transition: all 0.22s ease; }
.slide-down-leave-active { transition: all 0.18s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>