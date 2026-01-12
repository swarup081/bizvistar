'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqSection from '@/components/checkout/FaqSection';
import { AnimatePresence, motion } from 'framer-motion';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
                        <div className="flex">
                            <div className="relative w-1/3 sm:w-1/4">
                                <select 
                                    className="w-full p-3 border  border-gray-300 rounded-l-md appearance-none bg-white focus:ring-1 focus:ring-purple-500 outline-none"
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
                            <div className="relative">
                                <select 
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:ring-1 focus:ring-purple-500 outline-none"
                                    required
                                >
                                    <option value="" disabled>Select State</option>
<option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
<option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Arunachal Pradesh">Arunachal Pradesh</option>
<option value="Assam">Assam</option>
<option value="Bihar">Bihar</option>
<option value="Chandigarh">Chandigarh</option>
<option value="Chhattisgarh">Chhattisgarh</option>
<option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
<option value="Delhi">Delhi</option>
<option value="Goa">Goa</option>
<option value="Gujarat">Gujarat</option>
<option value="Haryana">Haryana</option>
<option value="Himachal Pradesh">Himachal Pradesh</option>
<option value="Jammu and Kashmir">Jammu and Kashmir</option>
<option value="Jharkhand">Jharkhand</option>
<option value="Karnataka">Karnataka</option>
<option value="Kerala">Kerala</option>
<option value="Ladakh">Ladakh</option>
<option value="Lakshadweep">Lakshadweep</option>
<option value="Madhya Pradesh">Madhya Pradesh</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Manipur">Manipur</option>
<option value="Meghalaya">Meghalaya</option>
<option value="Mizoram">Mizoram</option>
<option value="Nagaland">Nagaland</option>
<option value="Odisha">Odisha</option>
<option value="Puducherry">Puducherry</option>
<option value="Punjab">Punjab</option>
<option value="Rajasthan">Rajasthan</option>
<option value="Sikkim">Sikkim</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Telangana">Telangana</option>
<option value="Tripura">Tripura</option>
<option value="Uttar Pradesh">Uttar Pradesh</option>
<option value="Uttarakhand">Uttarakhand</option>
<option value="West Bengal">West Bengal</option>
                                    {/* Add more states as needed */}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
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
                        className="w-full sm:w-auto px-9 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg shadow-md transition-colors"
                    >
                        Continue 
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
                                    <button className="px-4 py-2 border border-purple-600 text-purple-600 font-semibold rounded-md hover:bg-purple-50">
                                        Apply
                                    </button>
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
