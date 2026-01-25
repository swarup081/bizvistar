'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');
  const signUpUrl = redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : '/sign-up';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
        router.push(redirect);
      } else {
        router.push('/templates');
      }
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-12 border border-gray-100">
      <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2E1065] tracking-tight">
            Log in
          </h2>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
          {errorMessage}
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
        
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                 <label htmlFor="password" className="block text-sm text-gray-600 font-medium">
                    Password
                </label>
            </div>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all pr-10"
                    required
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
            <div className="flex justify-end pt-1">
                 <Link href="/forgot-password">
                    <span className="text-sm font-medium text-[#6366F1] hover:text-[#4F46E5] cursor-pointer">
                        Forgot password?
                    </span>
                </Link>
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
               Logging In...
             </>
          ) : 'Log in'}
        </button>

        <div className="text-center pt-2">
            <p className="text-[15px] text-[#2E1065] font-medium">
                Don't have an account? <Link href={signUpUrl} className="text-[#6366F1] hover:text-[#4F46E5] font-bold ml-1">Register</Link>
            </p>
        </div>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
