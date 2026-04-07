import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { LoadingPage, EmptyState, BackButton } from '../../components/common/UI';

const CartPage = () => {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <LoadingPage message="Loading cart..." />;

  const items = cart?.items || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-4" />

      <h1 className="font-display text-3xl font-bold text-dark-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Browse our catalog and add books you love."
          action={<button className="btn-primary" onClick={() => navigate('/books')}>Browse Books</button>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4 animate-fade-in">
                {/* Cover thumb */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                  {item.coverImageUrl
                    ? <img src={item.coverImageUrl} alt={item.bookTitle} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl bg-amber-100">📖</div>}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark-900 text-sm truncate">{item.bookTitle}</p>
                  <p className="text-stone-500 text-xs mb-2">{item.bookAuthor}</p>
                  <p className="text-primary-600 font-bold">{formatCurrency(item.unitPrice)}</p>
                  {item.availableStock !== undefined && item.availableStock <= 5 && (
                    <p className="text-red-500 text-xs mt-1">Only {item.availableStock} available</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                      className="px-2 py-1 text-sm hover:bg-stone-100 transition-colors">−</button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="px-2 py-1 text-sm hover:bg-stone-100 transition-colors disabled:opacity-40">+</button>
                  </div>
                  <p className="font-bold text-dark-900">{formatCurrency(item.subtotal)}</p>
                  <button onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 text-xs transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-stone-600">
                    <span className="truncate flex-1 pr-2">{item.bookTitle} ×{item.quantity}</span>
                    <span className="flex-shrink-0">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-dark-900">
                <span>Total</span>
                <span className="text-primary-600 text-lg">{formatCurrency(cart?.totalAmount)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mt-5">
                Proceed to Checkout →
              </button>
              <button onClick={() => navigate('/books')}
                className="btn-secondary w-full mt-2 text-sm">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
