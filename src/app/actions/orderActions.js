'use server';

import { createClient } from '@supabase/supabase-js';

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
            // Check if this product was ordered
            // productMap keys are cart IDs, values are DB IDs.
            // We need to map DB ID -> Quantity bought.
            // Wait, productMap maps CartID -> DBID.
            // We need to know how much stock was reduced for which DBID.
            // We don't have that map readily here passed to this function.
            // Let's pass a map of DbProductId -> NewStock
            if (productMap.has(p.id)) { // Assuming p.id in JSON matches DB ID (which we set in productActions sync)
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

export async function submitOrder({ siteSlug, cartDetails, customerDetails, totalAmount }) {
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

    // 3. Process Products & Update Stock
    const dbProductMap = new Map(); // cartItemId -> dbProductId
    const stockUpdateMap = new Map(); // dbProductId -> newStockValue

    for (const item of cartDetails) {
      // Find product by name (fallback) or ID if we had it
      // Ideally cartDetails item has ID that matches DB if synced.
      // But if it came from older JSON, ID might be '1', '2'.
      // If synced, ID is big int.

      let productId = item.id;

      // Try to find by ID first if it looks like a DB ID (number/string)
      // Or by Name if ID lookup fails
      let productData = null;

      const { data: byId } = await supabaseAdmin
         .from('products')
         .select('id, stock')
         .eq('website_id', websiteId)
         .eq('id', productId)
         .maybeSingle();

      if (byId) {
          productData = byId;
      } else {
          // Fallback to name
          const { data: byName } = await supabaseAdmin
             .from('products')
             .select('id, stock')
             .eq('website_id', websiteId)
             .eq('name', item.name)
             .limit(1)
             .maybeSingle();
          productData = byName;
      }

      if (productData) {
        dbProductMap.set(item.id, productData.id);

        // DECREMENT STOCK
        const newStock = Math.max(0, (productData.stock || 0) - item.quantity);
        await supabaseAdmin
            .from('products')
            .update({ stock: newStock })
            .eq('id', productData.id);

        stockUpdateMap.set(productData.id, newStock);

      } else {
        // Create product (legacy support) - Default stock 0? or -quantity?
        // We set stock to 0 to be safe.
        const { data: newProduct, error: productError } = await supabaseAdmin
          .from('products')
          .insert({
            website_id: websiteId,
            name: item.name,
            price: item.price,
            description: item.description || 'Imported from order',
            image_url: item.image,
            category_id: null,
            stock: 0
          })
          .select('id')
          .single();

        if (productError) throw new Error('Failed to create product: ' + productError.message);
        dbProductMap.set(item.id, newProduct.id);
      }
    }

    // 4. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        website_id: websiteId,
        customer_id: customerId,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) throw new Error('Failed to create order: ' + orderError.message);

    // 5. Create Order Items
    const orderItemsData = cartDetails.map(item => ({
      order_id: order.id,
      product_id: dbProductMap.get(item.id),
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw new Error('Failed to create order items: ' + itemsError.message);

    // 6. SYNC JSON Stock
    await syncStockToJSON(websiteId, stockUpdateMap);

    return { success: true, orderId: order.id };

  } catch (error) {
    console.error('Submit Order Error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
    const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
    
    if (error) throw new Error(error.message);
    return { success: true };
}

export async function addOrderLogistics(orderId, websiteId, trackingDetails) {
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
