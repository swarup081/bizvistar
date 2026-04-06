'use client';

import { useState } from 'react';
import { Check, Minus, ChevronDown, Zap, Layers, BarChart2, Headset, Info, Smartphone, Wand2, LayoutGrid, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react'; 
import TemplatesShowcaseUI from '@/components/templatemarquee';

// --- Reusable Icons ---
const CheckMark = ({ isRecommended = false }) => (
  <div className="flex justify-center">
    <Check
      className={cn(
        "w-5 h-5",
        isRecommended ? "text-[#8a63d2]" : "text-gray-900"
      )}
      strokeWidth={2.5}
    />
  </div>
);
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

// --- Info Tooltip Component (Light theme) ---
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
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 w-64 bg-white text-gray-600 text-sm p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5"
          >
            {/* Arrow (pointing up) */}
            <svg 
              className="absolute bottom-full left-1/2 -translate-x-1/2 w-4 h-4 text-white rotate-180"
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

// --- Tooltip Data ---
const featureTooltips = {
  'AI-Powered Website Builder': 'Instantly generate a complete, professional website using AI tailored to your business with ready-made text and images.',
  'Easy-to-Use Editor': 'Edit any text, image, or section on your website in seconds with a simple click no coding required.',
  'Secure Web Hosting': 'Fast, reliable, and secure hosting is fully managed by us—no technical setup needed.',
  'Professional Subdomain': 'Get a ready to use website link like "yourname.bizvistar.in" to start sharing instantly.',
  'Free Custom Domain': 'Get a custom domain like "yourbusiness.com" free for the first year with the annual Growth plan.',
  'Products': 'The number of items or services you can list and sell on your online store.',
  'Business Tools': 'Built-in tools like order management, appointment booking, and contact forms to run your business smoothly.',
  'Order Dashboard': 'View, track, and manage all your customer orders from one central dashboard.',
  'Visitor Analytics': 'Track how many people visit your site, where they come from, and how they interact with your pages.',
  'Order Confirmation': 'Automatically notify customers after every order with confirmation details.',
  'Dashboard Order': 'Get an instant alert in your dashboard whenever a new order is placed.',
  'WhatsApp Notifications': 'Receive real time order alerts directly on your WhatsApp for faster response.',
  'Email Support': 'Get reliable support via email whenever you need help.',
  'WhatsApp Support': 'Get faster, priority support directly on WhatsApp from our team.',
  'Social Media Posts': 'Receive professionally designed and written social media posts every month to grow your online presence.',
  'Google Maps Management': 'We set up and optimize your Google Business profile to help customers find you easily.',
  'Priority Onboarding Call': 'Get a 1 on 1 setup call with our team to launch your website smoothly and correctly.',
};

// --- Features List Structure ---
const featureList = [
  { category: 'CORE PLATFORM' },
  { name: 'AI-Powered Website Builder', starter: true, pro: true, growth: true },
  { name: 'Easy-to-Use Editor', starter: true, pro: true, growth: true },
  { name: 'Secure Web Hosting', starter: true, pro: true, growth: true },
  { name: 'Professional Subdomain', starter: true, pro: true, growth: true },
  { name: 'Free Custom Domain', starter: false, pro: false, growth: true },
  { category: 'BUSINESS & E-COMMERCE' },
  { name: 'Authentication', starter: false, pro: 500, growth: 1000 },
  { name: 'Products', starter: '25', pro: 'Unlimited', growth: 'Unlimited' },
  { name: 'Business Tools', starter: 'Limited Business Tool', pro: 'Limited Advanced Business Tools', growth: 'Advanced Business Tools' },
  { name: 'Order Dashboard', starter: true, pro: true, growth: true },
  { name: 'Visitor Analytics', starter: 'Basic', pro: 'Advanced', growth: 'Advanced' },
  { name: 'AI Insights', starter: false, pro: 'Basic', growth: 'Advanced' },
  { category: 'AUTOMATION' },
  { name: 'Order Confirmation', starter: true, pro: true, growth: true },
  { name: 'Dashboard Order', starter: true, pro: true, growth: true },
  { name: 'WhatsApp Notifications', starter: false, pro: true, growth: true },
  { category: 'Website' },
  { name: 'Email Support', starter: 'Standard', pro: 'Priority', growth: 'Priority' },
  { name: 'WhatsApp Support', starter: true, pro: true, growth: true },
  { name: 'Web Management', starter: true, pro: true, growth: true },
  { name: 'SEO', starter: false, pro: true, growth: true },
  { name: 'Priority Onboarding Call', starter: false, pro: false, growth: true },
];

import { Suspense } from 'react';

function PricingContent() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const searchParams = useSearchParams();
  const isUpdateFlow = searchParams.get('update') === 'true';
  const siteId = searchParams.get('site_id');

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: subs } = await supabase
          .from('subscriptions')
          .select('*, plans(name)')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('id', { ascending: false })
          .limit(1);
          
      if (subs && subs.length > 0 && subs[0].plans) {
          let cycle = 'monthly';
          if (subs[0].plans.name.toLowerCase().includes('yearly')) cycle = 'yearly';
          setCurrentPlan({
             name: subs[0].plans.name.replace(/ yearly| monthly/gi, ''),
             cycle: cycle
          });
          // Auto-toggle to the user's current billing cycle
          setIsYearly(cycle === 'yearly');
      } else {
          setCurrentPlan({ name: 'Starter', cycle: 'monthly' }); // Default active
      }
    };
    fetchCurrentPlan();
  }, []);

