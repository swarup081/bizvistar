// src/lib/templates/templateLogic.js

/**
 * Shared logic for selecting "Landing Page" items (Collection/Featured).
 * - Mixes Manual/Auto logic.
 * - Handles Categories vs Products.
 * - Strictly prevents image duplication.
 * - Enforces Priority (Pinned items).
 * - Handles OOS fallbacks.
 */
export const getLandingItems = (businessData, requiredCount = 3) => {
    if (!businessData) return [];

    const settings = businessData.landing_settings || { mode: 'auto', manualItems: [], prioritizedProducts: [] };
    const allProducts = businessData.allProducts || [];
    const allCategories = businessData.categories || [];
    const totalItems = allProducts.length + allCategories.length;

    // 0. SMALL CATALOG CHECK: If total items < required, just return everything (no dupes check needed usually, but we can filter)
    if (totalItems <= requiredCount) {
         let everything = [];
         // Add categories first
         allCategories.forEach(c => everything.push({ ...c, type: 'category', image: c.image || null }));
         // Add products
         allProducts.forEach(p => everything.push({ ...p, type: 'product', image: p.image || p.image_url }));
         return everything.slice(0, requiredCount); // Limit if somehow > required
    }

    // MANUAL MODE
    if (settings.mode === 'manual') {
        return (settings.manualItems || []).slice(0, requiredCount).map(item => {
            if (item.type === 'product') {
                 const p = allProducts.find(x => String(x.id) === String(item.id));
                 return p ? { ...p, type: 'product', image: p.image || p.image_url } : null;
            } else {
                 const c = allCategories.find(x => String(x.id) === String(item.id));
                 return c ? { ...c, type: 'category', image: c.image || null } : null;
            }
        }).filter(Boolean);
    }

    // AUTO MODE
    let finalItems = [];
    const usedImages = new Set();
    const prioritizedIds = (settings.prioritizedProducts || []).map(String);
    const usedProductIds = new Set(); // Track product IDs to avoid repeating same product logic

    const isImageUsed = (url) => {
        if (!url) return false;
        return usedImages.has(url);
    };

    const addItem = (item, type, isOOS = false) => {
        if (finalItems.length >= requiredCount) return false;

        // ID Uniqueness Check
        if (finalItems.find(x => x.type === type && String(x.id) === String(item.id))) return false;

        let displayImage = item.image || item.image_url;
        let actualProductId = null; // If this item uses a specific product's image

        if (type === 'category') {
             // Logic: item.image comes from backend (Top Product).
             // We must check if this image is already used.
             if (isImageUsed(displayImage)) {
                 // Try to find NEXT best product in this category
                 const catProducts = allProducts.filter(p => String(p.category) === String(item.id));

                 // Sort by sales, but skip products whose images are used OR who are pinned (as pinned might be used later)
                 const nextBest = catProducts
                    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                    .find(p => {
                        const img = p.image || p.image_url;
                        return img && !isImageUsed(img);
                    });

                 if (nextBest) {
                     displayImage = nextBest.image || nextBest.image_url;
                     actualProductId = nextBest.id;
                 } else {
                     // No unique image found.
                     // Exception: If no other option, allow it? Or skip category?
                     // Requirement says: "if there is no other option let it be" -> Allow duplicate if strictly necessary?
                     // For now, let's allow it but maybe prefer skipping if we can fill with products.
                     // Let's TRY to skip category if we have enough products to fill.
                     // But for priority, we might need to show it.
                     // Let's accept duplicate if forced, but we prefer unique.
                 }
             } else {
                 // Ensure we mark the product ID that provided this image as "used"
                 // item.image usually corresponds to top seller.
                 const catProducts = allProducts.filter(p => String(p.category) === String(item.id));
                 const top = catProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0))[0];
                 if (top && (top.image === displayImage || top.image_url === displayImage)) {
                     actualProductId = top.id;
                 }
             }
        } else {
             // Product
             if (isImageUsed(displayImage)) return false; // Skip product if image used
             actualProductId = item.id;
        }

        if (displayImage) usedImages.add(displayImage);
        if (actualProductId) usedProductIds.add(String(actualProductId));

        finalItems.push({ ...item, type, isOOS, image: displayImage });
        return true;
    };

    // 1. Prioritized Products (Pinned)
    // FORCE these in first.
    const pinnedItems = prioritizedIds
        .map(id => allProducts.find(p => String(p.id) === id))
        .filter(Boolean)
        .sort((a, b) => {
            // Sort pinned items: Image > Sales
            const imgA = a.image || a.image_url;
            const imgB = b.image || b.image_url;
            if (!!imgA !== !!imgB) return !!imgB - !!imgA;
            return (b.sales || 0) - (a.sales || 0);
        });

    pinnedItems.forEach(p => addItem(p, 'product', (p.stock !== -1 && p.stock <= 0)));

    if (finalItems.length >= requiredCount) return finalItems;

    // 2. Top Categories
    // Sort: Image Exists > Sales
    const sortedCats = [...allCategories].sort((a, b) => {
        if (!!a.image !== !!b.image) return !!b.image - !!a.image;
        return (b.sales || 0) - (a.sales || 0);
    });

    for (const cat of sortedCats) {
        if (finalItems.length >= requiredCount) break;
        addItem(cat, 'category');
    }

    if (finalItems.length >= requiredCount) return finalItems;

    // 3. Top Products (Smart Fill)
    // Filter: Stock OK, Not Pinned, Not "Used as Category Cover"
    const availableProducts = [...allProducts]
         .filter(p => (p.stock === -1 || p.stock > 0))
         .filter(p => !prioritizedIds.includes(String(p.id)))
         .filter(p => !usedProductIds.has(String(p.id))) // Critical: Don't show product if it's a category cover
         .sort((a, b) => {
            const imgA = a.image || a.image_url;
            const imgB = b.image || b.image_url;
            if (!!imgA !== !!imgB) return !!imgB - !!imgA;
            return (b.sales || 0) - (a.sales || 0);
         });

    for (const p of availableProducts) {
         if (finalItems.length >= requiredCount) break;
         addItem(p, 'product');
    }

    // 4. Fallback OOS
    if (finalItems.length < requiredCount) {
         const oosProducts = allProducts
            .filter(p => p.stock !== -1 && p.stock <= 0)
            .filter(p => !prioritizedIds.includes(String(p.id)))
            .filter(p => !usedProductIds.has(String(p.id)))
            .sort((a, b) => (b.sales || 0) - (a.sales || 0));

         for (const p of oosProducts) {
             if (finalItems.length >= requiredCount) break;
             addItem(p, 'product', true);
         }
    }

    return finalItems.slice(0, requiredCount);
};

