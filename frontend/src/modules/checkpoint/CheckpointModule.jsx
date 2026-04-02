// Check Point Firewall Administration Module
import React, { useState } from 'react';
import CheckpointDashboard from './components/CheckpointDashboard';
import CheckpointRules from './components/CheckpointRules';
import CheckpointPolicies from './components/CheckpointPolicies';
import CheckpointGateways from './components/CheckpointGateways';
import CheckpointLogs from './components/CheckpointLogs';
import CheckpointBackup from './components/CheckpointBackup';
import useCheckpoint from './hooks/useCheckpoint';

export default function CheckpointModule() {
  const [tab, setTab] = useState('dashboard');
  const checkpoint = useCheckpoint();

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'rules', label: '🔥 Regras', icon: '🔥' },
    { id: 'policies', label: '📋 Políticas', icon: '📋' },
    { id: 'gateways', label: '🌐 Gateways', icon: '🌐' },
    { id: 'logs', label: '📝 Logs', icon: '📝' },
    { id: 'backup', label: '💾 Backup', icon: '💾' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🛡️ Check Point Firewall</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Administração e sustentação de firewall Check Point R81.10</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <CheckpointDashboard data={checkpoint.status} loading={checkpoint.loading} />}
      {tab === 'rules' && <CheckpointRules rules={checkpoint.rules} onCreate={checkpoint.createRule} onToggle={checkpoint.toggleRule} onDelete={checkpoint.deleteRule} loading={checkpoint.loading} />}
      {tab === 'policies' && <CheckpointPolicies policies={checkpoint.policies} onInstall={checkpoint.installPolicy} loading={checkpoint.loading} />}
      {tab === 'gateways' && <CheckpointGateways gateways={checkpoint.gateways} loading={checkpoint.loading} />}
      {tab === 'logs' && <CheckpointLogs logs={checkpoint.logs} loading={checkpoint.loading} />}
      {tab === 'backup' && <CheckpointBackup backups={checkpoint.backups} onCreate={checkpoint.createBackup} loading={checkpoint.loading} />}
    </div>
  );
}
