// scripts/api.js - Wrapper central API V2 ERP

class ApiCache {
  constructor() {
    this.cache = new Map()
    this.failedQueries = new Set()
  }
  
  getCacheKey(endpoint, params) {
    return `${endpoint}_${JSON.stringify(params)}`
  }
  
  get(endpoint, params) {
    const key = this.getCacheKey(endpoint, params)
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return { data: cached.data, fromCache: true }
    }
    return null
  }
  
  set(endpoint, params, data, ttl = 300000) {
    const key = this.getCacheKey(endpoint, params)
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
  }
  
  markAsFailed(endpoint, params) {
    const key = this.getCacheKey(endpoint, params)
    this.failedQueries.add(key)
    setTimeout(() => this.failedQueries.delete(key), 30000)
  }
  
  hasFailed(endpoint, params) {
    const key = this.getCacheKey(endpoint, params)
    return this.failedQueries.has(key)
  }
  
  clear(pattern) {
    if (pattern) {
      for (let key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
}

class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.token = localStorage.getItem('auth_token');
    this.cache = new ApiCache();
  }

  // Méthode wrapper générique
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (_) {
          try {
            const text = await response.text();
            errorData = { message: text };
          } catch (_) {
            errorData = { message: 'Erreur réseau' };
          }
        }
        const message = (errorData && (errorData.message || errorData.detail)) || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Méthodes CRUD génériques
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...(data && { body: JSON.stringify(data) })
    });
  }

  // Gestion token
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // === ENDPOINTS SPÉCIFIQUES ===

  // Dashboard avec cache
  async getDashboardKPIs(period = '7d', platforms = { instagram: true, linkedin: true }, forceRefresh = false) {
    const params = { period, ...platforms }
    const endpoint = '/dashboard/kpis'
    
    if (!forceRefresh) {
      const cached = this.cache.get(endpoint, params)
      if (cached) return cached.data
    }
    
    try {
      const data = await this.get(`${endpoint}?period=${period}&instagram=${platforms.instagram}&linkedin=${platforms.linkedin}`)
      this.cache.set(endpoint, params, data, 300000) // 5min cache
      return data
    } catch (error) {
      this.cache.markAsFailed(endpoint, params)
      throw error
    }
  }

  async getDashboardChart(metric, period = '7d') {
    const params = { metric, period }
    const endpoint = `/dashboard/chart/${metric}`
    
    const cached = this.cache.get(endpoint, params)
    if (cached) return cached.data
    
    try {
      const data = await this.get(`${endpoint}?period=${period}`)
      this.cache.set(endpoint, params, data, 300000)
      return data
    } catch (error) {
      this.cache.markAsFailed(endpoint, params)
      throw error
    }
  }

  // Contacts (CRM)
  async getContacts(page = 1, limit = 20, search = '', status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status })
    });
    return this.get(`/contacts?${params}`);
  }

  async searchContacts(searchTerm, status, source) {
    const params = { search: searchTerm, status, source }
    const endpoint = '/contacts/search'
    
    // Vérifier si cette recherche a déjà échoué récemment
    if (this.cache.hasFailed(endpoint, params)) {
      return []
    }
    
    try {
      const data = await this.post(endpoint, params)
      
      // Si pas de résultats, marquer comme échoué temporairement
      if (!data || data.length === 0) {
        this.cache.markAsFailed(endpoint, params)
      }
      
      return data || []
    } catch (error) {
      this.cache.markAsFailed(endpoint, params)
      return []
    }
  }

  async createContact(contactData) {
    const result = await this.post('/contacts', contactData);
    // Invalider le cache des contacts après création
    this.cache.clear('/contacts');
    return result;
  }

  async updateContact(contactId, contactData) {
    const result = await this.put(`/contacts/${contactId}`, contactData);
    this.cache.clear('/contacts');
    return result;
  }

  async deleteContact(contactId) {
    const result = await this.delete(`/contacts/${contactId}`);
    this.cache.clear('/contacts');
    return result;
  }

  // Comptes sociaux
  async getAccounts() {
    return this.get('/accounts');
  }

  async createAccount(accountData) {
    return this.post('/accounts', accountData);
  }

  async updateAccountStatus(accountId, enabled) {
    return this.put(`/accounts/${accountId}/status`, { enabled });
  }

  async deleteAccount(accountId) {
    return this.delete(`/accounts/${accountId}`);
  }

  // Conversations
  async getConversations(userId, status = null) {
    const params = status ? `?status=${status}` : '';
    return this.get(`/conversations${params}`);
  }

  async updateConversationStatus(conversationId, status) {
    return this.put(`/conversations/${conversationId}/status`, { status });
  }

  // Messages
  async getMessages(conversationId, limit = 50) {
    return this.get(`/messages/conversation/${conversationId}?limit=${limit}`);
  }

  async createMessage(messageData) {
    return this.post('/messages', messageData);
  }

  // Logs
  async getLogs(type = null, limit = 100) {
    const params = type ? `?type=${type}&limit=${limit}` : `?limit=${limit}`;
    return this.get(`/logs${params}`);
  }
}

// Instance singleton
const api = new ApiClient();
export default api;