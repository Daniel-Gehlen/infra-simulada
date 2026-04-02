// Check Point Firewall Service
const API_BASE = '/api/checkpoint';

const checkpointService = {
  // Status
  async getStatus() {
    const response = await fetch(`${API_BASE}?resource=status`);
    return response.json();
  },

  // Gateways
  async getGateways() {
    const response = await fetch(`${API_BASE}?resource=gateways`);
    return response.json();
  },

  // Policies
  async getPolicies() {
    const response = await fetch(`${API_BASE}?resource=policies`);
    return response.json();
  },

  async installPolicy(policyId, gatewayId) {
    const response = await fetch(`${API_BASE}?resource=policies&action=install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policyId, gatewayId })
    });
    return response.json();
  },

  // Rules
  async getRules() {
    const response = await fetch(`${API_BASE}?resource=rules`);
    return response.json();
  },

  async createRule(ruleData) {
    const response = await fetch(`${API_BASE}?resource=rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData)
    });
    return response.json();
  },

  async toggleRule(ruleId) {
    const response = await fetch(`${API_BASE}?resource=rules&action=toggle&id=${ruleId}`, {
      method: 'PUT'
    });
    return response.json();
  },

  async deleteRule(ruleId) {
    const response = await fetch(`${API_BASE}?resource=rules&id=${ruleId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // NAT
  async getNatRules() {
    const response = await fetch(`${API_BASE}?resource=nat`);
    return response.json();
  },

  // Logs
  async getLogs() {
    const response = await fetch(`${API_BASE}?resource=logs`);
    return response.json();
  },

  // Backup
  async getBackups() {
    const response = await fetch(`${API_BASE}?resource=backup`);
    return response.json();
  },

  async createBackup() {
    const response = await fetch(`${API_BASE}?resource=backup`, {
      method: 'POST'
    });
    return response.json();
  }
};

export default checkpointService;
