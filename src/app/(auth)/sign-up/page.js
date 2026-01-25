'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');
  const signInUrl = redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : '/sign-in';

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Invalid email format";
    }

    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) {
        setFieldErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) {
        return;
    }

    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (error) {
      setGlobalError(error.message);
      setLoading(false);
    } else if (data.user) {
      // Create profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: formData.fullName,
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
          <h2 className="text-3xl not-italic font-bold text-[#2E1065] tracking-tight">
            Register
          </h2>
      </div>

      {globalError && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
           <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
           <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
        {/* Full Name */}
        <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-sm text-gray-600 font-medium">
                Full Name
            </label>
            <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={cn(
                    "w-full p-3 bg-white border rounded-lg outline-none transition-all focus:ring-2",
                    fieldErrors.fullName
                        ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"
                )}
            />
            {fieldErrors.fullName && <p className="text-xs text-red-500">{fieldErrors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-gray-600 font-medium">
                Email address
            </label>
            <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                    "w-full p-3 bg-white border rounded-lg outline-none transition-all focus:ring-2",
                    fieldErrors.email
                        ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"
                )}
            />
            {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
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
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                        "w-full p-3 bg-white border rounded-lg outline-none transition-all pr-10 focus:ring-2",
                        fieldErrors.password
                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                            : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"
                    )}
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
            {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-[17px] font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
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
                Already have an account? <Link href={signInUrl} className="text-purple-600 hover:text-purple-700 font-bold ml-1">Log in</Link>
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
    <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>}>
      <SignUpForm />
    </Suspense>
  );
}
