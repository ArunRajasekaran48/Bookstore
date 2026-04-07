import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/otherServices';
import { formatCurrency } from '../../utils/helpers';
import { EmptyState, BackButton } from '../../components/common/UI';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'UPI', label: 'UPI', icon: '📱' },
  { id: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
];

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=result
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const items = cart?.items || [];
  if (items.length === 0 && step !== 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <EmptyState icon="🛒" title="Cart is empty" message="Add books before checking out."
          action={<button className="btn-primary" onClick={() => navigate('/books')}>Browse Books</button>} />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) { toast.error('Enter shipping address'); return; }
    setLoading(true);
    try {
      const order = await orderService.placeOrder({ shippingAddress, paymentMethod, notes: '' });
      setPlacedOrder(order);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const payload = { paymentMethod };
      if (paymentMethod === 'CARD') payload.cardNumber = cardNumber;
      if (paymentMethod === 'UPI')  payload.upiId = upiId;

      const result = await orderService.processPayment(placedOrder.id, payload);
      setPaymentResult(result);
      setStep(3);
      if (result.success) {
        await fetchCart();
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <BackButton className="mb-4" />

      <h1 className="font-display text-3xl font-bold text-dark-900 mb-2">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        {['Address', 'Payment', 'Confirmation'].map((s, i) => (
          <React.Fragment key={s}>
            <span className={`px-3 py-1 rounded-full font-medium ${step === i+1 ? 'bg-primary-500 text-white' : step > i+1 ? 'bg-green-500 text-white' : 'bg-stone-100 text-stone-500'}`}>
              {step > i+1 ? '✓' : i+1}. {s}
            </span>
            {i < 2 && <span className="text-stone-300">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Shipping Address</h2>
            <textarea
              value={shippingAddress} onChange={e => setShippingAddress(e.target.value)}
              rows={3} className="input-field resize-none"
              placeholder="Door No, Street, City, State – PIN Code" />
          </div>

          {/* Order summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-dark-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm text-stone-600 mb-3">
              {items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span className="truncate flex-1 pr-2">{i.bookTitle} ×{i.quantity}</span>
                  <span>{formatCurrency(i.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-dark-900">
              <span>Total</span>
              <span className="text-primary-600">{formatCurrency(cart?.totalAmount)}</span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-dark-900 mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map(pm => (
                <label key={pm.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-primary-500 bg-primary-50' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input type="radio" name="pm" value={pm.id} checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)} className="sr-only" />
                  <span className="text-xl">{pm.icon}</span>
                  <span className="text-sm font-medium text-dark-800">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>Processing...</> : 'Continue to Payment →'}
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6">
            <h2 className="font-display text-xl font-semibold mb-2">Payment</h2>
            <p className="text-stone-500 text-sm mb-5">Order <code className="font-mono bg-stone-100 px-1 rounded">{placedOrder?.orderNumber}</code> · Total: <strong className="text-primary-600">{formatCurrency(placedOrder?.totalAmount)}</strong></p>

            {paymentMethod === 'CARD' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  💡 Use card ending in <strong>0000</strong> to simulate a payment failure.
                </div>
                <input value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                  className="input-field font-mono" placeholder="Card number (e.g. 4111111111110000)" maxLength={16} />
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <input value={upiId} onChange={e => setUpiId(e.target.value)}
                className="input-field" placeholder="yourname@upi" />
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="p-4 bg-stone-50 rounded-lg text-sm text-stone-600">
                You will be redirected to your bank's portal. (Mock: auto-processes)
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-4 bg-stone-50 rounded-lg text-sm text-stone-600">
                Pay when your order is delivered. No online payment needed.
              </div>
            )}
          </div>

          <button onClick={handlePayment} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>Processing Payment...</> : `Pay ${formatCurrency(placedOrder?.totalAmount)}`}
          </button>
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && paymentResult && (
        <div className="animate-fade-in">
          <div className={`card p-10 text-center border-2 ${paymentResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="text-7xl mb-4">{paymentResult.success ? '🎉' : '❌'}</div>
            <h2 className={`font-display text-2xl font-bold mb-2 ${paymentResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
            </h2>
            <p className={`mb-6 ${paymentResult.success ? 'text-green-700' : 'text-red-700'}`}>{paymentResult.message}</p>

            {paymentResult.success && (
              <div className="bg-white rounded-xl p-4 mb-6 text-sm text-left space-y-1 border border-green-100">
                <div className="flex justify-between"><span className="text-stone-500">Order No:</span><span className="font-mono font-medium">{paymentResult.orderNumber}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Transaction:</span><span className="font-mono font-medium">{paymentResult.transactionId}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Amount:</span><span className="font-semibold text-green-700">{formatCurrency(paymentResult.amount)}</span></div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {paymentResult.success
                ? <>
                    <button className="btn-primary" onClick={() => navigate('/student/orders')}>View Orders</button>
                    <button className="btn-secondary" onClick={() => navigate('/books')}>Continue Shopping</button>
                  </>
                : <>
                    <button className="btn-primary" onClick={() => setStep(2)}>Retry Payment</button>
                    <button className="btn-secondary" onClick={() => navigate('/cart')}>Back to Cart</button>
                  </>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
