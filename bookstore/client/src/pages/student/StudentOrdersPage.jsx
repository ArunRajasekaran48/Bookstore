import React, { useState } from 'react';
import { useOrders } from '../../hooks/useData';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { LoadingPage, EmptyState, StatusBadge, BackButton } from '../../components/common/UI';
import { useNavigate } from 'react-router-dom';

const EBill = ({ order, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in" onClick={e => e.stopPropagation()}>
      {/* Bill header */}
      <div className="text-center mb-6 pb-6 border-b-2 border-dashed border-stone-200">
        <div className="text-4xl mb-2">📚</div>
        <h2 className="font-display text-2xl font-bold text-dark-900">BookHaven</h2>
        <p className="text-stone-500 text-xs">Online Bookstore · Smart Inventory</p>
        <div className="mt-3 text-xs text-stone-400">
          <p>Tax Invoice / E-Bill</p>
          <p className="font-mono text-dark-700 font-semibold">{order.orderNumber}</p>
          <p>{formatDate(order.orderedAt)}</p>
        </div>
      </div>

      {/* Items */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-stone-400 text-xs border-b border-stone-100">
            <th className="text-left pb-2">Item</th>
            <th className="text-center pb-2">Qty</th>
            <th className="text-right pb-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map(item => (
            <tr key={item.id} className="border-b border-stone-50">
              <td className="py-2 pr-2">
                <p className="font-medium text-dark-800 text-xs leading-snug">{item.bookTitle}</p>
                <p className="text-stone-400 text-xs">{formatCurrency(item.unitPrice)} each</p>
              </td>
              <td className="py-2 text-center text-stone-600">{item.quantity}</td>
              <td className="py-2 text-right font-semibold text-dark-800">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between font-bold text-dark-900 text-base border-t-2 border-dashed border-stone-200 pt-3 mb-1">
        <span>Total Paid</span>
        <span className="text-primary-600">{formatCurrency(order.totalAmount)}</span>
      </div>
      <div className="flex justify-between text-xs text-stone-500 mb-6">
        <span>Payment: {order.paymentMethod}</span>
        <StatusBadge status={order.paymentStatus} />
      </div>

      <p className="text-center text-xs text-stone-400 mb-4">Thank you for shopping with BookHaven! 📚</p>
      <button className="btn-primary w-full" onClick={() => window.print()}>🖨️ Print Bill</button>
      <button className="btn-secondary w-full mt-2 text-sm" onClick={onClose}>Close</button>
    </div>
  </div>
);

const StudentOrdersPage = () => {
  const { orders, loading } = useOrders(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loading) return <LoadingPage message="Loading orders..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-4" />
      <h1 className="font-display text-3xl font-bold text-dark-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" message="Place your first order from the catalog." />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5 animate-fade-in">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-dark-700">{order.orderNumber}</p>
                  <p className="text-stone-500 text-xs">{formatDate(order.orderedAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="space-y-1 mb-4 text-sm text-stone-600">
                {(order.items || []).slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate flex-1 pr-4">{item.bookTitle} ×{item.quantity}</span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
                {(order.items || []).length > 3 && (
                  <p className="text-stone-400 text-xs">+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="font-bold text-primary-600 text-lg">{formatCurrency(order.totalAmount)}</span>
                <button onClick={() => setSelectedOrder(order)}
                  className="btn-secondary text-sm py-1.5 px-4">
                  📄 E-Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && <EBill order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default StudentOrdersPage;
