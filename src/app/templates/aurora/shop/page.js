'use client';
import { useState } from 'react';
import { useTemplateContext } from '../templateContext.js';
import { ProductCard } from '../components.js';
import { sortProducts } from '@/lib/templates/templateLogic';

export default function ShopPage() {
    const { businessData } = useTemplateContext();
    const [filter, setFilter] = useState('all');

    const products = filter === 'all' 
        ? businessData.allProducts 
        : businessData.allProducts.filter(p => p.category === filter);

    const sortedProducts = sortProducts(products, businessData);

    return (
        <div className="bg-[var(--color-bg)] w-full max-w-full overflow-hidden overflow-x-hidden min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-24">
                <h1 className="text-[7vw] md:text-5xl font-serif text-center mb-8 md:mb-16 mt-8 md:mt-0">All Collections</h1>
                <div className="flex justify-center flex-wrap gap-4 md:gap-6 mb-8 md:mb-16">
                    <button onClick={() => setFilter('all')} className={`uppercase tracking-widest text-[2.5vw] md:text-sm ${filter === 'all' ? 'border-b border-black text-black' : 'text-gray-500'}`}>All</button>
                    {businessData.categories.map(c => (
                        <button key={c.id} onClick={() => setFilter(c.id)} className={`uppercase tracking-widest text-[2.5vw] md:text-sm ${filter === c.id ? 'border-b border-black text-black' : 'text-gray-500'}`}>{c.name}</button>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {sortedProducts.map(p => <ProductCard key={p.id} item={p} />)}
                </div>
            </div>
        </div>
    );
}
