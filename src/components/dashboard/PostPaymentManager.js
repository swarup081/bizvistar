'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { getSlugSuggestions, updateSiteSlug } from '@/app/actions/websiteActions';
import { Loader2, Check, AlertCircle, ChevronRight } from 'lucide-react';

// --- UI Components ---

const ModalOverlay = ({ children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    {children}
  </div>
);

const ModalContent = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 ${className}`}>
    {children}
  </div>
);

export default function PostPaymentManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState('idle'); // idle, checking, slug-selection, success, contact-founder
  const [website, setWebsite] = useState(null);
  const [intendedSlug, setIntendedSlug] = useState('');
  
  // Slug Selection State
  const [customSlug, setCustomSlug] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedPlanName, setUpdatedPlanName] = useState('');

  useEffect(() => {
    const checkPaymentFlow = async () => {
      const isPaymentSuccess = searchParams.get('payment_success') === 'true';
      const isUpdate = searchParams.get('update') === 'true';
      
      if (!isPaymentSuccess) return;

      // If this is just a plan update, we don't need to do slug checks
      if (isUpdate) {
        setStatus('checking');
        
        // Fetch the new plan name to show in the success modal
        const subId = searchParams.get('sub_id');
        if (subId) {
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('plans(name)')
                .eq('razorpay_subscription_id', subId)
                .single();
            if (sub && sub.plans) {
                setUpdatedPlanName(sub.plans.name.replace(/ yearly| monthly/gi, ''));
            }
        }
        
        setStatus('success-update');
        return;
      }

      setStatus('checking');

      try {
        // 1. Get User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; 

        // 2. Get Website
        const { data: site } = await supabase
            .from('websites')
            .select('id, site_slug, is_published')
            .eq('user_id', user.id)
            .single();

        if (!site) {
             setStatus('contact-founder');
             return;
        }

        setWebsite(site);

        // 3. Check Logic
        // Read intent from localStorage
        const storedIntended = localStorage.getItem('intendedSlug');
        const siteCreatedWithFallback = localStorage.getItem('siteCreatedWithFallback') === 'true';
        
        // Check if current slug is NOT the intended one (it shouldn't be if fallback was used)
        // Also ensure storedIntended is valid and distinct
        if (storedIntended && siteCreatedWithFallback && site.site_slug !== storedIntended) {
             // Double check if current slug matches a fallback pattern (contains intended + dash + numbers)
             // or just trust the flag.
             setIntendedSlug(storedIntended);
             setCustomSlug(storedIntended); // Pre-fill
             setStatus('slug-selection');
             fetchSuggestions(storedIntended);
             return;
        }
        
        // If we are here, either:
        // A) siteCreatedWithFallback is false (Clean slug secured initially)
        // B) site.site_slug ALREADY matches storedIntended (Maybe user refreshed?)
        // C) No stored intent (legacy or cross-device)
        
        // In all these cases, we show Success.
        setStatus('success');
        
      } catch (err) {
        console.error("Post Payment Check Error", err);
        setStatus('contact-founder');
      }
    };

    checkPaymentFlow();
  }, [searchParams]);

  const fetchSuggestions = async (base) => {
      setSuggestionsLoading(true);
      try {
          const sugs = await getSlugSuggestions(base);
          setSuggestions(sugs);
      } catch (e) {
          console.error(e);
      } finally {
          setSuggestionsLoading(false);
      }
  };

  const handleUpdateSlug = async () => {
      if (!customSlug) return;
      setIsUpdating(true);
      setUpdateError('');
      
      try {
          const res = await updateSiteSlug(customSlug);
          if (res.success) {
              setWebsite(prev => ({ ...prev, site_slug: res.slug }));
              setStatus('success');
              // Clear intent
              localStorage.removeItem('intendedSlug');
              localStorage.removeItem('siteCreatedWithFallback');
          } else {
              setUpdateError(res.message || "Failed to update slug.");
          }
      } catch (err) {
          setUpdateError("An unexpected error occurred.");
      } finally {
          setIsUpdating(false);
      }
  };
  
  const handleClose = () => {
       // Remove query params
       const newUrl = window.location.pathname;
       router.replace(newUrl);
       setStatus('idle');
  };

  if (status === 'idle' || status === 'checking') return null;

  // --- RENDERERS ---

  if (status === 'contact-founder') {
      const contactNumber = process.env.NEXT_PUBLIC_CONTACT_FOUNDER || '919560411266'; // Default fallback or use env
      return (
          <ModalOverlay>
              <ModalContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                  <p className="text-gray-600 mb-6">
                      We noticed a payment attempt but couldn't verify your subscription or website details immediately.
                  </p>
                  <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      If you have paid and are seeing this message, please contact the founder immediately.
                  </p>
                  
                  <div className="space-y-3">
                      <a 
                        href={`https://wa.me/${contactNumber}?text=I paid for a subscription but am facing an issue.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                      >
                          Contact on WhatsApp
                      </a>
                      <button 
                        onClick={handleClose}
                        className="block w-full py-3 text-gray-500 hover:text-gray-700 font-medium"
                      >
                          Close
                      </button>
                  </div>
              </ModalContent>
          </ModalOverlay>
      );
  }

  if (status === 'slug-selection') {
      return (
          <ModalOverlay>
              <ModalContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your link</h2>
                  <p className="text-gray-600 mb-6">
                      The name <span className="font-semibold text-gray-900">"{intendedSlug}"</span> is already taken. Please choose an alternative or create your own.
                  </p>

                  <div className="space-y-4 mb-6">
                      {suggestionsLoading ? (
                          <div className="flex items-center gap-2 text-gray-500">
                              <Loader2 className="w-4 h-4 animate-spin" /> Loading suggestions...
                          </div>
                      ) : (
                          <div className="grid gap-2">
                              {suggestions.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setCustomSlug(s)}
                                    className={`text-left px-4 py-3 rounded-lg border transition-all ${
                                        customSlug === s 
                                            ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                                            : 'border-gray-200 hover:border-gray-400 text-gray-700'
                                    }`}
                                  >
                                      {s}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Or type your own:</label>
                      <div className="flex items-center">
                          <input 
                              type="text" 
                              value={customSlug}
                              onChange={(e) => {
                                  setCustomSlug(e.target.value);
                                  setUpdateError('');
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                              placeholder="my-awesome-site"
                          />
                      </div>
                      {updateError && <p className="text-red-500 text-sm mt-2">{updateError}</p>}
                  </div>

                  <button 
                      onClick={handleUpdateSlug}
                      disabled={isUpdating || !customSlug}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                      {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                      Claim & Publish
                  </button>
              </ModalContent>
          </ModalOverlay>
      );
  }

  if (status === 'success') {
      const siteUrl = website ? `${website.site_slug}.bizvistaar.com` : 'your-site.bizvistaar.com'; 
      
      return (
          <ModalOverlay>
              <ModalContent className="p-8 text-center relative overflow-visible">
                  {/* Celebration Icon */}
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">You're Live!</h2>
                  <p className="text-gray-600 mb-8 text-lg">
                      Your website is officially published and live at <span className="font-bold text-gray-900">{website?.site_slug}</span>.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-colors">
                      <div className="flex flex-col text-left">
                          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Public URL</span>
                          <span className="text-gray-900 font-medium truncate max-w-[250px]">{siteUrl}</span>
                      </div>
                      <a 
                        href={`https://${siteUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 group-hover:text-brand-600 transition-colors"
                      >
                         <ChevronRight className="w-5 h-5" />
                      </a>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                      We will connect you in a moment to help you set up your custom domain.
                  </p>

                  <button 
                      onClick={handleClose}
                      className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black shadow-lg hover:shadow-xl transition-all"
                  >
                      Go to Dashboard
                  </button>
              </ModalContent>
          </ModalOverlay>
      );
  }

  if (status === 'success-update') {
      return (
          <ModalOverlay>
              <ModalContent className="p-8 text-center border border-brand-100">
                  <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-brand-100">
                      <div className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                      </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Plan Updated!</h2>
                  <p className="text-gray-600 mb-8 text-lg">
                      Your subscription has been successfully changed to the <span className="font-bold text-brand-700">{updatedPlanName || 'new'}</span> plan.
                  </p>
                  
                  <button 
                      onClick={handleClose}
                      className="block w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                      Continue to Dashboard
                  </button>
              </ModalContent>
          </ModalOverlay>
      );
  }

  return null;
}
