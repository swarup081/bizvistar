'use client';

import { useState } from 'react';
import { businessData } from '../data.js';
import { ProductCard } from '../components.js';
import { sortProducts } from '@/lib/templates/templateLogic';

export default function ShopPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    
    const allProducts = businessData.allProducts; 
    
    const categories = [
        { id: 'all', name: 'All' }, 
        ...businessData.categories
    ];
    
    const filteredProducts = selectedCategoryId === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === selectedCategoryId);

    const sortedProducts = sortProducts(filteredProducts, businessData);

    // Shop display settings
    const shopSettings = businessData.shopSettings || {};
    const gridCols = shopSettings.gridColumns || 3;
    const perPage = shopSettings.productsPerPage || 0;
    const displayProducts = perPage > 0 ? sortedProducts.slice(0, perPage) : sortedProducts;

    const gridColsClass = {
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4',
    }[gridCols] || 'lg:grid-cols-3';

    return (
        <div className="container mx-auto px-6 py-24">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-secondary font-serif text-center mb-16">All Products</h1>
            
            {/* Category Filters */}
            <div className="flex justify-center flex-wrap gap-3 mb-16">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`btn px-6 py-2 rounded-full font-medium transition-colors ${
                            selectedCategoryId === category.id 
                                ? 'btn-primary' // Active state
                                : 'bg-brand-primary text-brand-text hover:bg-brand-secondary/20' // Inactive
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            
            {/* Products Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-6 items-stretch`}>
                {displayProducts.map(item => (
                    <ProductCard 
                        key={item.id} 
                        item={item}
                    />
                ))}
            </div>
            {displayProducts.length === 0 && (
                <p className="text-center text-brand-text/70 text-lg mt-12">No products found in this category.</p>
            )}
        </div>
    );
}