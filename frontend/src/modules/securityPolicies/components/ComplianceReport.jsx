// Compliance Report Component
import React from 'react';

export default function ComplianceReport({ data, loading }) {
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const complianceColors = {
    'LGPD': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'ISO 27001': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'PCI DSS': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Interno': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Compliance por Framework</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.entries(data.byCompliance).map(([compliance, count]) => (
              <div key={compliance} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${complianceColors[compliance]}`}>
                    {compliance}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count} políticas</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📈 Status Geral</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Políticas</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalPolicies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Políticas Ativas</span>
              <span className="text-2xl font-bold text-green-600">{data.enabledPolicies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cobertura Média</span>
              <span className="text-2xl font-bold text-purple-600">{data.averageCoverage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Revisões Pendentes</span>
              <span className="text-2xl font-bold text-orange-600">{data.pendingReviews}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📋 Políticas por Categoria</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.byCategory).map(([category, count]) => (
              <div key={category} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{category.replace('_', ' ')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Relatório de Compliance</h4>
        <p className="text-sm text-green-700 dark:text-green-400">
          Relatório gerado automaticamente com base nas políticas ativas.
          Revisões pendentes devem ser concluídas dentro do prazo estabelecido.
        </p>
      </div>
    </div>
  );
}
