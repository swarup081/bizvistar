'use client';

import { useState } from 'react';
import { Check, Minus, ChevronDown, ShieldCheck, Heart, Zap, Layers, BarChart2, Headset } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Reusable Icons ---
const CheckMark = () => <div className="flex justify-center"><Check className="w-5 h-5 text-blue-600" strokeWidth={2.5} /></div>;
const Dash = () => <div className="flex justify-center"><Minus className="w-5 h-5 text-gray-300" strokeWidth={2.5} /></div>;

// --- Payment Icons (Professional SVGs) ---
const VisaIcon = () => <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.386 25.105L19.69 16.978H23.906L22.602 25.105H18.386Z" fill="#0A2540"/><path d="M33.492 17.13C33.105 16.978 32.332 16.826 31.344 16.826C28.743 16.826 26.918 18.234 26.918 20.941C26.918 22.88 28.699 23.945 30.117 24.63C31.578 25.352 32.051 25.808 32.051 26.53C32.051 27.633 30.761 28.127 29.516 28.127C28.314 28.127 27.584 27.937 27.069 27.709L26.338 31.127C27.24 31.545 28.872 31.887 30.547 31.887C33.381 31.887 35.272 30.48 35.272 27.594C35.272 25.883 34.198 24.667 32.609 23.907C31.15 23.185 30.591 22.767 30.591 21.893C30.591 21.133 31.45 20.525 32.266 20.525C33.082 20.525 33.597 20.639 33.898 20.791L34.37 18.51L33.492 17.13Z" fill="#0A2540"/><path d="M41.812 16.978H38.505C37.474 16.978 37.216 17.244 36.83 18.232L31.536 31.649H35.962L36.864 29.065H42.412L42.928 31.649H46.922L43.788 16.978H41.812ZM39.622 21.232L41.554 26.708H38.376L39.622 21.232Z" fill="#0A2540"/><path d="M12.387 16.978H8.306C8.048 16.978 7.704 17.054 7.532 17.434L4.31 31.649H8.692L12.387 16.978Z" fill="#0A2540"/><path d="M3.452 16.978L0 17.168L0.516 19.865C0.946 20.967 4.052 25.523 4.052 25.523L4.782 22.255L6.286 16.978H3.452Z" fill="#0A2540"/></svg>;
const MasterCardIcon = () => <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.783 42C21.943 42 25.771 40.413 28.677 37.761C25.811 34.94 24 31.033 24 26.702C24 21.879 26.189 17.563 29.605 14.559C26.639 11.752 22.58 10 18.101 10C9.147 10 1.885 17.346 1.885 26.406C1.885 35.016 8.86 42 17.783 42Z" fill="#FF5F00"/><path d="M34.536 42C43.146 42 50.123 35.016 50.123 26.406C50.123 17.346 42.861 10 33.908 10C29.883 10 26.207 11.413 23.329 13.774C26.67 16.883 28.793 21.388 28.793 26.385C28.793 30.983 26.996 35.161 24.127 38.172C27.002 40.587 30.612 42 34.536 42Z" fill="#EB001B"/><path d="M29.605 14.559C26.189 17.563 24 21.879 24 26.702C24 31.033 25.811 34.94 28.677 37.761C26.996 35.161 28.793 30.983 28.793 26.385C28.793 21.388 26.67 16.883 23.329 13.774C25.394 14.036 27.503 14.29 29.605 14.559Z" fill="#F79E1B"/></svg>;
const UpiIcon = () => (
    <svg className="h-8 w-auto" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="32" rx="4" fill="white"/>
        <path d="M8.5 25.5V8.5L20.5 8.5L20.5 11.5L11.5 11.5V22.5H20.5V25.5H8.5Z" fill="#097939"/>
        <path d="M24.5 8.5H36.5L36.5 11.5L27.5 11.5V15.5H35.5V18.5H27.5V25.5H24.5V8.5Z" fill="#E66D2C"/>
        <path d="M40.5 25.5V8.5L52.5 8.5L52.5 11.5L43.5 11.5V15.5H51.5V18.5H43.5V25.5H40.5Z" fill="#097939"/>
        <path d="M14 14.5L17.5 20.5H10.5L14 14.5Z" fill="#E66D2C"/>
    </svg>
);
// ... (You can add more icons or use an image sprite for "More")

