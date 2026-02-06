'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';

export default function ProductPage() {
    const { productId } = useParams();
    const { businessData, websiteId } = useTemplateContext();
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const product = businessData.allProducts.find(p => p.id.toString() === productId);

    useEffect(() => {
        const loadSuggestions = async () => {
             if (product) {
                 if (websiteId) {
                     const suggestions = await fetchSuggestedProducts(websiteId, product, 3);
                     if (suggestions && suggestions.length > 0) {
                         setRelatedProducts(suggestions);
                         return;
                     }
                 }
                 
                 // Fallback
                 const local = businessData.allProducts
                    .filter(p => String(p.category) === String(product.category) && String(p.id) !== String(product.id))
                    .slice(0, 3);
                 setRelatedProducts(local);
             }
        };
        loadSuggestions();
    }, [product, websiteId, businessData.allProducts]);

    if (!product) return <div className="py-20 text-center">Product not found</div>;

    return (
        <div className="bg-[var(--color-bg)] w-full max-w-full overflow-hidden overflow-x-hidden min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-24">
                {/* Mobile: Grid Cols 2 (Shrink) | Desktop: Grid Cols 2 */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-16 mt-8 md:mt-0">
                    
                    {/* Image */}
                    <div className="bg-gray-50 aspect-[3/4] relative overflow-hidden">
                        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[5vw] md:text-4xl font-serif mb-2 md:mb-4 leading-tight">{product.name}</h1>
                        <p className="text-[4vw] md:text-2xl font-light mb-4 md:mb-8 text-[#D4A373]">${product.price.toFixed(2)}</p>
                        <p className="text-gray-600 text-[2.5vw] md:text-base mb-4 md:mb-8 leading-tight md:leading-relaxed line-clamp-4 md:line-clamp-none">{product.description}</p>
                        
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:mb-8">
                            <div className="flex border border-gray-300 w-full md:w-32 h-[8vw] md:h-12 items-center">
                                <button onClick={() => setQty(Math.max(1, qty-1))} className="w-[8vw] md:w-10 h-full hover:bg-gray-100 flex items-center justify-center text-[3vw] md:text-base">-</button>
                                <span className="flex-grow flex items-center justify-center font-bold text-[3vw] md:text-base">{qty}</span>
                                <button onClick={() => setQty(qty+1)} className="w-[8vw] md:w-10 h-full hover:bg-gray-100 flex items-center justify-center text-[3vw] md:text-base">+</button>
                            </div>
                            <button 
                                onClick={() => addToCart(product, qty)} 
                                className="flex-grow h-[8vw] md:h-12 bg-[#0F1C23] text-white text-[2.5vw] md:text-sm uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors flex items-center justify-center"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-gray-200">
                        <h2 className="text-[5vw] md:text-3xl font-serif text-center mb-8 md:mb-16">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} item={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
