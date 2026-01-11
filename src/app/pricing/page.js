'use client';

import { useState } from 'react';
import { Check, Minus, ChevronDown, Zap, Layers, BarChart2, Headset, Info } from 'lucide-react'; // Added Info icon
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence

// --- Reusable Icons ---
const CheckMark = () => <div className="flex justify-center"><Check className="w-5 h-5 text-blue-600" strokeWidth={2.5} /></div>;
const Dash = () => <div className="flex justify-center"><Minus className="w-5 h-5 text-gray-300" strokeWidth={2.5} /></div>;

// --- Payment Icons (Professional SVGs) ---
const VisaIcon = () => <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.386 25.105L19.69 16.978H23.906L22.602 25.105H18.386Z" fill="#0A2540"/><path d="M33.492 17.13C33.105 16.978 32.332 16.826 31.344 16.826C28.743 16.826 26.918 18.234 26.918 20.941C26.918 22.88 28.699 23.945 30.117 24.63C31.578 25.352 32.051 25.808 32.051 26.53C32.051 27.633 30.761 28.127 29.516 28.127C28.314 28.127 27.584 27.937 27.069 27.709L26.338 31.127C27.24 31.545 28.872 31.887 30.547 31.887C33.381 31.887 35.272 30.48 35.272 27.594C35.272 25.883 34.198 24.667 32.609 23.907C31.15 23.185 30.591 22.767 30.591 21.893C30.591 21.133 31.45 20.525 32.266 20.525C33.082 20.525 33.597 20.639 33.898 20.791L34.37 18.51L33.492 17.13Z" fill="#0A2540"/><path d="M41.812 16.978H38.505C37.474 16.978 37.216 17.244 36.83 18.232L31.536 31.649H35.962L36.864 29.065H42.412L42.928 31.649H46.922L43.788 16.978H41.812ZM39.622 21.232L41.554 26.708H38.376L39.622 21.232Z" fill="#0A2540"/><path d="M12.387 16.978H8.306C8.048 16.978 7.704 17.054 7.532 17.434L4.31 31.649H8.692L12.387 16.978Z" fill="#0A2540"/><path d="M3.452 16.978L0 17.168L0.516 19.865C0.946 20.967 4.052 25.523 4.052 25.523L4.782 22.255L6.286 16.978H3.452Z" fill="#0A2540"/></svg>;
const MasterCardIcon = () => <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.783 42C21.943 42 25.771 40.413 28.677 37.761C25.811 34.94 24 31.033 24 26.702C24 21.879 26.189 17.563 29.605 14.559C26.639 11.752 22.58 10 18.101 10C9.147 10 1.885 17.346 1.885 26.406C1.885 35.016 8.86 42 17.783 42Z" fill="#FF5F00"/><path d="M34.536 42C43.146 42 50.123 35.016 50.123 26.406C50.123 17.346 42.861 10 33.908 10C29.883 10 26.207 11.413 23.329 13.774C26.67 16.883 28.793 21.388 28.793 26.385C28.793 30.983 26.996 35.161 24.127 38.172C27.002 40.587 30.612 42 34.536 42Z" fill="#EB001B"/><path d="M29.605 14.559C26.189 17.563 24 21.879 24 26.702C24 31.033 25.811 34.94 28.677 37.761C26.996 35.161 28.793 30.983 28.793 26.385C28.793 21.388 26.67 16.883 23.329 13.774C25.394 14.036 27.503 14.29 29.605 14.559Z" fill="#F79E1B"/></svg>;

const AmexIcon = () => (
  <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="#006FCF"/>
    <rect x="5" y="5" width="38" height="22" rx="2" fill="#006FCF" stroke="white" strokeWidth="2"/>
    <path d="M24 10H18V22H24V18H30V14H24V10Z" fill="white"/>
    <path d="M30 10H36V22H30V18H36V14H30V10Z" fill="white"/>
    <path d="M12 10H18V12H12V10Z" fill="white"/>
    <path d="M12 20H18V22H12V20Z" fill="white"/>
    <path d="M12 15H18V17H12V15Z" fill="white"/>
  </svg>
);

