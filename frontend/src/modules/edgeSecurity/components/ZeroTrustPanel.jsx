// Zero Trust Panel Component
import React from 'react';

export default function ZeroTrustPanel({ policies, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusColors = {
    implemented: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  };

  const statusLabels = {
    implemented: '✅ Implementado',
    partial: '⚠️ Parcial',
    in_progress: '🔄 Em Progresso'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔐 Zero Trust na Borda</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Políticas de acesso e verificação de identidade</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {policies.map(policy => (
              <div key={policy.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{policy.name}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[policy.status]}`}>
                    {statusLabels[policy.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{policy.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cobertura: {policy.coverage}%</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${policy.coverage > 80 ? 'bg-green-500' : policy.coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${policy.coverage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔑 Autenticação Simulada</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Teste a verificação de identidade na borda</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📋 Como Funciona</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Todas as API routes verificam o header <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">X-Auth-Token</code></li>
              <li>• Requisições sem token válido recebem HTTP 401</li>
              <li>• O token de demonstração é: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">edge-token-2024</code></li>
              <li>• Em produção, isso seria integrado com provedores como Auth0, Okta ou Azure AD</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">🛡️ Cloudflare Access Like</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              A implementação simula o Cloudflare Access, onde cada requisição passa por uma verificação de identidade
              antes de alcançar o backend. Isso garante que apenas usuários autenticados acessem recursos protegidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Endpoints Protegidos</h4>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>• /api/servers/*</li>
                <li>• /api/network/*</li>
                <li>• /api/virtualization/*</li>
                <li>• /api/security/*</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">🔄 Fluxo de Verificação</h4>
              <ol className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                <li>1. Request chega na API route</li>
                <li>2. Middleware verifica X-Auth-Token</li>
                <li>3. Token válido → processa request</li>
                <li>4. Token inválido → retorna 401</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
