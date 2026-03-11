'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PLAN_LIMITS } from '@/app/config/razorpay-config';

export default function PlanManager({ currentPlan, productCount }) {
    const router = useRouter();

    const plans = [
        { name: 'Starter', limit: PLAN_LIMITS['starter'] },
        { name: 'Pro', limit: PLAN_LIMITS['pro'] },
        { name: 'Growth', limit: PLAN_LIMITS['growth'] }
    ];

    const getNextPlan = () => {
        if (!currentPlan) return plans[0];
        const currentIndex = plans.findIndex(p => p.name === currentPlan.name);
        if (currentIndex === plans.length - 1 || currentIndex === -1) return null;
        return plans[currentIndex + 1];
    };

    const nextPlan = getNextPlan();

    const handleDirectUpgrade = () => {
        if (!nextPlan) return;

        // Product limit check before allowing upgrade/downgrade theoretically,
        // but since this card ONLY shows the *next* plan, it's always an upgrade with higher/unlimited limits.
        // Still, safe to leave the structure.
        const billingToUse = currentPlan?.cycle || 'monthly';
        router.push(`/checkout?plan=${nextPlan.name}&billing=${billingToUse}&update=true`);
    };

    if (!nextPlan) return null; // Hide upgrade card if on max plan

    const isStarter = currentPlan?.name === 'Starter';
    // Match inspiration title exactly or adapt based on tier
    const displayTitle = isStarter ? "Bizvistar" : "Vision";

    return (
        <div className="w-full mt-6 space-y-4">
            {/* INSPIRATION CARD DESIGN */}
            <div className="relative rounded-[24px] p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center isolate"
                 style={{
                     background: 'linear-gradient(135deg, #0A1128 0%, #002B5E 50%, #0A1128 100%)',
                     boxShadow: '0 20px 40px -10px rgba(0, 43, 94, 0.4)'
                 }}>

                {/* Glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/30 blur-[60px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>

                {/* Title & Badge */}
                <div className="flex items-center justify-center gap-3 mb-3 z-10">
                    <h3 className="text-4xl font-extrabold text-white tracking-tight">{displayTitle}</h3>
                    <span className="bg-white text-[#0A1128] text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                        {nextPlan.name === 'Pro' ? 'PRO' : nextPlan.name.toUpperCase()}
                    </span>
                </div>

                {/* Subtitle */}
                <p className="text-blue-100/90 text-sm sm:text-base font-medium mb-8 max-w-xs mx-auto leading-relaxed z-10">
                    Upgrade now & unlock more exclusive features
                </p>

                {/* Direct Upgrade Button */}
                <button
                    onClick={handleDirectUpgrade}
                    className="w-full sm:w-[90%] py-3.5 bg-white hover:bg-gray-50 text-[#0A1128] rounded-[16px] font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 z-10"
                >
                    Upgrade
                </button>

                {/* Redirect to Pricing Page */}
                <div className="text-center mt-4 z-10">
                    <button
                        onClick={() => router.push('/pricing?update=true')}
                        className="text-xs text-white/50 hover:text-white font-medium transition-colors border-b border-dashed border-white/30 hover:border-white/70 pb-0.5"
                    >
                        Change to a different plan
                    </button>
                </div>
            </div>
        </div>
    );
}
