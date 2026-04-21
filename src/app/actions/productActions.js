'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { validateUserSubscription } from './subscriptionUtils';
import { getPlanLimits } from '../config/razorpay-config';
import { createNotification } from '@/lib/notificationUtils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- HELPER: Get Current Website ID ---
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

  if (authError || !user) {
    throw new Error('Unauthorized: Please sign in.');
  }

  // Fetch website ID for this user
  // Priority: website with a site_slug (active/configured site) > published > newest
  const { data: website } = await supabaseAdmin
    .from('websites')
    .select('id, site_slug, is_published')
    .eq('user_id', user.id)
    .not('site_slug', 'is', null)
    .order('is_published', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (website) {
    return website.id;
  }

  // Fallback: any website for this user (no slug filter)
  const { data: anyWebsite } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (anyWebsite) return anyWebsite.id;
  throw new Error('No website found for this user.');
}

// Exported wrapper so dashboard pages can get websiteId via admin client (bypasses RLS)
export async function getWebsiteIdForUser() {
  try {
    const id = await getWebsiteId();
    return { websiteId: id };
  } catch (err) {
    return { websiteId: null, error: err.message };
  }
}

// --- HELPER: Sync JSON ---
async function syncWebsiteData(websiteId) {
  try {
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, price, category_id, description, image_url, stock, additional_images, variants')
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
    
    // Map SQL data to JSON format
    const mappedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category_id ? String(p.category_id) : 'uncategorized',
        description: p.description,
        image: p.image_url,
        stock: p.stock, // -1 means Unlimited
        additional_images: p.additional_images || [],
        variants: p.variants || []
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

// --- ACTIONS ---

export async function getCategories() {
  const websiteId = await getWebsiteId();
  if (!websiteId) return [];

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id, name')
    .eq('website_id', websiteId)
    .order('name');
  
  if (error) {
    return [];
  }
  return data;
}

export async function addCategory(name) {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) throw new Error("No website ID found.");

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert({ name, website_id: websiteId })
            .select()
            .single();

        if (error) throw error;

        await syncWebsiteData(websiteId);

        return { success: true, category: data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function updateCategory(categoryId, name) {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) throw new Error("No website ID found.");

        const { error } = await supabaseAdmin
            .from('categories')
            .update({ name })
            .eq('id', categoryId)
            .eq('website_id', websiteId); // Security: only update if belongs to this website

        if (error) throw error;

        await syncWebsiteData(websiteId);

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function deleteCategory(categoryId) {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) throw new Error("No website ID found.");

        const { error } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', categoryId)
            .eq('website_id', websiteId); // Security: only delete if belongs to this website

        if (error) throw error;

        await syncWebsiteData(websiteId);

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function updateProductCategory(productIds, categoryId) {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) throw new Error("No website ID found.");

        const { error } = await supabaseAdmin
            .from('products')
            .update({ category_id: categoryId })
            .in('id', productIds)
            .eq('website_id', websiteId); // Security: only update if belongs to this website

        if (error) throw error;

        await syncWebsiteData(websiteId);

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function getCategoryStats() {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) return { stats: {} };

        const { data: products } = await supabaseAdmin
            .from('products')
            .select('id, name, image_url, category_id, price')
            .eq('website_id', websiteId);

        if (!products) return { stats: {} };

        const { data: orderItems } = await supabaseAdmin
            .from('order_items')
            .select('product_id, quantity');

        const productSales = {};
        (orderItems || []).forEach(item => {
            productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
        });

        const stats = {};
        // Build stats for ALL category_ids found in products, plus uncategorized
        const categoryIds = new Set(products.map(p => p.category_id).filter(Boolean));

        categoryIds.forEach(catId => {
            const catProducts = products.filter(p => p.category_id === catId);
            const count = catProducts.length;
            let topProd = null;
            let maxSales = -1;
            let totalCatSales = 0;

            catProducts.forEach(p => {
                const sales = productSales[p.id] || 0;
                totalCatSales += sales;
                if (sales > maxSales) { maxSales = sales; topProd = p; }
            });

            stats[catId] = { count, topProduct: topProd, sales: totalCatSales };
        });

        return { stats };
    } catch (err) {
        console.error('getCategoryStats error:', err);
        return { stats: {} };
    }
}

export async function addProduct(productData) {
  try {
    // 1. Get User & Website
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
    if (!user) throw new Error("Unauthorized");

    const websiteId = await getWebsiteId(); // Note: getWebsiteId also fetches user internally, but we need user.id here.
    if (!websiteId) throw new Error("No website ID found to associate product with. Please ensure you are logged in.");

    // 2. Validate Subscription & Check Limits
    const subValidation = await validateUserSubscription(user.id);
    const limits = getPlanLimits(subValidation.razorpayPlanId);

    if (limits.maxProducts !== -1) {
        // Count existing products
        const { count, error: countError } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('website_id', websiteId);
            
        if (countError) throw countError;
        
        // Check if adding 1 more would exceed limit
        // (count is current total. if count == 25, you cannot add 26th)
        if (count >= limits.maxProducts) {
             throw new Error(`Plan limit reached (${limits.maxProducts} products). Please upgrade your plan to add more products.`);
        }
    }
    
    // Check if unlimited was requested (-1 flag from UI or blank stock logic handled in UI)
    // The UI should send 'isUnlimited' flag or stock -1.
    // We'll normalize here: If isUnlimited is true OR stock is -1, store -1.
    
    let finalStock = parseInt(productData.stock);
    if (isNaN(finalStock)) finalStock = -1; // Default to unlimited if empty
    if (productData.isUnlimited) finalStock = -1;

    // Ensure we don't store negative numbers other than -1
    if (finalStock < 0) finalStock = -1;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        category_id: productData.categoryId === 'uncategorized' ? null : productData.categoryId,
        description: productData.description,
        image_url: productData.imageUrl,
        stock: finalStock,
        website_id: websiteId,
        additional_images: productData.additionalImages || [],
        variants: productData.variants || []
      })
      .select()
      .single();

    if (error) throw error;

    await syncWebsiteData(websiteId);

    // Notification: Low Stock or Out of Stock (if newly added product is low)
    if (finalStock !== -1 && finalStock <= 5) {
        const type = finalStock === 0 ? 'out_of_stock' : 'low_stock';
        const title = finalStock === 0 ? 'Out of Stock Alert' : 'Low Stock Alert';
        const message = `${productData.name} is ${finalStock === 0 ? 'out of stock' : 'running low'} (${finalStock} remaining).`;
        
        await createNotification({
            websiteId,
            type,
            title,
            message,
            data: { 
                product_id: data.id, 
                product_name: data.name,
                current_stock: finalStock 
            }
        });
    }

    return { success: true, product: data };
  } catch (err) {
    console.error('Error adding product:', err);
    return { success: false, error: err.message };
  }
}

