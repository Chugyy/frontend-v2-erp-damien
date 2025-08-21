// scripts/conversations.js - API conversations

import api from './api.js';

export const conversations = {
  async getAll(status) {
    const params = status ? `?status=${status}` : '';
    return api.get(`/conversations${params}`);
  },

  async getDetail(conversationId, limit = 50) {
    return api.get(`/conversations/${conversationId}?limit=${limit}`);
  },

  async archive(conversationId) {
    return api.post(`/conversations/${conversationId}/archive`);
  }
};