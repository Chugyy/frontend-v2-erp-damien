// scripts/analytics.js - API analytics selon backend

import api from './api.js';

export const analytics = {
  // Dashboard KPIs
  async getDashboardKPIs(period = '7d', platforms = { instagram: true, linkedin: true }) {
    return api.getDashboardKPIs(period, platforms);
  },

  async getDashboardChart(metric, period = '7d') {
    return api.getDashboardChart(metric, period);
  },

  // Analytics existantes
  async getKPI() {
    return api.get('/analytics/kpi');
  },

  async getPerformance(days = 7) {
    return api.get(`/analytics/performance?days=${days}`);
  },

  async getPipeline() {
    return api.get('/analytics/pipeline');
  },

  async getLogs(type, limit = 100) {
    return api.getLogs(type, limit);
  }
};