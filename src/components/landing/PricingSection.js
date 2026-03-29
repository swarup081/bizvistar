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
        subtitle: 'The Digital Business Card',
        price: '299',
        dailyRate: 'Just ₹10 a day',
        cta: 'Get Started',
        isRecommended: false,
        features: [
          'Professional Website',
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
          'Professional Website',
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

          <div className="relative inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
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
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 lg:gap-8 items-end max-w-6xl mx-auto snap-x snap-mandatory pb-8 lg:pb-0 no-scrollbar px-4 lg:px-0">
            {activePlans.map((plan, index) => {
              const currentCycle = isYearly ? 'yearly' : 'monthly';
              const isCurrentPlan = currentPlan?.name === plan.name && currentPlan?.cycle === currentCycle;

              // On mobile, the recommended plan (index 1) should be shown first, followed by others
              const orderClass = index === 1 ? 'order-first lg:order-none' : '';

              return (
                <div key={plan.name} className={`min-w-[85vw] md:min-w-[350px] lg:min-w-0 snap-center lg:snap-align-none ${orderClass}`}>
                  <PlanCard
                    plan={plan}
                    isYearly={isYearly}
                    isUpdateFlow={isUpdateFlow}
                    isCurrentPlan={isCurrentPlan}
                    className={index === 1 ? 'lg:scale-110 lg:-translate-y-4 z-10' : 'lg:scale-100'}
                  />
                </div>
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
            <div className="xl:w-[72%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-8 pt-1">
              <div className="flex flex-col">
                <Smartphone className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">Mobile-friendly site</h3>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Easily reach customers wherever they are.</p>
              </div>
              
              <div className="flex flex-col">
                <Wand2 className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">100+ beautiful templates</h3>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Dazzle customers with our professional templates.</p>
              </div>
              
              <div className="flex flex-col">
                <LayoutGrid className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">Marketing dashboard</h3>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Real-time tracking of your performance and presence.</p>
              </div>
              
              <div className="flex flex-col">
                <Phone className="w-6 h-6 mb-4 text-gray-900" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug min-h-[44px]">24/7 expert support</h3>
                <p className="text-gray-700 text-[13px] xl:text-[14px] leading-relaxed mt-3">Our GoDaddy Guides are always here to help.</p>
              </div>
            </div>

          </div>
        </div>
        {/* --- END INCLUDED SECTION --- */}

      </div>
    </div>
  );
}

// --- Sub-component: PlanCard ---
const PlanCard = ({ plan, isYearly, className, isUpdateFlow, isCurrentPlan }) => (
  <div 
    className={cn(
      'flex flex-col rounded-3xl bg-white transition-all duration-300 ease-out', 
      plan.isRecommended 
        ? 'border-[3px] border-[#8A63D2] shadow-2xl relative'
        : 'border border-gray-200 shadow-lg hover:shadow-xl',
      className
    )}
  >
    {plan.isRecommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8A63D2] text-white px-6 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase">
        Recommended
      </div>
    )}

    <div className="p-10 text-center flex-grow flex flex-col">
      <h3 className="text-5xl font-bold text-gray-900">{plan.name}</h3>
      <p className="text-gray-500 font-medium mt-2">{plan.subtitle}</p>

      <div className="my-8">
        {isYearly && plan.originalPrice && (
          <p className="text-lg font-medium text-gray-400 line-through">
            ₹{plan.originalPrice}/mo
          </p>
        )}

        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-gray-900">₹</span>
          <span className="text-6xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
          <span className="text-xl font-medium text-gray-500">/month</span>
        </div>

         {isYearly && plan.savings && (
             <div className="mt-4 inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1 rounded-full">
                 {plan.savings}
             </div>
         )}
      </div>

      {isCurrentPlan ? (
          <button 
            disabled
            className={cn(
              'w-full py-4 rounded-full text-xl font-bold cursor-not-allowed opacity-60 border-2 border-gray-300 text-gray-500 bg-gray-50'
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
                'w-full py-4 rounded-full text-xl font-bold transition-all duration-200 transform hover:-translate-y-1',
                plan.isRecommended
                  ? 'bg-[#7554b3] text-white hover:bg-[#5c428c] shadow-md hover:shadow-lg'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              )}
            >
              {plan.cta}
            </button>
          </Link>
      )}

       {!isYearly && (
         <p className="text-base font-semibold text-[#8A63D2] mt-4">{plan.dailyRate}</p>
      )}
      {isYearly && (
           <p className="text-sm font-medium text-gray-500 mt-4">{plan.yearlyTotal}</p>
      )}
    </div>

    <div className="p-10 pt-0">
       <div className="border-t border-gray-100 pt-8">
          {plan.name === 'Starter' && <h4 className="text-base font-semibold text-gray-800 mb-4">Includes:</h4>}
          {plan.name === 'Pro' && <h4 className="text-base font-semibold text-gray-800 mb-4">Everything in Starter, plus:</h4>}
          {plan.name === 'Growth' && <h4 className="text-base font-semibold text-gray-800 mb-4">Everything in Pro, plus:</h4>}
          
          <ul className="space-y-4">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start text-left">
                <Check className={cn("w-6 h-6 mt-0.5 mr-3 flex-shrink-0", plan.isRecommended ? "text-[#8A63D2]" : "text-[#8A63D2]")} strokeWidth={2.5} />
                <span className="text-gray-700 font-medium text-[15px] leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
       </div>
    </div>
  </div>
);

export default function PricingSection() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}