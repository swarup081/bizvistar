'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import Link from 'next/link';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Gallery State
    const allImages = [product?.image, ...(product?.additional_images || [])].filter(Boolean);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }
    };
    const [selectedVariants, setSelectedVariants] = useState({});

    // Initialize defaults
    useEffect(() => {
        if (product) {
            if (product.variants && Array.isArray(product.variants)) {
                const defaults = {};
                product.variants.forEach(v => {
                    const vals = v.values.split(',').map(s => s.trim());
                    if (vals.length > 0) defaults[v.name] = vals[0];
                    if (v.type === 'color') {
                         const colorParts = vals[0].split(':');
                         defaults[v.name] = colorParts[0];
                    }
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
                     // Request 2-8 items
                     const suggestions = await fetchSuggestedProducts(websiteId, product, 2, 8);
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

    // Carousel Logic
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Image Gallery (Carousel) */}
                <div className="relative group w-full max-w-lg mx-auto md:mx-0">
                    <div className="bg-brand-primary overflow-hidden rounded-xl relative aspect-[4/5] max-h-[60vh] md:max-h-[600px] w-full" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                         <img
                            src={allImages[currentImageIndex]}
                            alt={product.name} 
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>

                     {/* Arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={24} />
                            </button>
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {allImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
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
                                const rawValues = v.values.split(',').map(s => s.trim());
                                return (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-2">
                                            {v.name}: <span className="text-brand-text normal-case font-normal ml-1">{selectedVariants[v.name]}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {v.type === 'color' ? (
                                                rawValues.map(valStr => {
                                                    const [hex, name] = valStr.split(':');
                                                    const colorName = name || hex;
                                                    const isSelected = selectedVariants[v.name] === hex;
                                                    return (
                                                        <button
                                                            key={hex}
                                                            onClick={() => handleVariantChange(v.name, hex)}
                                                            className={`w-10 h-10 rounded-full border-2 transition-all relative group ${isSelected ? 'border-brand-text ring-1 ring-brand-text ring-offset-2' : 'border-transparent hover:scale-110'}`}
                                                            style={{ backgroundColor: hex }}
                                                            title={colorName}
                                                        >
                                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10">
                                                                {colorName}
                                                            </span>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                rawValues.map(opt => (
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
                                                ))
                                            )}
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
