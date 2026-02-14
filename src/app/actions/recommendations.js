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
        .eq('website_id', websiteId);
        // Removed order by ID to allow shuffle later if scores match
        
    if (!allProducts || allProducts.length === 0) return [];

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

    // 5. Scoring & Candidates
    const candidates = allProducts.filter(p => String(p.id) !== String(currentProduct.id));
    if (candidates.length === 0) return [];

    const categoryId = currentProduct.category_id || currentProduct.category;
    
    const scored = candidates.map(p => {
        let score = 0;

        // Map image URL for frontend consistency
        if (p.image_url && !p.image) p.image = p.image_url;

        // --- SCORING WEIGHTS ---

        // 1. Pinned (Highest Priority) - +10,000
        if (prioritizedIds.includes(String(p.id))) score += 10000;

        // 2. Also Bought (High Relevance) - +5,000 to +100
        const boughtIdx = alsoBoughtIds.indexOf(p.id);
        if (boughtIdx !== -1) {
            // Decay score based on rank (0 is best)
            score += 5000 - (boughtIdx * 100);
        }

        // 3. Global Best Seller (Medium-High Relevance) - +2,500 to +50
        const globalIdx = globalBestSellerIds.indexOf(p.id);
        if (globalIdx !== -1) {
            score += 2500 - (globalIdx * 50);
        }

        // 4. Same Category (Contextual Relevance) - +1,000
        // Reduced from previous step to ensure Sales signals can override it,
        // BUT we still want it high enough to beat random "In Stock" items.
        // Wait, user said "fix recommendation model based on user previous buying, top product, pushed product and category and random".
        // My previous logic was Category + Random.
        // The user wants ALL signals.
        // Category should be a strong signal, but maybe not stronger than "Also Bought".
        // Also Bought (5000) > Best Seller (2500) > Category (1000) > In Stock (500) > Random (0-1).

        if (String(p.category_id) === String(categoryId)) score += 1000;

        // 5. Stock (Prefer In-Stock items) - +500
        const stock = p.stock === -1 ? 999999 : p.stock;
        if (stock > 0) score += 500;

        // 6. Randomness (Tie-breaker) - 0 to 100
        // Use random to shuffle items with equal scores (e.g., items that are just "In Stock" but no sales)
        score += Math.random() * 100;

        return { ...p, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Limit Result
    let result = scored;
    if (result.length > maxLimit) {
        result = result.slice(0, maxLimit);
    }

    // Ensure minLimit (if possible) is handled by slice logic implicitly (we return up to maxLimit, or all if less).

    return result;
}
