// src/components/ui/Toast.js
'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right ${bgColors[type]}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  );
};

// Usage Helper (Put this in your layout or context)
// const [toast, setToast] = useState(null);
// {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}