'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Reuse the getWebsiteId from productActions (conceptually) or redefine it.
// To avoid importing from another server action file (which can be tricky with Next.js bundling sometimes), I'll copy the helper.
async function getWebsiteId() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
           } catch {
             // Pass
           }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: website } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!website) {
       // fallback maybeSingle
     const { data: firstWebsite } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
     return firstWebsite?.id || null;
  }
  return website.id;
}

// --- Sync Helper ---
// We need to sync stock changes to JSON blob
async function syncWebsiteData(websiteId) {
    // Similar to productActions.js sync logic
    try {
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('website_id', websiteId)
          .order('id');

        const { data: categories } = await supabaseAdmin
          .from('categories')
          .select('id, name')
          .eq('website_id', websiteId);

        if (!products) return;

        const { data: website } = await supabaseAdmin
          .from('websites')
          .select('website_data')
          .eq('id', websiteId)
          .single();

        if (!website) return;

        const currentData = website.website_data || {};

        const mappedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category_id ? String(p.category_id) : 'uncategorized',
            description: p.description,
            image: p.image_url,
            stock: p.stock
        }));

        const mappedCategories = categories ? categories.map(c => ({
            id: String(c.id),
            name: c.name
        })) : [];

        const newData = {
            ...currentData,
            allProducts: mappedProducts,
            categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || [])
        };

        await supabaseAdmin
          .from('websites')
          .update({ website_data: newData })
          .eq('id', websiteId);

      } catch (err) {
        console.error("Error syncing website data:", err);
      }
}

export async function createQuickInvoiceOrder(orderData) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) throw new Error("Unauthorized");

    // 1. Create/Find Customer
    // Since it's a walk-in, we might not have email. We'll use name.
    let customerId = null;

    // Attempt to find customer by name/email if provided
    let query = supabaseAdmin.from('customers').select('id').eq('website_id', websiteId);

    // If email exists, match strictly. If only name, match name?
    // POS typically creates new records or matches strictly.
    // Let's create a new customer record for every walk-in if they don't have a unique identifier,
    // or just upsert if we had an ID. But here we have raw form data.
    // Logic: Insert new customer for this order.

    const { data: newCustomer, error: custError } = await supabaseAdmin
        .from('customers')
        .insert({
            website_id: websiteId,
            name: orderData.customerName,
            email: orderData.customerEmail || null, // Optional
            shipping_address: orderData.customerAddress ? { address: orderData.customerAddress } : {}
        })
        .select()
        .single();

    if (custError) throw custError;
    customerId = newCustomer.id;

    // 2. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
            website_id: websiteId,
            customer_id: customerId,
            total_amount: orderData.totalAmount,
            status: 'paid', // POS orders are usually paid immediately
            source: 'pos'
        })
        .select()
        .single();

    if (orderError) throw orderError;

    // 3. Create Order Items & Update Stock
    for (const item of orderData.items) {
        // Insert Item
        await supabaseAdmin.from('order_items').insert({
            order_id: order.id,
            product_id: item.productId, // If it's a manual item without ID? We need to handle that.
            // Requirement says "allow them to search their existing products".
            // If they enter a custom item, we might need a dummy product or null product_id (if schema allows).
            // Schema: product_id is NOT NULL foreign key.
            // So we MUST select a product.
            // Wait, "The Feature: A simple form: Customer Name + Item + Price."
            // If they type "Consultation" which isn't a product?
            // User said: "allow them to search their existing products... if user wnats to generate a prder which is there in db then fields need to be autogenerated"
            // Implementation: We will require picking a product or creating a temporary one?
            // "we need to make a raw for walkin... yes select order means existing once"
            // Ideally, we should support "Custom Item" if possible, but schema enforces product_id.
            // For now, I will enforce selecting a product. If I need custom items, I'd need to create a "Custom Product" in DB.
            // Let's stick to "Select Product".
            quantity: item.quantity,
            price: item.price
        });

        // Update Stock
        if (item.stock !== -1) { // If not unlimited
             // Fetch current stock to be safe? Or decrement directly.
             // SQL: update products set stock = stock - quantity where id = ?
             const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
                 p_id: item.productId,
                 qty: item.quantity
             });
             // If RPC doesn't exist, use manual update.
             if (stockError) {
                 // Fallback manual
                 const { data: prod } = await supabaseAdmin.from('products').select('stock').eq('id', item.productId).single();
                 if (prod && prod.stock !== -1) {
                     await supabaseAdmin.from('products').update({ stock: prod.stock - item.quantity }).eq('id', item.productId);
                 }
             }
        }
    }

    // 4. Sync
    await syncWebsiteData(websiteId);

    return { success: true, orderId: order.id, orderNumber: order.id };

  } catch (err) {
    console.error("Quick Invoice Error:", err);
    return { success: false, error: err.message };
  }
}

export async function searchProducts(queryStr) {
    const websiteId = await getWebsiteId();
    if (!websiteId) return [];

    let query = supabaseAdmin
        .from('products')
        .select('id, name, price, stock, image_url')
        .eq('website_id', websiteId)
        .ilike('name', `%${queryStr}%`)
        .limit(20);

    const { data } = await query;
    return data || [];
}

export async function getShopDetails() {
    const websiteId = await getWebsiteId();
    if (!websiteId) return null;

    // Fetch from website_data or profiles?
    // User mentioned local storage, but fetching from DB is better if available.
    // Let's fetch website_data.
    const { data } = await supabaseAdmin.from('websites').select('website_data, site_slug').eq('id', websiteId).single();

    // Also fetch user profile for fallback?
    return data;
}
