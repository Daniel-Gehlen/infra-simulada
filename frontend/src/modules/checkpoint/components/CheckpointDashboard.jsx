// Check Point Dashboard Component
import React from 'react';

export default function CheckpointDashboard({ data, loading }) {
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{data.status}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status do Firewall</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.version}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Versão</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.connectedGateways}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gateways Conectados</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{data.activePolicies}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Políticas Ativas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Regras de Firewall</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total de Regras</span>
              <span className="font-bold text-gray-900 dark:text-white">{data.totalRules}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Regras Habilitadas</span>
              <span className="font-bold text-green-600">{data.enabledRules}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Regras Desabilitadas</span>
              <span className="font-bold text-red-600">{data.totalRules - data.enabledRules}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🕐 Última Atividade</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Última Instalação de Política</span>
              <span className="font-mono text-sm text-gray-900 dark:text-white">
                {new Date(data.lastPolicyInstall).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">🛡️ Check Point R81.10</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Firewall Check Point administrado via SmartConsole. Todas as políticas são instaladas automaticamente
          nos gateways conectados. Logs são coletados em tempo real para análise de segurança.
        </p>
      </div>
    </div>
  );
}
