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
            <div className="text-center mb-12">
                <span className="text-brand-primary font-bold uppercase tracking-wider text-sm">Order Online</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-2 text-brand-text">Full Menu</h1>
            </div>
            
            <div className="flex justify-center flex-wrap gap-3 mb-12">
                {categories.map((category, index) => (
                    <button 
                        key={`${category.id || category.name}-${index}`}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                            String(selectedCategoryId) === String(category.id)
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                : 'bg-white text-brand-text hover:bg-gray-100'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(item => (
                    <ProductCard 
                        key={item.id} 
                        item={item}
                        templateName="flavornest"
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-brand-text/50 text-lg">No dishes found in this category.</p>
                </div>
            )}
        </div>
    );
}
