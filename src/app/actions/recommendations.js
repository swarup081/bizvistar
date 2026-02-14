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

    // 5. Scoring & Categorization
    const candidates = allProducts.filter(p => String(p.id) !== String(currentProduct.id));
    if (candidates.length === 0) return [];

    const categoryId = currentProduct.category_id || currentProduct.category;
    
    const highRelevance = [];
    const discovery = [];

    candidates.forEach(p => {
        let score = 0;

        // Map image
        if (p.image_url && !p.image) p.image = p.image_url;

        // Scoring Factors
        let isRelevant = false;

        // Pinned
        if (prioritizedIds.includes(String(p.id))) {
            score += 10000;
            isRelevant = true;
        }

        // Also Bought
        const boughtIdx = alsoBoughtIds.indexOf(p.id);
        if (boughtIdx !== -1) {
            score += 5000 - (boughtIdx * 100);
            isRelevant = true;
        }

        // Global Best Seller
        const globalIdx = globalBestSellerIds.indexOf(p.id);
        if (globalIdx !== -1) {
            score += 2500 - (globalIdx * 50);
            isRelevant = true;
        }

        // Same Category
        if (String(p.category_id) === String(categoryId)) {
            score += 1000;
            isRelevant = true;
        }

        // Stock
        const stock = p.stock === -1 ? 999999 : p.stock;
        if (stock > 0) score += 500;

        // Random Tie-breaker
        score += Math.random() * 100;

        p.score = score;

        if (isRelevant) {
            highRelevance.push(p);
        } else {
            discovery.push(p);
        }
    });

    // Sort buckets
    highRelevance.sort((a, b) => b.score - a.score);
    discovery.sort((a, b) => b.score - a.score);

    // Build Mixed Result
    // Goal: 50% Relevant / 50% Discovery if possible
    // But prioritize Relevant if Discovery is weak/empty

    const finalResult = [];
    const halfLimit = Math.ceil(maxLimit / 2);

    // 1. Take up to 50% from High Relevance
    const relevantSlice = highRelevance.slice(0, halfLimit);
    finalResult.push(...relevantSlice);

    // 2. Take up to 50% from Discovery (Random/Other)
    const discoveryNeeded = maxLimit - finalResult.length;
    const discoverySlice = discovery.slice(0, discoveryNeeded);
    finalResult.push(...discoverySlice);

    // 3. If we still have space and High Relevance has more, fill it up
    if (finalResult.length < maxLimit) {
        const remainingRelevant = highRelevance.slice(halfLimit);
        const needed = maxLimit - finalResult.length;
        finalResult.push(...remainingRelevant.slice(0, needed));
    }

    // 4. If still space, fill with any remaining Discovery
    if (finalResult.length < maxLimit) {
        const remainingDiscovery = discovery.slice(discoveryNeeded);
        const needed = maxLimit - finalResult.length;
        finalResult.push(...remainingDiscovery.slice(0, needed));
    }

    // 5. Shuffle final result to mix them visually?
    // Or keep them sorted by score?
    // User requested "random and all", implies a mix.
    // Let's shuffle the final set so "Best" isn't always first if we want discovery.
    // But usually "You might like" implies relevance first.
    // Let's keep sorted by score for quality, but since we forced Discovery items in, they will be there.
    // Actually, re-sorting by score might push Discovery items to the end if their score is low.
    // We want them interleaved or visible.
    // Let's just return the constructed list (Relevant first, then Discovery).
    // Or shuffle. Let's shuffle to make it look "organic".

    return finalResult.sort(() => Math.random() - 0.5);
}
