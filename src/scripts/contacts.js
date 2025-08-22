// scripts/contacts.js - API gestion contacts

import api from './api.js';

export const contacts = {
  async getAll(status, page = 1, limit = 100) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    return api.get(`/contacts?${params.toString()}`);
  },

  async getById(contactId) {
    return api.get(`/contacts/${contactId}`);
  },

  async create(data) {
    return api.post('/contacts', data);
  },

  async update(contactId, data) {
    return api.put(`/contacts/${contactId}`, data);
  },

  async delete(contactId) {
    return api.delete(`/contacts/${contactId}`);
  },

  async updatestatus(contactId, status) {
    return api.put(`/contacts/${contactId}`, { status });
  },

  async testConnection() {
    return api.get('/contacts/test');
  },

  // Search contacts with filters
  async searchContacts(search, statuses = [], sources = []) {
    return api.post('/contacts/search', {
      search,
      statuses: statuses.length > 0 ? statuses : undefined,
      sources: sources.length > 0 ? sources : undefined,
      // Backward compatibility
      status: statuses.length === 1 ? statuses[0] : null,
      source: sources.length === 1 ? sources[0] : null
    });
  },

  // Bulk operations
  async bulkDelete(contactIds) {
    return api.delete('/contacts/bulk', { contact_ids: contactIds });
  },

  async bulkDuplicate(contactIds, modifications = {}) {
    return api.post('/contacts/bulk/duplicate', { 
      contact_ids: contactIds, 
      modifications 
    });
  }
};