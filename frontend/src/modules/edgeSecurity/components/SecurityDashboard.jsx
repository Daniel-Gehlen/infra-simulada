// Security Dashboard Component
import React from 'react';

export default function SecurityDashboard({ data, events, loading }) {
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const eventTypeColors = {
    waf_block: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    rate_limit: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    auth_failure: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    ddos_detected: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  };

  const eventTypeLabels = {
    waf_block: '🔥 WAF Block',
    rate_limit: '⚡ Rate Limit',
    auth_failure: '🔑 Auth Failure',
    ddos_detected: '🛡️ DDoS Detected'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.totalEvents}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de Eventos</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{data.wafBlocks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">WAF Blocks</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{data.rateLimits}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rate Limits</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.activeThreats}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ameaças Ativas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔥 Status das Regras WAF</h3>
          </div>
          <div className="p-4 space-y-3">
            {data.wafRulesStatus?.map((rule, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{rule.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{rule.blocked} bloqueados</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Mapa de Ameaças (Simulado)</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
                <p className="font-bold text-red-600 dark:text-red-400">🌎 América</p>
                <p className="text-gray-600 dark:text-gray-400">45 eventos</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <p className="font-bold text-blue-600 dark:text-blue-400">🌍 Europa</p>
                <p className="text-gray-600 dark:text-gray-400">23 eventos</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                <p className="font-bold text-green-600 dark:text-green-400">🌏 Ásia</p>
                <p className="text-gray-600 dark:text-gray-400">12 eventos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📋 Eventos Recentes</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum evento de segurança registrado
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventTypeColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
                    {eventTypeLabels[event.type] || event.type}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.rule || event.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      IP: {event.ip} | {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {event.payload && (
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono max-w-xs truncate">
                    {event.payload}
                  </code>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
