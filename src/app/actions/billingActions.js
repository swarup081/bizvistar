"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyWebsiteOwnership } from '@/app/actions/onboardingActions';

const createClient = async () => {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {}
                },
                remove(name, options) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {}
                },
            },
        }
    );
};

export async function getOrdersForBilling(websiteId) {
  const verification = await verifyWebsiteOwnership(websiteId);
  if (!verification.success) return { success: false, error: 'Unauthorized' };

    const supabase = await createClient();

    // Fetch orders and their items with product details
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        items:order_items(
            *,
            product:products(name, price)
        )
      `)
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false })
      .limit(50); // Get last 50 for selection

    if (error) {
        console.error("Error fetching billing orders", error);
        return { success: false, error: error.message };
    }

    return { success: true, data: orders };
}
