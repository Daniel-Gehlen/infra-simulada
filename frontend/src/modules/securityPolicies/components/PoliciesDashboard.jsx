// Policies Dashboard Component
import React from 'react';

export default function PoliciesDashboard({ data, policies, loading }) {
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
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.totalPolicies}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de Políticas</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{data.enabledPolicies}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Políticas Ativas</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.averageCoverage}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cobertura Média</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{data.pendingReviews}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revisões Pendentes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Políticas por Categoria</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.entries(data.byCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{category.replace('_', ' ')}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">✅ Compliance</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.entries(data.byCompliance).map(([compliance, count]) => (
              <div key={compliance} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{compliance}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">🔐 Políticas de Segurança</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Políticas de segurança definem as regras e diretrizes para proteger os ativos da organização.
          Revisões regulares garantem conformidade com LGPD, ISO 27001 e PCI DSS.
        </p>
      </div>
    </div>
  );
}
