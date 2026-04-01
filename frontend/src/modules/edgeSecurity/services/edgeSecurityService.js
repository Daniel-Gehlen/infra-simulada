// Edge Security Service
const API_BASE = '/api/security';

const edgeSecurityService = {
  // WAF
  async getWafRules() {
    const response = await fetch(`${API_BASE}?action=waf`);
    return response.json();
  },

  async testWafPayload(payload) {
    const response = await fetch(`${API_BASE}?action=waf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testPayload: payload })
    });
    return response.json();
  },

  // Rate Limiting
  async getRateLimitStatus() {
    const response = await fetch(`${API_BASE}?action=rate-limit`);
    return response.json();
  },

  // DDoS
  async getDdosStatus() {
    const response = await fetch(`${API_BASE}?action=ddos`);
    return response.json();
  },

  async toggleDdosSimulation(active) {
    const response = await fetch(`${API_BASE}?action=ddos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active })
    });
    return response.json();
  },

  // Zero Trust
  async getZeroTrustPolicies() {
    const response = await fetch(`${API_BASE}?action=zero-trust`);
    return response.json();
  },

  // Security Events
  async getSecurityEvents() {
    const response = await fetch(`${API_BASE}?action=events`);
    return response.json();
  },

  // Dashboard
  async getDashboardData() {
    const response = await fetch(`${API_BASE}?action=dashboard`);
    return response.json();
  }
};

export default edgeSecurityService;
