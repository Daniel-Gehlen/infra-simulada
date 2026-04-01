// DDoS Protection Panel Component
import React from 'react';

export default function DdosPanel({ state, onToggle, loading }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🛡️ Proteção DDoS na Borda</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detecção e mitigação de ataques de negação de serviço</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Status da Proteção</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {state.active ? 'Ataque detectado e mitigação ativa' : 'Monitoramento normal'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${state.active ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
              {state.active ? '🚨 ALERTA ATIVO' : '✅ NORMAL'}
            </div>
          </div>

          {state.active && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></span>
                <h4 className="font-medium text-red-800 dark:text-red-300">Traffic Anomaly Detected</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-red-600 dark:text-red-400">Multiplicador de Tráfego</p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-300">{state.trafficMultiplier}x</p>
                </div>
                <div>
                  <p className="text-red-600 dark:text-red-400">Início do Ataque</p>
                  <p className="text-sm font-mono text-red-800 dark:text-red-300">
                    {state.startTime ? new Date(state.startTime).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">🛡️ Mitigation Active</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Edge protection está bloqueando tráfego malicioso automaticamente. Requests suspeitas são descartadas na borda.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">📊 Estatísticas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">Requests Bloqueados (24h)</span>
                  <span className="font-medium text-blue-800 dark:text-blue-300">12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">IPs Suspensos</span>
                  <span className="font-medium text-blue-800 dark:text-blue-300">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">Ataques Mitigados</span>
                  <span className="font-medium text-blue-800 dark:text-blue-300">5</span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">🔧 Configurações</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">Threshold</span>
                  <span className="font-medium text-green-800 dark:text-green-300">1000 req/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">Auto-Block</span>
                  <span className="font-medium text-green-800 dark:text-green-300">Ativado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">Geo-Blocking</span>
                  <span className="font-medium text-green-800 dark:text-green-300">Desativado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">🧪 Simulação de Ataque DDoS</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Ative a simulação para ver como o edge protection responde a um ataque DDoS. Isso é apenas visual e demonstra o conceito.
            </p>
            <button
              onClick={() => onToggle(!state.active)}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                state.active
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50`}
            >
              {state.active ? '🔴 Desativar Simulação' : '🟢 Ativar Simulação DDoS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
