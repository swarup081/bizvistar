'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function UpgradeModal({ isOpen, onClose }) {
  const plans = [
    {
      name: 'Pro',
      price: '799',
      features: [
        '500 sms for user authentication',
        'Instant WhatsApp Order Notifications',
        'Priority WhatsApp Support',
        '2 Advanced Business Tools',
        'Basic Website Analytics',
        'Unlimited Products'
      ],
      cta: 'Start Pro',
      isRecommended: true,
      color: 'purple'
    },
    {
      name: 'Growth',
      price: '1499',
      features: [
        '1000 sms for user authentication',
        'Google Maps Management',
        'Access to All Business Tools',
        'Free Custom Domain (First Year)',
        'Priority Onboarding Call',
        'Unlimited Products'
      ],
      cta: 'Go for Growth',
      isRecommended: false,
      color: 'gray'
    }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[90] focus:outline-none p-8 font-sans">
          
          <div className="absolute top-4 right-4 z-10">
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">Limit Reached</Dialog.Title>
            <Dialog.Description className="text-gray-600 max-w-lg mx-auto">
              You've reached the limit of 25 products on the Starter plan. Upgrade to add unlimited products and unlock powerful features.
            </Dialog.Description>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6 transition-all",
                  plan.isRecommended ? "border-[#8A63D2] shadow-xl bg-purple-50/20" : "border-gray-200 shadow-md hover:shadow-lg bg-white"
                )}
              >
                {plan.isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8A63D2] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Recommended
                  </div>
                )}
                
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="flex justify-center items-baseline gap-1 mt-2">
                        <span className="text-lg font-bold text-gray-900">₹</span>
                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 font-medium">/mo</span>
                    </div>
                </div>

                <div className="flex-grow mb-6">
                    <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-700">
                                <Check className={cn("w-5 h-5 mr-2 shrink-0", plan.isRecommended ? "text-[#8A63D2]" : "text-green-500")} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <Link href={{
                    pathname: '/checkout',
                    query: {
                        plan: plan.name,
                        billing: 'monthly',
                        price: plan.price
                    }
                }} className="w-full mt-auto">
                    <button className={cn(
                        "w-full py-3 rounded-xl font-bold transition-colors",
                        plan.isRecommended 
                            ? "bg-[#8A63D2] text-white hover:bg-[#7751c2]" 
                            : "bg-gray-900 text-white hover:bg-gray-800"
                    )}>
                        {plan.cta}
                    </button>
                </Link>
              </div>
            ))}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