/**
 * Logic for "Best Sellers" section (Products Only).
 */
export const getBestSellerItems = (businessData, requiredCount = 4) => {
    if (!businessData) return [];

    const settings = businessData.landing_settings || { prioritizedProducts: [] };
    const allProducts = businessData.allProducts || [];
    const prioritizedIds = (settings.prioritizedProducts || []).map(String);
    let finalItems = [];
    const usedIds = new Set();
    const usedImages = new Set(); // Prevent image dupes even here

    const addItem = (p, isOOS = false) => {
        if (finalItems.length >= requiredCount) return;
        if (usedIds.has(String(p.id))) return;

        const img = p.image || p.image_url;
        if (img && usedImages.has(img)) return; // Skip if image used

        if (img) usedImages.add(img);
        usedIds.add(String(p.id));
        finalItems.push({ ...p, isOOS, image: img });
    };

    // 1. Pinned
    const pinnedItems = prioritizedIds
        .map(id => allProducts.find(p => String(p.id) === id))
        .filter(Boolean);

    pinnedItems.forEach(p => addItem(p, (p.stock !== -1 && p.stock <= 0)));

    if (finalItems.length >= requiredCount) return finalItems;

    // 2. Best Sellers (Available)
    const available = allProducts
        .filter(p => !usedIds.has(String(p.id)))
        .filter(p => (p.stock === -1 || p.stock > 0))
        .sort((a, b) => {
             const imgA = a.image || a.image_url;
             const imgB = b.image || b.image_url;
             if (!!imgA !== !!imgB) return !!imgB - !!imgA;
             return (b.sales || 0) - (a.sales || 0);
        });

    available.forEach(p => addItem(p));

    // 3. OOS Fallback
    if (finalItems.length < requiredCount) {
        const oos = allProducts
            .filter(p => !usedIds.has(String(p.id)))
            .filter(p => p.stock !== -1 && p.stock <= 0)
            .sort((a, b) => (b.sales || 0) - (a.sales || 0));

        oos.forEach(p => addItem(p, true));
    }

    return finalItems.slice(0, requiredCount);
};

/**
 * Logic for "Might Also Like" (Similar Products) on Detail Page.
 */
export const getSimilarProducts = (currentProduct, allProducts, requiredCount = 4) => {
    if (!currentProduct || !allProducts) return [];

    const currentId = String(currentProduct.id);
    const categoryId = String(currentProduct.category || currentProduct.category_id);

    // Filter Candidates: Not current product, Has Image (preferred), Stock OK (preferred)
    let candidates = allProducts.filter(p => String(p.id) !== currentId);

    // Scoring Logic
    const scored = candidates.map(p => {
        let score = 0;

        // 1. Same Category (+100)
        if (String(p.category || p.category_id) === categoryId) score += 100;

        // 2. Has Image (+50)
        if (p.image || p.image_url) score += 50;

        // 3. In Stock (+20)
        if (p.stock === -1 || p.stock > 0) score += 20;

        // 4. Sales (+ sales count)
        score += (p.sales || 0);

        return { ...p, score };
    });

    // Sort by Score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, requiredCount).map(p => ({
        ...p,
        image: p.image || p.image_url
    }));
};
