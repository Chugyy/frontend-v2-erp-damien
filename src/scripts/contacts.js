// scripts/contacts.js - API gestion contacts

import api from './api.js';

export const contacts = {
  async getAll(status) {
    const params = status ? `?status=${status}` : '';
    return api.get(`/contacts${params}`);
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
  async searchContacts(search, status = null, source = null) {
    return api.post('/contacts/search', {
      search,
      status,
      source
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