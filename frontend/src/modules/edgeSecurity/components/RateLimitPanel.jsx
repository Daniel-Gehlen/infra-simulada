// Rate Limit Panel Component
import React from 'react';

export default function RateLimitPanel({ data, loading }) {
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const percentage = ((data.limit - data.remaining) / data.limit) * 100;
  const resetDate = new Date(data.resetTime * 1000);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">⚡ Rate Limiting na Borda</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Limitação de taxa por IP - proteção contra abuso</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.limit}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Limite por Minuto</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{data.remaining}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Requisições Restantes</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.window}s</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Janela de Tempo</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uso da Cota</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{data.limit - data.remaining} / {data.limit}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📋 Headers de Resposta</h4>
            <div className="space-y-1 font-mono text-sm">
              <p className="text-gray-600 dark:text-gray-400">X-RateLimit-Limit: <span className="text-blue-600 dark:text-blue-400">{data.limit}</span></p>
              <p className="text-gray-600 dark:text-gray-400">X-RateLimit-Remaining: <span className="text-green-600 dark:text-green-400">{data.remaining}</span></p>
              <p className="text-gray-600 dark:text-gray-400">X-RateLimit-Reset: <span className="text-purple-600 dark:text-purple-400">{data.resetTime}</span></p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Quando o Limite é Excedido</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Quando uma IP excede o limite de {data.limit} requisições por minuto, a API retorna HTTP 429 (Too Many Requests)
              com a mensagem "Rate limit exceeded - protegido pelo edge layer". O cliente deve aguardar {data.window} segundos
              antes de fazer novas requisições.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔄 Próximo Reset</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A janela de rate limit será resetada em: <span className="font-mono">{resetDate.toLocaleTimeString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
