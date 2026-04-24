import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (() => {
      try {
        const stored = localStorage.getItem('user');
        return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })(),
    token: localStorage.getItem('token') || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role
  },
  
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});