// --- Plan Data (Moved inside component to avoid reference error) ---

export default function PricingPage() {
  const plans = {
    monthly: [
      {
        name: 'Starter',
        subtitle: 'The Digital Business Card',
        price: '299',
        dailyRate: 'Just ₹10 a day',
        cta: 'Get Started',
        isRecommended: false,
        features: [
          'AI-Generated Professional Website',
          'Easy-to-Use Editor',
          'Secure Hosting & Subdomain',
          '1 Business Tool (e.g., Photo Gallery)',
          'Automated Order Emails',
          'Standard Email Support',
        ],
      },
      {
        name: 'Pro',
        subtitle: 'The "Done-with-You" Partner',
        price: '799',
        dailyRate: 'Just ₹26 a day',
        cta: 'Start Your Pro Plan',
        isRecommended: true,
        features: [
          '3 "Done-for-You" Social Media Posts / Month',
          'Instant WhatsApp Order Notifications',
          'Priority WhatsApp Support',
          '2 Advanced Business Tools',
          'Basic Website Analytics',
        ],
      },
      {
        name: 'Growth',
        subtitle: 'The "Done-for-You" Service',
        price: '1499',
        dailyRate: 'Just ₹50 a day',
        cta: 'Go for Growth',
        isRecommended: false,
        features: [
          '8 "Done-for-You" Social Media Posts / Month',
          'Google Maps Management',
          'Access to All Business Tools',
          'Free Custom Domain (First Year)',
          'Priority Onboarding Call',
          'AI Website Analytics',
        ],
      },
    ],
    yearly: [
      {
        name: 'Starter',
        subtitle: 'The Digital Business Card',
        price: '249',
        originalPrice: '299',
        yearlyTotal: 'Billed as ₹2,990 / year',
        savings: 'Save ₹600',
        cta: 'Get Started',
        isRecommended: false,
        features: [
          'AI-Generated Professional Website',
          'Easy-to-Use Editor',
          'Secure Hosting & Subdomain',
          '1 Business Tool (e.g., Photo Gallery)',
          'Automated Order Emails',
          'Standard Email Support',
        ],
      },
      {
        name: 'Pro',
        subtitle: 'The "Done-with-You" Partner',
        price: '666',
        originalPrice: '799',
        yearlyTotal: 'Billed as ₹7,990 / year',
        savings: 'Save ₹1,600',
        cta: 'Start Your Pro Plan',
        isRecommended: true,
        features: [
          '3 "Done-for-You" Social Media Posts / Month',
          'Instant WhatsApp Order Notifications',
          'Priority WhatsApp Support',
          '2 Advanced Business Tools',
          'Website Analytics',
        ],
      },
      {
        name: 'Growth',
        subtitle: 'The "Done-for-You" Service',
        price: '1249',
        originalPrice: '1499',
        yearlyTotal: 'Billed as ₹14,990 / year',
        savings: 'Save ₹3,000',
        cta: 'Go for Growth',
        isRecommended: false,
        features: [
          '8 "Done-for-You" Social Media Posts / Month',
          'Google Maps Management',
          'Access to All Business Tools',
          'Free Custom Domain (First Year)',
          'Priority Onboarding Call',
          'AI Website Analytics',
        ],
      },
    ],
  };

  const [isYearly, setIsYearly] = useState(false); // Default to Monthly
  const activePlans = isYearly ? plans.yearly : plans.monthly;
  const maxSavings = 17; // Hardcoded based on your request "SAVE 17%"

  return (
    <div className="py-20 sm:py-28 bg-white font-sans text-gray-900">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* --- Header & Toggle --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Your Website Looks Amazing!
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Choose a plan to go live and start growing your business. All plans are risk-free. Cancel anytime.
          </p>
          
          {/* --- SLIM & WIDE Toggle --- */}
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
             <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  'px-8 py-2 text-base font-medium rounded-full transition-all duration-200',
                  !isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                Billed monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  'flex items-center px-8 py-2 text-base font-medium rounded-full transition-all duration-200',
                  isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                Billed yearly
                <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  Save {maxSavings}%
                </span>
              </button>
          </div>
        </div>

        {/* --- PRICING CARDS (Pro is LARGER) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
            {activePlans.map((plan, index) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                isYearly={isYearly}
                // Make the middle card (Pro) physically larger
                className={index === 1 ? 'lg:scale-110 lg:-translate-y-4 z-10' : 'lg:scale-100'}
              />
            ))}
        </div>

        {/* --- "Compare Plan Features" Button --- */}
        <div className="mt-20 text-center">
           <Link href="#compare" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
             Compare Plan Features
           </Link>
        </div>

        {/* --- TRUST & ENTERPRISE GRID (Side-by-Side) --- */}
        <div className="max-w-7xl mx-auto mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* LEFT: Trust Badges & Enterprise Offer */}
            <div className="space-y-12">
                 {/* Enterprise Offer (Matches screenshot UI) */}
                 <div className="bg-gray-50 rounded-3xl p-10 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">BizVistar Enterprise solutions</h3>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Launch exceptional sites faster, manage your business better, and work more freely.
                    </p>
                    <Link href="/enterprise">
                        <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors">
                            Book a Call
                        </button>
                    </Link>
                 </div>
                
                {/* Cancel Anytime */}
                <div className="flex gap-5 items-start">
                    <div className="p-3 bg-blue-50 rounded-full">
                        <Heart className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Cancel Anytime</h4>
                        <p className="text-gray-600 leading-relaxed">No contracts, no-hassle. You are in complete control of your subscription.</p>
                    </div>
                </div>
                
                {/* SSL Secure */}
                <div className="flex gap-5 items-start">
                     <div className="p-3 bg-green-50 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">SSL Secure Payment</h4>
                        <p className="text-gray-600 leading-relaxed">Your information is protected by 256-bit SSL encryption.</p>
                    </div>
                </div>

                 {/* Payment Methods */}
                 <div className="pt-8 border-t border-gray-200">
                    <h5 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">ACCEPTED PAYMENT METHODS</h5>
                    <div className="flex items-center gap-6 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                        <VisaIcon />
                        <MasterCardIcon />
                        <UpiIcon />
                        <span className="text-gray-500 font-medium">+ More</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Enterprise Features Grid */}
            <div className="bg-gray-50 rounded-3xl p-10 lg:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                    <div>
                        <Zap className="w-10 h-10 text-purple-600 mb-6" />
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Faster content deployment</h4>
                        <p className="text-gray-600 leading-relaxed">Launch sites at scale with custom templates and reusable components.</p>
                    </div>
                    <div>
                        <Layers className="w-10 h-10 text-purple-600 mb-6" />
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Multi-site management</h4>
                        <p className="text-gray-600 leading-relaxed">Streamline ops with shared assets and centralized billing on one dashboard.</p>
                    </div>
                     <div>
                        <BarChart2 className="w-10 h-10 text-purple-600 mb-6" />
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Custom integrations</h4>
                        <p className="text-gray-600 leading-relaxed">Seamlessly connect the software tools, apps, and APIs your business relies on.</p>
                    </div>
                    <div>
                        <Headset className="w-10 h-10 text-purple-600 mb-6" />
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Dedicated account support</h4>
                        <p className="text-gray-600 leading-relaxed">Get priority support and personalized training for you and your team.</p>
                    </div>
                </div>
            </div>

        </div>

        {/* --- "Compare Plan Features" Section --- */}
        <div id="compare" className="mt-32 scroll-mt-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Compare Plan Features
          </h2>
          <AllFeaturesTable />
        </div>

        {/* --- "Why Choose BizVistaar?" Section --- */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Why Choose BizVistaar?
          </h2>
          <ComparisonTable />
        </div>

        {/* --- FAQ Section --- */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Frequently Asked Questions
          </h2>
          <FaqSection />
        </div>

      </div>
    </div>
  );
}

// --- Sub-component: PlanCard (ENHANCED) ---
const PlanCard = ({ plan, isYearly, className }) => (
  <div 
    className={cn(
      'flex flex-col rounded-3xl bg-white transition-all duration-300 ease-out', 
      plan.isRecommended 
        ? 'border-[3px] border-purple-600 shadow-2xl relative' // Highlighted Pro Plan
        : 'border border-gray-200 shadow-lg hover:shadow-xl',
      className
    )}
  >
    {plan.isRecommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase">
        MOST POPULAR
      </div>
    )}
    
    <div className="p-10 text-center flex-grow flex flex-col">
      <h3 className="text-3xl font-bold text-gray-900">{plan.name}</h3>
      <p className="text-gray-500 font-medium mt-2">{plan.subtitle}</p>

      {/* --- THIS IS THE UPDATED PRICE SECTION --- */}
      <div className="my-8">
        {isYearly && plan.originalPrice && (
          <p className="text-lg font-medium text-gray-400 line-through">
            ₹{plan.originalPrice}/mo
          </p>
        )}

        {/* This is the new one-line price */}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-gray-900">₹</span>
          <span className="text-6xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
          <span className="text-xl font-medium text-gray-500">/month</span>
        </div>

        {/* Yearly Savings Pill (no change) */}
         {isYearly && plan.savings && (
             <div className="mt-4 inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1 rounded-full">
                 {plan.savings}
             </div>
         )}
      </div>
      {/* --- END OF UPDATED PRICE SECTION --- */}

      <Link href="/sign-up" className="w-full">
        <button 
          className={cn(
            'w-full py-4 rounded-full text-xl font-bold transition-all duration-200 transform hover:-translate-y-1',
            plan.isRecommended
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          )}
        >
          {plan.cta}
        </button>
      </Link>
      
       {!isYearly && (
         <p className="text-base font-semibold text-blue-600 mt-4">{plan.dailyRate}</p>
      )}
      {isYearly && (
           <p className="text-sm font-medium text-gray-500 mt-4">{plan.yearlyTotal}</p>
      )}

    </div>
    
    {/* Features List */}
    <div className="p-10 pt-0">
       <div className="border-t border-gray-100 pt-8">
          {/* --- Dynamic Feature Heading --- */}
          {plan.name === 'Starter' && (
            <h4 className="text-base font-semibold text-gray-800 mb-4">Includes:</h4>
          )}
          {plan.name === 'Pro' && (
            <h4 className="text-base font-semibold text-gray-800 mb-4">Everything in Starter, plus:</h4>
          )}
          {plan.name === 'Growth' && (
            <h4 className="text-base font-semibold text-gray-800 mb-4">Everything in Pro, plus:</h4>
          )}
          {/* --- END: Dynamic Feature Heading --- */}
          <ul className="space-y-4">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start text-left">
                <Check className={cn("w-6 h-6 mt-0.5 mr-3 flex-shrink-0", plan.isRecommended ? "text-purple-600" : "text-green-500")} strokeWidth={2.5} />
                <span className="text-gray-700 font-medium text-[15px] leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
       </div>
    </div>
  </div>
);

