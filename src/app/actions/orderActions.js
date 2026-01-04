'use server';

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    // Check if customer exists by email for this website
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
      // Optional: Update address if changed? For now, we keep the existing ID.
      // But strictly, we should probably update the address.
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
          shipping_address: customerDetails // storing full details JSON
        })
        .select('id')
        .single();

      if (customerError) throw new Error('Failed to create customer: ' + customerError.message);
      customerId = newCustomer.id;
    }

    // 3. Process Products (Ensure they exist)
    const productMap = new Map(); // cartItemId -> dbProductId

    for (const item of cartDetails) {
      // Check if product exists
      // We assume item.name is the unique key for matching if IDs don't match backend
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('website_id', websiteId)
        .eq('name', item.name)
        .limit(1)
        .maybeSingle();

      if (existingProduct) {
        productMap.set(item.id, existingProduct.id);
      } else {
        // Create product
        const { data: newProduct, error: productError } = await supabaseAdmin
          .from('products')
          .insert({
            website_id: websiteId,
            name: item.name,
            price: item.price,
            description: item.description || 'Imported from order',
            image_url: item.image,
            category_id: null // or find a default category
          })
          .select('id')
          .single();

        if (productError) throw new Error('Failed to create product: ' + productError.message);
        productMap.set(item.id, newProduct.id);
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
      product_id: productMap.get(item.id),
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw new Error('Failed to create order items: ' + itemsError.message);

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
    // Updated: Insert into 'deliveries' table
    // trackingDetails has { provider, trackingNumber, date }
    // We map date -> created_at or ignore, usually created_at is auto.
    const { error } = await supabaseAdmin
        .from('deliveries')
        .insert({
            order_id: orderId,
            provider: trackingDetails.provider,
            tracking_number: trackingDetails.trackingNumber,
            // tracking_url can be derived or passed if available
            status: 'shipped'
        });

    if (error) throw new Error(error.message);

    // Also update order status to shipped
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
