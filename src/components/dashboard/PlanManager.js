'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLAN_LIMITS } from '@/app/config/razorpay-config';
import { 
    cancelSubscriptionAction, 
    pauseSubscriptionAction, 
    resumeSubscriptionAction,
    reconcileSubscriptionAction
} from '@/app/actions/subscriptionLifecycleActions';
import { Loader2, AlertTriangle, CheckCircle2, Pause, Play, X, RefreshCw } from 'lucide-react';

export default function PlanManager({ currentPlan, productCount, subscriptionStatus }) {
    const router = useRouter();
    const [actionLoading, setActionLoading] = useState(null); // 'cancel' | 'pause' | 'resume' | 'reconcile' | null
    const [confirmAction, setConfirmAction] = useState(null); // 'cancel' | 'pause' | null
    const [actionResult, setActionResult] = useState(null); // { type: 'success'|'error', message: string }

    const plans = [
        { name: 'Starter', limit: PLAN_LIMITS['starter'] },
        { name: 'Pro', limit: PLAN_LIMITS['pro'] },
        { name: 'Growth', limit: PLAN_LIMITS['growth'] }
    ];

    const status = subscriptionStatus || currentPlan?.status || 'active';
    const isPaused = status === 'paused';
    const isCanceled = status === 'canceled';
    const isPastDue = status === 'past_due';
    const isActive = status === 'active';
    const isCancelPending = currentPlan?.cancelAtPeriodEnd === true;

    const getNextPlanInfo = () => {
        if (!currentPlan || isPaused || isCanceled || isPastDue) return null;
        const currentIndex = plans.findIndex(p => p.name === currentPlan.name);
        
        if (currentIndex === plans.length - 1) {
            if (currentPlan.cycle === 'monthly') {
                return { plan: plans[currentIndex], billing: 'yearly', isYearlyUpsell: true };
            }
            return null;
        }
        
        if (currentIndex === -1) return null;
        return { plan: plans[currentIndex + 1], billing: currentPlan.cycle || 'monthly', isYearlyUpsell: false };
    };

    const nextPlanInfo = getNextPlanInfo();

    const handleDirectUpgrade = () => {
        if (!nextPlanInfo) return;
        const { plan, billing } = nextPlanInfo;
        router.push(`/checkout?plan=${plan.name}&billing=${billing}&update=true`);
    };

    // --- Lifecycle Actions ---

    const handleCancel = async () => {
        setActionLoading('cancel');
        setActionResult(null);
        try {
            const res = await cancelSubscriptionAction();
            if (res.success) {
                setActionResult({ type: 'success', message: res.message });
                setConfirmAction(null);
                // Refresh after short delay
                setTimeout(() => router.refresh(), 2000);
            } else {
                setActionResult({ type: 'error', message: res.error });
            }
        } catch (err) {
            setActionResult({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setActionLoading(null);
        }
    };

    const handlePause = async () => {
        setActionLoading('pause');
        setActionResult(null);
        try {
            const res = await pauseSubscriptionAction();
            if (res.success) {
                setActionResult({ type: 'success', message: res.message });
                setConfirmAction(null);
                setTimeout(() => router.refresh(), 2000);
            } else {
                setActionResult({ type: 'error', message: res.error });
            }
        } catch (err) {
            setActionResult({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleResume = async () => {
        setActionLoading('resume');
        setActionResult(null);
        try {
            const res = await resumeSubscriptionAction();
            if (res.success) {
                setActionResult({ type: 'success', message: res.message });
                setTimeout(() => router.refresh(), 2000);
            } else {
                setActionResult({ type: 'error', message: res.error });
            }
        } catch (err) {
            setActionResult({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleReconcile = async () => {
        setActionLoading('reconcile');
        setActionResult(null);
        try {
            const res = await reconcileSubscriptionAction();
            if (res.success) {
                setActionResult({ type: res.reconciled ? 'success' : 'info', message: res.message });
                if (res.reconciled) {
                    setTimeout(() => router.refresh(), 2000);
                }
            } else {
                setActionResult({ type: 'error', message: res.error });
            }
        } catch (err) {
            setActionResult({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setActionLoading(null);
        }
    };

    // --- CONFIRMATION MODAL ---
    const ConfirmationModal = () => {
        if (!confirmAction) return null;
        const isCancel = confirmAction === 'cancel';
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCancel ? 'bg-red-100' : 'bg-amber-100'}`}>
                            {isCancel ? (
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            ) : (
                                <Pause className="w-6 h-6 text-amber-600" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {isCancel ? 'Cancel Subscription?' : 'Pause Subscription?'}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {isCancel 
                                    ? `Your subscription will remain active until ${currentPlan?.end ? new Date(currentPlan.end).toLocaleDateString() : 'the end of your billing period'}. After that, your website will be taken offline. All your data (products, orders, settings) will be safely preserved.`
                                    : 'Your website will be taken offline immediately, but all your data (products, orders, settings) will be safely preserved. You can resume anytime to bring everything back.'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button 
                            onClick={() => setConfirmAction(null)}
                            disabled={actionLoading}
                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                        >
                            Keep Plan
                        </button>
                        <button 
                            onClick={isCancel ? handleCancel : handlePause}
                            disabled={actionLoading}
                            className={`px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-colors disabled:opacity-70 ${
                                isCancel ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                            }`}
                        >
                            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isCancel ? 'Yes, Cancel' : 'Yes, Pause'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- PAUSED STATE UI ---
    if (isPaused) {
        return (
            <div className="w-full mt-6 space-y-4">
                <ConfirmationModal />
                {/* Result Banner */}
                {actionResult && (
                    <div className={`p-3 rounded-xl text-sm font-medium flex items-start gap-2 ${
                        actionResult.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        {actionResult.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                        <span>{actionResult.message}</span>
                    </div>
                )}

                <div className="relative rounded-[24px] p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center isolate" 
                     style={{
                         background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                         boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.3)'
                     }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    <div className="flex items-center justify-center gap-3 mb-3 z-10">
                        <Pause className="w-6 h-6 text-amber-400" />
                        <span className="bg-amber-400 text-gray-900 text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                            Paused
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 z-10">Subscription Paused</h3>
                    <p className="text-indigo-200/80 text-sm mb-6 max-w-xs mx-auto z-10">
                        Your website is offline but all your data is safe. Resume anytime to bring it back.
                    </p>

                    <button
                        onClick={handleResume}
                        disabled={actionLoading === 'resume'}
                        className="w-full sm:w-[90%] py-3.5 bg-white hover:bg-gray-50 text-gray-900 rounded-[16px] font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 z-10 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {actionLoading === 'resume' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                        Resume Subscription
                    </button>

                    <button
                        onClick={handleReconcile}
                        disabled={actionLoading === 'reconcile'}
                        className="text-xs text-white/40 hover:text-white/70 mt-3 z-10 flex items-center gap-1 transition-colors"
                    >
                        {actionLoading === 'reconcile' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        Sync subscription status
                    </button>
                </div>
            </div>
        );
    }

    // --- CANCELED / PAST DUE STATE UI ---
    if (isCanceled || isPastDue) {
        return (
            <div className="w-full mt-6 space-y-4">
                {actionResult && (
                    <div className={`p-3 rounded-xl text-sm font-medium flex items-start gap-2 ${
                        actionResult.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        {actionResult.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                        <span>{actionResult.message}</span>
                    </div>
                )}

                <div className="relative rounded-[24px] p-6 sm:p-8 overflow-hidden shadow-lg flex flex-col items-center justify-center text-center border border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <X className="w-5 h-5 text-red-500" />
                        <span className="bg-red-100 text-red-700 text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                            {isCanceled ? 'Canceled' : 'Payment Issue'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {isCanceled ? 'Subscription Canceled' : 'Payment Required'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                        {isCanceled 
                            ? 'Your website is offline. Subscribe again to bring it back with all your data intact.'
                            : 'There was a payment issue. Please update your payment method.'}
                    </p>

                    <button
                        onClick={() => router.push('/pricing')}
                        className="w-full sm:w-[90%] py-3 bg-gray-900 hover:bg-black text-white rounded-[16px] font-bold transition-all"
                    >
                        {isCanceled ? 'Subscribe Again' : 'Fix Payment'}
                    </button>

                    <button
                        onClick={handleReconcile}
                        disabled={actionLoading === 'reconcile'}
                        className="text-xs text-gray-400 hover:text-gray-600 mt-3 flex items-center gap-1 transition-colors"
                    >
                        {actionLoading === 'reconcile' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        Paid but website still offline? Click to sync
                    </button>
                </div>
            </div>
        );
    }

    // --- ACTIVE STATE UI ---
    const isMaxPlan = !nextPlanInfo;

    return (
        <div className="w-full mt-6 space-y-4">
            <ConfirmationModal />

            {/* Result Banner */}
            {actionResult && (
                <div className={`p-3 rounded-xl text-sm font-medium flex items-start gap-2 ${
                    actionResult.type === 'success' ? 'bg-green-50 text-green-800' 
                    : actionResult.type === 'info' ? 'bg-blue-50 text-blue-800'
                    : 'bg-red-50 text-red-800'
                }`}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{actionResult.message}</span>
                </div>
            )}

            {/* Cancel Pending Notice */}
            {isCancelPending && (
                <div className="p-3 rounded-xl text-sm font-medium bg-amber-50 text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                        Cancellation scheduled. Your plan stays active until {currentPlan?.end ? new Date(currentPlan.end).toLocaleDateString() : 'end of period'}.
                    </span>
                </div>
            )}

            {/* UPGRADE CARD (only for non-max plans) */}
            {!isMaxPlan && nextPlanInfo && (
                <div className="relative rounded-[24px] p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center isolate" 
                     style={{
                         background: 'linear-gradient(135deg, #0A1128 0%, #002B5E 50%, #0A1128 100%)',
                         boxShadow: '0 20px 40px -10px rgba(0, 43, 94, 0.4)'
                     }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/30 blur-[60px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-brand-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    <div className="flex items-center justify-center gap-3 mb-3 z-10">
                        <h3 className="text-4xl font-extrabold text-white tracking-tight">Bizvistar</h3>
                        <span className="bg-white text-[#0A1128] text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                            {nextPlanInfo.isYearlyUpsell ? `${nextPlanInfo.plan.name.toUpperCase()} YEARLY` : nextPlanInfo.plan.name.toUpperCase()}
                        </span>
                    </div>

                    <p className="text-blue-100/90 text-sm sm:text-base font-medium mb-8 max-w-xs mx-auto leading-relaxed z-10">
                        {nextPlanInfo.isYearlyUpsell ? "Pay for 10 months and get 2 months free!" : "Upgrade now & unlock more exclusive features"}
                    </p>

                    <button 
                        onClick={handleDirectUpgrade}
                        className="w-full sm:w-[90%] py-3.5 bg-white hover:bg-gray-50 text-[#0A1128] rounded-[16px] font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 z-10"
                    >
                        Upgrade
                    </button>

                    <div className="text-center mt-4 z-10">
                        <button 
                            onClick={() => router.push('/pricing?update=true')}
                            className="text-xs text-white/50 hover:text-white font-medium transition-colors border-b border-dashed border-white/30 hover:border-white/70 pb-0.5"
                        >
                            Change to a different plan
                        </button>
                    </div>
                </div>
            )}

            {/* MAX PLAN — Change plan option */}
            {isMaxPlan && (
                <button 
                    onClick={() => router.push('/pricing?update=true')}
                    className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-[16px] font-bold text-sm transition-all"
                >
                    Change Plan
                </button>
            )}

            {/* SUBSCRIPTION MANAGEMENT ACTIONS */}
            {isActive && !isCancelPending && (
                <div className="flex gap-2">
                    <button
                        onClick={() => setConfirmAction('pause')}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                        <Pause className="w-3.5 h-3.5" />
                        Pause
                    </button>
                    <button
                        onClick={() => setConfirmAction('cancel')}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
