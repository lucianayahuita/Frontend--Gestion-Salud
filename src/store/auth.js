import { defineStore } from 'pinia';

// El nombre 'useAuthStore' debe coincidir exactamente con el import del router
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // token: localStorage.getItem('token') || null,
    // user: JSON.parse(localStorage.getItem('user')) || null
  }),
  actions: {
    // setAuth(user, token) {
    //   this.user = user;
    //   this.token = token;
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('user', JSON.stringify(user));
    // },
    // clearAuth() {
    //   this.user = null;
    //   this.token = null;
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    // }
  }
});