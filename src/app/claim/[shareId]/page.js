'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getSharedTemplateByShareId, claimTemplate } from '@/app/actions/sharedTemplateActions';
import Logo from '@/lib/logo/logoOfBizVistar';
import Link from 'next/link';

export default function ClaimPage({ params }) {
  const { shareId } = use(params);
  const router = useRouter();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Load template and auth state
  useEffect(() => {
    async function load() {
      const result = await getSharedTemplateByShareId(shareId);
      if (result.success) {
        setTemplate(result.template);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    load();

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, [shareId]);

  // Show popup after 8 seconds
  useEffect(() => {
    if (!template || loading) return;
    const timer = setTimeout(() => setShowPopup(true), 8000);
    return () => clearTimeout(timer);
  }, [template, loading]);

  const handleClaim = async () => {
    if (!session) {
      router.push(`/sign-up?redirect=${encodeURIComponent(`/claim/${shareId}/activate`)}`);
      return;
    }
    setClaiming(true);
    const result = await claimTemplate(shareId);
    if (result.success) {
      router.push('/dashboard');
    } else {
      alert(result.error || 'Failed to claim template');
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#8A63D2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 font-sans p-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <X className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Template Not Available</h1>
        <p className="text-sm text-gray-500 text-center max-w-md">{error || 'This template link is no longer active.'}</p>
        <Link href="/" className="mt-4 px-6 py-2.5 bg-[#8A63D2] text-white font-semibold text-sm rounded-lg hover:bg-[#7c59bd] transition-colors">
          Go to BizVistar
        </Link>
      </div>
    );
  }

  const templateUrl = `/templates/${template.template_name}`;

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* ─── FIXED TOP NAV BAR ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[56px] flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="text-2xl" />
          </Link>

          {/* Center: CTA text (desktop) */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Sparkles size={16} className="text-[#8A63D2]" />
            <span className="text-gray-700 font-medium">
              Love this website? <span className="text-[#8A63D2] font-bold">Claim it for free</span> — just sign up!
            </span>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-2">
            {session ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="flex items-center gap-2 px-4 py-2 bg-[#8A63D2] hover:bg-[#7c59bd] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-60"
              >
                <Sparkles size={14} />
                {claiming ? 'Claiming...' : 'Make It Yours'}
              </button>
            ) : (
              <>
                <Link
                  href={`/sign-in?redirect=${encodeURIComponent(`/claim/${shareId}/activate`)}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
                <Link
                  href={`/sign-up?redirect=${encodeURIComponent(`/claim/${shareId}/activate`)}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#8A63D2] hover:bg-[#7c59bd] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <UserPlus size={14} />
                  <span className="hidden sm:inline">Sign Up Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── FULL TEMPLATE VIEW (IFRAME) ─── */}
      <div className="pt-[56px] w-full h-screen">
        <iframe
          src={templateUrl}
          className="w-full h-full border-0"
          title={`${template.business_name || template.template_name} Preview`}
        />
      </div>

      {/* ─── FLOATING POPUP (appears after timer or when nav is scrolled past) ─── */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-[380px] z-[60]"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
              {/* Preview thumbnail */}
              <div className="relative h-[140px] overflow-hidden bg-gray-50 border-b border-gray-100">
                <iframe
                  src={templateUrl}
                  className="w-[1280px] h-[720px] origin-top-left scale-[0.3] pointer-events-none"
                  title="Preview"
                />
                {/* Close button */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#8A63D2]" />
                  <span className="text-xs font-bold text-[#8A63D2] uppercase tracking-wider">Free Website</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {template.business_name ? `Love ${template.business_name}?` : 'Loving this website?'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Make it yours in 60 seconds — completely free. Sign up and start customizing.
                </p>

                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#8A63D2] hover:bg-[#7c59bd] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 text-[15px]"
                >
                  <Sparkles size={16} />
                  {claiming ? 'Setting up...' : session ? 'Make It Yours — Free' : '✨ Make It Yours — Free'}
                </button>

                {!session && (
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Already have an account?{' '}
                    <Link href={`/sign-in?redirect=${encodeURIComponent(`/claim/${shareId}/activate`)}`} className="text-[#8A63D2] font-medium hover:underline">
                      Log in
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE BOTTOM BAR (always visible on mobile, hidden when popup is open) ─── */}
      {!showPopup && (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-3">
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#8A63D2] hover:bg-[#7c59bd] text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-60"
          >
            <Sparkles size={16} />
            {claiming ? 'Setting up...' : '✨ Make It Yours — Free'}
          </button>
        </div>
      )}
    </div>
  );
}
