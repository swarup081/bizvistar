'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role Key if available for secure access, otherwise fall back to Anon Key (RLS applies)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchSuggestedProducts(websiteId, currentProduct, minLimit = 2, maxLimit = 8) {
    if (!websiteId || !currentProduct) return [];
    
    // 1. Fetch "Also Bought" (Collaborative Filtering)
    let alsoBoughtIds = [];
    try {
        const { data: ordersWithProduct } = await supabase
            .from('order_items')
            .select('order_id')
            .eq('product_id', currentProduct.id)
            .limit(50);
        
        if (ordersWithProduct && ordersWithProduct.length > 0) {
            const orderIds = ordersWithProduct.map(o => o.order_id);
            const { data: otherItems } = await supabase
                .from('order_items')
                .select('product_id')
                .in('order_id', orderIds)
                .neq('product_id', currentProduct.id); 
            
            const freq = {};
            otherItems?.forEach(item => {
                freq[item.product_id] = (freq[item.product_id] || 0) + 1;
            });
            
            alsoBoughtIds = Object.keys(freq).sort((a,b) => freq[b] - freq[a]).map(Number);
        }
    } catch (err) {
        console.error("Error fetching recommendations (Also Bought):", err);
    }

    // 2. Fetch Global Best Sellers
    let globalBestSellerIds = [];
    try {
        const { data: recentOrders } = await supabase
            .from('orders')
            .select('id')
            .eq('website_id', websiteId)
            .order('created_at', { ascending: false })
            .limit(100);

        if (recentOrders && recentOrders.length > 0) {
            const orderIds = recentOrders.map(o => o.id);
            const { data: items } = await supabase
                .from('order_items')
                .select('product_id')
                .in('order_id', orderIds);

            if (items) {
                const freq = {};
                items.forEach(item => {
                    freq[item.product_id] = (freq[item.product_id] || 0) + 1;
                });
                globalBestSellerIds = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).map(Number);
            }
        }
    } catch (e) {
        console.error("Error fetching recommendations (Best Sellers):", e);
    }

    // 3. Fetch All Products
    const { data: allProducts } = await supabase
        .from('products')
        .select('*')
        .eq('website_id', websiteId)
        .order('id', { ascending: false });
        
    if (!allProducts) return [];

    // 4. Get Pinned Products
    let prioritizedIds = [];
    try {
        const { data: site } = await supabase
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .single();
        
        if (site?.website_data?.landing_settings?.prioritizedProducts) {
            prioritizedIds = site.website_data.landing_settings.prioritizedProducts.map(String);
        }
    } catch (e) { /* ignore */ }

    // 5. Scoring
    const candidates = allProducts.filter(p => String(p.id) !== String(currentProduct.id));
    const categoryId = currentProduct.category_id || currentProduct.category;
    
    const scored = candidates.map(p => {
        let score = 0;
        
        // Pinned (Highest)
        if (prioritizedIds.includes(String(p.id))) score += 10000;

        // Also Bought (High)
        const boughtIdx = alsoBoughtIds.indexOf(p.id);
        if (boughtIdx !== -1) score += 5000 - (boughtIdx * 100);

        // Global Best Seller (Medium-High)
        const globalIdx = globalBestSellerIds.indexOf(p.id);
        if (globalIdx !== -1) score += 2500 - (globalIdx * 50);

        // Same Category (Contextual - Strong)
        if (String(p.category_id) === String(categoryId)) score += 1000;

        // Stock
        const stock = p.stock === -1 ? 999999 : p.stock;
        if (stock > 0) score += 500;

        // Tie-breaker
        score += (p.id / 100000); 

        return { ...p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Filter to ensure we have at least minLimit if possible, max maxLimit
    // If we have very few products, we just return what we have.
    // The requirement says "at least 2 and at most 8 (given that there are this many product)".

    let result = scored;
    if (result.length > maxLimit) {
        result = result.slice(0, maxLimit);
    }

    // Ensure at least minLimit if available
    // (This logic is implicitly handled because we sliced; if we had < maxLimit, we kept all.
    // If we have < minLimit, we return all we have, which is the best we can do).

    return result;
}