const plans = {
  monthly: [
    {
      name: 'Starter',
      subtitle: 'Best for hobbyists and individual creators testing a side-hustle with a basic item catalog',
      originalPrice: '499',
      price: '299',
      discount: '40% off',
      dailyRate: 'Billed monthly. Total freedom to pause or cancel anytime.',
      cta: 'Choose plan',
      isRecommended: false,
      features: [
        'Professional Website',
        'Free Subdomain',
        'Secure Hosting',
        '25 Products',
        'Standard Support',
        'Basic Business Tools',
        'Edit Your Website Anytime from Mobile',
        'Generate & Send Invoices Instantly',
        'Accept Payments via UPI, Cards & Wallets',
        'Basic Analytics',
      ],
    },
    {
      name: 'Pro',
      subtitle: 'Best for serious shop owners and service brands automating daily sales and business growth',
      originalPrice: '1599',
      price: '799',
      discount: '51% off',
      dailyRate: 'Billed monthly. Zero long-term commitment. Switch to yearly anytime.',
      cta: 'Choose plan',
      isRecommended: true,
      features: [
        'Professional Website',
        'Free Subdomain',
        'Unlimited Products',
        'Priority Support',
        'Advanced Business Tools',
        'Edit Your Website Anytime from Mobile',
        'Generate & Send Invoices Instantly',
        'Accept Payments via UPI, Cards & Wallets',
        'Advanced Analytics',
      ],
    },
    {
      name: 'Growth',
      subtitle: 'Best for established enterprises with high-volume multi-channel operations.',
      originalPrice: '1999',
      price: '1499',
      discount: '24% off',
      dailyRate: 'Billed monthly. Enterprise power with total flexibility. Cancel whenever you want.',
      cta: 'Choose plan',
      isRecommended: false,
      features: [
        'Professional Website',
        'Free Custom Domain',
        'Secure Hosting',
        'Unlimited Products',
        'Priority Support',
        'Advanced Business Tools',
        'Edit Your Website Anytime from Mobile',
        'Accept Payments via UPI, Cards & Wallets',
        'Priority Onboarding Call',
        'Advanced Analytics',
      ],
    },
  ],
  yearly: [
    {
      name: 'Starter',
      subtitle: 'Best for hobbyists and individual creators testing a side-hustle with a basic item catalog',
      originalPrice: '499',
      price: '249',
      discount: '51% off',
      yearlyTotal: 'Get 12 months for ₹2,990 (regularly ₹5,988). Includes 2 months free. Cancel anytime.',
      cta: 'Choose plan',
      isRecommended: false,
      features: [
        'Professional Website',
        'Free Subdomain',
        'Secure Hosting',
        'Unlimited Edits',
        '25 Products',
        'Standard Support',
        'Basic Business Tools',
        'Edit Your Website Anytime from Mobile',
        'Generate & Send Invoices Instantly',
        'Accept Payments via UPI, Cards & Wallets',
        'Basic Analytics',
      ],
    },
    {
      name: 'Pro',
      subtitle: 'Best for serious shop owners and service brands automating daily sales and business growth',
      originalPrice: '1599',
      price: '666',
      discount: '60% off',
      yearlyTotal: 'Get 12 months for ₹7,990 (regularly ₹19,188). Includes 2 months free. Cancel anytime.',
      cta: 'Choose plan',
      isRecommended: true,
      features: [
        'Professional Website',
        'Free Subdomain',
        'Secure Hosting',
        'Unlimited Products',
        'Priority Support',
        'Advanced Business Tools',
        'Edit Your Website Anytime from Mobile',
        'Generate & Send Invoices Instantly',
        'Accept Payments via UPI, Cards & Wallets',
        'Advanced Analytics',
      ],
    },
    {
      name: 'Growth',
      subtitle: 'Best for established enterprises with high-volume multi-channel operations.',
      originalPrice: '1999',
      price: '1249',
      discount: '38% off',
      yearlyTotal: 'Get 12 months for ₹14,990 (regularly ₹23,988). Includes 2 months free. Cancel anytime.',
      cta: 'Choose plan',
      isRecommended: false,
      features: [
        'Professional Website',
        'Free Custom Domain',
        'Secure Hosting',
        'Unlimited Products',
        'Priority Support',
        'Advanced Business Tools',
        'Edit Your Website Anytime from Mobile',
        'Accept Payments via UPI, Cards & Wallets',
        'Priority Onboarding Call',
        'Advanced Analytics',
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
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            {siteId ? "Your Website Looks Amazing!" : "Find the right plan for you"}
          </h1>
          <p className="text-sm sm:text-xl  text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Choose a plan to go live and start growing your business. All plans are risk-free. Cancel anytime.
          </p>

          {/* --- ANIMATED Toggle --- */}
          <div className="relative inline-flex mb-15 items-center p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
             <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  'relative z-10 px-8 py-2 text-base font-medium rounded-full transition-colors duration-200',
                  !isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <span className="relative z-10">Billed monthly</span>
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

        {/* --- PRICING CARDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
            {activePlans.map((plan, index) => {
              const currentCycle = isYearly ? 'yearly' : 'monthly';
              const isCurrentPlan = currentPlan?.name === plan.name && currentPlan?.cycle === currentCycle;

              return (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  isYearly={isYearly}
                  isUpdateFlow={isUpdateFlow}
                  isCurrentPlan={isCurrentPlan}
                  // Make the middle card (Pro) physically larger
                  className={index === 1 ? 'lg:scale-110 lg:-translate-y-4 z-10' : 'lg:scale-100'}
                />
              );
            })}
        </div>
        
        {/* --- "Compare Plan Features" Button --- */}
        <div className="mt-20 text-center hidden lg:block">
           <Link href="#compare" className="inline-flex items-center justify-center px-8 py-4 border border-gray-900 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-900 hover:text-white transition-colors shadow-sm">
             Compare Plan Features
           </Link>
        </div>

             {/* --- INCLUDED IN EVERY PLAN SECTION --- */}
             <div className="mt-24 bg-[#F4F5F8] rounded-3xl p-10 lg:p-16 mx-auto max-w-7xl">
          <div className="flex flex-col xl:flex-row gap-16 lg:gap-12 items-start">
            
            {/* Left Header Area */}
            <div className="xl:w-[28%] flex flex-col shrink-0">
              <span className="bg-[#a28ad6] text-white text-xs font-bold px-3 py-1 rounded-[4px] uppercase tracking-widest w-max mb-6">
                Plus
              </span>
              <h2 className="text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.15] tracking-tight">
                Included in <br className="hidden xl:block" /> every Website <br className="hidden xl:block" /> Builder plan
              </h2>
            </div>
            
            {/* Right Features Grid */}
            <div className="xl:w-[72%] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-8 pt-1">
              <div className="flex flex-col">
                <Smartphone className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <span className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">Mobile-friendly site</span>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Easily reach customers wherever they are.</p>
              </div>
              
              <div className="flex flex-col">
                <Wand2 className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <span className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">100+ beautiful templates</span>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Dazzle customers with our professional templates.</p>
              </div>
              
              <div className="flex flex-col">
                <LayoutGrid className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <span className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">Marketing dashboard</span>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Real-time tracking of your performance and presence.</p>
              </div>

            
              
              <div className="flex flex-col">
                <Phone className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <span className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">24/7 expert support</span>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Our Bizvistar Guides are always here to help.</p>
              </div>
            </div>

          </div>
        </div>

        {/* --- "Compare Plan Features" Section --- */}
        <div id="compare" className="mt-32 scroll-mt-20 hidden lg:block">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 sr-only">
            Compare Plan Features
          </h2>
          <AllFeaturesTable InfoTooltip={InfoTooltip} featureTooltips={featureTooltips} featureList={featureList} />
        </div>

        {/* --- "Why Choose Bizvistar?" Section --- */}
        <div className="mt-32 hidden lg:block">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Why Choose Bizvistar?
          </h2>
          <ComparisonTable />
        </div>

        {/* --- Mobile Only Marquee Section --- */}
        <div className="mt-16 sm:mt-24 block lg:hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8 px-4 leading-tight">
            Whatever website you'll build, it'll look good
          </h2>
          <div className="-mx-6">
            <TemplatesShowcaseUI />
          </div>
        </div>

        {/* --- FAQ Section --- */}
        <div className="mt-32 max-w-7xl mx-auto">
          <FaqSection />
        </div>

      </div>
    </div>
  );
}

// --- Sub-component: PlanCard (UPDATED FOR SCREENSHOT LAYOUT) ---
const PlanCard = ({ plan, isYearly, className, isUpdateFlow, isCurrentPlan }) => {
  
  // Create the inner content blocks to reuse, matching the exact flow of the screenshot
  const innerCardContent = (
    <div className="flex flex-col h-full text-left">
      <div className="px-8 pt-8 pb-6 flex-grow flex flex-col relative">
        
        {/* Top row: Title and Badge (Savings or Promos aligned to right) */}
        <div className="flex justify-between items-start mb-3 gap-4">
          <span className="text-3xl font-bold text-gray-900 leading-tight">{plan.name}</span>
          {plan.discount && (
            <div className="inline-flex bg-[#f4f1fa] text-[#7554b3] text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap mt-1">
              {plan.discount}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mb-6 flex flex-col">
          {plan.originalPrice ? (
            <p className="text-lg font-medium text-gray-400 line-through mb-1">
              ₹{plan.originalPrice}/mo
            </p>
          ) : (
            // Placeholder for alignment when not yearly
            <p className="text-lg font-medium text-transparent mb-1 select-none" aria-hidden="true">-</p> 
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-[44px] font-extrabold text-gray-900 tracking-tight leading-none">₹{plan.price}</span>
            <span className="text-lg font-medium text-gray-500">/mo</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-4 w-full">
          {isCurrentPlan ? (
            <button 
              disabled
              className={cn(
                'w-full py-3.5 rounded-xl text-[17px] font-bold cursor-not-allowed opacity-60 border-2 border-gray-400 text-gray-500 bg-gray-100'
              )}
            >
              Current Plan
            </button>
          ) : (
            <Link href={{
                  pathname: '/checkout',
                  query: {
                      plan: plan.name,
                      billing: isYearly ? 'yearly' : 'monthly',
                      price: plan.price,
                      ...(isUpdateFlow ? { update: 'true' } : {})
                  }
              }} className="w-full">
              <button 
                className={cn(
                  'w-full py-3.5 rounded-xl text-[17px] font-bold transition-all duration-200',
                  plan.isRecommended
                    ? 'bg-[#8a63d2] text-white hover:bg-[#7554b3] shadow-md hover:shadow-lg'
                    : 'bg-white border-2 hover:bg-[#8a63d2] hover:text-white border-[#8a63d2] text-[#7554b3] hover:border-[#8a63d2]'
                )}
              >
                {plan.cta}
              </button>
            </Link>
          )}
        </div>

        {/* Subtext (Renewals / Rate) placed under the button */}
        <p className="text-[12px] font-medium text-gray-600 mb-6">
          {!isYearly ? plan.dailyRate : plan.yearlyTotal}
        </p>

        {/* Highlighted "Best for" Box */}
        <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-5 mt-auto">
          <p className="text-gray-900 font-semibold text-[15px] leading-relaxed">{plan.subtitle}</p>
        </div>
      </div>

      {/* Features List */}
      <div className="px-8 pb-8 pt-2">
          <span className="text-[17px] font-bold text-gray-900 mb-5">
            {plan.name === 'Starter' && "Included:"}
            {plan.name === 'Pro' && "Included:"}
            {plan.name === 'Growth' && "Included:"}
          </span>
          <ul className="space-y-3.5 mt-5">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start text-left">
                <Check className={cn("w-[22px] h-[22px] mt-[2px] mr-3 flex-shrink-0", plan.isRecommended ? "text-[#7554b3]" : "text-black-900")} strokeWidth={2.5} />
                <span className="text-gray-700 font-medium text-[15px] leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );

  return (
    <div 
      className={cn(
        'flex flex-col rounded-[24px] transition-all duration-300 ease-out overflow-hidden', 
        plan.isRecommended 
          ? 'bg-[#8A63D2] shadow-2xl px-[3px] pb-[3px]' 
          : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
        className
      )}
    >
      {plan.isRecommended && (
        <div className="py-2.5 text-center text-white text-sm font-bold tracking-wider uppercase">
          Most Popular
        </div>
      )}

      {plan.isRecommended ? (
        <div className="bg-white rounded-[20px] flex flex-col flex-grow">
          {innerCardContent}
        </div>
      ) : (
        innerCardContent
      )}
    </div>
  );
};

// --- Sub-component: AllFeaturesTable ---
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
              <button className="px-10 py-2 text-base font-semibold text-[#7554b3] rounded-full border-2 border-[#7554b3] hover:bg-[#f4f1fa] transition-colors mt-4">
                Select
              </button>
            </Link>
          </div>

          {/* --- Pro Plan (Recommended) --- */}
          <div className="p-6 text-center border-l border-gray-200 relative bg-white shadow-lg z-10 flex flex-col justify-between h-full">
            <div>
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="inline-block bg-[#7554b3] text-white text-sm font-semibold px-6 py-1 rounded-b-lg">
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
              <button className="px-10 py-2 text-base font-semibold text-white rounded-full bg-[#7554b3] hover:bg-[#5c428c] transition-colors mt-4">
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
              <button className="px-10 py-2 text-base font-semibold text-[#7554b3] rounded-full border-2 border-[#7554b3] hover:bg-[f4f1fa] transition-colors mt-4">
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

// --- Helper for Feature Rows --- 
const FeatureRow = ({ feature, starter, pro, growth, InfoTooltip }) => {
    const renderCell = (value, isProCol) => { 
        if (value === true) return <CheckMark isRecommended={isProCol} />;
        if (value === false) return <Dash />;
        return <span className={cn("font-semibold", isProCol ? "text-[#7554b3]" : "text-gray-900")}>{value}</span>;
    };

    const isObject = typeof feature === 'object' && feature !== null;
    const featureName = isObject ? feature.name : feature;
    const featureInfo = isObject ? feature.info : null;

    return (
        <div className="grid grid-cols-4 hover:bg-gray-50 transition-colors">
            <div className="p-5 pl-8 font-medium text-gray-700 flex items-center justify-between w-full">
              <span>{featureName}</span>
              {featureInfo && <InfoTooltip info={featureInfo} />}
            </div>
            <div className="p-5 flex items-center justify-center border-l border-gray-200">{renderCell(starter, false)}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-200 bg-[#f4f1fa]/30">{renderCell(pro, true)}</div>
            <div className="p-5 flex items-center justify-center border-l border-gray-200">{renderCell(growth, false)}</div>
        </div>
    );
};

// --- Sub-component: ComparisonTable ---
const ComparisonTable = () => (
        <div className="border border-gray-300 bg-white">
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
                  <th className="text-center text-lg font-bold text-[#7554b3] p-6 border-l border-gray-200 bg-[#f4f1fa]">
                    Bizvistar<br />
                    <span className="text-sm font-normal text-[#8a63d2]">(Your Partner)</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                <tr>
                  <td className="font-semibold p-6 text-gray-700">Website Creation Experience</td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Do-It-Yourself</strong><br />
                    Spend hours learning tools and building everything from scratch.
                  </td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Fully Outsourced</strong><br />
                    Experts build it for you, but with less flexibility and higher cost.
                  </td>
                  <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-[#f4f1fa]/30">
                    <strong>AI + You</strong><br />
                    Launch instantly with AI and customize easily anytime.
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-6 text-gray-700">Sales & Order Management</td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Manual Setup</strong><br />
                    Connect multiple tools and manage everything separately.
                  </td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Agency Managed</strong><br />
                    Setup is done for you, but changes take time and extra cost.
                  </td>
                  <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-[#f4f1fa]/30">
                    <strong>All-in-One Dashboard</strong><br />
                    Manage orders, payments, and invoices from one place.
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-6 text-gray-700">Support Experience</td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Generic Support</strong><br />
                    Long wait times and limited personalized help.
                  </td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Dedicated Manager</strong><br />
                    High-touch support but comes at a premium cost.
                  </td>
                  <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-[#f4f1fa]/30">
                    <strong>WhatsApp Support</strong><br />
                    Fast, direct support from real experts when you need it.
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-6 text-gray-700">Pricing & Value</td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Pay + Your Time</strong><br />
                    Monthly fees plus hours of your own effort.
                  </td>
                  <td className="text-center p-6 text-gray-600 border-l border-gray-100">
                    <strong>Very Expensive</strong><br />
                    High upfront and ongoing costs.
                  </td>
                  <td className="text-center p-6 text-gray-900 border-l border-gray-100 bg-[#f4f1fa]/30">
                    <strong>Affordable & Scalable</strong><br />
                    Simple pricing designed to grow with your business.
                  </td>
                </tr>
                <tr>
                  <td className="font-bold p-6 text-gray-900">Final Verdict</td>
                  <td className="text-center p-6 text-gray-500 font-medium border-l border-gray-100">
                    High effort, limited support
                  </td>
                  <td className="text-center p-6 text-gray-500 font-medium border-l border-gray-100">
                    Powerful but expensive
                  </td>
                  <td className="text-center p-6 text-[#7554b3] font-bold border-l border-gray-100 bg-[#f4f1fa]/50">
                    Best balance of cost, control & support
                  </td>
                </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- Sub-component: FaqSection ---
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
      q: 'What do I get with a Bizvistar plan?',
      a: 'You get a complete business website with hosting, payments, order management, and analytics — all in one place. You can start selling, managing orders, and growing your business without needing multiple tools.'
    },
    {
      q: 'Can I upgrade or downgrade my plan anytime?',
      a: 'Yes, you can switch between plans anytime. Upgrade instantly to unlock more features or downgrade based on your needs — no long-term commitments.'
    },
    {
      q: 'Do I need technical skills to use Bizvistar?',
      a: 'Not at all. Your website is created using AI in seconds, and you can easily edit everything with a simple interface — no coding required.'
    },
    {
      q: 'How do payments work on my website?',
      a: 'You can accept payments via UPI, cards, and wallets directly on your website. All transactions are managed securely and visible in your dashboard.'
    },
    {
      q: 'How will I manage orders?',
      a: 'All your orders are managed from a single dashboard. You also get instant alerts and optional WhatsApp notifications so you never miss a sale.'
    },
    {
      q: 'What kind of support do I get?',
      a: 'You get fast and reliable support via email and WhatsApp. On higher plans, you receive priority assistance for quicker resolution.'
    },
    {
      q: 'Do I get a custom domain?',
      a: 'Yes, the Growth yearly plan includes a free custom domain for one year. You can also connect your own domain anytime.'
    },
    {
      q: 'Can I use Bizvistar for any type of business?',
      a: 'Yes, Bizvistar works for product-based businesses, service providers, and personal brands. You can customize your site based on your needs.'
    },
    {
      q: 'How fast can I launch my website?',
      a: 'You can go live in minutes. Our AI builds your website instantly, and you can start sharing and selling right away.'
    }
  ];
  const handleHelpCenterClick = (e) => {
    e.preventDefault();
    const chatButton = document.querySelector('button[aria-label="Open Chat"]') || document.querySelector('.bg-gradient-to-r.from-\\[\\#8A63D2\\]');
    if (chatButton) {
        chatButton.click();
    } else {
        window.dispatchEvent(new CustomEvent('open-support-widget'));
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
      <div className="lg:col-span-1">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600">
          Haven't found what you're looking for? Try the{' '}
          <button onClick={handleHelpCenterClick} className="text-[#8a63d2] hover:underline hover:text-[#7554b3] font-medium text-left">
            Bizvistar Help Center
          </button>{' '}
          or{' '}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_US || '919013063854'}?text=Hi!%20I%20have%20a%20question%20from%20the%20FAQ%20page.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a63d2] hover:text-[#7554b3] hover:underline font-medium"
          >
            contact us
          </a>.
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

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}