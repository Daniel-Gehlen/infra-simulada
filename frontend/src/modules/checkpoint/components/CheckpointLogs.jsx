// Check Point Logs Component
import React from 'react';

export default function CheckpointLogs({ logs, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const actionColors = {
    'Accept': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Drop': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Reject': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📝 Logs de Firewall Check Point</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Últimos 50 logs de tráfego do firewall</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Timestamp</th>
                <th className="px-4 py-3 text-left">Ação</th>
                <th className="px-4 py-3 text-left">Origem</th>
                <th className="px-4 py-3 text-left">Destino</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left">Regra</th>
                <th className="px-4 py-3 text-left">Gateway</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-800'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{log.source}</td>
                  <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{log.destination}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.service}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.rule}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.gateway}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">🔍 Análise de Logs</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-purple-600 dark:text-purple-400">Total de Logs</p>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{logs.length}</p>
          </div>
          <div>
            <p className="text-purple-600 dark:text-purple-400">Conexões Aceitas</p>
            <p className="text-2xl font-bold text-green-600">{logs.filter(l => l.action === 'Accept').length}</p>
          </div>
          <div>
            <p className="text-purple-600 dark:text-purple-400">Conexões Bloqueadas</p>
            <p className="text-2xl font-bold text-red-600">{logs.filter(l => l.action === 'Drop').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