export async function getProducts({ page = 1, limit = 10, search = '', categoryId = null, stockStatus = [] }) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) {
        return { products: [], totalCount: 0 };
    }
    
    let query = supabaseAdmin
      .from('products')
      .select(`
        id, name, price, category_id, description, image_url, stock, additional_images, variants,
        categories ( name )
      `)
      .eq('website_id', websiteId)
      .order('id', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    // Process products
    const processedProducts = await Promise.all(products.map(async (p) => {
      // 1. Real Stock
      const stockCount = p.stock !== undefined ? p.stock : 0; 
      
      let status = 'Active';
      if (stockCount === -1) {
          status = 'Unlimited'; 
      } else {
        if (stockCount === 0) status = 'Out Of Stock';
        else if (stockCount < 10) status = 'Low Stock';
        else if (stockCount > 100) status = 'Overflow Stock';
      }
      
      // 2. Analytics
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('quantity, orders!inner(created_at)')
        .eq('product_id', p.id)
        .gte('orders.created_at', startDate.toISOString());

      const dailySales = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dailySales[key] = 0;
      }

      if (orderItems) {
        orderItems.forEach(item => {
           const dateStr = new Date(item.orders.created_at).toISOString().split('T')[0];
           if (dailySales[dateStr] !== undefined) {
             dailySales[dateStr] += item.quantity || 1;
           }
        });
      }

      const analyticsData = Object.keys(dailySales).sort().map(date => ({
        date,
        value: dailySales[date]
      }));

      // Mock noise
      const totalSales = analyticsData.reduce((acc, curr) => acc + curr.value, 0);
       if (totalSales === 0) {
           const hash = String(p.id).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
          analyticsData.forEach((d, i) => {
              d.value = Math.floor(Math.abs(Math.sin(hash + i) * 5)); 
          });
      }

      return {
        ...p,
        stock: stockCount === -1 ? 'Unlimited' : stockCount,
        stockStatus: status,
        categoryName: p.categories?.name || 'Uncategorized',
        analytics: analyticsData
      };
    }));

    // Filter by Stock Status
    let finalProducts = processedProducts;
    if (stockStatus && stockStatus.length > 0) {
      finalProducts = finalProducts.filter(p => stockStatus.includes(p.stockStatus));
    }

    // Paginate
    const totalCount = finalProducts.length;
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedProducts = finalProducts.slice(from, to);

    return { 
      products: paginatedProducts, 
      totalCount: totalCount 
    };

  } catch (err) {
    console.error('Error fetching products:', err);
    return { products: [], totalCount: 0, error: err.message };
  }
}

