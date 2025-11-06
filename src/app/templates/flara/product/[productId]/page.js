'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js'; // Import the context hook
import { useCart } from '../../cartContext.js';
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const { productId } = params;
    const { addToCart } = useCart();
    const { businessData } = useTemplateContext(); // Get data from context

    // Find the product from the master list
    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    
    // --- DYNAMIC CATEGORY ---
    const category = product 
        ? businessData.categories.find(c => c.id === product.category) 
        : null;
    
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product?.image || null);
    
    // Find related products
    const relatedProducts = product 
        ? businessData.allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
        : [];

    if (!product) {
        return <div className="container mx-auto px-6 py-20 text-center text-brand-text">Product not found.</div>;
    }
    
    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="container mx-auto px-6 py-20">
            {/* ... (rest of the component JSX remains the same) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Image Gallery */}
                <div>
                    <div className="bg-brand-primary aspect-[4/5] overflow-hidden">
                        <img 
                            src={selectedImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                
                {/* Product Info */}
                <div>
                    {/* Display dynamic category name */}
                    {category && (
                        <span className="text-sm text-brand-text/70 uppercase tracking-wider">{category.name}</span>
                    )}
                    <h1 className="text-5xl font-bold text-brand-text font-serif mt-2">{product.name}</h1>
                    <p className="text-3xl text-brand-text font-serif mt-4">₹{product.price.toFixed(2)}</p>
                    
                    <p className="text-brand-text/80 text-lg mt-6">
                        {product.description}
                    </p>
                    
                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex items-center border border-brand-text/30">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 text-2xl text-brand-text/70 hover:bg-brand-primary">-</button>
                            <span className="w-12 h-12 flex items-center justify-center text-lg font-bold border-x border-brand-text/30">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 text-2xl text-brand-text/70 hover:bg-brand-primary">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="flex-grow h-12 bg-brand-secondary text-brand-bg font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity"
                        >
                            Add to Cart
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
                            <Link href={`/templates/flara/product/${item.id}`} className="block bg-brand-primary overflow-hidden relative aspect-[4/5] h-80">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                            <div className="mt-4">
                                <h3 className="text-xl font-serif font-medium text-brand-text">
                                    <Link href={`/templates/flara/product/${item.id}`} className="hover:text-brand-secondary">{item.name}</Link>
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