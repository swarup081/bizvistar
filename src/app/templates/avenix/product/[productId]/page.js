'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import Link from 'next/link';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
    const params = useParams();
    const { productId } = params;
    const { addToCart } = useCart();
    const { businessData, websiteId } = useTemplateContext();
    
    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    const category = product ? businessData.categories.find(c => c.id === product.category) : null;
    
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    // Gallery State
    const allImages = [product?.image, ...(product?.additional_images || [])].filter(Boolean);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [selectedVariants, setSelectedVariants] = useState({});

    // Initialize defaults
    useEffect(() => {
        if (product) {
            // Robust check for variants
            const variants = Array.isArray(product.variants) ? product.variants : [];
            if (variants.length > 0) {
                const defaults = {};
                variants.forEach(v => {
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
    const stock = isUnlimited ? Infinity : (rawStock !== undefined ? rawStock : Infinity);
    const isOutOfStock = !isUnlimited && stock === 0;
    const isLowStock = !isUnlimited && stock > 0 && stock < 10;
    
    useEffect(() => {
        const loadSuggestions = async () => {
             if (product) {
                 if (websiteId) {
                     const suggestions = await fetchSuggestedProducts(websiteId, product, 2, 8);
                     if (suggestions && suggestions.length > 0) {
                         setRelatedProducts(suggestions);
                         return;
                     }
                 }
                 
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
        addToCart({ ...product, selectedVariants }, quantity);
    };

    const handleVariantChange = (name, value) => {
        setSelectedVariants(prev => ({ ...prev, [name]: value }));
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    // Variants data safe access
    const variants = Array.isArray(product.variants) ? product.variants : [];

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                
                {/* Image Gallery */}
                <div className="relative group w-full max-w-lg mx-auto md:mx-0">
                    <div className="bg-brand-primary overflow-hidden rounded-xl md:rounded-lg relative aspect-[4/5] max-h-[60vh] md:max-h-[600px] w-full">
                        <img
                            src={allImages[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                    {allImages.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={24} /></button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={24} /></button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {allImages.map((_, idx) => (
                                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                {/* Product Info */}
                <div className="py-2 md:py-4">
                    <h1 className="text-[6vw] md:text-5xl font-serif font-medium text-brand-text mt-1 md:mt-2">{product.name}</h1>
                    <p className="text-[4vw] md:text-3xl text-brand-text font-sans mt-2 md:mt-4">${product.price.toFixed(2)}</p>
                    
                    <div className="mt-2 md:mt-4 text-[2.5vw] md:text-base">
                        {isOutOfStock ? <span className="text-red-600 font-medium">Currently Unavailable</span> : isLowStock ? <span className="text-orange-600 font-medium">Only {stock} left in stock!</span> : <span className="text-green-600 font-medium">In Stock</span>}
                    </div>

                    {category && (
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-1">Category</h3>
                            <p className="text-brand-text/80 text-lg">{category.name}</p>
                        </div>
                    )}

                    {/* Variants */}
                    {variants.length > 0 && (
                        <div className="mt-8 space-y-6">
                            {variants.map((v, idx) => {
                                const rawValues = v.values.split(',').map(s => s.trim());
                                return (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-3">
                                            {v.name}: <span className="text-brand-text normal-case font-normal ml-1">{selectedVariants[v.name]}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
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
                                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10">{colorName}</span>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                rawValues.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleVariantChange(v.name, opt)}
                                                        className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${selectedVariants[v.name] === opt ? 'bg-brand-secondary text-brand-bg border-brand-secondary' : 'border-brand-text/20 text-brand-text hover:border-brand-secondary'}`}
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

                    {/* Add to Cart */}
                    <div className="flex items-stretch gap-2 md:gap-4 mt-8 md:mt-10 border-t border-brand-text/10 pt-8 mb-8">
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

                    {/* Description - Moved to Bottom */}
                    {product.description && (
                        <div className="mt-6 pt-6 border-t border-brand-text/10">
                            <h3 className="text-sm font-bold text-brand-text/50 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-brand-text/80 text-[3vw] md:text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-brand-text/10">
                <h2 className="text-[6vw] md:text-4xl font-serif font-medium text-brand-text mb-8 md:mb-12 text-center">You Might Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16 items-stretch">
                     {relatedProducts.map(item => <ProductCard key={item.id} item={item} templateName="avenix" />)}
                </div>
            </div>
        </div>
    );
}
