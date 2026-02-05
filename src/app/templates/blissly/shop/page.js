'use client';

import { useState, useMemo } from 'react';
import { useTemplateContext } from '../templateContext.js';
import { ProductCard } from '../components.js';
import { sortProducts } from '@/lib/templates/templateLogic';

export default function ShopPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const { businessData } = useTemplateContext();
    
    // --- 1. Get Sorted List (Pinned > Stock > Sales > Newest) ---
    const allProducts = useMemo(() => {
        return sortProducts(businessData.allProducts, businessData);
    }, [businessData]);
    
    const categories = [
        { id: 'all', name: 'All' }, 
        ...businessData.categories
    ];
    
    const filteredProducts = selectedCategoryId === 'all' 
        ? allProducts 
        : allProducts.filter(p => String(p.category) === String(selectedCategoryId));

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
            <h1 className="text-[8vw] md:text-6xl font-serif font-medium text-brand-text text-center mb-8 md:mb-16">Shop Collection</h1>

            <div className="flex justify-center flex-wrap gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-4 mb-8 md:mb-16">
            {categories.map((category, index) => (
                <button
                    key={`${category.id || category.name}-${index}`}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`font-sans font-medium uppercase tracking-wider text-[3vw] md:text-sm transition-colors ${
                        String(selectedCategoryId) === String(category.id)
                            ? 'text-brand-text border-b border-brand-text'
                            : 'text-brand-text/50 hover:text-brand-text'
                    }`}
                >
                    {category.name}
                </button>
            ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16 items-stretch">
                {filteredProducts.map(item => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        templateName="blissly"
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-brand-text/70 text-lg col-span-full">No products found in this category.</p>
            )}
        </div>
    );
}
