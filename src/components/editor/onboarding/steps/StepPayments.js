'use client';

import { ShieldCheck, Wallet, Quote } from 'lucide-react';
import { useState } from 'react';

export default function StepPayments({ data, onUpdate }) {
  const [isTouched, setIsTouched] = useState(false);

  // Regex validation
  const isValidUpi = (upi) => /.+@.+/.test(upi);
  const isMatch = data.upi_id === data.confirm_upi_id;

  const handleChange = (val) => {
    onUpdate('upi_id', val);
  };

  const handleConfirmChange = (val) => {
      onUpdate('confirm_upi_id', val);
      setIsTouched(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative h-full flex flex-col">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Get paid directly</h2>
        <p className="text-gray-500 text-sm mt-1">Setup UPI to receive payments instantly to your bank.</p>
      </div>

      {/* Friendly Disclaimer */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3 items-start">
         <ShieldCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
         <div>
            <h4 className="text-sm font-semibold text-green-800">0% Commission</h4>
            <p className="text-xs text-green-700 mt-1">
                Payments go directly to your bank. We take 0% commission. Ensure your UPI ID is correct.
            </p>
         </div>
      </div>

      <div className="space-y-4">
        {/* UPI Input */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
            </label>
            <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                value={data.upi_id || ''}
                onChange={(e) => handleChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 transition-all ${
                    data.upi_id && !isValidUpi(data.upi_id)
                    ? 'border-red-300 focus:border-red-500 text-red-600'
                    : 'border-gray-200 focus:border-[#8A63D2]'
                }`}
                placeholder="shop@okhdfcbank"
            />
            </div>
            {data.upi_id && !isValidUpi(data.upi_id) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid UPI ID (must contain @).</p>
            )}
        </div>

        {/* Confirm UPI Input */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm UPI ID
            </label>
            <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                value={data.confirm_upi_id || ''}
                onChange={(e) => handleConfirmChange(e.target.value)}
                onPaste={(e) => e.preventDefault()} // Block paste for security/confirmation
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 transition-all ${
                    isTouched && data.upi_id && !isMatch
                    ? 'border-red-300 focus:border-red-500 text-red-600'
                    : 'border-gray-200 focus:border-[#8A63D2]'
                }`}
                placeholder="Retype UPI ID"
            />
            </div>
            {isTouched && data.upi_id && !isMatch && (
                <p className="text-xs text-red-500 mt-1">UPI IDs do not match.</p>
            )}
             <p className="text-[10px] text-gray-400 mt-1 ml-1">
                Make sure you enter the UPI ID where you want to receive payments.
            </p>
        </div>
      </div>

      <div className="flex-grow"></div>

      {/* Quote at bottom */}
      <div className="text-center opacity-60">
        <p className="text-xs text-gray-500 italic flex items-center justify-center gap-1">
            <Quote size={12} className="rotate-180" />
            Your money, your bank. Direct & Instant.
            <Quote size={12} />
        </p>
      </div>
    </div>
  );
}
