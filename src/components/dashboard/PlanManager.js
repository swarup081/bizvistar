'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CreditCard, Loader2, Check, ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { PLAN_LIMITS } from '@/app/config/razorpay-config';

export default function PlanManager() {
    const [loading, setLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState('monthly');
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

    useEffect(() => {
        fetchPlanData();
    }, []);

    const fetchPlanData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: subs } = await supabase
                .from('subscriptions')
                .select('*, plans(*)')
                .eq('user_id', user.id)
                .in('status', ['active', 'trialing'])
                .order('created_at', { ascending: false })
                .limit(1);

            const sub = subs && subs.length > 0 ? subs[0] : null;

            if (sub && sub.plans) {
                let cycle = 'monthly';
                if (sub.plans.name.toLowerCase().includes('yearly')) cycle = 'yearly';

                setCurrentPlan({
                    id: sub.id,
                    name: sub.plans.name.replace(/ yearly| monthly/gi, ''), // Clean name
                    price: sub.plans.price,
                    status: sub.status,
                    end: sub.current_period_end,
                    cycle: cycle
                });
                setSelectedBilling(cycle);
            } else {
                // If no active subscription is found, assume they are on the default Starter plan (or a free trial).
                setCurrentPlan({
                    id: 'default',
                    name: 'Starter',
                    price: '299',
                    status: 'active',
                    end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // Dummy next month date
                    cycle: 'monthly'
                });
            }

            const { data: website } = await supabase
                .from('websites')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (website) {
                const { count } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('website_id', website.id);
                setProductCount(count || 0);
            }

        } catch (error) {
            console.error("Error fetching plan data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = (targetPlan) => {
        setErrorMsg('');

        if (targetPlan.limit !== -1 && productCount > targetPlan.limit) {
            setErrorMsg(`You cannot downgrade to the ${targetPlan.name} plan because you currently have ${productCount} products. The limit for this plan is ${targetPlan.limit}. Please delete some products before downgrading.`);
            return;
        }

        router.push(`/checkout?plan=${targetPlan.name}&billing=${selectedBilling}&update=true`);
    };

    const getNextPlan = () => {
        if (!currentPlan) return plans[0];

        const currentIndex = plans.findIndex(p => p.name === currentPlan.name);
        if (currentIndex === plans.length - 1 || currentIndex === -1) return null;

        return plans[currentIndex + 1];
    };

    const nextPlan = getNextPlan();

    if (loading) {
        return <div className="p-6 text-center text-gray-500 flex justify-center items-center"><Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading plan details...</div>;
    }

    return (
        <div className="space-y-4 w-full mt-6">

            {/* MERGED PLAN OVERVIEW & UPGRADE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Current Plan */}
                <div className="p-6 md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Current Plan
                        </h3>
                        {currentPlan ? (
                            <div>
                                <h4 className="text-3xl font-extrabold text-gray-900 mb-2">{currentPlan.name}</h4>
                                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider mb-4">
                                    Active
                                </span>
                                <p className="text-gray-600 text-sm mb-1">
                                    Billed {currentPlan.cycle}.
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Next billing date: <span className="font-semibold text-gray-900">{new Date(currentPlan.end).toLocaleDateString()}</span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No active plan found.</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Recommended Upgrade */}
                <div className="md:w-1/2 bg-gray-50 relative overflow-hidden group">
                    {nextPlan ? (
                        <>
                            <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-24 h-24 text-[#8A63D2]" />
                            </div>
                            <div className="p-6 h-full flex flex-col justify-center relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8A63D2]/10 text-[#8A63D2] text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                                    <Zap className="w-3 h-3 fill-[#8A63D2]" /> Recommended Upgrade
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">{nextPlan.name} Plan</h4>
                                <p className="text-gray-600 text-sm mb-5">
                                    {nextPlan.limit === -1 ? 'Unlock unlimited products, advanced analytics, and priority features.' : `Scale your business up to ${nextPlan.limit} products instantly.`}
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedBilling(currentPlan?.cycle || 'monthly');
                                        setShowModal(true);
                                    }}
                                    className="w-full py-3 bg-[#8A63D2] hover:bg-[#7853bd] text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    Explore {nextPlan.name} Features <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                 <Check className="w-6 h-6 text-green-600" />
                             </div>
                             <h4 className="text-xl font-bold text-gray-900 mb-2">You're on the Top Tier!</h4>
                             <p className="text-gray-500 text-sm">You have access to all premium features.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* VIEW ALL PLANS LINK */}
            <div className="text-center">
                <button
                    onClick={() => setShowModal(true)}
                    className="text-xs text-gray-500 hover:text-[#8A63D2] underline underline-offset-4 transition-colors font-medium"
                >
                    Change to a different plan
                </button>
            </div>

            {/* Change Plan Modal */}
            <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[1000px] max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[90] p-8 md:p-10">
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