// --- Sub-component: AllFeaturesTable (Clean & Professional) ---
const AllFeaturesTable = () => (
  <div className="border border-gray-200 rounded-3xl bg-white shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <div className="min-w-[1024px]">
        {/* Header Row */}
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
          <div className="p-6"></div> {/* Empty corner */}
          <div className="p-6 text-center border-l border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
            <p className="text-gray-500 font-medium mt-1">₹299/mo</p>
          </div>
          <div className="p-6 text-center border-l border-gray-200 bg-purple-50">
            <h3 className="text-2xl font-bold text-purple-700">Pro</h3>
            <p className="text-purple-600 font-medium mt-1">₹799/mo</p>
          </div>
          <div className="p-6 text-center border-l border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Growth</h3>
            <p className="text-gray-500 font-medium mt-1">₹1499/mo</p>
          </div>
        </div>

        {/* Feature Rows Container */}
        <div className="divide-y divide-gray-100">
            
          {/* Section: CORE */}
          <div className="bg-gray-50/50 p-4 pl-8 font-bold text-gray-900 text-sm tracking-wider uppercase">CORE PLATFORM</div>
          <FeatureRow feature="AI-Powered Website Builder" starter={true} pro={true} growth={true} />
          <FeatureRow feature="Easy-to-Use Editor" starter={true} pro={true} growth={true} />
          <FeatureRow feature="Secure Web Hosting" starter={true} pro={true} growth={true} />
          <FeatureRow feature="Professional Subdomain" starter={true} pro={true} growth={true} />
          <FeatureRow feature="Free Custom Domain (1st Year)" starter={false} pro={false} growth={true} />

          {/* Section: E-COMMERCE */}
          <div className="bg-gray-50/50 p-4 pl-8 font-bold text-gray-900 text-sm tracking-wider uppercase border-t border-gray-100">BUSINESS & E-COMMERCE</div>
          <FeatureRow feature="Products" starter="10" pro="Unlimited" growth="Unlimited" />
          <FeatureRow feature="Business Tools" starter="1 Tool" pro="2 Tools" growth="All Tools" />
          <FeatureRow feature="Order Dashboard" starter={true} pro={true} growth={true} />
          <FeatureRow feature="Visitor Analytics" starter={false} pro="Basic" growth="Advanced" />

          {/* Section: AUTOMATION */}
          <div className="bg-gray-50/50 p-4 pl-8 font-bold text-gray-900 text-sm tracking-wider uppercase border-t border-gray-100">AUTOMATION</div>
          <FeatureRow feature="Order Confirmation Emails" starter={true} pro={true} growth={true} />
          <FeatureRow feature="Dashboard Order Sound" starter={true} pro={true} growth={true} />
          <FeatureRow feature="WhatsApp Notifications" starter={false} pro={true} growth={true} />

           {/* Section: SERVICES */}
          <div className="bg-gray-50/50 p-4 pl-8 font-bold text-gray-900 text-sm tracking-wider uppercase border-t border-gray-100">DONE-FOR-YOU SERVICES</div>
          <FeatureRow feature="Email Support" starter="Standard" pro="Priority" growth="Priority" />
          <FeatureRow feature="WhatsApp Support" starter={false} pro={true} growth={true} />
          <FeatureRow feature="Social Media Posts" starter={false} pro="3 / mo" growth="8 / mo" />
          <FeatureRow feature="Google Maps Management" starter={false} pro={false} growth={true} />
          <FeatureRow feature="Priority Onboarding Call" starter={false} pro={false} growth={true} />
        </div>
      </div>
    </div>
  </div>
);

