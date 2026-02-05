// src/lib/templates/templateLogic.js

/**
 * Shared logic for selecting "Landing Page" items (Collection/Featured).
 */
export const getLandingItems = (businessData, requiredCount = 3) => {
    if (!businessData) return [];

    const settings = businessData.landing_settings || { mode: 'auto', manualItems: [], prioritizedProducts: [] };
    const allProducts = businessData.allProducts || [];
    const allCategories = businessData.categories || [];
    const totalItems = allProducts.length + allCategories.length;

    // 0. SMALL CATALOG CHECK
    if (totalItems <= requiredCount) {
         let everything = [];
         allCategories.forEach(c => everything.push({ ...c, type: 'category', image: c.image || null }));
         allProducts.forEach(p => everything.push({ ...p, type: 'product', image: p.image || p.image_url }));
         return everything.slice(0, requiredCount);
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
    const usedProductIds = new Set();

    // Helper: Is this image used?
    const isImageUsed = (url) => {
        if (!url) return false;
        return usedImages.has(url);
    };

    // Helper: Predict if a product is "High Value" (likely to be selected)
    // We check if it's Pinned OR in the Top N sales (where N is fairly small, e.g., 5)
    // This helps Categories "yield" their image if the product itself is important.
    const isHighValueProduct = (prod) => {
        if (!prod) return false;
        if (prioritizedIds.includes(String(prod.id))) return true;
        // Top 5 sellers
        const topSellers = [...allProducts]
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 5)
            .map(p => String(p.id));
        return topSellers.includes(String(prod.id));
    };

    const addItem = (item, type, isOOS = false) => {
        if (finalItems.length >= requiredCount) return false;
        if (finalItems.find(x => x.type === type && String(x.id) === String(item.id))) return false;

        let displayImage = item.image || item.image_url;
        let actualProductId = null;

        if (type === 'category') {
             // 1. Identify the product that provides this image
             const catProducts = allProducts.filter(p => String(p.category) === String(item.id));
             const top = catProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0))[0];

             // 2. Should we force a switch?
             // Yes if: Image is already used OR Top Product is "High Value" (reserve it for standalone)
             let forceSwitch = false;
             if (isImageUsed(displayImage)) forceSwitch = true;
             if (top && isHighValueProduct(top)) forceSwitch = true;

             if (forceSwitch) {
                 // Find NEXT best product
                 const nextBest = catProducts
                    .filter(p => {
                        // Exclude the top one if we are forcing switch due to High Value
                        if (top && String(p.id) === String(top.id)) return false;
                        // Exclude if image used
                        const img = p.image || p.image_url;
                        return img && !isImageUsed(img);
                    })
                    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                    .find(p => true); // First remaining

                 if (nextBest) {
                     displayImage = nextBest.image || nextBest.image_url;
                     actualProductId = nextBest.id;
                 } else {
                     // No alternative.
                     // If purely duplicate check failed, we might allow it.
                     // If high value check failed, we allow duplication rather than empty category.
                     if (top) {
                         displayImage = top.image || top.image_url;
                         actualProductId = top.id;
                     }
                 }
             } else {
                 if (top) actualProductId = top.id;
             }
        } else {
             // Product
             if (isImageUsed(displayImage)) return false;
             actualProductId = item.id;
        }

        if (displayImage) usedImages.add(displayImage);
        if (actualProductId) usedProductIds.add(String(actualProductId));

        finalItems.push({ ...item, type, isOOS, image: displayImage });
        return true;
    };

    // 1. Prioritized Products (Pinned)
    const pinnedItems = prioritizedIds
        .map(id => allProducts.find(p => String(p.id) === id))
        .filter(Boolean)
        .sort((a, b) => {
            const imgA = a.image || a.image_url;
            const imgB = b.image || b.image_url;
            if (!!imgA !== !!imgB) return !!imgB - !!imgA;
            return (b.sales || 0) - (a.sales || 0);
        });

    pinnedItems.forEach(p => addItem(p, 'product', (p.stock !== -1 && p.stock <= 0)));

    if (finalItems.length >= requiredCount) return finalItems;

    // 2. Top Categories
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
    const availableProducts = [...allProducts]
         .filter(p => (p.stock === -1 || p.stock > 0))
         .filter(p => !prioritizedIds.includes(String(p.id)))
         .filter(p => !usedProductIds.has(String(p.id))) // Skip products used on covers
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

export const getBestSellerItems = (businessData, requiredCount = 4) => {
    if (!businessData) return [];

    const settings = businessData.landing_settings || { prioritizedProducts: [] };
    const allProducts = businessData.allProducts || [];
    const prioritizedIds = (settings.prioritizedProducts || []).map(String);
    let finalItems = [];
    const usedIds = new Set();
    const usedImages = new Set();

    const addItem = (p, isOOS = false) => {
        if (finalItems.length >= requiredCount) return;
        if (usedIds.has(String(p.id))) return;

        const img = p.image || p.image_url;
        if (img && usedImages.has(img)) return;

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

    // 2. Best Sellers
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

    // 3. OOS
    if (finalItems.length < requiredCount) {
        const oos = allProducts
            .filter(p => !usedIds.has(String(p.id)))
            .filter(p => p.stock !== -1 && p.stock <= 0)
            .sort((a, b) => (b.sales || 0) - (a.sales || 0));

        oos.forEach(p => addItem(p, true));
    }

    return finalItems.slice(0, requiredCount);
};

export const getSimilarProducts = (currentProduct, allProducts, requiredCount = 4) => {
    if (!currentProduct || !allProducts) return [];

    const currentId = String(currentProduct.id);
    const categoryId = String(currentProduct.category || currentProduct.category_id);

    let candidates = allProducts.filter(p => String(p.id) !== currentId);

    const scored = candidates.map(p => {
        let score = 0;
        if (String(p.category || p.category_id) === categoryId) score += 100;
        if (p.image || p.image_url) score += 50;
        if (p.stock === -1 || p.stock > 0) score += 20;
        score += (p.sales || 0);
        return { ...p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, requiredCount).map(p => ({
        ...p,
        image: p.image || p.image_url
    }));
};

/**
 * Sort products for the Shop page:
 * 1. Pinned Products (Top Priority)
 * 2. In Stock
 * 3. Sales High -> Low
 * 4. ID Desc (Newest)
 */
export const sortProducts = (products, businessData) => {
    if (!products) return [];

    const settings = businessData?.landing_settings || { prioritizedProducts: [] };
    const prioritizedIds = (settings.prioritizedProducts || []).map(String);

    return [...products].sort((a, b) => {
        // 1. Pinned
        const isPinnedA = prioritizedIds.includes(String(a.id));
        const isPinnedB = prioritizedIds.includes(String(b.id));
        if (isPinnedA !== isPinnedB) return isPinnedB - isPinnedA;

        // 2. Stock (In stock > Out of stock)
        const isOosA = (a.stock !== -1 && a.stock <= 0);
        const isOosB = (b.stock !== -1 && b.stock <= 0);
        if (isOosA !== isOosB) return isOosA - isOosB; // False (0) > True (1)

        // 3. Sales
        const salesA = a.sales || 0;
        const salesB = b.sales || 0;
        if (salesA !== salesB) return salesB - salesA;

        // 4. ID (Newest)
        return Number(b.id) - Number(a.id);
    });
};
