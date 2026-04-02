// Check Point Backup Component
import React from 'react';

export default function CheckpointBackup({ backups, onCreate, loading }) {
  const statusColors = {
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'running': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">💾 Backups Check Point</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Backups de configuração do firewall</p>
          </div>
          <button
            onClick={onCreate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            + Novo Backup
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {backups.map(backup => (
            <div key={backup.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400">💾</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{backup.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(backup.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tamanho</p>
                    <p className="font-medium text-gray-900 dark:text-white">{backup.size}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[backup.status]}`}>
                    {backup.status === 'completed' ? 'Concluído' : backup.status === 'running' ? 'Em Andamento' : 'Falhou'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Boas Práticas de Backup</h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• Realize backups antes de qualquer alteração significativa</li>
          <li>• Mantenha backups em local seguro e fora do SmartCenter</li>
          <li>• Teste a restauração periodicamente</li>
          <li>• Documente as alterações em cada backup</li>
        </ul>
      </div>
    </div>
  );
}