// Server Action: Update Product (uses admin client to bypass RLS)
export async function updateProduct(productId, productData) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) throw new Error('No website found.');

    const payload = {
      name: productData.name,
      price: productData.price,
      category_id: (!productData.categoryId || productData.categoryId === 'uncategorized') ? null : parseInt(productData.categoryId),
      description: productData.description,
      image_url: productData.imageUrl,
      stock: productData.stock,
      website_id: websiteId,
      additional_images: productData.additionalImages || [],
      variants: productData.variants || []
    };

    const { error } = await supabaseAdmin
      .from('products')
      .update(payload)
      .eq('id', productId)
      .eq('website_id', websiteId); // Security: only update if product belongs to this website

    if (error) throw error;

    await syncWebsiteData(websiteId);

    return { success: true };
  } catch (err) {
    console.error('Error updating product:', err);
    return { success: false, error: err.message };
  }
}

// Server Action: Delete Product (uses admin client to bypass RLS)
export async function deleteProduct(productId) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) throw new Error('No website found.');

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('website_id', websiteId);

    if (error) throw error;

    await syncWebsiteData(websiteId);

    return { success: true };
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, error: err.message };
  }
}

// Server Action: Fetch all dashboard data (products, categories, analytics) using admin client
export async function getDashboardProducts() {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) return { products: [], categories: [], websiteId: null };

    // Fetch categories
    const { data: cats } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('website_id', websiteId)
      .order('name');

    // Fetch products
    const { data: productsData, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, category_id, description, image_url, stock, additional_images, variants')
      .eq('website_id', websiteId)
      .order('id', { ascending: false });

    if (error) throw error;

    // Fetch sales analytics (last 7 days) — non-blocking, products load even if this fails
    let salesData = null;
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data } = await supabaseAdmin
        .from('order_items')
        .select('product_id, quantity, orders!inner(created_at, website_id)')
        .eq('orders.website_id', websiteId)
        .gte('orders.created_at', sevenDaysAgo.toISOString());
      salesData = data;
    } catch (analyticsErr) {
      console.warn('Analytics fetch failed (non-critical):', analyticsErr.message);
    }

    // Build sales map by product and date
    const salesMap = {};
    if (salesData) {
      salesData.forEach(item => {
        try {
          const date = item.orders.created_at.split('T')[0];
          const pid = item.product_id;
          if (!salesMap[pid]) salesMap[pid] = {};
          if (!salesMap[pid][date]) salesMap[pid][date] = 0;
          salesMap[pid][date] += item.quantity;
        } catch (e) { /* skip malformed item */ }
      });
    }

    const catMap = (cats || []).reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});

    const processed = (productsData || []).map(p => {
      const stockCount = p.stock !== undefined ? p.stock : 0;
      let status = 'Active';
      if (stockCount === -1) status = 'Unlimited';
      else if (stockCount === 0) status = 'Out Of Stock';
      else if (stockCount < 10) status = 'Low Stock';
      else if (stockCount > 100) status = 'Overflow Stock';

      const analyticsData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        analyticsData.push({ date: dateStr, value: salesMap[p.id]?.[dateStr] || 0 });
      }

      const totalSales = analyticsData.reduce((sum, item) => sum + item.value, 0);

      return {
        ...p,
        stock: stockCount === -1 ? 'Unlimited' : stockCount,
        stockStatus: status,
        categoryName: (p.category_id && catMap[p.category_id]) || 'Uncategorized',
        analytics: analyticsData,
        totalSales
      };
    });

    // Sync website_data JSON with actual DB products on every dashboard load
    // This ensures the live site (which reads from website_data.allProducts) stays
    // consistent with the products table. Removes stale/deleted products from the site.
    try {
      await syncWebsiteData(websiteId);
    } catch (syncErr) {
      console.warn('Dashboard sync failed (non-critical):', syncErr.message);
    }

    return {
      products: processed,
      categories: cats || [],
      websiteId
    };
  } catch (err) {
    console.error('getDashboardProducts error:', err);
    return { products: [], categories: [], websiteId: null, error: err.message };
  }
}
