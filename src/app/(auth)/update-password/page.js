'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const router = useRouter();

  // Optionally check if session exists, but updateUser will fail if not.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setLoading(false);
      } else {
        setMessage({ type: 'success', text: 'Password updated successfully. Redirecting...' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-12 border border-gray-100">
      <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2E1065] tracking-tight">
            Set new password
          </h2>
          <p className="mt-2 text-gray-500 text-[15px]">
            Please enter your new password below.
          </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 text-sm rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm text-gray-600 font-medium">
                New Password
            </label>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all pr-10"
                    required
                    placeholder="Min. 6 characters"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[17px] font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
          disabled={loading}
        >
          {loading ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               Updating...
             </>
          ) : 'Update password'}
        </button>
      </form>
    </div>
  );
}
