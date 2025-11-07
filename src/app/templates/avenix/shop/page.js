'use client';

import { useState } from 'react';
import { useTemplateContext } from '../templateContext.js'; // Import the context hook
import { ProductCard } from '../components.js';

export default function ShopPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const { businessData } = useTemplateContext(); // Get data from context
    
    // Get master lists from dynamic data
    const allProducts = businessData.allProducts; 
    
    // Create categories list, starting with "All"
    const categories = [
        { id: 'all', name: 'All' }, 
        ...businessData.categories
    ];
    
    // Filter products based on selected category ID
    const filteredProducts = selectedCategoryId === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === selectedCategoryId);

    return (
        <div className="container mx-auto px-6 py-24">
            <h1 className="text-6xl font-serif font-medium text-brand-text text-center mb-16">Shop Collection</h1>
            
            {/* Category Filters (Minimalist Style) */}
            <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 mb-16">
            {categories.map((category, index) => (
    <button 
        key={`${category.id || category.name}-${index}`}
        onClick={() => setSelectedCategoryId(category.id)}
        className={`font-sans font-medium uppercase tracking-wider text-sm transition-colors ${
            selectedCategoryId === category.id 
                ? 'text-brand-text' 
                : 'text-brand-text/50 hover:text-brand-text'
        }`}
    >
        {category.name}
    </button>
))}
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 items-stretch">
                {filteredProducts.map(item => (
                    <ProductCard 
                        key={item.id} // This key is also required
                        item={item}
                        templateName="avenix"
                    />
                ))}
            </div>

            {/* "No products" message */}
            {filteredProducts.length === 0 && (
                <p className="text-center text-brand-text/70 text-lg col-span-full">No products found in this category.</p>
            )}
        </div>
    );
}