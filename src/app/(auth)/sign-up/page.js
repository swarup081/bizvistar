'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Reusable Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.6111 20.0833H42V20H24V28H35.303C33.6747 32.6596 29.2235 36 24 36C17.3727 36 12 30.6273 12 24C12 17.3727 17.3727 12 24 12C26.8556 12 29.4734 13.1164 31.4789 14.9312L36.8537 9.55642C33.4369 6.55631 29.0034 4.5 24 4.5C13.2289 4.5 4.5 13.2289 4.5 24C4.5 34.7711 13.2289 43.5 24 43.5C34.7711 43.5 43.5 34.7711 43.5 24C43.5 22.6104 43.4072 21.34 43.2332 20.0833H43.6111V20.0833Z" fill="#FFC107"/>
    <path d="M6.9079 14.8085L12.7128 19.1028C14.6536 15.8234 18.995 13.5 24 13.5C26.4381 13.5 28.7001 14.3312 30.6559 15.6882L36.0234 10.315C32.8253 7.57174 28.6369 6 24 6C17.6169 6 12.0289 9.61303 9.0749 14.8085H6.9079Z" fill="#FF3D00"/>
    <path d="M24 44C30.2353 44 35.513 41.2376 38.5242 37.0701L32.9778 32.5312C31.334 35.0877 27.9398 37 24 37C19.7208 37 16.0354 34.7356 14.4999 31.1872L8.85295 35.6372C11.9723 41.0106 17.5833 44 24 44Z" fill="#4CAF50"/>
    <path d="M43.6111 20.0833H42V20H24V28H35.303C34.535 30.1322 33.2843 32.0079 31.6766 33.466L37.1498 37.8358C41.0913 34.137 43.5 29.3235 43.5 24C43.5 22.6104 43.4072 21.34 43.2332 20.0833H43.6111V20.0833Z" fill="#1976D2"/>
  </svg>
);

const AuthInput = ({ id, label, type, placeholder, value, onChange, icon: Icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-800 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-11 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
        required
      />
    </div>
  </div>
);

const AuthDivider = () => (
    <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 flex-shrink text-sm font-medium text-gray-500">
            OR
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
    </div>
);

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert(error.message);
    } else if (data.user) {
      // Optional: auto-create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      });

      // Check for redirect URL
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/get-started');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Create an Account
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Start your journey with BizVistar today.
      </p>

      <button
        type="button"
        className="w-full flex justify-center items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="Alex Johnson"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={User}
        />
        
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />
        
        <AuthInput
          id="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
        />

        <button
          type="submit"
          className="w-full px-8 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        By signing up, you agree to our{" "}
        <Link href="/terms">
            <span className="font-medium text-gray-800 hover:text-gray-900 cursor-pointer underline">
                Terms of Service
            </span>
        </Link>
        .
      </p>

      <p className="text-center text-base text-gray-600 mt-8">
        Already have an account?{" "}
        <Link href="/sign-in">
          <span className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer">
            Sign in
          </span>
        </Link>
      </p>
    </>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
