// Security Policies Service
const API_BASE = '/api/security-policies';

const securityPoliciesService = {
  // Policies
  async getPolicies() {
    const response = await fetch(`${API_BASE}?resource=policies`);
    return response.json();
  },

  async createPolicy(policyData) {
    const response = await fetch(`${API_BASE}?resource=policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyData)
    });
    return response.json();
  },

  async togglePolicy(policyId) {
    const response = await fetch(`${API_BASE}?resource=policies&action=toggle&id=${policyId}`, {
      method: 'PUT'
    });
    return response.json();
  },

  async updatePolicy(policyId, policyData) {
    const response = await fetch(`${API_BASE}?resource=policies&id=${policyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyData)
    });
    return response.json();
  },

  async deletePolicy(policyId) {
    const response = await fetch(`${API_BASE}?resource=policies&id=${policyId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Reviews
  async getReviews() {
    const response = await fetch(`${API_BASE}?resource=reviews`);
    return response.json();
  },

  async createReview(reviewData) {
    const response = await fetch(`${API_BASE}?resource=reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return response.json();
  },

  // Compliance
  async getComplianceReport() {
    const response = await fetch(`${API_BASE}?resource=compliance`);
    return response.json();
  },

  // Optimization
  async optimizePolicies() {
    const response = await fetch(`${API_BASE}?resource=optimize`, {
      method: 'POST'
    });
    return response.json();
  }
};

export default securityPoliciesService;
