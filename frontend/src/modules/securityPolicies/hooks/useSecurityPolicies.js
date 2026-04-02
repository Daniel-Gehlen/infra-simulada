// Security Policies Hook
import { useState, useEffect, useCallback } from 'react';
import securityPoliciesService from '../services/securityPoliciesService';
import toast from 'react-hot-toast';

export default function useSecurityPolicies() {
  const [policies, setPolicies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complianceReport, setComplianceReport] = useState(null);
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPolicies = useCallback(async () => {
    const r = await securityPoliciesService.getPolicies();
    if (r.success) setPolicies(r.data);
  }, []);

  const loadReviews = useCallback(async () => {
    const r = await securityPoliciesService.getReviews();
    if (r.success) setReviews(r.data);
  }, []);

  const loadCompliance = useCallback(async () => {
    const r = await securityPoliciesService.getComplianceReport();
    if (r.success) setComplianceReport(r.data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      loadPolicies(),
      loadReviews(),
      loadCompliance()
    ]);
    setLoading(false);
  }, [loadPolicies, loadReviews, loadCompliance]);

  const createPolicy = useCallback(async (policyData) => {
    const r = await securityPoliciesService.createPolicy(policyData);
    if (r.success) {
      toast.success('Política criada com sucesso');
      loadPolicies();
    }
    return r;
  }, [loadPolicies]);

  const togglePolicy = useCallback(async (policyId) => {
    const r = await securityPoliciesService.togglePolicy(policyId);
    if (r.success) {
      toast.success(r.message);
      loadPolicies();
    }
    return r;
  }, [loadPolicies]);

  const updatePolicy = useCallback(async (policyId, policyData) => {
    const r = await securityPoliciesService.updatePolicy(policyId, policyData);
    if (r.success) {
      toast.success('Política atualizada');
      loadPolicies();
    }
    return r;
  }, [loadPolicies]);

  const deletePolicy = useCallback(async (policyId) => {
    const r = await securityPoliciesService.deletePolicy(policyId);
    if (r.success) {
      toast.success('Política removida');
      loadPolicies();
    }
    return r;
  }, [loadPolicies]);

  const createReview = useCallback(async (reviewData) => {
    const r = await securityPoliciesService.createReview(reviewData);
    if (r.success) {
      toast.success('Revisão registrada');
      loadReviews();
      loadPolicies();
    }
    return r;
  }, [loadReviews, loadPolicies]);

  const optimizePolicies = useCallback(async () => {
    const r = await securityPoliciesService.optimizePolicies();
    if (r.success) {
      setOptimizations(r.data);
      toast.success('Análise de otimização concluída');
    }
    return r;
  }, []);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, [loadAll]);

  return {
    policies,
    reviews,
    complianceReport,
    optimizations,
    loading,
    loadAll,
    createPolicy,
    togglePolicy,
    updatePolicy,
    deletePolicy,
    createReview,
    optimizePolicies,
    loadPolicies,
    loadReviews,
    loadCompliance
  };
}
