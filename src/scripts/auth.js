// scripts/auth.js - Gestion authentification

import api from './api.js';

export const auth = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    api.setToken(response.access_token);
    return response;
  },

  async register(email, password) {
    const response = await api.post('/register', { email, password });
    api.setToken(response.access_token);
    return response;
  },

  async getMe() {
    return api.get('/me');
  },

  logout() {
    api.clearToken();
  },

  isAuthenticated() {
    return !!api.token;
  }
};