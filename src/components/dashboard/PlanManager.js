'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { PLAN_LIMITS } from '@/app/config/razorpay-config';

export default function PlanManager({ currentPlan, productCount }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(currentPlan?.cycle || 'monthly');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const plans = [
        {
            name: 'Starter', price: '299', yearlyPrice: '2990', limit: PLAN_LIMITS['starter'],
            features: [
                'Professional Website',
                'Easy-to-Use Editor',
                'Secure Hosting & Subdomain',
                'Automated Order Emails',
                'Standard Email Support',
            ]
        },
        {
            name: 'Pro', price: '799', yearlyPrice: '7990', limit: PLAN_LIMITS['pro'],
            features: [
                '500 sms for user authentication',
                'Instant WhatsApp Order Notifications',
                'Priority WhatsApp Support',
                '2 Advanced Business Tools',
                'Basic Website Analytics',
                'Unlimited Products'
            ]
        },
        {
            name: 'Growth', price: '1499', yearlyPrice: '14990', limit: PLAN_LIMITS['growth'],
            features: [
                '1000 sms for user authentication',
                'Google Maps Management',
                'Access to All Business Tools',
                'Free Custom Domain (First Year)',
                'Priority Onboarding Call',
                'Unlimited Products'
            ]
        }
    ];

    const getNextPlan = () => {
        if (!currentPlan) return plans[0];
        const currentIndex = plans.findIndex(p => p.name === currentPlan.name);
        if (currentIndex === plans.length - 1 || currentIndex === -1) return null;
        return plans[currentIndex + 1];
    };

    const nextPlan = getNextPlan();

    const handlePlanSelect = (targetPlan, directUpgrade = false) => {
        setErrorMsg('');

        if (targetPlan.limit !== -1 && productCount > targetPlan.limit) {
            setErrorMsg(`You cannot downgrade to the ${targetPlan.name} plan because you currently have ${productCount} products. The limit for this plan is ${targetPlan.limit}. Please delete some products before downgrading.`);
            return;
        }

        // If direct upgrade from the fleshy card, use the user's current billing cycle
        const billingToUse = directUpgrade ? (currentPlan?.cycle || 'monthly') : selectedBilling;
        router.push(`/checkout?plan=${targetPlan.name}&billing=${billingToUse}&update=true`);
    };

    if (!nextPlan) return null; // If they are on Growth, we don't show the upgrade card (maybe just the change link)

    return (
        <div className="w-full mt-6 space-y-4">

            {/* INSPIRATION CARD DESIGN */}
            <div className="relative rounded-[24px] p-6 sm:p-8 overflow-hidden shadow-2xl group flex flex-col items-center justify-center text-center isolate"
                 style={{
                     background: 'linear-gradient(135deg, #0A1128 0%, #002B5E 50%, #0A1128 100%)',
                     boxShadow: '0 20px 40px -10px rgba(0, 43, 94, 0.4)'
                 }}>

                {/* Glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/30 blur-[60px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>

                {/* Title & Badge */}
                <div className="flex items-center justify-center gap-3 mb-3 z-10">
                    <h3 className="text-4xl font-extrabold text-white tracking-tight">{nextPlan.name}</h3>
                    <span className="bg-white text-[#0A1128] text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                        PRO
                    </span>
                </div>

                {/* Subtitle */}
                <p className="text-blue-100/90 text-sm sm:text-base font-medium mb-8 max-w-xs mx-auto leading-relaxed z-10">
                    Upgrade now & unlock more exclusive features
                </p>

                {/* Direct Upgrade Button */}
                <button
                    onClick={() => handlePlanSelect(nextPlan, true)}
                    className="w-full sm:w-[90%] py-3.5 bg-white hover:bg-gray-50 text-[#0A1128] rounded-[16px] font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 z-10"
                >
                    Upgrade
                </button>
            </div>

            {/* VIEW ALL PLANS LINK */}
            <div className="text-center mt-4">
                <button
                    onClick={() => setShowModal(true)}
                    className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors border-b border-dashed border-gray-300 hover:border-gray-900 pb-0.5"
                >
                    Change to a different plan
                </button>
            </div>

            {/* Change Plan Modal */}
            <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[1000px] max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[90] p-8 md:p-10 animate-in zoom-in-95">
                        <div className="absolute top-4 right-4">
                            <Dialog.Close asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Choose your plan</h2>
                            <p className="text-gray-500 text-lg">Select the best plan for your growing business.</p>

                            <div className="flex justify-center mt-8">
                                <div className="bg-gray-100 p-1.5 rounded-full flex items-center shadow-inner">
                                    <button
                                        onClick={() => setSelectedBilling('monthly')}
                                        className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${selectedBilling === 'monthly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setSelectedBilling('yearly')}
                                        className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${selectedBilling === 'yearly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Yearly
                                        <span className="bg-green-100 text-green-700 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider">Save 20%</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                                <div className="mt-0.5"><X className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-sm">Cannot Change Plan</h4>
                                    <p className="text-sm mt-1">{errorMsg}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {plans.map((plan) => {
                                const isCurrent = currentPlan?.name === plan.name && currentPlan?.cycle === selectedBilling;
                                const isPro = plan.name === 'Pro';

                                return (
                                    <div key={plan.name} className={`relative rounded-3xl p-8 flex flex-col transition-all ${isPro ? 'bg-gray-900 text-white shadow-2xl scale-105 z-10' : 'bg-white border border-gray-200 hover:border-gray-300 shadow-lg'} ${isCurrent && !isPro ? 'ring-2 ring-[#8A63D2]' : ''}`}>

                                        {isPro && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-[#8A63D2] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                                                Most Popular
                                            </div>
                                        )}
                                        {isCurrent && !isPro && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-800 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                Current Plan
                                            </div>
                                        )}

                                        <h3 className={`text-2xl font-bold mb-2 ${isPro ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                                        <p className={`text-sm mb-6 ${isPro ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {plan.limit === -1 ? 'Unlimited potential.' : `Up to ${plan.limit} products.`}
                                        </p>

                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-xl font-medium">₹</span>
                                            <span className={`text-5xl font-extrabold tracking-tight ${isPro ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedBilling === 'yearly' ? plan.yearlyPrice : plan.price}
                                            </span>
                                            <span className={`font-medium ${isPro ? 'text-gray-400' : 'text-gray-500'}`}>
                                                /{selectedBilling === 'yearly' ? 'yr' : 'mo'}
                                            </span>
                                        </div>

                                        <div className="flex-grow space-y-4 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className={`mt-1 rounded-full p-0.5 flex-shrink-0 ${isPro ? 'bg-purple-500/20 text-purple-400' : 'bg-green-100 text-green-600'}`}>
                                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                    </div>
                                                    <span className={`text-sm ${isPro ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePlanSelect(plan)}
                                            disabled={isCurrent}
                                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                                                isCurrent
                                                    ? (isPro ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                                    : (isPro ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-lg')
                                            }`}
                                        >
                                            {isCurrent ? 'Active' : `Get ${plan.name}`}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
