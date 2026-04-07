import React from 'react';
import { useAlerts } from '../../hooks/useData';
import { inventoryService } from '../../services/otherServices';
import { formatDate } from '../../utils/helpers';
import { LoadingPage, EmptyState, StatusBadge, BackButton } from '../../components/common/UI';
import toast from 'react-hot-toast';

const AdminInventoryPage = () => {
  const { alerts, loading, refetch, acknowledge, resolve } = useAlerts();
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  const triggerSync = async () => {
    try {
      await inventoryService.triggerSync();
      toast.success('Inventory sync triggered!');
      refetch();
    } catch { toast.error('Sync failed'); }
  };

  const activeAlerts = safeAlerts.filter(a => a.status === 'ACTIVE');
  const otherAlerts  = safeAlerts.filter(a => a.status !== 'ACTIVE');

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-4" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark-900">Inventory Alerts</h1>
          <p className="text-stone-500 mt-1">Low-stock threshold alerts & synchronization</p>
        </div>
        <button onClick={triggerSync} className="btn-secondary flex items-center gap-2">
          🔄 Sync Now
        </button>
      </div>

      {/* Active alerts */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-xl font-semibold text-dark-900">🚨 Active Alerts</h2>
          {activeAlerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-alert-pulse">
              {activeAlerts.length}
            </span>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="font-display text-xl font-semibold text-green-700">All Clear!</h3>
            <p className="text-stone-500 text-sm mt-1">All stock levels are above threshold.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="card p-5 border-l-4 border-red-400 animate-fade-in">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="animate-alert-pulse text-red-500 font-bold">⚠️</span>
                      <h3 className="font-semibold text-dark-900 truncate">{alert.book?.title}</h3>
                    </div>
                    <p className="text-stone-500 text-sm">{alert.message}</p>
                    <p className="text-stone-400 text-xs mt-1">Triggered: {formatDate(alert.triggeredAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => acknowledge(alert.id)}
                      className="text-xs px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-100 transition-colors font-medium">
                      Acknowledge
                    </button>
                    <button onClick={() => resolve(alert.id)}
                      className="text-xs px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 rounded-lg hover:bg-green-100 transition-colors font-medium">
                      Resolve
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs">
                  <span className="flex items-center gap-1 text-red-600 font-semibold">
                    📦 Current Stock: {alert.stockLevel}
                  </span>
                  <span className="flex items-center gap-1 text-stone-500">
                    🎯 Threshold: {alert.threshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert History */}
      {otherAlerts.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-dark-900 mb-4">Alert History</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Book', 'Stock Level', 'Threshold', 'Status', 'Triggered', 'Resolved'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {otherAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark-800 max-w-[200px] truncate">{alert.book?.title}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{alert.stockLevel}</td>
                    <td className="px-4 py-3 text-stone-600">{alert.threshold}</td>
                    <td className="px-4 py-3"><StatusBadge status={alert.status} /></td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{formatDate(alert.triggeredAt)}</td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{alert.resolvedAt ? formatDate(alert.resolvedAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;
