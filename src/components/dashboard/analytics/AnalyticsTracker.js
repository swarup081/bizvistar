"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AnalyticsTracker({ websiteId }) {
  const pathname = usePathname();
  // Use a ref to track if we've already logged this specific path view in this session/mount
  // However, in Next.js, a route change updates pathname, re-running the effect.
  // We want to log every route change.
  const lastLoggedPath = useRef(null);

  useEffect(() => {
    // Avoid double logging in strict mode or rapid updates
    if (lastLoggedPath.current === pathname) return;

    const logView = async () => {
      lastLoggedPath.current = pathname;

      // 1. Get/Set Visitor ID (for unique visitor count)
      let visitorId = localStorage.getItem('bizvistar_visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('bizvistar_visitor_id', visitorId);
      }

      // 2. Get Location (Best Effort)
      let locationData = null;
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
           const data = await res.json();
           // Store minimal data: country, city, ip (maybe hash IP for privacy if needed, but for now simple)
           // The schema has a 'location' jsonb column.
           locationData = {
             country: data.country_name,
             city: data.city,
             region: data.region,
             ip: data.ip // Be careful with GDPR, but user asked for standard analytics.
           };
        }
      } catch (err) {
        // Ignore location errors (ad blockers, rate limits)
        console.warn('Analytics location fetch failed', err);
      }

      // 3. Send to Supabase
      // client_analytics table: website_id, event_type, path, user_agent, location, timestamp
      // We are sending as anonymous user. RLS must allow INSERT for public with website_id.

      const { error } = await supabase.from('client_analytics').insert({
        website_id: websiteId,
        event_type: 'page_view',
        path: pathname,
        user_agent: navigator.userAgent,
        location: locationData ? { ...locationData, visitor_id: visitorId } : { visitor_id: visitorId },
      });

      if (error) {
        console.error('Analytics logging failed:', error);
      }
    };

    if (websiteId) {
        logView();
    }

  }, [pathname, websiteId]);

  return null; // This component renders nothing
}
