// Security Policies Module
import React, { useState } from 'react';
import PoliciesDashboard from './components/PoliciesDashboard';
import PoliciesList from './components/PoliciesList';
import PolicyReviews from './components/PolicyReviews';
import ComplianceReport from './components/ComplianceReport';
import PolicyOptimizer from './components/PolicyOptimizer';
import useSecurityPolicies from './hooks/useSecurityPolicies';

export default function SecurityPoliciesModule() {
  const [tab, setTab] = useState('dashboard');
  const policies = useSecurityPolicies();

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'policies', label: '📋 Políticas', icon: '📋' },
    { id: 'reviews', label: '🔍 Revisões', icon: '🔍' },
    { id: 'compliance', label: '✅ Compliance', icon: '✅' },
    { id: 'optimize', label: '⚡ Otimizar', icon: '⚡' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔐 Políticas de Segurança</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Criação, revisão e otimização de políticas de segurança</p>
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

      {tab === 'dashboard' && <PoliciesDashboard data={policies.complianceReport} policies={policies.policies} loading={policies.loading} />}
      {tab === 'policies' && <PoliciesList policies={policies.policies} onCreate={policies.createPolicy} onToggle={policies.togglePolicy} onUpdate={policies.updatePolicy} onDelete={policies.deletePolicy} loading={policies.loading} />}
      {tab === 'reviews' && <PolicyReviews reviews={policies.reviews} policies={policies.policies} onCreate={policies.createReview} loading={policies.loading} />}
      {tab === 'compliance' && <ComplianceReport data={policies.complianceReport} loading={policies.loading} />}
      {tab === 'optimize' && <PolicyOptimizer optimizations={policies.optimizations} onOptimize={policies.optimizePolicies} loading={policies.loading} />}
    </div>
  );
}
