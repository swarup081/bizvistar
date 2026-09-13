'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { claimTemplate } from '@/app/actions/sharedTemplateActions';
import Logo from '@/lib/logo/logoOfBizVistar';
import Link from 'next/link';

export default function ClaimActivatePage({ params }) {
  const { shareId } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function activate() {
      try {
        const result = await claimTemplate(shareId);
        if (result.success) {
          setStatus('success');
          // Redirect to dashboard after a brief celebration
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setErrorMsg(result.error || 'Failed to set up your website.');
          setStatus('error');
        }
      } catch (err) {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      }
    }
    activate();
  }, [shareId, router]);

  return (
    <div className="min-h-screen bg-[#F5F7FD] font-sans flex flex-col">
      {/* Header */}
      <header className="p-8 pb-0">
        <Link href="/" className="inline-block">
          <Logo className="text-3xl" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#8A63D2]/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#8A63D2] animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Setting Up Your Website</h1>
                <p className="text-sm text-gray-500">Just a moment — we're getting everything ready for you...</p>
              </div>
              {/* Progress bar animation */}
              <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#8A63D2] rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">🎉 Your Website is Ready!</h1>
                <p className="text-sm text-gray-500">Redirecting you to your dashboard...</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
                <p className="text-sm text-gray-500 max-w-sm">{errorMsg}</p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => { setStatus('loading'); window.location.reload(); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#8A63D2] hover:bg-[#7c59bd] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
