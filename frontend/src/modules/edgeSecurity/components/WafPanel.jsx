// WAF Panel Component
import React, { useState } from 'react';

export default function WafPanel({ rules, onTest, loading }) {
  const [testPayload, setTestPayload] = useState('');
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    if (!testPayload.trim()) return;
    const r = await onTest(testPayload);
    if (r.success) setTestResult(r.data);
  };

  const maliciousPayloads = [
    { label: 'SQL Injection', value: "' OR 1=1--" },
    { label: 'XSS Attack', value: '<script>alert("xss")</script>' },
    { label: 'Path Traversal', value: '../../../etc/passwd' },
    { label: 'Command Injection', value: '; ls -la' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔥 Regras WAF (Web Application Firewall)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Proteção na borda contra ataques web</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Regra</th>
                <th className="px-4 py-3 text-left">Ação</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Bloqueados</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{rule.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      {rule.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rule.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {rule.enabled ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rule.blockedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🧪 Testar WAF</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Envie payloads maliciosos para testar a proteção</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {maliciousPayloads.map((p, i) => (
              <button
                key={i}
                onClick={() => setTestPayload(p.value)}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={testPayload}
              onChange={e => setTestPayload(e.target.value)}
              placeholder="Digite um payload malicioso..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
            <button
              onClick={handleTest}
              disabled={loading || !testPayload.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Testar
            </button>
          </div>
          {testResult && (
            <div className={`p-4 rounded-lg ${testResult.blocked ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
              <p className={`font-medium ${testResult.blocked ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
                {testResult.blocked ? '🛡️ BLOQUEADO' : '✅ PERMITIDO'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{testResult.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