// Helper for Feature Rows to keep code clean
const FeatureRow = ({ feature, starter, pro, growth }) => {
    const renderCell = (value, isProCol) => { // <-- FIXED
        if (value === true) return <CheckMark />;
        if (value === false) return <Dash />;
        return <span className={cn("font-semibold", isProCol ? "text-purple-700" : "text-gray-900")}>{value}</span>;
    };

    return (
        <div className="grid grid-cols-4 hover:bg-gray-50 transition-colors">
            <div className="p-5 pl-8 font-medium text-gray-700 flex items-center">{feature}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-100">{renderCell(starter, false)}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-100 bg-purple-50/30">{renderCell(pro, true)}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-100">{renderCell(growth, false)}</div>
        </div>
    );
};

// --- Sub-component: ComparisonTable (Styled to match PDF) ---
// (Re-using the cleaner FeatureRow logic here would be good, but sticking to the requested table structure for now)
const ComparisonTable = () => (
  <div className="overflow-x-auto border border-gray-200 rounded-3xl bg-white shadow-sm">
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          <th className="text-left text-lg font-bold text-gray-900 p-6 w-1/4">Features</th>
          <th className="text-center text-lg font-bold text-gray-900 p-6 border-l border-gray-200">DIY Builders<br/><span className="text-sm font-normal text-gray-500">(Wix/GoDaddy)</span></th>
          <th className="text-center text-lg font-bold text-gray-900 p-6 border-l border-gray-200">Local Agencies</th>
          <th className="text-center text-lg font-bold text-purple-700 p-6 border-l border-gray-200 bg-purple-50">BizVistaar<br/><span className="text-sm font-normal text-purple-600">(Your Partner)</span></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td className="font-semibold p-6 text-gray-700">Who Builds the Site?</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>You Do 100%</strong><br/>You spend 40+ hours learning complex tools.</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>They Do 100%</strong><br/>A full-service, hands-off experience.</td>
          <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>We Do It Together</strong><br/>Our AI builds the site in 60s. You do the fun edits.</td>
        </tr>
        <tr>
          <td className="font-semibold p-6 text-gray-700">Who Manages Socials?</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>You Do 100%</strong><br/>They give you a tool, but you do all the work.</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>They Do It</strong><br/>They create and post for you.</td>
          <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>We Do It (on Pro+)</strong><br/>Our plan includes "done-for-you" posts.</td>
        </tr>
        <tr>
          <td className="font-semibold p-6 text-gray-700">Who Provides Support?</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>A Call Center</strong><br/>You wait in a queue to talk to a stranger.</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>A Dedicated Manager</strong><br/>Great support for a very high price.</td>
          <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>A WhatsApp Partner</strong><br/>Priority support from a local expert.</td>
        </tr>
        <tr>
          <td className="font-semibold p-6 text-gray-700">The Price</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>High Cost + Your Time</strong><br/>(₹800 - ₹2,300/mo)</td>
          <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>Extremely High Cost</strong><br/>(₹10,000 - ₹20,000/mo)</td>
          <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>Simple, Affordable Price</strong><br/>(Just ₹26 a day!)</td>
        </tr>
        <tr>
          <td className="font-bold p-6 text-gray-900">The Verdict</td>
          <td className="text-center p-6 text-gray-500 font-medium border-l border-gray-100">High Effort, Low Support</td>
          <td className="text-center p-6 text-gray-500 font-medium border-l border-gray-100">High Cost, High Service</td>
          <td className="text-center p-6 text-purple-700 font-bold border-l border-gray-100 bg-purple-50/50">Low Cost, High Service</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// --- Sub-component: FaqSection (Clean Accordion) ---
const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left hover:text-purple-600 transition-colors"
      >
        <span className="text-xl font-semibold text-gray-900">{q}</span>
        <ChevronDown
          className={cn('h-6 w-6 text-gray-400 transition-transform duration-300', isOpen ? 'rotate-180 text-purple-600' : '')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pb-6 pr-12 text-lg text-gray-600 leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      q: 'What is a "Done-for-You" Social Media Post?',
      a: 'It means you don\'t have to do anything! Our team will design a professional post, write a compelling caption for it, and post it to your social media (like Instagram or Facebook) for you, 3 times a month on the Pro plan and 8 times a month on the Growth plan.'
    },
    {
      q: 'What is "Priority WhatsApp Support"?',
      a: 'Instead of emailing a support center, Pro and Growth members get a dedicated WhatsApp number. You can send questions, request simple text updates, or ask for help, and a real person who knows your site will get back to you quickly. It\'s like having a tech expert on your team.'
    },
    {
      q: 'Can I cancel my plan anytime?',
      a: 'Yes. All our plans are billed monthly and have no long-term contracts. You can cancel your subscription at any time.'
    },
    {
      q: 'What\'s the difference between a Subdomain and a Custom Domain?',
      a: 'A subdomain (included in all plans) looks like "yourbusiness.bizvistar.com". A custom domain (free for the first year on Growth) is a fully custom URL like "yourbusiness.com", which looks more professional and is better for branding.'
    },
  ];

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100">
      {faqs.map((faq, i) => (
        <FaqItem key={i} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
};