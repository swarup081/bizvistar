'use client';

import { useState, useEffect } from 'react';
import { useTemplateContext } from '../templateContext.js'; // Import the context hook
import { ProductCard } from '../components.js';
import { useSearchParams } from 'next/navigation';

export default function ShopPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';

    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory);
    const { businessData } = useTemplateContext(); // Get data from context
    
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategoryId(cat);
    }, [searchParams]);

    // Get master lists from dynamic data
    const allProducts = businessData.allProducts; 
    
    // --- DYNAMIC CATEGORIES ---
    const categories = [
        { id: 'all', name: 'All' }, 
        ...businessData.categories
    ];
    
    // Filter products
    const filteredProducts = selectedCategoryId === 'all' 
        ? allProducts 
        : allProducts.filter(p => String(p.category) === String(selectedCategoryId));

    return (
        <div className="container mx-auto px-6 py-16">
            <h1 className="text-5xl font-bold text-brand-text font-serif text-center mb-12">Shop Our Collection</h1>
            
            {/* Category Filters (Now dynamic) */}
            <div className="flex justify-center flex-wrap gap-3 mb-12">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${
                            String(selectedCategoryId) === String(category.id)
                                ? 'bg-brand-secondary text-brand-bg' 
                                : 'bg-brand-primary text-brand-text hover:bg-brand-secondary/20'
                        }`}
                    >
                        {category.name} {/* Display category name */}
                    </button>
                ))}
            </div>
            
            {/* Products Grid (No changes needed, ProductCard handles it) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 items-stretch">
                {filteredProducts.map(item => (
                    <ProductCard 
                        key={item.id} 
                        item={item}
                        templateName="flara"
                    />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <p className="text-center text-brand-text/70 text-lg">No products found in this category.</p>
            )}
        </div>
    );
}
