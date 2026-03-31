'use client';

import { useState, useEffect, Suspense } from 'react';
import { Check, Smartphone, Wand2, LayoutGrid, Phone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';

function PricingContent() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const searchParams = useSearchParams();
  const isUpdateFlow = searchParams.get('update') === 'true';

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
          setIsYearly(cycle === 'yearly');
      } else {
          setCurrentPlan({ name: 'Starter', cycle: 'monthly' });
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
          'Secure Hosting ',
          'unlimited editing',
          '25 Products ',
          'Standard  Support',
          'Limited Business Tool ',
          'Update your site anytime with mobile editing',
          'Free invoicing',
          'Accept payments',
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
          'Secure Hosting ',
          'unlimited products',
          'Priority  Support',
          'Limited Advanced Business Tools',
          'Update your site anytime with mobile editing',
          'Free invoicing',
          'Accept payments',
          'Advance Analytics',
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
          'Free Custom Domain ',
          'Secure Hosting ',
          'unlimited products',
          'Priority  Support',
          'Advanced Business Tools',
          'Update your site anytime with mobile editing',
          'Accept payments',
          'Onboarding Call',
          'Accept payments',
          'Advance Analytics',
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
          'Secure Hosting ',
          'unlimited editing',
          '25 Products ',
          'Standard  Support',
          'Limited Business Tool ',
          'Update your site anytime with mobile editing',
          'Free invoicing',
          'Accept payments',
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
          'Secure Hosting ',
          'unlimited products',
          'Priority  Support',
          'Limited Advanced Business Tools',
          'Update your site anytime with mobile editing',
          'Free invoicing',
          'Accept payments',
          'Advance Analytics',
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
          'Free Custom Domain ',
          'Secure Hosting ',
          'unlimited products',
          'Priority  Support',
          'Advanced Business Tools',
          'Update your site anytime with mobile editing',
          'Accept payments',
          'Onboarding Call',
          'Accept payments',
          'Advance Analytics',
        ],
      },
    ],
  };
  const [isYearly, setIsYearly] = useState(false);
  const activePlans = isYearly ? plans.yearly : plans.monthly;
  const maxSavings = 17;

  return (
    <div id="pricing" className="py-20 sm:py-25 bg-[#fdfdfd] font-sans text-gray-900 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* --- Header & Toggle --- */}
        <div className="text-center max-w-3xl  mx-auto mb-16">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
             Launch your website. Pick your perfect plan
          </h2>
          <p className="text-xl text-gray-600 mb-10">
          Get a mobile-friendly website with built-in marketing and 24/7 support <br></br>everything you need to start and grow          </p>

        <div className="flex justify-center">
          <Link href="/get-started">
            <button className="px-10 py-4 bg-[#000] text-white text-lg font-bold rounded-2xl transition-all hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3 active:scale-95">
            Start for Free
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
                className="inline-block text-xl"
              >
                →
              </motion.span>
            </button>
          </Link>
         
        </div>
         <p className="text-sm text-gray-500 mt-3  mb-10 font-medium">
            No credit card required*
          </p>

          <div className="relative mb-15 inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
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
                  className={index === 1 ? 'lg:scale-110 lg:-translate-y-4 z-10' : 'lg:scale-100'}
                />
              );
            })}
        </div>

        {/* --- View All Features Link --- */}
        <div className="flex justify-center mt-17">
          <Link href="/pricing" className="group inline-flex items-center gap-2 text-xl font-semibold text-gray-900 relative">
            <span className="flex items-center gap-2 relative">
              View all features
              <span className="transform -rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                →
              </span>
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </div>
        
        {/* --- INCLUDED IN EVERY PLAN SECTION (Matches Pricing Page) --- */}
        <div className="mt-24 bg-[#F4F5F8] rounded-3xl p-6 sm:p-10 lg:p-16 mx-auto max-w-7xl">
          <div className="flex flex-col xl:flex-row gap-12 lg:gap-12 items-start">
            
            {/* Left Header Area */}
            <div className="xl:w-[28%] flex flex-col shrink-0">
              <span className="bg-[#a28ad6] text-white text-xs font-bold px-3 py-1 rounded-[4px] uppercase tracking-widest w-max mb-6">
                Plus
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.15] tracking-tight">
                Included in <br className="hidden xl:block" /> every Website <br className="hidden xl:block" /> Builder plan
              </h2>
            </div>
            
            {/* Right Features Grid */}
            <div className="xl:w-[72%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-8 pt-1">
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
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Our BizVistar Guides are always here to help.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- Sub-component: PlanCard (UPDATED WITH NEW STYLES) ---
const PlanCard = ({ plan, isYearly, className, isUpdateFlow, isCurrentPlan }) => {
  
  // Create the inner content blocks to reuse
  const innerCardContent = (
    <div className="flex flex-col h-full text-left">
      <div className="px-8 pt-8 pb-6 flex-grow flex flex-col relative">
        
        {/* Top row: Title and Badge (Savings or Promos aligned to right) */}
        <div className="flex justify-between items-start mb-3 gap-4">
          <span className="text-3xl font-bold text-gray-900 leading-tight">{plan.name}</span>
          {isYearly && plan.savings && (
            <div className="inline-flex bg-[#f4f1fa] text-[#7554b3] text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap mt-1">
              {plan.savings}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mb-6 flex flex-col">
          {isYearly && plan.originalPrice ? (
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
                'w-full py-3.5 rounded-xl text-[17px] font-bold cursor-not-allowed opacity-60 border-2 border-gray-300 text-gray-500 bg-gray-50'
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
        <p className="text-[12px] font-medium text-gray-600 mb-6 min-h-[18px]">
          {!isYearly ? plan.dailyRate : plan.yearlyTotal}
        </p>

        {/* Highlighted Title/Subtitle Box */}
        <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-5 mt-auto">
          <p className="text-gray-900 font-semibold text-[15px] leading-relaxed">{plan.subtitle}</p>
        </div>
      </div>

      {/* Features List */}
      <div className="px-8 pb-8 pt-2">
          <span className="text-[17px] font-bold text-gray-900 mb-5 block">
            {plan.name === 'Starter' && "Includes:"}
            {plan.name === 'Pro' && "Includes:"}
            {plan.name === 'Growth' && "Includes:"}
          </span>
          <ul className="space-y-3.5 mt-5">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start text-left">
                <Check className={cn("w-[22px] h-[22px] mt-[2px] mr-3 flex-shrink-0", plan.isRecommended ? "text-[#7554b3]" : "text-[#000]")} strokeWidth={2.5} />
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

export default function PricingSection() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}