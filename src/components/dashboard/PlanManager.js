'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CreditCard, Loader2, Check, ArrowRight } from 'lucide-react';
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
        { name: 'Starter', price: '299', yearlyPrice: '2990', limit: PLAN_LIMITS['starter'] },
        { name: 'Pro', price: '799', yearlyPrice: '7990', limit: PLAN_LIMITS['pro'] },
        { name: 'Growth', price: '1499', yearlyPrice: '14990', limit: PLAN_LIMITS['growth'] }
    ];

    useEffect(() => {
        fetchPlanData();
    }, []);

    const fetchPlanData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch active subscription
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('*, plans(*)')
                .eq('user_id', user.id)
                .in('status', ['active', 'trialing'])
                .single();

            if (sub && sub.plans) {
                // Determine billing cycle from plan name (basic parsing, adjust if needed)
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
            } else {
                setCurrentPlan(null);
            }

            // Fetch website to get product count
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

        // Downgrade logic: check limits
        if (targetPlan.limit !== -1 && productCount > targetPlan.limit) {
            setErrorMsg(`You cannot downgrade to the ${targetPlan.name} plan because you currently have ${productCount} products. The limit for this plan is ${targetPlan.limit}. Please delete some products before downgrading.`);
            return;
        }

        // Redirect to checkout with the new plan and 'update' flag
        router.push(`/checkout?plan=${targetPlan.name}&billing=${selectedBilling}&update=true`);
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500 flex justify-center items-center"><Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading plan details...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    Subscription Plan
                </h3>
            </div>

            <div className="p-6">
                {currentPlan ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#8A63D2]/10 rounded-xl border border-[#8A63D2]/20">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-xl font-bold text-gray-900">{currentPlan.name} Plan</h4>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8A63D2] text-white uppercase tracking-wider shadow-sm">Active</span>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Billed {currentPlan.cycle}. Next billing date: <span className="font-semibold text-gray-900">{new Date(currentPlan.end).toLocaleDateString()}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2.5 bg-white border border-gray-200 hover:border-[#8A63D2] hover:text-[#8A63D2] text-gray-700 rounded-xl font-medium transition-all shadow-sm"
                        >
                            Change Plan
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">You do not have an active subscription.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2.5 bg-[#8A63D2] hover:bg-[#7a55bd] text-white rounded-xl font-medium transition-all shadow-md"
                        >
                            View Plans
                        </button>
                    </div>
                )}
            </div>

            {/* Change Plan Modal */}
            <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[900px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[90] p-8">
                        <div className="absolute top-4 right-4">
                            <Dialog.Close asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="text-center mb-8 mt-2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Change your plan</h2>
                            <p className="text-gray-500">Choose the best plan for your growing business.</p>

                            <div className="flex justify-center mt-6">
                                <div className="bg-gray-100 p-1 rounded-full flex items-center">
                                    <button
                                        onClick={() => setSelectedBilling('monthly')}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedBilling === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setSelectedBilling('yearly')}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedBilling === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Yearly
                                        <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Save 20%</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                                <div className="mt-0.5"><X className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-bold text-sm">Cannot Change Plan</h4>
                                    <p className="text-sm mt-1">{errorMsg}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan) => {
                                const isCurrent = currentPlan?.name === plan.name && currentPlan?.cycle === selectedBilling;

                                return (
                                    <div key={plan.name} className={`relative rounded-2xl border p-6 flex flex-col ${isCurrent ? 'border-[#8A63D2] shadow-md bg-purple-50/20' : 'border-gray-200 bg-white hover:border-gray-300'} transition-all`}>
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8A63D2] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                Current Plan
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>

                                        <div className="flex items-baseline gap-1 mb-6">
                                            <span className="text-3xl font-extrabold text-gray-900">₹{selectedBilling === 'yearly' ? plan.yearlyPrice : plan.price}</span>
                                            <span className="text-gray-500 font-medium">/{selectedBilling === 'yearly' ? 'yr' : 'mo'}</span>
                                        </div>

                                        <div className="flex-grow space-y-4 mb-8">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-full bg-green-100 p-0.5 text-green-600">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {plan.limit === -1 ? <strong className="text-gray-900">Unlimited</strong> : <strong className="text-gray-900">Up to {plan.limit}</strong>} products
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handlePlanSelect(plan)}
                                            disabled={isCurrent}
                                            className={`w-full py-3 rounded-xl font-bold transition-all ${
                                                isCurrent
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-lg'
                                            }`}
                                        >
                                            {isCurrent ? 'Active' : 'Select Plan'}
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
