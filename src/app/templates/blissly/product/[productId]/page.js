'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
// FIX: Path changed from ../ to ../../
import { businessData } from '../../data.js'; 
// FIX: Path changed from ../ to ../../
import { useCart } from '../../cartContext.js'; 
// FIX: Path changed from ../ to ../../
import { ProductCard } from '../../components.js'; 

export default function ProductDetailPage() {
    const params = useParams();
    const { productId } = params;
    const { addToCart } = useCart();
    
    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    const category = product ? businessData.categories.find(c => c.id === product.category) : null;
    
    const [quantity, setQuantity] = useState(1);
    
    let relatedProducts = [];
    if (product) {
        const sameCategoryProducts = businessData.allProducts.filter(
            p => p.category === product.category && p.id !== product.id
        );
        const otherProducts = businessData.allProducts.filter(
            p => p.id !== product.id && p.category !== product.category
        );
        relatedProducts = [...sameCategoryProducts, ...otherProducts].slice(0, 4);
    }

    if (!product) {
        return <div className="container mx-auto px-6 py-20 text-center text-brand-text">Product not found.</div>;
    }
    
    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 font-sans">
                {/* Mobile: Grid Cols 2 (Shrink Layout) */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-12 items-start">
                    
                    {/* Image */}
                    <div className="bg-brand-primary aspect-[4/5] overflow-hidden rounded-lg">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Product Info */}
                    <div className="py-0 md:py-4 flex flex-col h-full">
                        {category && (
                            <span className="text-[2vw] md:text-sm text-brand-text/70 uppercase tracking-widest">{category.name}</span>
                        )}
                        <h1 className="text-[5vw] md:text-5xl font-serif font-medium text-brand-text mt-1 md:mt-2 leading-tight">{product.name}</h1>
                        <p className="text-[4vw] md:text-3xl text-brand-secondary font-sans mt-2 md:mt-4 font-bold">${product.price.toFixed(2)}</p>
                        
                        <p className="text-brand-text/80 text-[2.5vw] md:text-lg mt-2 md:mt-6 leading-tight">
                            {product.description}
                        </p>
                        
                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-4 mt-4 md:mt-8">
                            <div className="flex items-center border border-brand-text/20 rounded-lg h-[8vw] md:h-12 w-full md:w-auto">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-[8vw] md:w-12 h-full text-[4vw] md:text-2xl text-brand-text/70 hover:bg-brand-primary rounded-l-lg flex items-center justify-center">-</button>
                                <span className="flex-grow md:w-12 h-full flex items-center justify-center text-[3vw] md:text-lg font-bold border-x border-brand-text/20">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="w-[8vw] md:w-12 h-full text-[4vw] md:text-2xl text-brand-text/70 hover:bg-brand-primary rounded-r-lg flex items-center justify-center">+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className="h-[8vw] md:h-12 w-full bg-brand-secondary text-brand-bg font-medium tracking-wide transition-opacity rounded-lg hover:opacity-90 text-[3vw] md:text-base whitespace-nowrap px-4"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Related Products */}
                <div className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-brand-text/10">
                    <h2 className="text-[6vw] md:text-4xl font-serif font-medium text-brand-text mb-6 md:mb-12 text-center">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-stretch">
                         {relatedProducts.map(item => (
                            <ProductCard 
                                key={item.id} 
                                item={item}
                                templateName="blissly"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}