import React, { useState } from 'react';
import { useOrders } from '../../hooks/useData';
import { orderService } from '../../services/otherServices';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { LoadingPage, EmptyState, StatusBadge, BackButton } from '../../components/common/UI';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];

const AdminOrdersPage = () => {
  const { orders, loading, refetch } = useOrders(true);
  const [selected, setSelected]      = useState(null);
  const [filter, setFilter]          = useState('ALL');

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      toast.success('Status updated');
      refetch();
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-4" />
      <h1 className="font-display text-3xl font-bold text-dark-900 mb-6">Manage Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['ALL', ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === s ? 'bg-dark-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <EmptyState icon="📦" title="No orders found" /> : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Order list */}
          <div className="lg:col-span-3 space-y-3">
            {filtered.map(order => (
              <div key={order.id}
                onClick={() => setSelected(order)}
                className={`card p-4 cursor-pointer transition-all ${selected?.id === order.id ? 'border-primary-300 shadow-md' : 'hover:border-stone-200'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-dark-700">{order.orderNumber}</p>
                    <p className="text-stone-400 text-xs mt-0.5">{formatDate(order.orderedAt)}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                    <StatusBadge status={order.status} />
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-stone-500 text-xs">{order.items?.length || 0} items · {order.paymentMethod}</span>
                  <span className="font-bold text-primary-600">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card p-5 sticky top-24 animate-fade-in">
                <h3 className="font-display text-lg font-semibold mb-1">Order Details</h3>
                <p className="font-mono text-xs text-stone-500 mb-4">{selected.orderNumber}</p>

                <div className="space-y-1 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-stone-500">Status</span><StatusBadge status={selected.status} /></div>
                  <div className="flex justify-between"><span className="text-stone-500">Payment</span><StatusBadge status={selected.paymentStatus} /></div>
                  <div className="flex justify-between"><span className="text-stone-500">Method</span><span className="font-medium">{selected.paymentMethod}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Total</span><span className="font-bold text-primary-600">{formatCurrency(selected.totalAmount)}</span></div>
                </div>

                {selected.shippingAddress && (
                  <div className="mb-4 p-2 bg-stone-50 rounded-lg text-xs text-stone-600">
                    <p className="font-medium text-stone-700 mb-1">📍 Ship to:</p>
                    <p>{selected.shippingAddress}</p>
                  </div>
                )}

                <div className="space-y-1.5 mb-5">
                  {(selected.items || []).map(item => (
                    <div key={item.id} className="flex justify-between text-xs text-stone-600">
                      <span className="truncate flex-1 pr-2">{item.bookTitle} ×{item.quantity}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-3">
                  <p className="text-xs text-stone-500 font-medium mb-2">Update Status:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ORDER_STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        disabled={selected.status === s}
                        className={`text-xs py-1.5 px-2 rounded-lg border transition-all font-medium ${selected.status === s ? 'bg-dark-900 text-white border-dark-900' : 'border-stone-200 hover:border-stone-400 text-stone-600'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center text-stone-400">
                <div className="text-4xl mb-2">👆</div>
                <p className="text-sm">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
