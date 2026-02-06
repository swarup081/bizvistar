'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import Link from 'next/link';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';

export default function ProductDetailPage() {
    const params = useParams();
    const { productId } = params;
    const { addToCart } = useCart();
    const { businessData, websiteId } = useTemplateContext();
    
    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    const category = product ? businessData.categories.find(c => c.id === product.category) : null;
    
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    // --- Stock Logic ---
    const rawStock = product?.stock;
    const isUnlimited = rawStock === -1; 
    const stock = isUnlimited ? Infinity : (rawStock !== undefined ? rawStock : Infinity);

    const isOutOfStock = !isUnlimited && stock === 0;
    const isLowStock = !isUnlimited && stock > 0 && stock < 10;
    
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
                 
                 // Fallback Logic
                 const sameCategoryProducts = businessData.allProducts.filter(
                    p => String(p.category) === String(product.category) && String(p.id) !== String(product.id)
                 );
                 const otherProducts = businessData.allProducts.filter(
                    p => String(p.id) !== String(product.id) && String(p.category) !== String(product.category)
                 );
                 setRelatedProducts([...sameCategoryProducts, ...otherProducts].slice(0, 4));
             }
        };
        loadSuggestions();
    }, [product, websiteId, businessData.allProducts]);

    if (!product) {
        return <div className="container mx-auto px-4 md:px-6 py-20 text-center text-brand-text">Product not found.</div>;
    }
    
    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                
                <div className="bg-brand-primary aspect-[4/5] overflow-hidden rounded-xl md:rounded-lg relative">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Product Info */}
                <div className="py-2 md:py-4">
                    {category && (
                        <span className="text-[2.5vw] md:text-sm text-brand-text/70 uppercase tracking-widest">{category.name}</span>
                    )}
                    <h1 className="text-[6vw] md:text-5xl font-serif font-medium text-brand-text mt-1 md:mt-2">{product.name}</h1>
                    <p className="text-[4vw] md:text-3xl text-brand-text font-sans mt-2 md:mt-4">${product.price.toFixed(2)}</p>
                    
                    {/* Stock Status Badge */}
                    <div className="mt-2 md:mt-4 text-[2.5vw] md:text-base">
                        {isOutOfStock ? (
                             <span className="text-red-600 font-medium">Currently Unavailable</span>
                        ) : isLowStock ? (
                             <span className="text-orange-600 font-medium">Only {stock} left in stock!</span>
                        ) : (
                             <span className="text-green-600 font-medium">In Stock</span>
                        )}
                    </div>

                    <p className="text-brand-text/80 text-[3vw] md:text-lg mt-4 md:mt-6">
                        {product.description}
                    </p>
                    
                    <div className="flex items-stretch gap-2 md:gap-4 mt-6 md:mt-8">
                        <div className={`flex items-center border border-brand-text/20 rounded-full ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 md:w-12 md:h-12 text-[4vw] md:text-2xl text-brand-text/70 hover:bg-brand-primary rounded-l-full">-</button>
                            <span className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-[3vw] md:text-lg font-bold border-x border-brand-text/20">{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(stock, q + 1))} className="w-8 h-8 md:w-12 md:h-12 text-[4vw] md:text-2xl text-brand-text/70 hover:bg-brand-primary rounded-r-full">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-grow h-8 md:h-12 bg-brand-secondary text-brand-bg font-medium text-[2.5vw] md:text-base uppercase tracking-wider hover:opacity-80 transition-opacity rounded-full disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-brand-text/10">
                <h2 className="text-[6vw] md:text-4xl font-serif font-medium text-brand-text mb-8 md:mb-12 text-center">You Might Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16 items-stretch">
                     {relatedProducts.map(item => (
                        <ProductCard 
                            key={item.id} 
                            item={item}
                            templateName="avenix"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
