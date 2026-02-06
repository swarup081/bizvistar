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
    const [selectedVariants, setSelectedVariants] = useState({});

    // Initialize defaults
    useEffect(() => {
        if (product) {
            setSelectedImage(product.image);
            if (product.variants && Array.isArray(product.variants)) {
                const defaults = {};
                product.variants.forEach(v => {
                    const vals = v.values.split(',').map(s => s.trim());
                    if (vals.length > 0) defaults[v.name] = vals[0];
                });
                setSelectedVariants(defaults);
            }
        }
    }, [product]);

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
                     // Request 4 items
                     const suggestions = await fetchSuggestedProducts(websiteId, product, 4);
                     if (suggestions && suggestions.length > 0) {
                         setRelatedProducts(suggestions);
                         return;
                     }
                 }
                 
                 // Fallback
                 const local = businessData.allProducts
                    .filter(p => String(p.category) === String(product.category) && String(p.id) !== String(product.id))
                    .slice(0, 4);
                 setRelatedProducts(local);
             }
        };
        loadSuggestions();
    }, [product, websiteId, businessData.allProducts]);

    if (!product) {
        return <div className="container mx-auto px-6 py-20 text-center text-brand-text">Product not found.</div>;
    }
    
    const handleAddToCart = () => {
        addToCart({ ...product, selectedVariants }, quantity);
    };

    const handleVariantChange = (name, value) => {
        setSelectedVariants(prev => ({ ...prev, [name]: value }));
    };

    const allImages = [product.image, ...(product.additional_images || [])].filter(Boolean);

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="bg-brand-primary overflow-hidden rounded-xl relative aspect-[4/5] max-h-[60vh] md:max-h-[600px] w-full max-w-lg mx-auto md:mx-0">
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
                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar justify-center md:justify-start">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-brand-secondary opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Product Info */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-text font-serif mt-2">{product.name}</h1>
                    <p className="text-2xl md:text-3xl text-brand-text font-serif mt-4">₹{product.price.toFixed(2)}</p>

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
                    
                    {category && (
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-1">Category</h3>
                            <p className="text-brand-text/80 text-lg">{category.name}</p>
                        </div>
                    )}

                    {product.description && (
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-brand-text/80 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mt-8 space-y-4">
                            {product.variants.map((v, idx) => {
                                const options = v.values.split(',').map(s => s.trim());
                                return (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-2">{v.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {options.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleVariantChange(v.name, opt)}
                                                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                                                        selectedVariants[v.name] === opt
                                                            ? 'bg-brand-secondary text-brand-bg border-brand-secondary'
                                                            : 'border-brand-text/20 text-brand-text hover:border-brand-secondary'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mt-8 border-t border-brand-text/10 pt-8">
                        <div className={`flex items-center border border-brand-text/30 rounded ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl text-brand-text/70 hover:bg-brand-primary">-</button>
                            <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg font-bold border-x border-brand-text/30">{quantity}</span>
                            <button onClick={() => setQuantity(q => isUnlimited ? q + 1 : Math.min(stock, q + 1))} className="w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl text-brand-text/70 hover:bg-brand-primary">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-grow h-10 md:h-12 rounded bg-brand-secondary text-brand-bg font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Related Products */}
            <div className="mt-24">
                <h2 className="text-3xl font-bold text-brand-text font-serif mb-8">You Might Also Like</h2>
                {/* 2 cols on mobile (grid-cols-2), 4 on desktop (lg:grid-cols-4) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                     {relatedProducts.map(item => (
                        <div key={item.id} className="group text-left">
                            <Link href={`${basePath}/product/${item.id}`} className="block bg-brand-primary overflow-hidden relative aspect-[4/5] rounded-lg">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                            <div className="mt-4">
                                <h3 className="text-base md:text-xl font-serif font-medium text-brand-text line-clamp-1">
                                    <Link href={`${basePath}/product/${item.id}`} className="hover:text-brand-secondary">{item.name}</Link>
                                </h3>
                                <p className="text-brand-text font-medium text-sm md:text-base mt-1">₹{item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
