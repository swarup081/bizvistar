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
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <h1 className="text-4xl md:text-6xl font-serif text-center mb-16 text-brand-text font-thin tracking-wide">
                Collection
            </h1>

            <div className="flex justify-center flex-wrap gap-8 mb-20">
                {categories.map((category, index) => (
                    <button
                        key={`${category.id}-${index}`}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`text-xs uppercase tracking-[0.2em] transition-all pb-2 ${
                            String(selectedCategoryId) === String(category.id)
                                ? 'border-b border-brand-text text-brand-text'
                                : 'text-brand-text/40 hover:text-brand-text'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {filteredProducts.map(item => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        templateName="aurora"
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-sm uppercase tracking-widest text-brand-text/50 mt-12">No items found.</p>
            )}
        </div>
    );
}
