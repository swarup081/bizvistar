'use client';
import { useState } from 'react';
import { useTemplateContext } from '../templateContext.js';
import { ProductCard } from '../components.js';

export default function ShopPage() {
    const { businessData } = useTemplateContext();
    const [filter, setFilter] = useState('all');

    const products = filter === 'all' 
        ? businessData.allProducts 
        : businessData.allProducts.filter(p => p.category === filter);

    return (
        <div className="container mx-auto px-6 py-24">
            <h1 className="text-5xl font-serif text-center mb-16">All Collections</h1>
            <div className="flex justify-center gap-6 mb-16">
                <button onClick={() => setFilter('all')} className={`uppercase tracking-widest text-sm ${filter === 'all' ? 'border-b border-black' : 'text-gray-500'}`}>All</button>
                {businessData.categories.map(c => (
                    <button key={c.id} onClick={() => setFilter(c.id)} className={`uppercase tracking-widest text-sm ${filter === c.id ? 'border-b border-black' : 'text-gray-500'}`}>{c.name}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(p => <ProductCard key={p.id} item={p} />)}
            </div>
        </div>
    );
}