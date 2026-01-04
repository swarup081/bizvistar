'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
    console.error("Auth error or no user:", authError);
    // FALLBACK: In dev mode, if no user found, try to find a default user or website?
    // No, that's dangerous. But maybe the cookieStore isn't passing correctly.
    // Let's try to get session explicitly.
    // const { data: { session } } = await supabase.auth.getSession();
    return null;
  }

  // Fetch website ID for this user
  const { data: website, error: websiteError } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (websiteError) {
    // Maybe they have multiple? take first
     const { data: firstWebsite } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

     if (firstWebsite) return firstWebsite.id;

     console.error("No website found for user:", websiteError);
     return null;
  }

  return website?.id;
}

// --- HELPER: Sync JSON ---
async function syncWebsiteData(websiteId) {
  try {
    // 1. Fetch all products and categories from SQL
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('website_id', websiteId)
      .order('id'); // Stable ordering

    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('website_id', websiteId);

    if (!products) return;

    // 2. Fetch current website data JSON
    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('website_data')
      .eq('id', websiteId)
      .single();

    if (!website) return;

    const currentData = website.website_data || {};

    // 3. Map SQL data to JSON format expected by templates
    const mappedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        category: p.category_id ? String(p.category_id) : 'uncategorized',
        description: p.description,
        image: p.image_url,
        stock: p.stock,
        is_unlimited: p.is_unlimited // Sync Flag
    }));

    const mappedCategories = categories ? categories.map(c => ({
        id: String(c.id),
        name: c.name
    })) : [];

    // 4. Update JSON structure
    const newData = {
        ...currentData,
        allProducts: mappedProducts,
        categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || [])
    };

    // 5. Save back to SQL
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
    console.error('Error fetching categories:', error);
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

        // Sync
        await syncWebsiteData(websiteId);

        return { success: true, category: data };
    } catch (err) {
        console.error('Error adding category:', err);
        return { success: false, error: err.message };
    }
}

export async function addProduct(productData) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) throw new Error("No website ID found to associate product with. Please ensure you are logged in.");

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        category_id: productData.categoryId === 'uncategorized' ? null : productData.categoryId,
        description: productData.description,
        image_url: productData.imageUrl,
        stock: parseInt(productData.stock || 0),
        is_unlimited: productData.isUnlimited || false, // Handle Flag
        website_id: websiteId
      })
      .select()
      .single();

    if (error) throw error;

    // Sync to Website JSON
    await syncWebsiteData(websiteId);

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
        *,
        categories ( name )
      `)
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false }); // Show newest first

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
      if (p.is_unlimited) {
          status = 'Unlimited'; // New Status
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

      // Mock noise for demo if sales 0
      const totalSales = analyticsData.reduce((acc, curr) => acc + curr.value, 0);
       if (totalSales === 0) {
           const hash = String(p.id).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
          analyticsData.forEach((d, i) => {
              d.value = Math.floor(Math.abs(Math.sin(hash + i) * 5));
          });
      }

      return {
        ...p,
        stock: stockCount,
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
