// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
};

// Order status badge color
export const getStatusColor = (status) => {
  const map = {
    PENDING:    'bg-yellow-100 text-yellow-800',
    CONFIRMED:  'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-indigo-100 text-indigo-800',
    SHIPPED:    'bg-purple-100 text-purple-800',
    DELIVERED:  'bg-green-100 text-green-800',
    CANCELLED:  'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-stone-100 text-stone-800';
};

export const getPaymentStatusColor = (status) => {
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    SUCCESS: 'bg-green-100 text-green-800',
    FAILED:  'bg-red-100 text-red-800',
    REFUNDED:'bg-purple-100 text-purple-800',
  };
  return map[status] || 'bg-stone-100 text-stone-800';
};

// Generate a random book cover gradient when no image
export const bookGradient = (id) => {
  const gradients = [
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-600',
    'from-sky-400 to-blue-600',
    'from-violet-400 to-purple-600',
    'from-rose-400 to-pink-600',
    'from-lime-400 to-green-600',
    'from-cyan-400 to-sky-600',
    'from-fuchsia-400 to-violet-600',
  ];
  return gradients[(id || 0) % gradients.length];
};
