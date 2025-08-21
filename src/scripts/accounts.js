// scripts/accounts.js - API comptes sociaux

import api from './api.js';

export const accounts = {
  async getAll() {
    return api.get('/accounts');
  },

  async connect(plateforme, unipile_account_id) {
    return api.post('/accounts/connect', { plateforme, unipile_account_id });
  },

  async disconnect(accountId) {
    return api.delete(`/accounts/${accountId}/disconnect`);
  },

  async enable(accountId) {
    return api.put(`/accounts/${accountId}/enable`);
  },

  async disable(accountId) {
    return api.put(`/accounts/${accountId}/disable`);
  },

  async getStatus(accountId) {
    return api.get(`/accounts/${accountId}/status`);
  },

  async testConnection() {
    return api.get('/accounts/test');
  }
};