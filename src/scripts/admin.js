// admin.js - API calls pour interface admin
import api from './api'

export const adminApi = {
  async getUsers() {
    return api.get('/admin/users')
  },

  async createUser(email) {
    return api.post('/admin/users', { email })
  },

  async updateUser(userId, { email, is_admin }) {
    return api.request(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ email, is_admin })
    })
  },

  async deleteUser(userId) {
    return api.delete(`/admin/users/${userId}`)
  },

  async resendInvite(userId) {
    return api.post(`/admin/users/${userId}/resend-invite`)
  },

  async getUserKPIs(userId) {
    return api.get(`/admin/users/${userId}/kpis`)
  }
}
