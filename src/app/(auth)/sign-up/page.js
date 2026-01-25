'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');
  const signInUrl = redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : '/sign-in';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (data.user) {
      // Create profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      });

      if (profileError) {
          console.error("Profile creation failed:", profileError);
      }

      // Check for redirect URL
      if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
        router.push(redirect);
      } else {
        router.push('/get-started');
      }
    } else {
       setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-12 border border-gray-100">
      <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2E1065] tracking-tight">
            Register
          </h2>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Full Name */}
        <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-sm text-gray-600 font-medium">
                Full Name
            </label>
            <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all"
                required
            />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-gray-600 font-medium">
                Email address
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all"
                required
            />
        </div>
        
        {/* Password */}
        <div className="space-y-1.5">
             <label htmlFor="password" className="block text-sm text-gray-600 font-medium">
                Password
            </label>
            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
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
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[17px] font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
          disabled={loading}
        >
          {loading ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               Creating Account...
             </>
          ) : 'Register'}
        </button>

        <div className="text-center pt-2">
            <p className="text-[15px] text-[#2E1065] font-medium">
                Already have an account? <Link href={signInUrl} className="text-[#6366F1] hover:text-[#4F46E5] font-bold ml-1">Log in</Link>
            </p>
        </div>

        <div className="text-xs text-gray-500 text-center leading-relaxed pt-4 border-t border-gray-50 mt-6">
            By continuing you agree with our <Link href="/terms" className="text-gray-700 underline hover:text-gray-900 font-medium">Terms of Service</Link> and confirm that you have read our <Link href="/privacy" className="text-gray-700 underline hover:text-gray-900 font-medium">Privacy Policy</Link>
        </div>

      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" /></div>}>
      <SignUpForm />
    </Suspense>
  );
}
