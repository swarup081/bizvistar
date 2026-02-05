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
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <h1 className="text-6xl font-black uppercase text-center mb-16 italic tracking-tighter">
                Catalogue
            </h1>

            <div className="flex justify-center flex-wrap gap-4 mb-16">
                {categories.map((category, index) => (
                    <button
                        key={`${category.id}-${index}`}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-6 py-3 font-bold uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all ${
                            String(selectedCategoryId) === String(category.id)
                                ? 'bg-black text-white'
                                : 'bg-white text-black'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(item => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        templateName="frostify"
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-xl font-bold uppercase mt-20">Nothing here yet.</p>
            )}
        </div>
    );
}
