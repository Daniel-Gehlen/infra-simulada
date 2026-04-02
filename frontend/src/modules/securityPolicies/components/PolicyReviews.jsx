// Policy Reviews Component
import React, { useState } from 'react';

export default function PolicyReviews({ reviews, policies, onCreate, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    policyId: '',
    reviewer: '',
    findings: '',
    recommendations: '',
    status: 'pending'
  });

  const statusColors = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  const statusLabels = {
    approved: 'Aprovado',
    pending: 'Pendente',
    rejected: 'Rejeitado'
  };

  const handleCreate = async () => {
    if (!form.policyId || !form.findings) return;
    await onCreate(form);
    setShowModal(false);
    setForm({ policyId: '', reviewer: '', findings: '', recommendations: '', status: 'pending' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔍 Revisões de Políticas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Histórico de revisões e auditorias</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Nova Revisão
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reviews.map(review => {
            const policy = policies.find(p => p.id === review.policyId);
            return (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{policy?.name || 'Política não encontrada'}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Revisor: {review.reviewer} | Data: {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[review.status]}`}>
                    {statusLabels[review.status]}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Achados:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.findings}</p>
                  </div>
                  {review.recommendations && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Recomendações:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{review.recommendations}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nova Revisão de Política</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Política</label>
                  <select
                    value={form.policyId}
                    onChange={e => setForm({ ...form, policyId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecione uma política</option>
                    {policies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revisor</label>
                  <input
                    type="text"
                    value={form.reviewer}
                    onChange={e => setForm({ ...form, reviewer: e.target.value })}
                    placeholder="Nome do revisor"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Achados</label>
                  <textarea
                    value={form.findings}
                    onChange={e => setForm({ ...form, findings: e.target.value })}
                    placeholder="Descreva os achados da revisão"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recomendações</label>
                  <textarea
                    value={form.recommendations}
                    onChange={e => setForm({ ...form, recommendations: e.target.value })}
                    placeholder="Recomendações para melhoria"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="rejected">Rejeitado</option>
                  </select>
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
                    disabled={loading || !form.policyId || !form.findings}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Registrar Revisão
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
