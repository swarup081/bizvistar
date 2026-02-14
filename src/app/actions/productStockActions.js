'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createNotification } from '@/lib/notificationUtils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function notifyLowStock(productId) {
    try {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");

        // Verify ownership and get latest stock
        const { data: product, error } = await supabaseAdmin
            .from('products')
            .select('id, name, stock, website_id, websites(user_id)')
            .eq('id', productId)
            .single();

        if (error || !product) {
             console.error("Product lookup error:", error);
             throw new Error("Product not found.");
        }

        if (!product.websites || product.websites.user_id !== user.id) {
             throw new Error("Unauthorized: You do not own this product.");
        }

        const stock = product.stock;

        // Check low stock condition
        if (stock !== -1 && stock <= 5) {
            const type = stock === 0 ? 'out_of_stock' : 'low_stock';
            const title = stock === 0 ? 'Out of Stock Alert' : 'Low Stock Alert';
            const message = `${product.name} is ${stock === 0 ? 'out of stock' : 'running low'} (${stock} remaining).`;

            await createNotification({
                websiteId: product.website_id,
                type,
                title,
                message,
                data: {
                    product_id: product.id,
                    product_name: product.name,
                    current_stock: stock
                }
            });
        }

        return { success: true };
    } catch (err) {
        console.error("Notify Low Stock Error:", err);
        return { success: false, error: err.message };
    }
}
