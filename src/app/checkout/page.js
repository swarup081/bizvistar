'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqSection from '@/components/checkout/FaqSection';
import StateSelector from '@/components/checkout/StateSelector';
import { AnimatePresence, motion } from 'framer-motion';
import { saveBillingDetailsAction, createSubscriptionAction } from '@/app/actions/razorpayActions';
import { getStandardPlanId } from '@/app/config/razorpay-config';

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
  const finalPrice = isYearly ? monthlyRate * 12 : monthlyRate;

  // Resolve Standard Plan ID immediately
  const standardPlanId = getStandardPlanId(planName, billingCycle);

  // --- Styling Logic ---
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
  };

  const handleStateChange = (stateValue) => {
      setFormData(prev => ({ ...prev, state: stateValue }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    if (!standardPlanId) {
        setErrorMessage("Invalid Plan Selected. Please go back and select a plan again.");
        setIsProcessing(false);
        return;
    }

    try {
        // 1. Save Billing Details
        const billingPayload = {
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zip,
            country: formData.country,
            phoneNumber: formData.phoneNumber,
            companyName: addCompanyDetails ? formData.companyName : null,
            gstNumber: addCompanyDetails ? formData.gstNumber : null
        };

        const saveRes = await saveBillingDetailsAction(billingPayload);
        if (!saveRes.success) {
            throw new Error(saveRes.error || "Failed to save billing details.");
        }

        // 2. Create Subscription
        // SECURITY: We pass planName and billingCycle, NOT the ID.
        // The server resolves the ID internally to prevent manipulation.
        const subRes = await createSubscriptionAction(planName, billingCycle, promoCode);
        if (!subRes.success) {
            throw new Error(subRes.error || "Failed to initiate subscription.");
        }

        // 3. Open Razorpay
        const options = {
            "key": subRes.keyId,
            "subscription_id": subRes.subscriptionId,
            "name": "BizVistar",
            "description": `${planName} Plan - ${billingCycle}`,
            "image": "https://bizvistar.com/logo.png", // Or local logo path if valid url
            "handler": function (response) {
                // Success Callback
                // The webhook will handle the backend state.
                // We can redirect the user to a success page or dashboard.
                // We could explicitly call a verification action here if we wanted immediate UI feedback,
                // but usually redirecting is enough.
                router.push('/dashboard?payment_success=true');
            },
            "prefill": {
                "name": billingPayload.fullName,
                "email": "", // Ideally we should fetch user email from auth context or let Rzp handle it
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
             setErrorMessage(`Payment Failed: ${response.error.description}`);
             setIsProcessing(false);
        });
        rzp1.open();

    } catch (err) {
        console.error(err);
        setErrorMessage(err.message);
        setIsProcessing(false); // Stop loading if error occurred before modal open
    }
  };


  // --- Summary Calculations ---
  const planLabel = isYearly ? '12-month plan' : 'Monthly plan';
  let totalStruckVal = planStruckPrice || finalPrice;
  FREE_ITEMS_CONFIG.forEach(item => {
     if (item.isFixed) {
        totalStruckVal += item.yearlyStruck;
     } else {
        totalStruckVal += isYearly ? item.yearlyStruck : item.monthlyStruck;
     }
  });
  const formattedTotalStruck = formatCurrency(totalStruckVal);
  const formattedPrice = formatCurrency(finalPrice);
  const formattedPlanStruck = planStruckPrice ? formatCurrency(planStruckPrice) : null;


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
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
                        {errorMessage}
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
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                        <div className="flex">
                            <div className="relative w-1/3 sm:w-1/4">
                                <select 
                                    className="w-full p-3 border border-gray-300 rounded-l-md appearance-none bg-white focus:ring-1 focus:ring-purple-500 outline-none"
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
                                className="w-full p-3 border border-gray-300 border-l-0 rounded-r-md focus:ring-1 focus:ring-purple-500 outline-none"
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
                            <StateSelector
                                value={formData.state}
                                onChange={handleStateChange}
                                error={false}
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
                        <label className="flex items-center space-x-3 cursor-pointer group">
                             <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={addCompanyDetails}
                                    onChange={(e) => setAddCompanyDetails(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all hover:border-purple-500 checked:bg-purple-600 checked:border-purple-600"
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
                        disabled={isProcessing}
                        className="w-full sm:w-auto px-9 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-lg font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
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
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                            <span className="block text-sm text-gray-400 line-through">{formattedTotalStruck}</span>
                            <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
                         </div>
                    </div>
                </div>

                <div className="space-y-4">
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
                                    {/* For logic, the coupon is applied at payment time in the backend action.
                                        We could add a 'Check' button that hits an API, but prompt didn't strictly ask for pre-check.
                                        We will just let them enter it and it will apply on payment.
                                    */}
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
