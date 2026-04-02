// Check Point Gateways Component
import React from 'react';

export default function CheckpointGateways({ gateways, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusColors = {
    'connected': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'disconnected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🌐 Gateways Check Point</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status dos gateways conectados ao SmartCenter</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {gateways.map(gateway => (
            <div key={gateway.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${gateway.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{gateway.name}</h4>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[gateway.status]}`}>
                  {gateway.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Endereço IP</span>
                  <span className="font-mono text-gray-900 dark:text-white">{gateway.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Versão</span>
                  <span className="text-gray-900 dark:text-white">{gateway.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Política Instalada</span>
                  <span className="text-gray-900 dark:text-white">{gateway.policy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Gateways Sincronizados</h4>
        <p className="text-sm text-green-700 dark:text-green-400">
          Todos os gateways estão conectados e com políticas atualizadas. Última sincronização realizada automaticamente pelo SmartCenter.
        </p>
      </div>
    </div>
  );
}
