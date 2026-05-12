import { defineStore } from 'pinia';
 
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (() => {
      try {
        const stored = localStorage.getItem('user');
        return stored && stored !== 'undefined' && stored !== 'null'
               ? JSON.parse(stored)
               : null;
      } catch {
        return null;
      }
    })(),
    token: localStorage.getItem('token') || null,
  }),
 
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRoleName: (state) => state.user?.role?.nombre?.toLowerCase() || '',
    roleDetails: (state) => state.user?.role || null
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