const MoneyBackIcon = () => (
  <svg className="w-10 h-10 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5 9.16669C14.1667 9.05557 13.5 8.83335 12 8.83335C10.1667 8.83335 9 9.75002 9 11.0834C9 12.4167 10.1667 13.1667 11.3333 13.5834C12.5 14 13.1667 14.5 13.1667 15.4167C13.1667 16.1667 12.5 16.6667 11.5 16.6667C10.5 16.6667 10.0833 16.5 9.75 16.4167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 16H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 8H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SslShieldIcon = () => (
    <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 5V11C3 16.5 7.5 21.5 12 22C16.5 21.5 21 16.5 21 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- NEW: Info Tooltip Component (Light theme) ---
const InfoTooltip = ({ info }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div 
      className="relative inline-flex items-center ml-1"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20 w-64 bg-white text-gray-600 text-sm p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5"
          >
            {/* Arrow (pointing down) */}
            <svg 
              className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 text-white"
              style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))' }}
              viewBox="0 0 16 8" 
              fill="currentColor"
            >
               <path d="M0 0 L8 8 L16 0" />
            </svg>
            {info}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- NEW: Tooltip Data ---
const featureTooltips = {
  'AI-Powered Website Builder': 'Our AI instantly generates a professional website with text and images based on your business type, so you don\'t have to start from scratch.',
  'Easy-to-Use Editor': 'Our simple editor allows you to click on any text or image on your site and change it instantly, no code required.',
  'Secure Web Hosting': 'We handle all the technical details, providing fast and secure hosting for your website, included in your plan.',
  'Professional Subdomain': 'Get a website address like "yourname.bizvistar.in" to share with your customers instantly.',
  'Free Custom Domain (1st Year)': 'Get a professional domain like "yourname.com" for free for the first year (with annual Growth plan).',
  'Products': 'The number of products (like t-shirts, cakes, or services) you can list on your e-commerce store.',
  'Business Tools': 'Tools to help you run your business, such as an Appointment Booker, Order Manager, or Contact Form.',
  'Order Dashboard': 'A central place to view and manage all your incoming orders from customers.',
  'Visitor Analytics': 'See how many people visit your site. Advanced analytics show where they come from and what pages they view.',
  'Order Confirmation Emails': 'Your customers will automatically receive a confirmation email every time they place an order.',
  'Dashboard Order Sound': 'Get an audible "cha-ching" or notification sound in your dashboard when a new order arrives.',
  'WhatsApp Notifications': 'Receive an instant notification on your WhatsApp number as soon as a new order comes in.',
  'Email Support': 'Get help from our support team via email.',
  'WhatsApp Support': 'Get priority help directly via a dedicated WhatsApp chat number.',
  'Social Media Posts': 'Our team will design and write professional posts for your social media (like Instagram or Facebook) every month.',
  'Google Maps Management': 'We will set up and optimize your Google My Business profile to help you get found in local searches.',
  'Priority Onboarding Call': 'A dedicated 1-on-1 call with our team to help you get your site and store set up perfectly.',
};

