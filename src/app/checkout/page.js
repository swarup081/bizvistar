'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ChevronDown, Check } from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

// --- Components ---

const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left text-gray-900"
      >
        <span className="text-lg font-medium text-gray-900">{q}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform duration-300',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-10 text-base text-gray-600 leading-relaxed">
              {typeof a === 'string' ? <p>{a}</p> : a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      q: 'What is a Premium plan?',
      a: 'A Premium plan is a subscription that gives you access to all of BizVistar\'s advanced features, including custom domain connection, removal of BizVistar branding, increased storage, and access to our "Done-for-You" services.'
    },
    {
      q: 'Can I get a refund for a Premium plan?',
      a: 'Yes, we offer a 14-day money-back guarantee on all our annual Premium plans. If you are not satisfied for any reason, you can cancel within 14 days of purchase and receive a full refund, no questions asked.'
    },
    {
      q: 'How do I get my free domain?',
      a: 'A free custom domain for one year is included with the "Growth" annual plan. After you upgrade, you will receive a voucher to claim your free domain, which you can register directly through your BizVistar dashboard.'
    },
     {
      q: 'What online payments are accepted?',
      a: 'We accept all major credit cards (Visa, MasterCard, American Express) as well as UPI, Net Banking, and other popular payment methods for our Indian customers.'
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 mt-16 pt-16 border-t border-gray-200">
      <div className="lg:col-span-1">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600">
          Haven't found what you're looking for? Try the{' '}
          <a href="#" className="text-blue-600 hover:underline">BizVistar Help Center</a>{' '}
          or{' '}
          <a href="#" className="text-blue-600 hover:underline">contact us</a>.
        </p>
      </div>

      <div className="lg:col-span-2">
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Checkout Logic ---

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Params
  const planName = searchParams.get('plan') || 'Starter';
  const billingCycle = searchParams.get('billing') || 'monthly';
  const price = parseFloat(searchParams.get('price') || '299');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    gst: ''
  });

  const [promoCode, setPromoCode] = useState('');

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to sign in with return URL
        const currentPath = window.location.href; // Get full URL including query params
        router.push(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        setLoading(false);
        setFormData(prev => ({ ...prev, email: user.email }));
      }
    };
    checkAuth();
  }, [router, searchParams]);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                 <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 <h2 className="text-xl font-semibold text-gray-700">Loading Checkout...</h2>
            </div>
        </div>
    );
  }

  // Calculate Dates
  const today = new Date();
  const renewalDate = new Date();
  if (billingCycle === 'yearly') {
      renewalDate.setFullYear(today.getFullYear() + 1);
  } else {
      renewalDate.setMonth(today.getMonth() + 1);
  }

  const formattedRenewalDate = renewalDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/">
             <Logo />
          </Link>
          <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Secure Checkout
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN: Billing Details */}
          <div className="lg:col-span-7 space-y-8">
            <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Address</h2>
               <form className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" value={formData.email} disabled />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="123 Business St" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed font-medium" value="India" disabled />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                         <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Maharashtra" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Mumbai" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip / Postal Code</label>
                        <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="400001" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN (Optional)</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="22AAAAA0000A1Z5" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
                 </div>
               </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8">
               <div className="p-8 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
               </div>

               <div className="p-8 space-y-6">
                  {/* Plan Info */}
                  <div className="flex justify-between items-start pb-6 border-b border-gray-100">
                     <div>
                        <p className="font-bold text-lg text-gray-900">{planName} Plan</p>
                        <p className="text-sm text-gray-500 capitalize">{billingCycle} Subscription</p>
                     </div>
                     <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{formattedTotal}</p>
                     </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Have a Promo Code?</label>
                     <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                            Apply
                        </button>
                     </div>
                  </div>

                  {/* Total */}
                   <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                     <p className="font-bold text-xl text-gray-900">Total</p>
                     <div className="text-right">
                        <p className="font-bold text-2xl text-purple-700">{formattedTotal}</p>
                        <p className="text-xs text-gray-400 mt-1">Excludes Taxes</p>
                     </div>
                  </div>

                  {/* Safe & Secure Badge */}
                   <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-100">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-semibold text-sm">Safe & Secure Payment</span>
                   </div>

                  {/* Submit Button */}
                  <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-200 transition-all duration-200 transform hover:-translate-y-0.5">
                      Proceed to Pay
                  </button>

                  {/* Legal Text */}
                  <div className="text-xs text-gray-500 space-y-3 pt-4 border-t border-gray-100 leading-relaxed">
                      <p>
                        By purchasing, you accept the <Link href="/terms" className="underline text-blue-600">Terms and Conditions</Link> and <Link href="/privacy" className="underline text-blue-600">Privacy Policy</Link> and acknowledge reading the Privacy Policy.
                      </p>
                      <p>
                        You also agree to the automatic renewal of your subscription on a {billingCycle} basis for {formattedTotal} starting on {formattedRenewalDate}, which can be disabled at any time through your account. Any eligible tax exemptions and discounts will be applied when you're charged for your next renewal payment.
                      </p>
                      <p>
                        In accordance with RBI guidelines, your card details will be saved securely for future purchases and subscription renewals. An e-mandate will be created for a maximum amount of ₹15,000, but you’ll only be charged the amount of your purchase.
                      </p>
                  </div>

               </div>
            </div>
          </div>

        </div>

        {/* Footer / FAQ */}
        <FaqSection />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
