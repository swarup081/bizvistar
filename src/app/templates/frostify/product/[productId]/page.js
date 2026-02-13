'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FrostifyProductPage() {
    const { productId } = useParams();
    const { businessData, websiteId } = useTemplateContext();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariants, setSelectedVariants] = useState({});

    const product = businessData.allProducts.find(p => p.id.toString() === productId);
    const category = product ? businessData.categories.find(c => c.id === product.category) : null;

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
    useEffect(() => {
        if (product) {
            setSelectedImage(product.image);
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

    useEffect(() => {
        const loadSuggestions = async () => {
             if (product) {
                 if (websiteId) {
                     // Request 2-8
                     const suggestions = await fetchSuggestedProducts(websiteId, product, 2, 8);
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

    // Stock
    const rawStock = product?.stock;
    const isUnlimited = rawStock === -1;
    const stock = isUnlimited ? Infinity : (rawStock || 0);
    const isOutOfStock = !isUnlimited && stock === 0;

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32 pb-12 md:pb-24 w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-6">
                
                {/* Main Product Display: 1 Col on mobile, 2 on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-12 md:mb-24">

                    {/* Gallery (Carousel) */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-[#F9F4F6] rounded-2xl overflow-hidden shadow-lg aspect-square relative max-h-[60vh] md:max-h-[600px] w-full max-w-md mx-auto md:max-w-none md:mx-0 group" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                            <img
                                src={allImages[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-lg">Sold Out</span>
                                </div>
                            )}

                            {/* Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-primary)] p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-primary)] p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {allImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[var(--color-primary)] w-4' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Info */}
                    <div>
                        {category && (
                            <span className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-[0.2em] block mb-2">
                                {category.name}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-primary)] mb-2 md:mb-6 leading-tight">{product.name}</h1>
                        <p className="text-3xl text-[var(--color-primary)] font-bold mb-4 md:mb-8">${product.price.toFixed(2)}</p>

                        {product.description && (
                             <div className="mb-6">
                                <span className="text-xs font-bold text-[var(--color-primary)]/50 uppercase tracking-widest block mb-2">Description</span>
                                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                            </div>
                        )}

                         {/* Variants */}
                         {product.variants && product.variants.length > 0 && (
                            <div className="mb-8 space-y-4">
                                {product.variants.map((v, idx) => {
                                    const rawValues = v.values.split(',').map(s => s.trim());
                                    return (
                                        <div key={idx}>
                                            <span className="text-xs font-bold text-[var(--color-primary)]/50 uppercase tracking-widest block mb-2">{v.name}</span>
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
                                                                className={`w-10 h-10 rounded-full border-2 transition-all relative group ${isSelected ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] ring-offset-2' : 'border-transparent hover:scale-110'}`}
                                                                style={{ backgroundColor: hex }}
                                                                title={colorName}
                                                            >
                                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10">
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
                                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                                                                selectedVariants[v.name] === opt
                                                                    ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]'
                                                                    : 'bg-white border-[var(--color-primary)]/20 text-[var(--color-primary)] hover:border-[var(--color-secondary)]'
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
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className={`flex items-center border border-[var(--color-primary)] rounded-full px-2 h-12 w-full md:w-32 justify-center ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 text-lg text-[var(--color-primary)] font-bold hover:bg-gray-50 rounded-full">-</button>
                                <span className="px-3 text-lg text-[var(--color-primary)] font-bold w-10 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(isUnlimited ? quantity+1 : Math.min(stock, quantity + 1))} className="px-3 text-lg text-[var(--color-primary)] font-bold hover:bg-gray-50 rounded-full">+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-grow bg-[var(--color-primary)] text-white px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors h-12 flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
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
