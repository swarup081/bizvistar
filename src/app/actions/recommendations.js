'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role Key if available for secure access, otherwise fall back to Anon Key (RLS applies)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchSuggestedProducts(websiteId, currentProduct, minLimit = 2, maxLimit = 8) {
    if (!websiteId || !currentProduct) return [];
    
    // Fetch All Products for this website
    const { data: allProducts } = await supabase
        .from('products')
        .select('*')
        .eq('website_id', websiteId);
        
    if (!allProducts || allProducts.length === 0) return [];

    // Filter out current product and map images
    const candidates = allProducts
        .filter(p => String(p.id) !== String(currentProduct.id))
        .map(p => {
            if (p.image_url && !p.image) p.image = p.image_url;
            return p;
        });

    if (candidates.length === 0) return [];

    // Strategy: Mix Category + Random In-Stock
    const categoryId = currentProduct.category_id || currentProduct.category;
    
    // 1. Get Same Category Items
    const sameCategory = candidates.filter(p => String(p.category_id || p.category) === String(categoryId));

    // 2. Get Other Items (In Stock preferred)
    const others = candidates.filter(p => String(p.category_id || p.category) !== String(categoryId));
    const othersInStock = others.filter(p => p.stock !== 0);
    const othersOutOfStock = others.filter(p => p.stock === 0);

    // Shuffle helper
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    // Build the mix
    // We want roughly 50/50 if possible, but prioritize filling minLimit

    let result = [];

    // Take up to 4 from category
    result.push(...shuffle(sameCategory).slice(0, 4));

    // Fill rest with Random In-Stock
    const needed = maxLimit - result.length;
    if (needed > 0) {
        result.push(...shuffle(othersInStock).slice(0, needed));
    }

    // If still need more (to hit minLimit or just fill up), take Out of Stock others
    if (result.length < minLimit) {
        const stillNeeded = minLimit - result.length;
        result.push(...shuffle(othersOutOfStock).slice(0, stillNeeded));
    }

    // Final shuffle to mix them up visually
    return shuffle(result);
}
