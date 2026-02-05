'use client';

import { useState } from 'react';
import { useTemplateContext } from '../templateContext.js';
import { ProductCard } from '../components.js';
import { sortProducts } from '@/lib/templates/templateLogic';

export default function ShopPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const { businessData } = useTemplateContext();
    
    const allProducts = businessData.allProducts; 
    
    const categories = [
        { id: 'all', name: 'All' }, 
        ...businessData.categories
    ];
    
    const filteredProducts = selectedCategoryId === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === selectedCategoryId);

    const sortedProducts = sortProducts(filteredProducts, businessData);

    return (
        <div className="w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-24">
                <h1 className="text-[7vw] md:text-6xl font-bold text-brand-text font-serif text-center mb-8 md:mb-16">Shop Our Collection</h1>
                
                {/* Category Filters */}
                <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-8 md:mb-16">
                    {categories.map(category => (
                        <button 
                            key={category.id}
                            onClick={() => setSelectedCategoryId(category.id)}
                            className={`px-3 py-1 md:px-6 md:py-2 rounded-lg font-medium transition-colors text-[3vw] md:text-base ${
                                selectedCategoryId === category.id 
                                    ? 'bg-brand-secondary text-brand-bg' 
                                    : 'bg-brand-primary text-brand-text hover:bg-brand-secondary/20'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                
                {/* Products Grid - UPDATED GAPS & COLS - 2 cols on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 items-stretch">
                    {sortedProducts.map(item => (
                        <ProductCard 
                            key={item.id} 
                            item={item}
                            templateName="blissly"
                        />
                    ))}
                </div>

                {/* "No products" message */}
                {sortedProducts.length === 0 && (
                    <p className="text-center text-brand-text/70 text-lg mt-12 col-span-full">No products found in this category.</p>
                )}
            </div>
        </div>
    );
}
