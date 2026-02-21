'use client';

import { useState } from 'react';
import { CreditCard, Truck, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function PaymentStep({ onNext, loading }) {
  const [method, setMethod] = useState('upi'); // 'upi' or 'cod'
  const [upiId, setUpiId] = useState('');
  const [confirmUpiId, setConfirmUpiId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (method === 'upi') {
        if (!upiId) return setError("Please enter your UPI ID.");
        if (upiId !== confirmUpiId) return setError("UPI IDs do not match.");
    }

    onNext({ upiId: method === 'upi' ? upiId : '', isCodOnly: method === 'cod' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Setup</h2>
        <p className="text-gray-500 mt-2 text-sm">How would you like to receive payments?</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Method Selection */}
        <div className="grid grid-cols-2 gap-4">
            <button
                type="button"
                onClick={() => { setMethod('upi'); setError(''); }}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    method === 'upi'
                    ? 'border-[#8A63D2] bg-purple-50 text-[#8A63D2]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
            >
                <CreditCard size={24} />
                <span className="font-bold text-sm">UPI / Online</span>
            </button>

            <button
                type="button"
                onClick={() => { setMethod('cod'); setError(''); }}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    method === 'cod'
                    ? 'border-[#8A63D2] bg-purple-50 text-[#8A63D2]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
            >
                <Truck size={24} />
                <span className="font-bold text-sm">COD Only</span>
            </button>
        </div>

        {/* Dynamic Content */}
        {method === 'upi' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Enter UPI ID</label>
                    <input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Confirm UPI ID</label>
                    <input
                        value={confirmUpiId}
                        onChange={(e) => setConfirmUpiId(e.target.value)}
                        placeholder="Re-enter UPI ID"
                        className={`w-full p-3 border rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all ${
                            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
                </div>

                <div className="p-4 bg-blue-50 text-blue-800 text-xs rounded-xl flex gap-3 items-start border border-blue-100">
                    <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <strong>Direct Payment Policy:</strong> Payments are processed directly between you and your customers via UPI apps.
                        We do not act as an intermediary, nor do we charge any commission.
                        Please verify receipt of funds in your banking app before processing any order.
                    </p>
                </div>
            </div>
        )}

        {method === 'cod' && (
            <div className="p-4 bg-amber-50 text-amber-800 text-xs rounded-xl flex gap-3 items-start border border-amber-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    <strong>Cash on Delivery Only:</strong> You have opted out of online payments.
                    You are responsible for collecting payment from customers upon delivery.
                    We cannot redirect users to payment gateways or facilitate online transactions for this store.
                </p>
            </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end mt-auto">
        <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl hover:bg-[#7854bc] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-200"
        >
            {loading ? 'Saving...' : 'Continue'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
