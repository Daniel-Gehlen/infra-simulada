// Check Point Firewall Hook
import { useState, useEffect, useCallback } from 'react';
import checkpointService from '../services/checkpointService';
import toast from 'react-hot-toast';

export default function useCheckpoint() {
  const [status, setStatus] = useState(null);
  const [rules, setRules] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [logs, setLogs] = useState([]);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStatus = useCallback(async () => {
    const r = await checkpointService.getStatus();
    if (r.success) setStatus(r.data);
  }, []);

  const loadRules = useCallback(async () => {
    const r = await checkpointService.getRules();
    if (r.success) setRules(r.data);
  }, []);

  const loadPolicies = useCallback(async () => {
    const r = await checkpointService.getPolicies();
    if (r.success) setPolicies(r.data);
  }, []);

  const loadGateways = useCallback(async () => {
    const r = await checkpointService.getGateways();
    if (r.success) setGateways(r.data);
  }, []);

  const loadLogs = useCallback(async () => {
    const r = await checkpointService.getLogs();
    if (r.success) setLogs(r.data);
  }, []);

  const loadBackups = useCallback(async () => {
    const r = await checkpointService.getBackups();
    if (r.success) setBackups(r.data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      loadStatus(),
      loadRules(),
      loadPolicies(),
      loadGateways(),
      loadLogs(),
      loadBackups()
    ]);
    setLoading(false);
  }, [loadStatus, loadRules, loadPolicies, loadGateways, loadLogs, loadBackups]);

  const createRule = useCallback(async (ruleData) => {
    const r = await checkpointService.createRule(ruleData);
    if (r.success) {
      toast.success('Regra criada com sucesso');
      loadRules();
    }
    return r;
  }, [loadRules]);

  const toggleRule = useCallback(async (ruleId) => {
    const r = await checkpointService.toggleRule(ruleId);
    if (r.success) {
      toast.success(r.message);
      loadRules();
    }
    return r;
  }, [loadRules]);

  const deleteRule = useCallback(async (ruleId) => {
    const r = await checkpointService.deleteRule(ruleId);
    if (r.success) {
      toast.success('Regra removida com sucesso');
      loadRules();
    }
    return r;
  }, [loadRules]);

  const installPolicy = useCallback(async (policyId, gatewayId) => {
    const r = await checkpointService.installPolicy(policyId, gatewayId);
    if (r.success) {
      toast.success(r.message);
      loadPolicies();
      loadStatus();
    }
    return r;
  }, [loadPolicies, loadStatus]);

  const createBackup = useCallback(async () => {
    const r = await checkpointService.createBackup();
    if (r.success) {
      toast.success('Backup criado com sucesso');
      loadBackups();
    }
    return r;
  }, [loadBackups]);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, [loadAll]);

  return {
    status,
    rules,
    policies,
    gateways,
    logs,
    backups,
    loading,
    loadAll,
    createRule,
    toggleRule,
    deleteRule,
    installPolicy,
    createBackup,
    loadStatus,
    loadRules,
    loadPolicies,
    loadGateways,
    loadLogs,
    loadBackups
  };
}
