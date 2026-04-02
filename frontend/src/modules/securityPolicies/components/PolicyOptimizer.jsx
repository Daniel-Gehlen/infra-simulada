// Policy Optimizer Component
import React from 'react';

export default function PolicyOptimizer({ optimizations, onOptimize, loading }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⚡ Otimização de Políticas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Análise e recomendações para melhoria</p>
          </div>
          <button
            onClick={onOptimize}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Analisar Políticas
          </button>
        </div>

        {optimizations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">📊</div>
            <p className="text-gray-500 dark:text-gray-400">
              Clique em "Analisar Políticas" para gerar recomendações de otimização
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {optimizations.map(opt => (
              <div key={opt.policyId} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{opt.policyName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Cobertura: {opt.currentCoverage}%
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[opt.priority]}`}>
                      {priorityLabels[opt.priority]}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Recomendações:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {opt.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">💡 Sobre Otimização</h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          A análise de otimização verifica a cobertura de cada política e sugere melhorias
          para aumentar a postura de segurança da organização. Políticas com cobertura
          abaixo de 90% são priorizadas para revisão.
        </p>
      </div>
    </div>
  );
}
