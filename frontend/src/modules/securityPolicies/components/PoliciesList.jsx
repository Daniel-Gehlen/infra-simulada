// Policies List Component
import React, { useState } from 'react';

export default function PoliciesList({ policies, onCreate, onToggle, onUpdate, onDelete, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'password',
    compliance: 'Interno',
    settings: {}
  });

  const categories = [
    { value: 'password', label: 'Senha' },
    { value: 'authentication', label: 'Autenticação' },
    { value: 'access_control', label: 'Controle de Acesso' },
    { value: 'encryption', label: 'Criptografia' },
    { value: 'logging', label: 'Registro' },
    { value: 'network', label: 'Rede' }
  ];

  const complianceOptions = ['LGPD', 'ISO 27001', 'PCI DSS', 'Interno'];

  const categoryColors = {
    password: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    authentication: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    access_control: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    encryption: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    logging: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    network: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await onCreate(form);
    setShowModal(false);
    setForm({ name: '', description: '', category: 'password', compliance: 'Interno', settings: {} });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📋 Políticas de Segurança</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as políticas de segurança da organização</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Nova Política
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {policies.map(policy => (
            <div key={policy.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{policy.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[policy.category]}`}>
                        {categories.find(c => c.value === policy.category)?.label}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {policy.compliance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{policy.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Cobertura: {policy.coverage}%</span>
                      <span>Última revisão: {new Date(policy.lastReview).toLocaleDateString()}</span>
                      <span>Próxima revisão: {new Date(policy.nextReview).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    policy.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {policy.enabled ? 'Ativa' : 'Inativa'}
                  </span>
                  <button
                    onClick={() => onToggle(policy.id)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {policy.enabled ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => onDelete(policy.id)}
                    className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nova Política de Segurança</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Política</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Política de Segurança"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Descreva a política"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compliance</label>
                    <select
                      value={form.compliance}
                      onChange={e => setForm({ ...form, compliance: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {complianceOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading || !form.name.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Criar Política
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
