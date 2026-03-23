"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyWebsiteOwnership } from '@/app/actions/onboardingActions';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

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

export async function getCustomersWithMetrics(websiteId) {
  const verification = await verifyWebsiteOwnership(websiteId);
  if (!verification.success) return { success: false, error: 'Unauthorized' };

  /* Using supabaseAdmin instead to bypass RLS */

  // 1. Get all customers
  const { data: customers, error: custError } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('website_id', websiteId)
    .order('id', { ascending: false });

  if (custError) {
    console.error('Error fetching customers:', custError);
    return { success: false, error: custError.message };
  }

  // 2. Get all orders for this website
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from('orders')
    .select('customer_id, total_amount, created_at, status')
    .eq('website_id', websiteId)
    .neq('status', 'canceled');

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return { success: false, error: ordersError.message };
  }

  // 3. Aggregate data
  const customerMap = {};

  customers.forEach(c => {
      customerMap[c.id] = {
          ...c,
          total_spend: 0,
          order_count: 0,
          last_order_date: null
      };
  });

  orders.forEach(o => {
      if (o.customer_id && customerMap[o.customer_id]) {
          customerMap[o.customer_id].total_spend += Number(o.total_amount);
          customerMap[o.customer_id].order_count += 1;

          const orderDate = new Date(o.created_at);
          const currentLast = customerMap[o.customer_id].last_order_date ? new Date(customerMap[o.customer_id].last_order_date) : null;

          if (!currentLast || orderDate > currentLast) {
              customerMap[o.customer_id].last_order_date = o.created_at;
          }
      }
  });

  const processedCustomers = Object.values(customerMap).map(c => ({
      ...c,
      aov: c.order_count > 0 ? (c.total_spend / c.order_count) : 0
  })).sort((a, b) => b.total_spend - a.total_spend); // Sort by highest spend first

  return { success: true, data: processedCustomers };
}
