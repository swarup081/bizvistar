'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import Link from 'next/link';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';

export default function ProductDetailPage() {
    const params = useParams();
    const { productId } = params;
    const { addToCart } = useCart();
    
    const { businessData, basePath, websiteId } = useTemplateContext();

    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    
    const category = product 
        ? businessData.categories.find(c => c.id === product.category) 
        : null;
    
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product?.image || null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // --- Stock Logic ---
    const rawStock = product?.stock;
    const isUnlimited = rawStock === -1;
    const stock = isUnlimited ? Infinity : (rawStock || 0);

    const isOutOfStock = !isUnlimited && stock === 0;
    const isLowStock = !isUnlimited && stock > 0 && stock < 10;
    
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

    if (!product) {
        return <div className="container mx-auto px-6 py-20 text-center text-brand-text">Product not found.</div>;
    }
    
    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="container mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Image Gallery */}
                <div className="relative">
                    <div className="bg-brand-primary aspect-[4/5] overflow-hidden">
                        <img 
                            src={selectedImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Product Info */}
                <div>
                    {category && (
                        <span className="text-sm text-brand-text/70 uppercase tracking-wider">{category.name}</span>
                    )}
                    <h1 className="text-5xl font-bold text-brand-text font-serif mt-2">{product.name}</h1>
                    <p className="text-3xl text-brand-text font-serif mt-4">₹{product.price.toFixed(2)}</p>

                    {/* Stock Status Badge */}
                    <div className="mt-4">
                        {isOutOfStock ? (
                             <span className="text-red-600 font-medium uppercase tracking-wide text-sm">Sold Out</span>
                        ) : isLowStock ? (
                             <span className="text-orange-600 font-medium uppercase tracking-wide text-sm">Only {stock} left!</span>
                        ) : (
                             <span className="text-green-600 font-medium uppercase tracking-wide text-sm">In Stock</span>
                        )}
                    </div>
                    
                    <p className="text-brand-text/80 text-lg mt-6">
                        {product.description}
                    </p>
                    
                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className={`flex items-center border border-brand-text/30 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 text-2xl text-brand-text/70 hover:bg-brand-primary">-</button>
                            <span className="w-12 h-12 flex items-center justify-center text-lg font-bold border-x border-brand-text/30">{quantity}</span>
                            <button onClick={() => setQuantity(q => isUnlimited ? q + 1 : Math.min(stock, q + 1))} className="w-12 h-12 text-2xl text-brand-text/70 hover:bg-brand-primary">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-grow h-12 bg-brand-secondary text-brand-bg font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Related Products */}
            <div className="mt-24">
                <h2 className="text-3xl font-bold text-brand-text font-serif mb-8">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                     {relatedProducts.map(item => (
                        <div key={item.id} className="group text-left">
                            <Link href={`${basePath}/product/${item.id}`} className="block bg-brand-primary overflow-hidden relative aspect-[4/5] h-80">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                            <div className="mt-4">
                                <h3 className="text-xl font-serif font-medium text-brand-text">
                                    <Link href={`${basePath}/product/${item.id}`} className="hover:text-brand-secondary">{item.name}</Link>
                                </h3>
                                <p className="text-brand-text font-medium text-base mt-1">₹{item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
