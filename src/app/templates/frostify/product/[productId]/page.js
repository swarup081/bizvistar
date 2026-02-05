'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';

export default function FrostifyProductPage() {
    const { productId } = useParams();
    const { businessData, websiteId } = useTemplateContext();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const product = businessData.allProducts.find(p => p.id.toString() === productId);

    useEffect(() => {
        const loadSuggestions = async () => {
             if (product) {
                 if (websiteId) {
                     const suggestions = await fetchSuggestedProducts(websiteId, product, 4);
                     if (suggestions && suggestions.length > 0) {
                         setRelatedProducts(suggestions);
                         return;
                     }
                 }

                 // Fallback
                 const local = businessData.allProducts
                    .filter(p => p.category === product.category && String(p.id) !== String(product.id))
                    .slice(0, 4);
                 setRelatedProducts(local);
             }
        };
        loadSuggestions();
    }, [product, websiteId, businessData.allProducts]);

    if (!product) return <div className="py-32 text-center text-[var(--color-primary)]">Product not found.</div>;

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32 pb-12 md:pb-24 w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-6">
                
                {/* Main Product Display: 2 Cols on mobile (Shrink) */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-16 items-center mb-12 md:mb-24">
                    {/* Image */}
                    <div className="bg-[#F9F4F6] rounded-2xl overflow-hidden shadow-lg aspect-square">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Info */}
                    <div>
                        <span className="text-[var(--color-secondary)] text-[2vw] md:text-xs font-bold uppercase tracking-[0.2em]">
                            {businessData.categories.find(c => c.id === product.category)?.name}
                        </span>
                        <h1 className="text-[6vw] md:text-5xl font-serif text-[var(--color-primary)] mt-2 md:mt-4 mb-2 md:mb-6 leading-tight">{product.name}</h1>
                        <p className="text-[4vw] md:text-3xl text-[var(--color-primary)] font-bold mb-4 md:mb-8">${product.price.toFixed(2)}</p>
                        <p className="text-gray-600 leading-tight md:leading-relaxed mb-4 md:mb-10 text-[2.5vw] md:text-lg line-clamp-3 md:line-clamp-none">{product.description}</p>
                        
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <div className="flex items-center border border-[var(--color-primary)] rounded-full px-1 md:px-2 h-[8vw] md:h-12 w-full md:w-auto justify-center">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 md:px-3 text-[3vw] md:text-base text-[var(--color-primary)] font-bold">-</button>
                                <span className="px-2 md:px-3 text-[3vw] md:text-base text-[var(--color-primary)] font-bold w-6 md:w-8 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-2 md:px-3 text-[3vw] md:text-base text-[var(--color-primary)] font-bold">+</button>
                            </div>
                            <button 
                                onClick={() => addToCart(product, quantity)}
                                className="flex-grow bg-[var(--color-primary)] text-white px-4 py-2 md:px-8 md:py-4 rounded-full text-[2.5vw] md:text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors h-[8vw] md:h-auto flex items-center justify-center whitespace-nowrap"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-8 md:pt-16">
                        <h2 className="text-[6vw] md:text-3xl font-serif text-[var(--color-primary)] text-center mb-6 md:mb-12">You Might Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                            {relatedProducts.map(p => <ProductCard key={p.id} item={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
