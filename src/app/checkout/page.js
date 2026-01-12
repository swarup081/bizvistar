'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqSection from '@/components/checkout/FaqSection';
import CustomStateSelect from '@/components/checkout/CustomStateSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { createSubscriptionAction, saveBillingDetailsAction, validateCouponAction } from '@/app/actions/paymentActions';

// --- CONFIGURATION ---

const PLAN_DETAILS = {
  'Starter': { monthly: 299 },
  'Pro': { monthly: 799 },
  'Growth': { monthly: 1499 }, // Sometimes called 'Business' in memory, but 'Growth' in page.
};

// Map items to their struck prices.
// If isFixed is true, use same price for both.
// Else, use yearly/monthly distinct values.
const FREE_ITEMS_CONFIG = [
  { 
    id: 'hosting',
    name: 'Hosting', // Will be prefixed dynamically
    yearlyStruck: 5988, 
    monthlyStruck: 499,
    dynamicLabel: true 
  },
  { 
    id: 'support',
    name: 'Priority Support', 
    yearlyStruck: 2400, 
    monthlyStruck: 200 
  },
  { 
    id: 'domain',
    name: 'Custom Domain Connection', 
    yearlyStruck: 999, 
    monthlyStruck: 99 
  },
  { 
    id: 'cloud',
    name: 'Cloud Server Hosting', 
    yearlyStruck: 499, 
    monthlyStruck: 49 
  },
  { 
    id: 'ssl',
    name: 'SSL Security (https)', 
    yearlyStruck: 199, 
    monthlyStruck: 199,
    isFixed: true 
  },
  { 
    id: 'setup',
    name: 'One-Time Setup Fee', 
    yearlyStruck: 999, 
    monthlyStruck: 999,
    isFixed: true 
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planName = searchParams.get('plan') || 'Pro';
  const billingCycle = searchParams.get('billing') || 'monthly'; // 'monthly' | 'yearly'
  const paramPrice = parseFloat(searchParams.get('price') || '0');

  const isYearly = billingCycle === 'yearly';

  // --- Calculate Actual Price ---
  // If yearly, paramPrice is monthly rate (e.g. 666). Total = 666 * 12.
  // If monthly, paramPrice is total (e.g. 799).
  const finalPrice = isYearly ? paramPrice * 12 : paramPrice;

  // --- Calculate Plan Original Price (Struck) ---
  const planBase = PLAN_DETAILS[planName] || { monthly: 0 };
  let planStruckPrice = null;

  if (isYearly) {
    // Yearly Struck = Monthly Rate * 12
    planStruckPrice = planBase.monthly * 12;
  } else {
    // Monthly: User said "no cut anything other", so NO struck price for the plan itself.
    planStruckPrice = null;
  }

  // --- Format Currency Helper ---
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    });
  };

  // --- Form State ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    phoneCode: '+91',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    companyName: '',
    gstNumber: '',
  });

  const [addCompanyDetails, setAddCompanyDetails] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        router.push(`/sign-in?redirect=${returnUrl}`);
      } else {
        setUser(user);
        // Pre-fill email if not already there, or fetch profile
        fetchProfile(user.id);
      }
    };
    checkAuth();
  }, []);

  const fetchProfile = async (userId) => {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profile && profile.billing_address) {
        // Merge saved billing address
        setFormData(prev => ({ ...prev, ...profile.billing_address }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value) => {
    setFormData(prev => ({ ...prev, state: value }));
  };

  const handleApplyCoupon = async () => {
    setCouponError(null);
    setAppliedCoupon(null);
    if (!promoCode.trim()) return;

    try {
        const result = await validateCouponAction(promoCode);
        if (result.valid) {
            setAppliedCoupon(result);
            // Optionally auto-close the input or show success
        } else {
            setCouponError(result.message || 'Invalid Coupon Code');
        }
    } catch (err) {
        setCouponError('Error validating coupon');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
        // 1. Save Billing Details
        await saveBillingDetailsAction(formData);

        // 2. Create Subscription (with coupon if applied)
        const { subscriptionId, keyId, planId } = await createSubscriptionAction(planName, billingCycle, appliedCoupon ? promoCode : null);

        // 3. Load Razorpay
        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        const options = {
            key: keyId,
            subscription_id: subscriptionId,
            name: "BizVistar",
            description: `${planName} Plan (${billingCycle})`,
            handler: function (response) {
                // Success callback
                console.log("Payment Success:", response);
                // Optionally verify signature on backend here or trust webhook
                // For now, redirect to dashboard or success page
                router.push('/dashboard?payment=success');
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: user.email, // Use authenticated email
                contact: `${formData.phoneCode}${formData.phoneNumber}`
            },
            theme: {
                color: "#9333ea" // Purple-600
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (err) {
        console.error("Checkout Error:", err);
        alert("Something went wrong during checkout. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // --- Dates for Legal Text ---
  const today = new Date();
  const renewalDate = new Date(today);
  if (isYearly) {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  } else {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  }
  const formattedRenewalDate = renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const formattedPrice = formatCurrency(finalPrice);
  const formattedPlanStruck = planStruckPrice ? formatCurrency(planStruckPrice) : null;

   // Upper limit for e-mandate
   const eMandateLimit = 15000;
   const formattedLimit = eMandateLimit.toLocaleString('en-IN', {
       style: 'currency',
       currency: 'INR',
       minimumFractionDigits: 0
   });

   const planLabel = isYearly ? '12-month plan' : 'Monthly plan';

   // --- Calculate Total Struck Price for Summary ---
   // Start with Plan Struck (if any, else Plan Actual)
   let totalStruckVal = planStruckPrice || finalPrice;

   // Add up all free items
   FREE_ITEMS_CONFIG.forEach(item => {
     if (item.isFixed) {
        totalStruckVal += item.yearlyStruck;
     } else {
        totalStruckVal += isYearly ? item.yearlyStruck : item.monthlyStruck;
     }
   });

   const formattedTotalStruck = formatCurrency(totalStruckVal);


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: BILLING FORM --- */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Billing Address (Boxed) */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                   
                    <h2 className="text-2xl not-italic font-bold text-gray-900">Billing address</h2>
                </div>

                <form id="billing-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First name *</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder=""
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last name *</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder=""
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Country of residence *</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value="India" 
                                disabled 
                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone number</label>
                        <div className="flex relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-medium">+91</span>
                            </div>
                            <input 
                                type="tel" 
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-3 pl-12 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                placeholder="00000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Address *</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">City *</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">State *</label>
                            <CustomStateSelect
                                value={formData.state}
                                onChange={handleStateChange}
                                error={false} // pass validation error if needed
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">ZIP code *</label>
                            <input 
                                type="text" 
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={addCompanyDetails}
                                onChange={(e) => setAddCompanyDetails(e.target.checked)}
                                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-base font-medium text-gray-700">Add company details</span>
                            <HelpCircle className="w-4 h-4 text-purple-600" />
                        </label>
                    </div>

                    <AnimatePresence>
                        {addCompanyDetails && (
                             <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden"
                             >
                                <div className="space-y-2 py-2">
                                    <label className="text-sm font-semibold text-gray-700">Company name</label>
                                    <input 
                                        type="text" 
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full p-3  border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 py-2">
                                    <label className="text-sm font-semibold text-gray-700">GST number</label>
                                    <input 
                                        type="text" 
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-9 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Continue'}
                    </button>

                </form>
            </div>
            
         

        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                <h3 className="text-2xl not-italic font-bold text-gray-900 mb-2">Order summary</h3>
                <h4 className="text-lg not-italic font-bold text-gray-700 mb-6">{planName}</h4>
                
                <div className="space-y-4 mb-6">
                    {/* Main Plan Row */}
                    <div className="flex justify-between items-baseline">
                         <span className="text-base text-gray-700">{planLabel}</span>
                         <div className="text-right">
                            {planStruckPrice && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                    {formattedPlanStruck}
                                </span>
                            )}
                            <span className="text-base font-bold text-gray-900">{formattedPrice}</span>
                         </div>
                    </div>

                    {/* Free Items Loop */}
                    {FREE_ITEMS_CONFIG.map((item, i) => {
                        const struckVal = item.isFixed 
                            ? item.yearlyStruck 
                            : (isYearly ? item.yearlyStruck : item.monthlyStruck);
                        
                        let displayName = item.name;
                        if (item.dynamicLabel) {
                            displayName = isYearly ? '12 Months Hosting' : ' Hosting';
                        }

                        return (
                            <div key={i} className="flex justify-between items-baseline">
                                <span className="text-base text-gray-700">{displayName}</span>
                                <div className="text-right">
                                    <span className="text-sm text-gray-400 line-through mr-2">
                                        {formatCurrency(struckVal)}
                                    </span>
                                    <span className="text-base font-bold text-gray-900">₹0.00</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                     {appliedCoupon && (
                        <div className="flex justify-between items-baseline mb-2 text-green-600">
                             <span>Coupon ({promoCode})</span>
                             <span>
                                 -{appliedCoupon.discount_type === 'percent' ? `${appliedCoupon.discount_value}%` : `₹${appliedCoupon.discount_value}`}
                             </span>
                        </div>
                     )}
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                            <span className="block text-sm text-gray-400 line-through">{formattedTotalStruck}</span>
                            <span className="text-3xl font-bold text-gray-900">
                                {appliedCoupon ?
                                    (appliedCoupon.discount_type === 'percent'
                                        ? formatCurrency(finalPrice * (1 - appliedCoupon.discount_value/100))
                                        : formatCurrency(Math.max(0, finalPrice - appliedCoupon.discount_value))
                                    )
                                : formattedPrice}
                            </span>
                         </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {!appliedCoupon ? (
                        <>
                            <button
                                onClick={() => setShowPromo(!showPromo)}
                                className="text-purple-600 font-semibold hover:text-purple-700  focus:outline-none"
                            >
                                Have a coupon code?
                            </button>

                            <AnimatePresence>
                                {showPromo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex gap-2 pt-2">
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                                                placeholder="Code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="px-4 py-2 border border-purple-600 text-purple-600 font-semibold rounded-md hover:bg-purple-50"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-200">
                            <span className="text-green-700 font-medium">Code <b>{promoCode}</b> applied</span>
                            <button
                                onClick={() => { setAppliedCoupon(null); setPromoCode(''); }}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

             </div>

       
        </div>

      </div>

      {/* --- FAQ SECTION --- */}
      <div className="mt-20 border-t border-gray-200 pt-16">
         <FaqSection />
      </div>

    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
