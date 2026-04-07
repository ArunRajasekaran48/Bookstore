import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButton = ({ label = 'Back', className = '', fallbackTo = '/' }) => {
  const navigate = useNavigate();

  const onBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackTo, { replace: true });
  };

  return (
    <button
      onClick={onBack}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-dark-900 hover:border-stone-300 hover:bg-stone-50 transition-colors text-sm ${className}`}
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
};

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`animate-spin rounded-full border-4 border-stone-200 border-t-primary-500 ${sizes[size]} ${className}`} />
  );
};

export const LoadingPage = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
    <Spinner size="lg" />
    <p className="text-stone-500 text-sm">{message}</p>
  </div>
);

export const EmptyState = ({ icon = '📭', title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
    <span className="text-6xl">{icon}</span>
    <h3 className="font-display text-xl font-semibold text-dark-800">{title}</h3>
    {message && <p className="text-stone-500 max-w-xs">{message}</p>}
    {action}
  </div>
);

export const StatusBadge = ({ status, className = '' }) => {
  const colors = {
    PENDING:     'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED:   'bg-blue-100 text-blue-800 border-blue-200',
    PROCESSING:  'bg-indigo-100 text-indigo-800 border-indigo-200',
    SHIPPED:     'bg-purple-100 text-purple-800 border-purple-200',
    DELIVERED:   'bg-green-100 text-green-800 border-green-200',
    CANCELLED:   'bg-red-100 text-red-800 border-red-200',
    SUCCESS:     'bg-green-100 text-green-800 border-green-200',
    FAILED:      'bg-red-100 text-red-800 border-red-200',
    REFUNDED:    'bg-purple-100 text-purple-800 border-purple-200',
    ACTIVE:      'bg-red-100 text-red-800 border-red-200',
    ACKNOWLEDGED:'bg-yellow-100 text-yellow-800 border-yellow-200',
    RESOLVED:    'bg-green-100 text-green-800 border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || 'bg-stone-100 text-stone-800 border-stone-200'} ${className}`}>
      {status}
    </span>
  );
};

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-fade-in">
        <h3 className="font-display text-lg font-semibold text-dark-900 mb-2">{title}</h3>
        <p className="text-stone-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary text-sm" onClick={onCancel}>Cancel</button>
          <button className={`${danger ? 'btn-danger' : 'btn-primary'} text-sm`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};
