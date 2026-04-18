'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Download } from 'lucide-react';
import { usePwa } from './PwaContext';

export default function UpdatePlanNavButton({ isMobile = false }) {
  const [nextPlanText, setNextPlanText] = useState(null);
  const [loading, setLoading] = useState(true);

  // PWA State
  const { deferredPrompt, clearPrompt, isPwaInstalled } = usePwa();
  const [showPwaInstall, setShowPwaInstall] = useState(false);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: subs } = await supabase
          .from('subscriptions')
          .select('*, plans(*)')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('id', { ascending: false })
          .limit(1);

        const currentPlan = subs && subs.length > 0 ? subs[0].plans : null;

        if (currentPlan) {
            const planName = currentPlan.name.toLowerCase();
            if (planName.includes('starter') && !planName.includes('yearly')) {
                setNextPlanText({ name: 'Pro', billing: 'monthly' });
            } else if (planName.includes('starter') && planName.includes('yearly')) {
                setNextPlanText({ name: 'Pro', billing: 'yearly' });
            } else if (planName.includes('pro') && !planName.includes('yearly')) {
                setNextPlanText({ name: 'Growth', billing: 'monthly' });
            } else if (planName.includes('pro') && planName.includes('yearly')) {
                setNextPlanText({ name: 'Growth', billing: 'yearly' });
            } else if (planName.includes('growth') && !planName.includes('yearly')) {
                setNextPlanText({ name: 'Growth', billing: 'yearly' });
            } else {
                setNextPlanText(null); // Max plan
            }
        } else {
            setNextPlanText({ name: 'Starter', billing: 'monthly' });
        }
      } catch (error) {
        console.error("Error fetching plan for nav button:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  // Toggle PWA prompt every 15 seconds
  useEffect(() => {
    if (loading) return;

    if (!isPwaInstalled && deferredPrompt && !nextPlanText) {
      // If they are on max plan, always show install if available
      setShowPwaInstall(true);
      return;
    }

    if (!isPwaInstalled && deferredPrompt && nextPlanText) {
        // Start by randomly assigning it
        setShowPwaInstall(Math.random() > 0.5);

        // Toggle every 15s
        const interval = setInterval(() => {
            setShowPwaInstall(prev => !prev);
        }, 15000);
        return () => clearInterval(interval);
    } else {
        setShowPwaInstall(false);
    }
  }, [loading, isPwaInstalled, deferredPrompt, nextPlanText]);

  if (loading) return (
      <div className={isMobile ? "w-8 h-8 rounded-full bg-gray-200 animate-pulse" : "w-32 h-8 rounded-full bg-gray-200 animate-pulse"}></div>
  );

  const handleInstallClick = async (e) => {
    e.preventDefault();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        // App installed, context will update via event listener
      }
      clearPrompt();
    }
  };

  if (showPwaInstall) {
    if (isMobile) {
      return (
          <button
              onClick={handleInstallClick}
              className="flex items-center justify-center w-auto pl-5 pr-5 h-8 rounded-full bg-gradient-to-r from-[#8A63D2] to-[#6A43B2] text-white shadow-md hover:shadow-lg transition-all border border-[#8A63D2]/50"
              title="Install Dashboard App"
          >
              <Download size={14} className="text-white drop-shadow-md mr-1"/>
              <span className="p-2 text-sm font-bold">Install App</span>
          </button>
      );
    }

    return (
      <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8A63D2] via-[#7B54C4] to-[#8A63D2] bg-[length:200%_auto] text-white text-sm font-bold shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-[#8A63D2]/40 relative overflow-hidden group hover:bg-[position:right_center]"
      >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
          <Download size={16} className="text-white drop-shadow-md animate-bounce"/>
          <span className="drop-shadow-sm">Install App</span>
      </button>
    );
  }

  if (!nextPlanText) return null; // Don't show if max plan

  const buttonText = nextPlanText.billing === 'yearly' 
    ? `Update Plan to ${nextPlanText.name} Yearly` 
    : `Update Plan to ${nextPlanText.name}`;
    
  // Redirect directly to checkout
  const checkoutHref = `/checkout?plan=${nextPlanText.name}&billing=${nextPlanText.billing}&update=true`;

  if (isMobile) {
    return (
        <Link 
            href={checkoutHref} 
            className="flex items-center justify-center w-auto pl-5 pr-5 h-8 rounded-full bg-gradient-to-r from-[#0A1128] to-[#002B5E] text-white shadow-md hover:shadow-lg transition-all border border-blue-900/50"
            title={buttonText}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-yellow-400"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
           <span className="p-2 text-sm font-bold">Update Plan</span>  </Link>
    );
  }

  return (
    <Link 
        href={checkoutHref} 
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0A1128] via-[#002B5E] to-[#0A1128] bg-[length:200%_auto] text-white text-sm font-bold shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-blue-800/40 relative overflow-hidden group hover:bg-[position:right_center]"
    >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-yellow-400 drop-shadow-md"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
        <span className="drop-shadow-sm">{buttonText}</span>
    </Link>
  );
}
