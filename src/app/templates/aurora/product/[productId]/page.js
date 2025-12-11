'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';

export default function ProductPage() {
    const { productId } = useParams();
    const { businessData } = useTemplateContext();
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    if (!product) return <div className="py-20 text-center">Product not found</div>;

    return (
        <div className="container mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="bg-gray-50 aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
                    <p className="text-2xl font-light mb-8">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
                    
                    <div className="flex gap-4 mb-8">
                        <div className="flex border border-gray-300 w-32">
                            <button onClick={() => setQty(Math.max(1, qty-1))} className="w-10 hover:bg-gray-100">-</button>
                            <span className="flex-grow flex items-center justify-center font-bold">{qty}</span>
                            <button onClick={() => setQty(qty+1)} className="w-10 hover:bg-gray-100">+</button>
                        </div>
                        <button onClick={() => addToCart(product, qty)} className="flex-grow bg-black text-white uppercase tracking-widest font-bold hover:bg-gray-800">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}