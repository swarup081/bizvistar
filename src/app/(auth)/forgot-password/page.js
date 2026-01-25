'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: 'Check your email for the password reset link.'
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-12 border border-gray-100">
      <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#2E1065] tracking-tight">
            Reset password
          </h2>
          <p className="mt-2 text-gray-500 text-[15px]">
            Enter your email address and we'll send you a link to reset your password.
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
            <label htmlFor="email" className="block text-sm text-gray-600 font-medium">
                Email address
            </label>
            <div className="relative">
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all"
                    required
                />
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
               Sending...
             </>
          ) : 'Send reset link'}
        </button>

        <div className="text-center pt-4">
            <Link href="/sign-in" className="inline-flex items-center text-[15px] font-medium text-gray-600 hover:text-[#6366F1] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Log in
            </Link>
        </div>
      </form>
    </div>
  );
}
