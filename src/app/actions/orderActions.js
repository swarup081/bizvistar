'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to sync stock back to website JSON
async function syncStockToJSON(websiteId, productMap) {
    try {
        const { data: website } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .single();

        if (!website || !website.website_data || !website.website_data.allProducts) return;

        const allProducts = website.website_data.allProducts;
        let updated = false;

        const newAllProducts = allProducts.map(p => {
            if (productMap.has(p.id)) { 
                 updated = true;
                 return { ...p, stock: productMap.get(p.id) };
            }
            return p;
        });

        if (updated) {
            await supabaseAdmin
                .from('websites')
                .update({ 
                    website_data: {
                        ...website.website_data,
                        allProducts: newAllProducts
                    }
                })
                .eq('id', websiteId);
        }

    } catch (e) {
        console.error("Error syncing stock to JSON:", e);
    }
}

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

export async function submitOrder({ siteSlug, cartDetails, customerDetails }) {
  try {
    // 1. Resolve Website ID
    const { data: website, error: websiteError } = await supabaseAdmin
      .from('websites')
      .select('id, user_id')
      .eq('site_slug', siteSlug)
      .limit(1)
      .single();

    if (websiteError || !website) throw new Error('Website not found');

    const websiteId = website.id;

    // 2. Upsert Customer
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('website_id', websiteId)
      .eq('email', customerDetails.email)
      .limit(1)
      .maybeSingle();

    let customerId;

    if (existingCustomer) {
      customerId = existingCustomer.id;
      await supabaseAdmin
        .from('customers')
        .update({ 
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            shipping_address: customerDetails 
        })
        .eq('id', customerId);
    } else {
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          website_id: websiteId,
          email: customerDetails.email,
          name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          shipping_address: customerDetails
        })
        .select('id')
        .single();

      if (customerError) throw new Error('Failed to create customer: ' + customerError.message);
      customerId = newCustomer.id;
    }

    // 3. Process Products & Update Stock & Calculate Total
    const dbProductMap = new Map(); // cartItemId -> { id, price }
    const stockUpdateMap = new Map(); // dbProductId -> newStockValue
    let calculatedTotal = 0;

    for (const item of cartDetails) {
      // Find product
      let productData = null;
      
      const { data: byId } = await supabaseAdmin
         .from('products')
         .select('id, stock, price')
         .eq('website_id', websiteId)
         .eq('id', item.id)
         .maybeSingle();
         
      if (byId) {
          productData = byId;
      } else {
          // Fallback to name
          const { data: byName } = await supabaseAdmin
             .from('products')
             .select('id, stock, price')
             .eq('website_id', websiteId)
             .eq('name', item.name)
             .limit(1)
             .maybeSingle();
          productData = byName;
      }

      if (productData) {
        dbProductMap.set(item.id, { id: productData.id, price: productData.price });
        
        // Calculate Total
        calculatedTotal += Number(productData.price) * item.quantity;

        // DECREMENT STOCK IF NOT UNLIMITED (Stock = -1)
        if (productData.stock !== -1) {
            const newStock = Math.max(0, (productData.stock || 0) - item.quantity);
            await supabaseAdmin
                .from('products')
                .update({ stock: newStock })
                .eq('id', productData.id);
            stockUpdateMap.set(productData.id, newStock);
        }

      } else {
        // Product MUST exist
        throw new Error(`Product not found: ${item.name}. Cannot complete order.`);
      }
    }

    // 4. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        website_id: websiteId,
        customer_id: customerId,
        total_amount: calculatedTotal,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) throw new Error('Failed to create order: ' + orderError.message);

    // 5. Create Order Items
    const orderItemsData = cartDetails.map(item => {
        const productInfo = dbProductMap.get(item.id);
        return {
          order_id: order.id,
          product_id: productInfo.id,
          quantity: item.quantity,
          price: productInfo.price
        };
    });

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw new Error('Failed to create order items: ' + itemsError.message);

    // 6. SYNC JSON Stock (only if updates happened)
    if (stockUpdateMap.size > 0) {
        await syncStockToJSON(websiteId, stockUpdateMap);
    }

    return { success: true, orderId: order.id };

  } catch (error) {
    console.error('Submit Order Error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { data: order } = await supabaseAdmin
        .from('orders')
        .select('website_id, websites(user_id)')
        .eq('id', orderId)
        .single();

    if (!order || !order.websites || order.websites.user_id !== user.id) {
         throw new Error("Unauthorized: You do not own this order.");
    }

    const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
    
    if (error) throw new Error(error.message);
    return { success: true };
}

export async function addOrderLogistics(orderId, websiteId, trackingDetails) {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { data: website } = await supabaseAdmin
        .from('websites')
        .select('user_id')
        .eq('id', websiteId)
        .single();

    if (!website || website.user_id !== user.id) {
         throw new Error("Unauthorized: You do not own this website.");
    }

    // Also verify order belongs to website
    const { data: order } = await supabaseAdmin
        .from('orders')
        .select('website_id')
        .eq('id', orderId)
        .single();

    if (!order || order.website_id !== websiteId) {
         throw new Error("Mismatch between order and website.");
    }

    const { error } = await supabaseAdmin
        .from('deliveries')
        .insert({
            order_id: orderId,
            provider: trackingDetails.provider,
            tracking_number: trackingDetails.trackingNumber,
            status: 'shipped'
        });

    if (error) throw new Error(error.message);
    
    await supabaseAdmin.from('orders').update({ status: 'shipped' }).eq('id', orderId);

    return { success: true };
}

export async function getOrderLogistics(orderId) {
     const { data, error } = await supabaseAdmin
        .from('deliveries')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

    if (error) return null;
    return data ? {
        provider: data.provider,
        trackingNumber: data.tracking_number,
        date: data.created_at
    } : null;
}
