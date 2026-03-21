'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Check, X, Tag, ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqSection from '@/components/checkout/FaqSection';
import StateSelector from '@/components/checkout/StateSelector';
import ErrorDialog from '@/components/checkout/ErrorDialog';
import { AnimatePresence, motion } from 'framer-motion';
import { createSubscriptionAction, verifyPaymentAction } from '@/app/actions/razorpayActions';
import { getStandardPlanId } from '@/app/config/razorpay-config';
import { validateCouponAction } from '@/app/actions/razorpayActions';
import { supabase } from '@/lib/supabaseClient';

// --- CONFIGURATION ---

const PLAN_DETAILS = {
  'Starter': { monthly: 299 },
  'Pro': { monthly: 799 },
  'Growth': { monthly: 1499 },
};

const FREE_ITEMS_CONFIG = [
  { 
    id: 'hosting',
    name: 'Hosting', 
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
  const router = useRouter();
  
  // URL Params
  const planName = searchParams.get('plan') || 'Pro';
  const billingCycle = searchParams.get('billing') || 'monthly';
  
  // Ignore URL price, fetch from config
  const isYearly = billingCycle === 'yearly';
  const planBase = PLAN_DETAILS[planName] || { monthly: 0 };
  
  // Calculate price from trusted config
  const monthlyRate = planBase.monthly;
  const basePrice = isYearly ? monthlyRate * 12 : monthlyRate;

  // Resolve Standard Plan ID immediately
  const standardPlanId = getStandardPlanId(planName, billingCycle);

  // --- Styling Logic & Calculations ---
  const planLabel = isYearly ? '12-month plan' : 'Monthly plan';
  let planStruckPrice = null;

  if (isYearly) {
    planStruckPrice = planBase.monthly * 12;
  }

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
    email: '', 
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
  
  // Coupon State
  const [showPromo, setShowPromo] = useState(false); 
  const [promoCode, setPromoCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); 
  const [appliedCoupon, setAppliedCoupon] = useState(null); 

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Dialog State
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ title: '', message: '', actionLabel: '', onAction: null });

  // --- Summary Calculations ---
  
  // Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.percentOff) {
      const calculatedDiscount = (basePrice * appliedCoupon.percentOff) / 100;
      discountAmount = calculatedDiscount;
      
      // Apply Max Cap if exists
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
          discountAmount = appliedCoupon.maxDiscount;
      }
  }

  // Calculate Struck values for free items
  let totalFreeItemsVal = 0;
  FREE_ITEMS_CONFIG.forEach(item => {
     if (item.isFixed) {
        totalFreeItemsVal += item.yearlyStruck;
     } else {
        totalFreeItemsVal += isYearly ? item.yearlyStruck : item.monthlyStruck;
     }
  });

  // FIX: Use 'basePrice' (Number) instead of 'planBase' (Object) for total calculation
  const totalStruckVal = basePrice + totalFreeItemsVal;
  
  const formattedTotalStruck = formatCurrency(totalStruckVal);
  
  let finalPrice = Math.max(0, basePrice - discountAmount);
  const formattedBasePrice = formatCurrency(basePrice);

  // Dynamic Plan Row Price Display
  let planDisplayStruck = isYearly ? (planBase.monthly * 12) : null;
  let planDisplayMain = basePrice;
  let isFounder = appliedCoupon?.code === 'FOUNDER';
  let isFreeTrial = appliedCoupon?.code === 'FREETRIAL';

  if (discountAmount > 0) {
      planDisplayStruck = basePrice;
      planDisplayMain = finalPrice;
  }
  
  // FIX: Explicitly handle Free Trial -> 0
  if (isFreeTrial) {
      planDisplayStruck = basePrice;
      planDisplayMain = 0;
      finalPrice = 0;
  }

  // FIX: Explicitly handle Founder Prices
  if (isFounder) {
      let founderPriceVal = basePrice;
      // Map Plans: Starter(299)->149, Pro(799)->399, Growth(1499)->749
      if (planName === 'Starter') founderPriceVal = 149;
      else if (planName === 'Pro') founderPriceVal = 399;
      else if (planName === 'Growth') founderPriceVal = 749;
      
      // If Yearly, just multiply by 12? Or assume fixed?
      // "Founder plan is 1 year access".
      // Usually Founder price given (399) is per month equivalent billing or lump sum?
      // The prompt said "399 instead of 799" which are monthly rates.
      // If billing is yearly, base is 799*12=9588. Founder would be 399*12=4788.
      if (isYearly) {
          founderPriceVal = founderPriceVal * 12;
      }

      planDisplayStruck = basePrice;
      planDisplayMain = founderPriceVal;
      // Note: finalPrice for subtotal row should also reflect this logic if we want consistency,
      // but 'finalPrice' is calculated from discount. 
      // Founder is a Plan Swap, not a % discount in the standard flow, 
      // so we override finalPrice for display.
      finalPrice = founderPriceVal;
  }

  const formattedPlanDisplayStruck = planDisplayStruck ? formatCurrency(planDisplayStruck) : null;
  const formattedPlanDisplayMain = formatCurrency(planDisplayMain);
  const formattedPrice = formatCurrency(finalPrice);
  const formattedDiscount = formatCurrency(discountAmount);


  // --- Auth Check ---
  useEffect(() => {
    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Redirect to sign in, preserving current checkout state via redirect param
                const currentPath = window.location.pathname + window.location.search;
                router.push(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
            } else {
                // User is authenticated, fetch pre-fill data
                setIsCheckingAuth(false);
                fetchProfileData(user.id, user.email);
            }
        } catch (error) {
            console.error("Auth check failed", error);
             // Safe fallback: redirect
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
        }
    };

    const fetchProfileData = async (userId, authEmail) => {
        try {
            // 1. Fetch Profile Data
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, billing_address')
                .eq('id', userId)
                .single();

            // 2. Try fetching Onboarding Data (for phone, business name fallback)
            let onboardingData = null;
            const { data: websites } = await supabase
                .from('websites')
                .select('id')
                .eq('user_id', userId)
                .limit(1);
            if (websites && websites.length > 0) {
                const { data: obData } = await supabase
                    .from('onboarding_data')
                    .select('owner_name, whatsapp_number')
                    .eq('website_id', websites[0].id)
                    .single();
                onboardingData = obData;
            }

            // 3. Merge Data Priority: Profile.billing > Onboarding > User
            let merged = {
                firstName: '',
                lastName: '',
                email: authEmail,
                phoneNumber: '',
                companyName: ''
            };

            // Apply Onboarding Fallbacks
            if (onboardingData) {
                merged.phoneNumber = onboardingData.whatsapp_number || '';
                merged.companyName = onboardingData.owner_name || '';
                const [fn, ...ln] = (onboardingData.owner_name || '').split(' ');
                merged.firstName = fn || '';
                merged.lastName = ln.join(' ') || '';
            }

            // Apply Profile full_name
            if (profile && profile.full_name) {
                const [fn, ...ln] = profile.full_name.split(' ');
                merged.firstName = fn || merged.firstName;
                merged.lastName = ln.join(' ') || merged.lastName;
            }

            // Apply Profile Billing details (Highest Priority)
            if (profile && profile.billing_address) {
                const b = profile.billing_address;
                if (b.fullName) {
                    const [fn, ...ln] = b.fullName.split(' ');
                    merged.firstName = fn || merged.firstName;
                    merged.lastName = ln.join(' ') || merged.lastName;
                }
                
                setFormData(prev => ({
                    ...prev,
                    firstName: merged.firstName,
                    lastName: merged.lastName,
                    email: b.email || merged.email,
                    address: b.address || prev.address,
                    city: b.city || prev.city,
                    state: b.state || prev.state,
                    zip: b.zipCode || prev.zip,
                    phoneNumber: b.phoneNumber || merged.phoneNumber,
                    companyName: b.companyName || merged.companyName,
                    gstNumber: b.gstNumber || prev.gstNumber
                }));
                if (b.companyName) setAddCompanyDetails(true);
            } else {
                setFormData(prev => ({
                    ...prev,
                    firstName: merged.firstName,
                    lastName: merged.lastName,
                    email: merged.email,
                    phoneNumber: merged.phoneNumber,
                    companyName: merged.companyName
                }));
            }
        } catch (err) {
            console.error("Failed to fetch profile data", err);
            if (authEmail) setFormData(prev => ({ ...prev, email: authEmail }));
        }
    };

    checkUser();
  }, [router]);


  // --- Load Razorpay Script ---
  useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
          document.body.removeChild(script);
      };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStateChange = (stateValue) => {
      setFormData(prev => ({ ...prev, state: stateValue }));
      if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: null }));
  };

  const validateForm = () => {
      const errors = {};
      
      // Required Fields
      if (!formData.firstName.trim()) errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) errors.email = "Email is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state) errors.state = "State is required";
      
      // Strict Validations
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
          errors.phoneNumber = "Phone number must be exactly 10 digits";
      }

      const zipRegex = /^\d{6}$/;
      if (!zipRegex.test(formData.zip)) {
          errors.zip = "ZIP code must be exactly 6 digits";
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = async (e) => {
      e.preventDefault();
      if (!promoCode.trim()) return;

      setCouponStatus('loading');
      setErrorMessage('');

      try {
          const res = await validateCouponAction(promoCode);
          if (res.valid) {
              setCouponStatus('valid');
              setAppliedCoupon({
                  code: promoCode,
                  description: res.description,
                  type: res.type,
                  percentOff: res.percentOff,
                  maxDiscount: res.maxDiscount
              });
              setPromoCode(''); // clear input on success
          } else {
              setCouponStatus('invalid');
              // Optionally show error message from backend
              if (res.message) setErrorMessage(res.message);
          }
      } catch (err) {
          setCouponStatus('invalid');
          // setAppliedCoupon(null);
      }
  };

  const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponStatus(null);
      setPromoCode('');
      setErrorMessage('');
  };


  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // 1. Validate Form Client-side
    if (!validateForm()) {
        setErrorMessage("Please fix the highlighted errors before continuing.");
        return;
    }

    setIsProcessing(true);

    if (!standardPlanId) {
        setErrorMessage("Invalid Plan Selected. Please go back and select a plan again.");
        setIsProcessing(false);
        return;
    }

    try {
        // --- AUTH: Get Access Token ---
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
             router.push('/sign-in');
             throw new Error("Session expired. Please sign in again.");
        }
        const accessToken = session.access_token;

        // 2. Save Billing Details (DIRECTLY via Client Supabase for RLS)
        const billingPayload = {
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email, // Added Email
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zip,
            country: formData.country,
            phoneNumber: formData.phoneNumber,
            companyName: addCompanyDetails ? formData.companyName : null,
            gstNumber: addCompanyDetails ? formData.gstNumber : null
        };
        
        // Use server action to ensure email saves to profile if RLS allows or via admin
        // We use saveBillingDetailsAction which uses admin client now or checks auth
        const saveRes = await supabase
            .from('profiles')
            .update({
                billing_address: billingPayload,
                full_name: billingPayload.fullName
            })
            .eq('id', session.user.id);

        if (saveRes.error) {
             throw new Error("Failed to save billing details. Please try again.");
        }

        // 3. Create Subscription (Pass Token for Auth)
        const codeToSend = appliedCoupon ? appliedCoupon.code : '';
        
        // Pass accessToken to Server Action to verify user
        const subRes = await createSubscriptionAction(planName, billingCycle, codeToSend, accessToken);
        
        if (!subRes.success) {
            const err = subRes.error || "Failed to initiate subscription.";
            if (err.includes("Unauthorized")) {
                 router.push('/sign-in');
                 throw new Error("Session expired. Please sign in again.");
             }
             
             // Check for "Already has plan" or specific errors to show Dialog
             if (err.includes("already have an active plan") || err.includes("upgrade")) {
                 setDialogConfig({
                     title: "Subscription Active",
                     message: "You already have an active subscription. Do you want to view your current plan in the dashboard?",
                     actionLabel: "Go to Dashboard",
                     onAction: () => router.push('/dashboard')
                 });
                 setShowErrorDialog(true);
                 setIsProcessing(false);
                 return; // Stop flow
             }

            throw new Error(err);
        }

        // 4. Open Razorpay
        const options = {
            "key": subRes.keyId, 
            "subscription_id": subRes.subscriptionId,
            "name": "BizVistar",
            "description": `${planName} Plan - ${billingCycle}`,
            "image": "https://bizvistar.com/logo.png", 
            "handler": async function (response) {
                // Verify payment server-side before redirecting
                try {
                     const verification = await verifyPaymentAction(
                         response.razorpay_payment_id,
                         response.razorpay_subscription_id,
                         response.razorpay_signature
                     );
                     
                     if (verification.success) {
                        const isUpdate = searchParams.get('update') === 'true';
                        let url = `/dashboard?payment_success=true&sub_id=${response.razorpay_subscription_id}&pay_id=${response.razorpay_payment_id}`;
                        if (isUpdate) url += '&update=true';
                        router.push(url); 
                     } else {
                        const contactNumber = process.env.NEXT_PUBLIC_CONTACT_FOUNDER || '919560411266';
                        setDialogConfig({
                            title: "Payment Verification Failed",
                            message: "We received your payment but couldn't verify it instantly. If money was deducted, please contact the founder on WhatsApp immediately.",
                            actionLabel: "Contact on WhatsApp",
                            onAction: () => window.open(`https://wa.me/${contactNumber}?text=I paid for a subscription but verification failed.`, '_blank')
                        });
                        setShowErrorDialog(true);
                        setIsProcessing(false);
                     }
                } catch (verifyErr) {
                    const contactNumber = process.env.NEXT_PUBLIC_CONTACT_FOUNDER || '919560411266';
                    setDialogConfig({
                            title: "Verification Error",
                            message: "An error occurred while verifying your payment. If money was deducted, please contact us.",
                            actionLabel: "Contact on WhatsApp",
                            onAction: () => window.open(`https://wa.me/${contactNumber}?text=I paid for a subscription but verification error occurred.`, '_blank')
                    });
                    setShowErrorDialog(true);
                    setIsProcessing(false);
                }
            },
            "prefill": {
                "name": billingPayload.fullName,
                "email": formData.email, 
                "contact": formData.phoneNumber
            },
            "notes": {
                "note_key": "BizVistar Subscription"
            },
            "theme": {
                "color": "#8A63D2"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
             console.error("Razorpay Payment Failed:", response.error);
             setErrorMessage(`Payment Failed: ${response.error.description}`);
             setIsProcessing(false);
        });
        rzp1.open();

    } catch (err) {
        console.error("Payment Initiation Error:", err);
        setErrorMessage(err.message || "An unexpected error occurred during checkout.");
        setIsProcessing(false); 
    }
  };
  
  if (isCheckingAuth) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
      );
  }


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: BILLING FORM --- */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl not-italic font-bold text-gray-900">Billing address</h2>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form id="billing-form" onSubmit={handlePayment} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First name *</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-all", fieldErrors.firstName ? "border-red-500" : "border-gray-300")}
                                required 
                            />
                            {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last name *</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-all", fieldErrors.lastName ? "border-red-500" : "border-gray-300")}
                                required 
                            />
                            {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                        </div>
                    </div>
                    
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email address *</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-500 outline-none transition-all", fieldErrors.email ? "border-red-500" : "border-gray-300")}
                            required 
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
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
                        <div className="flex">
                            <div className="relative w-1/3 sm:w-1/4">
                                <select 
                                    className="w-full p-3 border border-gray-300 rounded-l-md appearance-none bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                                    value={formData.phoneCode}
                                    onChange={handleChange}
                                    name="phoneCode"
                                >
                                    <option value="+91">+91 (India)</option>
                                </select>
                            </div>
                            <input 
                                type="tel" 
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={cn("w-full p-3 border border-l-0 rounded-r-md focus:ring-1 focus:ring-brand-500 outline-none", fieldErrors.phoneNumber ? "border-red-500" : "border-gray-300")}
                                placeholder="0000000000"
                            />
                        </div>
                        {fieldErrors.phoneNumber && <p className="text-xs text-red-500">{fieldErrors.phoneNumber}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Address *</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-500 outline-none", fieldErrors.address ? "border-red-500" : "border-gray-300")}
                                required
                            />
                             {fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">City *</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-500 outline-none", fieldErrors.city ? "border-red-500" : "border-gray-300")}
                                required
                            />
                             {fieldErrors.city && <p className="text-xs text-red-500">{fieldErrors.city}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">State *</label>
                            <StateSelector 
                                value={formData.state} 
                                onChange={handleStateChange}
                                error={!!fieldErrors.state}
                            />
                             {/* Hidden input for HTML5 validation if needed, though we rely on state check */}
                             <input 
                                type="text" 
                                value={formData.state} 
                                className="sr-only" 
                                required 
                                onChange={()=>{}}
                                tabIndex={-1}
                             />
                             {fieldErrors.state && <p className="text-xs text-red-500">{fieldErrors.state}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">ZIP code *</label>
                            <input 
                                type="text" 
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-brand-500 outline-none", fieldErrors.zip ? "border-red-500" : "border-gray-300")}
                                required
                            />
                             {fieldErrors.zip && <p className="text-xs text-red-500">{fieldErrors.zip}</p>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                             <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={addCompanyDetails}
                                    onChange={(e) => setAddCompanyDetails(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all hover:border-[#8A63D2] checked:bg-[#8A63D2] checked:border-[#8A63D2]"
                                />
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                             </div>
                            <span className="text-base font-medium text-gray-700">Add company details</span>
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
                                        className="w-full p-3  border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 py-2">
                                    <label className="text-sm font-semibold text-gray-700">GST number</label>
                                    <input 
                                        type="text" 
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#7554b3] sm:w-auto px-9 py-3 bg-brand-600 hover:bg-[#8a63d2] disabled:bg-brand-400 text-white text-lg font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Continue to Payment'
                        )}
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
                            {formattedPlanDisplayStruck && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                    {formattedPlanDisplayStruck}
                                </span>
                            )}
                            <span className="text-base font-bold text-gray-900">{formattedPlanDisplayMain}</span>
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
                     {/* Discount Row (Green) */}
                     {discountAmount > 0 && appliedCoupon && (
                        <div className="flex justify-between items-center mb-4 text-emerald-600 font-medium">
                            <div className="flex items-center gap-2">
                                <Tag className={cn("w-4 h-4 transition-colors", showPromo ? "text-[#8A63D2]" : "text-gray-700 group-hover:text-[#8A63D2]")} />
                                <span>{appliedCoupon.code} -{appliedCoupon.percentOff}%</span>
                            </div>
                            <span>-{formattedDiscount}</span>
                        </div>
                     )}

                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900">Subtotal</span>
                        <div className="text-right">
                            {/* Struck through TOTAL if discount applied, otherwise existing struck total */}
                            <span className="block text-sm text-gray-400 line-through">
                                {/* Requirement: "Total cutoff should be the total of all base" => (Plan Base Struck + All Free Items) */}
                                {formattedTotalStruck} 
                            </span>
                            <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
                         </div>
                    </div>
                    
                    {/* Free Trial Note */}
                    {appliedCoupon?.code === 'FREETRIAL' && (
                         <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
                             <Check className="w-4 h-4" />
                             Free for the first month
                         </div>
                    )}

                    {/* Founder Plan Note */}
                    {isFounder && (
                        <div className="mt-2 p-3 bg-brand-50 border border-brand-100 rounded-md text-sm text-brand-700">
                             <strong>Founder Access:</strong> Valid for 1 year. Subscription ends after 1 year and requires re-registration.
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                     {/* Coupon Toggle Header */}
                    <button
                        type="button"
                        onClick={() => setShowPromo(!showPromo)}
                        className="group flex items-center gap-2 font-semibold transition-colors w-full"
                    >
                        <Tag className="w-4 h-4" />
                        <span className={cn("transition-colors", showPromo ? "text-[#8A63D2]" : "text-[#a28ad6] group-hover:text-[#8A63D2]")}>
                          Have a coupon code?
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform ml-auto", showPromo ? "rotate-180" : "")} />
                    </button>
                    
                    <AnimatePresence>
                        {(showPromo || appliedCoupon) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2">
                                    {appliedCoupon ? (
                                        <div className="bg-gray-100 rounded-md p-3 flex justify-between items-center">
                                            <div className="font-mono font-bold text-gray-700">{appliedCoupon.code}</div>
                                            <button onClick={removeCoupon} className="text-gray-500 hover:text-red-500">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <input 
                                                type="text" 
                                                className={cn("w-full p-3 border rounded-md focus:outline-[#8a63d2] focus:border-brand-500 transition-colors", couponStatus === 'invalid' ? "border-red-500 bg-red-50" : "border-gray-300")}
                                                placeholder="Code"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value);
                                                    setCouponStatus(null);
                                                }}
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                disabled={couponStatus === 'loading' || !promoCode}
                                                className="px-6 py-3 bg-[#8a63d2]  border-brand-600 text-[#fff] font-semibold rounded-md hover:bg-brand-50 "
                                            >
                                                {couponStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                    )}
                                    {couponStatus === 'invalid' && <p className="text-sm text-red-600 mt-1">{errorMessage || "Invalid Coupon Code"}</p>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

             </div>

       
        </div>

      </div>

      {/* --- FAQ SECTION --- */}
      <div className="mt-20 border-t border-gray-200 pt-16">
         <FaqSection pageType="checkout" />
      </div>
      
      {/* Error Dialog */}
      <ErrorDialog 
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title={dialogConfig.title}
        message={dialogConfig.message}
        primaryActionLabel={dialogConfig.actionLabel}
        onPrimaryAction={dialogConfig.onAction}
      />

    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="max-w-4xl mx-auto px-4 md:px-0 pt-8 pb-12 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="text-center mb-12 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative items-start">
                        {/* Left Side: Order Summary Skeleton */}
                        <div className="md:col-span-5 md:sticky md:top-8 w-full order-1 md:order-none">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
                                <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                                <div className="space-y-4 mb-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                                <div className="h-3 w-16 bg-gray-100 rounded"></div>
                                            </div>
                                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 space-y-3">
                                    <div className="flex justify-between"><div className="h-4 w-16 bg-gray-200 rounded"></div><div className="h-4 w-12 bg-gray-200 rounded"></div></div>
                                    <div className="flex justify-between"><div className="h-4 w-16 bg-gray-200 rounded"></div><div className="h-4 w-12 bg-gray-200 rounded"></div></div>
                                    <div className="border-t border-gray-100 mt-2 pt-4 flex justify-between"><div className="h-5 w-20 bg-gray-200 rounded"></div><div className="h-5 w-16 bg-gray-200 rounded"></div></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details Form Skeleton */}
                        <div className="md:col-span-7 space-y-8 order-2 md:order-none">
                            <div className="space-y-4">
                                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-md"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-md"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-md"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-md"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-12 w-full bg-gray-200 rounded-md"></div>
                                    <div className="h-12 w-full bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                            <div className="h-14 w-full bg-gray-300 rounded-lg mt-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}

