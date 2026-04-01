// Edge Security Hook
import { useState, useEffect, useCallback } from 'react';
import edgeSecurityService from '../services/edgeSecurityService';
import toast from 'react-hot-toast';

export default function useEdgeSecurity() {
  const [wafRules, setWafRules] = useState([]);
  const [rateLimit, setRateLimit] = useState(null);
  const [ddosState, setDdosState] = useState({ active: false });
  const [zeroTrustPolicies, setZeroTrustPolicies] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadWafRules = useCallback(async () => {
    const r = await edgeSecurityService.getWafRules();
    if (r.success) setWafRules(r.data);
  }, []);

  const loadRateLimit = useCallback(async () => {
    const r = await edgeSecurityService.getRateLimitStatus();
    if (r.success) setRateLimit(r.data);
  }, []);

  const loadDdosState = useCallback(async () => {
    const r = await edgeSecurityService.getDdosStatus();
    if (r.success) setDdosState(r.data);
  }, []);

  const loadZeroTrust = useCallback(async () => {
    const r = await edgeSecurityService.getZeroTrustPolicies();
    if (r.success) setZeroTrustPolicies(r.data);
  }, []);

  const loadEvents = useCallback(async () => {
    const r = await edgeSecurityService.getSecurityEvents();
    if (r.success) setSecurityEvents(r.data);
  }, []);

  const loadDashboard = useCallback(async () => {
    const r = await edgeSecurityService.getDashboardData();
    if (r.success) setDashboardData(r.data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      loadWafRules(),
      loadRateLimit(),
      loadDdosState(),
      loadZeroTrust(),
      loadEvents(),
      loadDashboard()
    ]);
    setLoading(false);
  }, [loadWafRules, loadRateLimit, loadDdosState, loadZeroTrust, loadEvents, loadDashboard]);

  const testWaf = useCallback(async (payload) => {
    const r = await edgeSecurityService.testWafPayload(payload);
    if (r.success) {
      if (r.data.blocked) {
        toast.error(`🛡️ ${r.data.message}`);
      } else {
        toast.success('✅ Payload permitido');
      }
      loadEvents();
      loadDashboard();
    }
    return r;
  }, [loadEvents, loadDashboard]);

  const toggleDdos = useCallback(async (active) => {
    setLoading(true);
    const r = await edgeSecurityService.toggleDdosSimulation(active);
    if (r.success) {
      setDdosState(r.data);
      toast(active ? '🚨 Simulação DDoS ativada' : '✅ Simulação DDoS desativada');
      loadEvents();
      loadDashboard();
    }
    setLoading(false);
    return r;
  }, [loadEvents, loadDashboard]);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, [loadAll]);

  return {
    wafRules,
    rateLimit,
    ddosState,
    zeroTrustPolicies,
    securityEvents,
    dashboardData,
    loading,
    loadAll,
    testWaf,
    toggleDdos,
    loadWafRules,
    loadRateLimit,
    loadDdosState,
    loadZeroTrust,
    loadEvents,
    loadDashboard
  };
}
