// Check Point Rules Component
import React, { useState } from 'react';

export default function CheckpointRules({ rules, onCreate, onToggle, onDelete, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    source: 'Any',
    destination: 'Any',
    service: 'Any',
    action: 'Accept',
    track: 'Log'
  });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await onCreate(form);
    setShowModal(false);
    setForm({ name: '', source: 'Any', destination: 'Any', service: 'Any', action: 'Accept', track: 'Log' });
  };

  const services = ['Any', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP', 'Telnet', 'RDP', 'SNMP'];
  const actions = ['Accept', 'Drop', 'Reject'];
  const tracks = ['Log', 'Accounting', 'None'];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔥 Regras de Firewall Check Point</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as regras de acesso do firewall</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Nova Regra
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Posição</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Origem</th>
                <th className="px-4 py-3 text-left">Destino</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left">Ação</th>
                <th className="px-4 py-3 text-left">Track</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{rule.position}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{rule.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rule.source}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rule.destination}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rule.service}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.action === 'Accept' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      rule.action === 'Drop' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {rule.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rule.track}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {rule.enabled ? 'Habilitada' : 'Desabilitada'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-1">
                    <button
                      onClick={() => onToggle(rule.id)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {rule.enabled ? 'Desabilitar' : 'Habilitar'}
                    </button>
                    <button
                      onClick={() => onDelete(rule.id)}
                      className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nova Regra de Firewall</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Regra</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Allow_Web_Traffic"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origem</label>
                    <input
                      type="text"
                      value={form.source}
                      onChange={e => setForm({ ...form, source: e.target.value })}
                      placeholder="Any"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destino</label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={e => setForm({ ...form, destination: e.target.value })}
                      placeholder="Any"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço</label>
                    <select
                      value={form.service}
                      onChange={e => setForm({ ...form, service: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ação</label>
                    <select
                      value={form.action}
                      onChange={e => setForm({ ...form, action: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {actions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Track</label>
                    <select
                      value={form.track}
                      onChange={e => setForm({ ...form, track: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {tracks.map(t => <option key={t} value={t}>{t}</option>)}
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
                    Criar Regra
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
