'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function UpdatePlanNavButton({ isMobile = false }) {
  const [nextPlanText, setNextPlanText] = useState(null);
  const [loading, setLoading] = useState(true);

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
                setNextPlanText('Pro');
            } else if (planName.includes('starter') && planName.includes('yearly')) {
                setNextPlanText('Pro Yearly');
            } else if (planName.includes('pro') && !planName.includes('yearly')) {
                setNextPlanText('Growth');
            } else if (planName.includes('pro') && planName.includes('yearly')) {
                setNextPlanText('Growth Yearly');
            } else if (planName.includes('growth') && !planName.includes('yearly')) {
                setNextPlanText('Growth Yearly');
            } else {
                setNextPlanText(null); // Max plan
            }
        } else {
            setNextPlanText('Starter');
        }
      } catch (error) {
        console.error("Error fetching plan for nav button:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  if (loading) return null; // Or a simple skeleton

  // If on the max plan, we just don't show the button or fallback to "Update Plan"
  const buttonText = nextPlanText ? `Update Plan to ${nextPlanText}` : 'Update Plan';

  if (isMobile) {
    return (
        <Link
            href="/pricing?update=true"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#0A1128] to-[#002B5E] text-white shadow-md hover:shadow-lg transition-all"
            title={buttonText}
        >
            <span className="font-bold text-xs tracking-tighter">UP</span>
        </Link>
    );
  }

  return (
    <Link
        href="/pricing?update=true"
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0A1128] to-[#002B5E] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
    >
        <span>{buttonText}</span>
    </Link>
  );
}