// --- NEW: Features List Structure ---
const featureList = [
  { category: 'CORE PLATFORM' },
  { name: 'AI-Powered Website Builder', starter: true, pro: true, growth: true },
  { name: 'Easy-to-Use Editor', starter: true, pro: true, growth: true },
  { name: 'Secure Web Hosting', starter: true, pro: true, growth: true },
  { name: 'Professional Subdomain', starter: true, pro: true, growth: true },
  { name: 'Free Custom Domain (1st Year)', starter: false, pro: false, growth: true },
  { category: 'BUSINESS & E-COMMERCE' },
  { name: 'sms for user authentication', starter: false, pro: 500, growth: 1000 },
  { name: 'Products', starter: '25', pro: 'Unlimited', growth: 'Unlimited' },
  { name: 'Business Tools', starter: '1Tool', pro: '2 Tools', growth: 'All Tools' },
  { name: 'Order Dashboard', starter: true, pro: true, growth: true },
  { name: 'Visitor Analytics', starter: false, pro: 'Basic', growth: 'Advanced' },
  { category: 'AUTOMATION' },
  { name: 'Order Confirmation Emails', starter: true, pro: true, growth: true },
  { name: 'Dashboard Order Sound', starter: true, pro: true, growth: true },
  { name: 'WhatsApp Notifications', starter: false, pro: true, growth: true },
  { category: 'DONE-FOR-YOU SERVICES' },
  { name: 'Email Support', starter: 'Standard', pro: 'Priority', growth: 'Priority' },
  { name: 'WhatsApp Support', starter: false, pro: true, growth: true },
  { name: 'Google Maps Management', starter: false, pro: false, growth: true },
  { name: 'Priority Onboarding Call', starter: false, pro: false, growth: true },
];

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
          '1 Business Tool ',
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
          '500 sms for user authentication',
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
          '1000 sms for user authentication',
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
          '1 Business Tool ',
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
            '500 sms for user authentication',
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
            '1000 sms for user authentication',
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
    <div className="py-17 sm:py-25 bg-white font-sans text-gray-900">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* --- Header & Toggle --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Your Website Looks Amazing!
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Choose a plan to go live and start growing your business. All plans are risk-free. Cancel anytime.
          </p>

          {/* --- ANIMATED Toggle --- */}
          <div className="relative inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
             <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  'relative z-10 px-8 py-2 text-base font-medium rounded-full transition-colors duration-200',
                  !isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {/* --- FIX: Added relative z-10 span --- */}
                <span className="relative z-10">Billed monthly</span>
                {/* --- End Fix --- */}
                {!isYearly && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  'relative z-10 flex items-center px-8 py-2 text-base font-medium rounded-full transition-colors duration-200',
                  isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <span className="relative z-10">Billed yearly</span>
                <span className="relative z-10 ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  Save {maxSavings}%
                </span>
                {isYearly && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
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

        {/* --- NEW SECTION: Enterprise & Trust (matches screenshot) --- */}
        <div className="max-w-7xl mx-auto mt-24">



          {/* Disclaimer Text */}
          <div className="px-6 mt-0">
            <p className="text-xs text-gray-500">
              Prices shown do not include applicable taxes. Taxes will be automatically calculated based on your billing address and local regulations. You’ll always see the complete and final amount on the checkout page before you confirm your payment.
            </p>
          </div>  

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-6">
              {/* 1. Accepted Payments */}
              <div>
                  <h5 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">ACCEPTED PAYMENT METHODS</h5>
                  <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                      <VisaIcon />
                      <MasterCardIcon />
                      <AmexIcon />
                      <span className="text-gray-500 font-medium">+ More</span>
                  </div>
              </div>

              {/* 2. Cancel Anytime*/}
              <div className="flex gap-4 items-start">
                  <MoneyBackIcon />
                  <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1">Cancel Anytime                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">End your plan anytime, no questions asked — full control, zero hassle.</p>
                  </div>
              </div>

              {/* 3. SSL Secure Payment */}
              <div className="flex gap-4 items-start">
                  <SslShieldIcon />
                  <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1">Smart Business Insights</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Understand what’s working. Get real-time visitor data and performance insights to grow faster</p>
                  </div>
              </div>
          </div>

        </div>
        {/* --- END OF NEW SECTION --- */}


        {/* --- "Compare Plan Features" Section --- */}
        <div id="compare" className="mt-32 scroll-mt-20">
          {/* This h2 is now hidden, as the title is in the table header */}
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 sr-only">
            Compare Plan Features
          </h2>
          <AllFeaturesTable InfoTooltip={InfoTooltip} featureTooltips={featureTooltips} featureList={featureList} />
        </div>

        {/* --- "Why Choose BizVistar?" Section --- */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Why Choose BizVistar?
          </h2>
          <ComparisonTable />
        </div>

        {/* --- FAQ Section --- */}
        <div className="mt-32 max-w-7xl mx-auto">
          {/* h2 is removed and now inside FaqSection */}


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
        Recommended
      </div>
    )}

    <div className="p-10 text-center flex-grow flex flex-col">
      <h3 className="text-5xl font-bold text-gray-900">{plan.name}</h3>
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

      <Link href={{
            pathname: '/checkout',
            query: {
                plan: plan.name,
                billing: isYearly ? 'yearly' : 'monthly',
                price: plan.price
            }
        }} className="w-full">
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

// --- Sub-component: AllFeaturesTable (Scroll-linked sticky header section) ---
// --- UPDATED to match the screenshot style ---
const AllFeaturesTable = ({ InfoTooltip, featureTooltips, featureList }) => (
  <div className="border border-gray-200  bg-white ">
    <div className="relative">
      <div className="sticky top-0 z-30 bg-white">
        <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">

          {/* --- Empty First Column (for feature names) --- */}
          <div className="p-6 flex items-end">
          </div>

          {/* --- Starter Plan --- */}
          <div className="p-6 text-center border-l border-gray-200 bg-white flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="flex justify-center items-center gap-1 mb-4">
                <span className="text-xl font-semibold text-gray-600 self-start mt-1">₹</span>
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">299</span>
                <span className="text-xl font-semibold text-gray-600 self-end mb-1">/mo</span>
              </div>
            </div>
            <Link href={{
                pathname: '/checkout',
                query: {
                    plan: 'Starter',
                    billing: 'monthly',
                    price: '299'
                }
            }}>
              <button className="px-10 py-2 text-base font-semibold text-purple-700 rounded-full border-2 border-purple-700 hover:bg-purple-50 transition-colors mt-4">
                Select
              </button>
            </Link>
          </div>

          {/* --- Pro Plan (Recommended) --- */}
          <div className="p-6 text-center border-l border-gray-200 relative bg-white shadow-lg z-10 flex flex-col justify-between h-full">
            <div>
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="inline-block bg-purple-600 text-white text-sm font-semibold px-6 py-1 rounded-b-lg">
                  Recommended
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-8">Pro</h3>
              <div className="flex justify-center items-center gap-1 mb-4">
                <span className="text-xl font-semibold text-gray-600 self-start mt-1">₹</span>
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">799</span>
                <span className="text-xl font-semibold text-gray-600 self-end mb-1">/mo</span>
              </div>
            </div>
            <Link href={{
                pathname: '/checkout',
                query: {
                    plan: 'Pro',
                    billing: 'monthly',
                    price: '799'
                }
            }}>
              <button className="px-10 py-2 text-base font-semibold text-white rounded-full bg-purple-600 hover:bg-purple-700 transition-colors mt-4">
                Select
              </button>
            </Link>
          </div>

          {/* --- Growth Plan --- */}
          <div className="p-6 text-center border-l border-gray-200 bg-white flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
              <div className="flex justify-center items-center gap-1 mb-4">
                <span className="text-xl font-semibold text-gray-600 self-start mt-1">₹</span>
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">1499</span>
                <span className="text-xl font-semibold text-gray-600 self-end mb-1">/mo</span>
              </div>
            </div>
            <Link href={{
                pathname: '/checkout',
                query: {
                    plan: 'Growth',
                    billing: 'monthly',
                    price: '1499'
                }
            }}>
              <button className="px-10 py-2 text-base font-semibold text-purple-700 rounded-full border-2 border-purple-700 hover:bg-purple-50 transition-colors mt-4">
                Select
              </button>
            </Link>
          </div>

        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {featureList.map((feature, index) => (
          feature.category ? (
            <div 
              key={index} 
              className="bg-gray-50/50 p-4 pl-8 font-bold text-gray-900 text-sm tracking-wider uppercase border-t border-gray-100"
            >
              {feature.category}
            </div>
          ) : (
            <FeatureRow 
              key={index}
              feature={{
                name: feature.name,
                info: featureTooltips[feature.name] || null
              }} 
              starter={feature.starter}
              pro={feature.pro}
              growth={feature.growth}
              InfoTooltip={InfoTooltip} 
            />
          )
        ))}
      </div>
    </div>
  </div>
);
// --- END OF MODIFIED COMPONENT ---


// --- FIX: Helper for Feature Rows --- (Added justify-between)
const FeatureRow = ({ feature, starter, pro, growth, InfoTooltip }) => {
    const renderCell = (value, isProCol) => { 
        if (value === true) return <CheckMark />;
        if (value === false) return <Dash />;
        return <span className={cn("font-semibold", isProCol ? "text-purple-700" : "text-gray-900")}>{value}</span>;
    };

    const isObject = typeof feature === 'object' && feature !== null;
    const featureName = isObject ? feature.name : feature;
    const featureInfo = isObject ? feature.info : null;

    return (
        <div className="grid grid-cols-4 hover:bg-gray-50 transition-colors">
            {/* --- FIX: Added justify-between and w-full --- */}
            <div className="p-5 pl-8 font-medium text-gray-700 flex items-center justify-between w-full">
              <span>{featureName}</span>
              {featureInfo && <InfoTooltip info={featureInfo} />}
            </div>
            <div className="p-5 flex items-center justify-center border-l border-gray-200">{renderCell(starter, false)}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-200 bg-purple-50/30">{renderCell(pro, true)}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-200">{renderCell(growth, false)}</div>
        </div>
    );
};

// --- Sub-component: ComparisonTable (Sticky header like AllFeaturesTable) ---
const ComparisonTable = () => (
        <div className="border border-gray-300 bg-white">
          {/* Outer wrapper handles horizontal overflow, not vertical */}
          <div className="relative">
            <table className="min-w-full border-collapse">
              <thead className="sticky top-0 z-200 bg-white shadow-sm">
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-center text-lg font-bold text-gray-900 p-6 border-l border-gray-200">Features</th>
                  <th className="text-center text-lg font-bold text-gray-900 p-6 border-l border-gray-200">
                    DIY Builders<br />
                    <span className="text-sm font-normal text-gray-500">(Wix/GoDaddy)</span>
                  </th>
                  <th className="text-center text-lg font-bold text-gray-900 p-6 border-l border-gray-200">Local Agencies<br/>
                  <span className="text-sm font-normal text-gray-500">(Freelancers)</span>
                  </th>
                  <th className="text-center text-lg font-bold text-purple-700 p-6 border-l border-gray-200 bg-purple-50">
                    BizVistar<br />
                    <span className="text-sm font-normal text-purple-600">(Your Partner)</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                <tr>
                  <td className="font-semibold p-6 text-gray-700">Who Builds the Site?</td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>You Do 100%</strong><br />You spend 40+ hours learning complex tools.
                  </td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>They Do 100%</strong><br />A full-service, hands-off experience.
                  </td>
                  <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30">
                    <strong>We Do It Together</strong><br />Our AI builds the site in 60s. You do the fun edits.
                  </td>
                </tr>
          <tr>
            <td className="font-semibold p-6 text-gray-700">Who Manages Socials?</td>
            <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>You Do 100%</strong><br />They give you a tool, but you do all the work.</td>
            <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>They Do It</strong><br />They create and post for you.</td>
            <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>We Do It (on Pro+)</strong><br />Our plan includes "done-for-you" posts.</td>
          </tr>
          <tr>
            <td className="font-semibold p-6 text-gray-700">Who Provides Support?</td>
            <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>A Call Center</strong><br />You wait in a queue to talk to a stranger.</td>
            <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>A Dedicated Manager</strong><br />Great support for a very high price.</td>
            <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>A WhatsApp Partner</strong><br />Priority support from a local expert.</td>
          </tr>
          <tr>
            <td className="font-semibold p-6 text-gray-700">The Price</td>
            <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>High Cost + Your Time</strong><br />(₹800 - ₹2,300/mo)</td>
            <td className="text-center p-6 text-gray-600 border-l border-gray-100"><strong>Extremely High Cost</strong><br />(₹10,000 - ₹20,000/mo)</td>
            <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-purple-50/30"><strong>Simple, Affordable Price</strong><br />(Just ₹26 a day!)</td>
          </tr>
          <tr>
            <td className="font-bold p-6 text-gray-900">The Verdict</td>
            <td className="text-center p-6 text-gray-500 font-medium border-l border-gray-100">High Effort, Low Support</td>
            <td className="text-center p-6 text-gray-500 font-medium border-l border-gray-100">High Cost, High Service</td>
            <td className="text-center p-6 text-purple-700 font-bold border-l border-gray-100 bg-purple-50/50">Cost-Effective, High Service</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- Sub-component: FaqSection (Clean Accordion) ---
// --- THIS IS THE START OF THE CHANGED SECTION ---
const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left text-gray-900" // STYLE CHANGED
      >
        <span className="text-lg font-medium text-gray-900">{q}</span> {/* STYLE CHANGED */}
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform duration-300', // STYLE CHANGED
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
            <div className="pb-5 pr-10 text-base text-gray-600 leading-relaxed"> {/* STYLE CHANGED, SUPPORT JSX */}
              {typeof a === 'string' ? <p>{a}</p> : a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  // NEW faqs based on screenshot
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
      q: 'Why do I need a custom domain?',
      a: 'A custom domain (e.g., yourbusiness.com) builds credibility, strengthens your brand, and makes it easier for customers to find you. It looks more professional than a free subdomain (e.g., yourbusiness.bizvistar.in).'
    },
    {
      q: 'How can I get my own personalized email address?',
      a: 'Once you have a custom domain, you can set up a personalized email address (e.g., info@yourbusiness.com) through our integration with Google Workspace or other third-party email providers.'
    },
    {
      q: 'Where can I find my billing information?',
      a: 'You can find all your billing information, including invoices and subscription details, in the "Billing & Payments" section of your account dashboard after you sign in.'
    },
    {
      q: 'What online payments are accepted?',
      a: 'We accept all major credit cards (Visa, MasterCard, American Express) as well as UPI, Net Banking, and other popular payment methods for our Indian customers.'
    },
    {
      q: 'How do I know if the Enterprise plan is right for my business?',
      a: 'Our Enterprise plan is designed for large-scale businesses with specific needs for custom features, dedicated support, and advanced security. If you have multiple locations or require custom integrations, our Enterprise team can help. Contact us for a consultation.'
    },
    {
      q: 'How do I contact the Enterprise team?',
      a: 'You can contact our Enterprise team by filling out the contact form on our "Enterprise" page or by reaching out to your dedicated account manager if you are an existing customer.'
    },
    {
      q: 'How does BizVistar handle security assessments/questionnaires?',
      // Pass JSX to support links
      a: (
        <p>
          For information on how BizVistar protects your data, compliance, certifications, GDPR and more, check out our{' '}
          <a href="#" className="text-blue-600 hover:underline">white paper</a>. 
          For security questions specific to your business, contact the Enterprise team using the form above.
        </p>
      )
    },
  ];

  return (
    // NEW 2-column layout
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
      {/* Left Column: Title & Description */}
      <div className="lg:col-span-1">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600">
          Haven't found what you're looking for? Try the{' '}
          <a href="#" className="text-blue-600 hover:underline">BizVistar Help Center</a>{' '}
          or{' '}
          <a href="#" className="text-blue-600 hover:underline">contact us</a>.
        </p>
      </div>
      
      {/* Right Column: Accordion */}
      <div className="lg:col-span-2">
        {/* Removed the outer card styling */}
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};
// --- THIS IS THE END OF THE CHANGED SECTION ---
