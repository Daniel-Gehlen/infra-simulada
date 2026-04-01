// Edge Security Module - Main Component
import React, { useState } from 'react';
import WafPanel from './components/WafPanel';
import RateLimitPanel from './components/RateLimitPanel';
import DdosPanel from './components/DdosPanel';
import ZeroTrustPanel from './components/ZeroTrustPanel';
import SecurityDashboard from './components/SecurityDashboard';
import useEdgeSecurity from './hooks/useEdgeSecurity';

export default function EdgeSecurityModule() {
  const [tab, setTab] = useState('dashboard');
  const security = useEdgeSecurity();

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'waf', label: '🔥 WAF', icon: '🔥' },
    { id: 'ratelimit', label: '⚡ Rate Limit', icon: '⚡' },
    { id: 'ddos', label: '🛡️ DDoS', icon: '🛡️' },
    { id: 'zerotrust', label: '🔐 Zero Trust', icon: '🔐' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🛡️ Edge Security</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Segurança na borda - WAF, Rate Limiting, DDoS Protection, Zero Trust</p>
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

      {tab === 'dashboard' && <SecurityDashboard data={security.dashboardData} events={security.securityEvents} loading={security.loading} />}
      {tab === 'waf' && <WafPanel rules={security.wafRules} onTest={security.testWaf} loading={security.loading} />}
      {tab === 'ratelimit' && <RateLimitPanel data={security.rateLimit} loading={security.loading} />}
      {tab === 'ddos' && <DdosPanel state={security.ddosState} onToggle={security.toggleDdos} loading={security.loading} />}
      {tab === 'zerotrust' && <ZeroTrustPanel policies={security.zeroTrustPolicies} loading={security.loading} />}
    </div>
  );
}
