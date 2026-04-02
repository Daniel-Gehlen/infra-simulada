// Check Point Policies Component
import React from 'react';

export default function CheckpointPolicies({ policies, onInstall, loading }) {
  const typeColors = {
    'Access': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'NAT': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Threat Prevention': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  const statusColors = {
    'installed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'not_installed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📋 Políticas de Segurança Check Point</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie e instale políticas nos gateways</p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {policies.map(policy => (
            <div key={policy.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{policy.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[policy.type] || 'bg-gray-100 text-gray-800'}`}>
                        {policy.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[policy.status]}`}>
                        {policy.status === 'installed' ? 'Instalada' : 'Não Instalada'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Última Instalação</p>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      {new Date(policy.lastInstall).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onInstall(policy.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Instalar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">ℹ️ Sobre Políticas Check Point</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Access Policy:</strong> Controla o tráfego de rede baseado em regras de acesso</li>
          <li>• <strong>NAT Policy:</strong> Gerencia tradução de endereços de rede</li>
          <li>• <strong>Threat Prevention:</strong> Proteção contra ameaças como IPS, Antivirus e Anti-Bot</li>
        </ul>
      </div>
    </div>
  );
}
