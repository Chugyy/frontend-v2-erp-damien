// scripts/automation.js - API automation

import api from './api.js';

export const automation = {
  async startScraping() {
    return api.post('/automation/scraping/start');
  },

  async getScrapingStatus() {
    return api.get('/automation/scraping/status');
  },

  async stopScraping() {
    return api.post('/automation/scraping/stop');
  },

  async startOutreach() {
    return api.post('/automation/outreach/start');
  },

  async getOutreachStatus() {
    return api.get('/automation/outreach/status');
  },

  async refreshKPI() {
    return api.post('/automation/kpi/refresh');
  }
};