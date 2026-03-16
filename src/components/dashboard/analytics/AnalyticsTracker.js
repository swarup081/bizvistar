"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AnalyticsTracker({ websiteId }) {
  const pathname = usePathname();
  const lastLoggedPath = useRef(null);

  useEffect(() => {
    if (lastLoggedPath.current === pathname) return;
    
    const logView = async () => {
      lastLoggedPath.current = pathname;

      let visitorId = localStorage.getItem('bizvistar_visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('bizvistar_visitor_id', visitorId);
      }

      let locationData = null;
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
           const data = await res.json();
           locationData = {
             country: data.country_name,
             city: data.city,
             region: data.region,
             ip: data.ip
           };
        }
      } catch (err) {
        console.warn('Analytics location fetch failed', err);
      }

      // Determine event type based on path for funnel tracking
      let eventType = 'page_view';
      if (pathname.includes('/product/')) eventType = 'view_item';
      else if (pathname.includes('/cart')) eventType = 'add_to_cart';
      else if (pathname.includes('/checkout')) eventType = 'begin_checkout';

      const { error } = await supabase.from('client_analytics').insert({
        website_id: websiteId,
        event_type: eventType,
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

  return null;
}
