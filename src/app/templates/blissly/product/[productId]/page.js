'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
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

    // Stock
    const rawStock = product?.stock;
    const isUnlimited = rawStock === -1;
    const stock = isUnlimited ? Infinity : (rawStock || 0);
    const isOutOfStock = !isUnlimited && stock === 0;

    return (
        <div className="w-full max-w-full overflow-hidden overflow-x-hidden">
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 font-sans">
                {/* Changed to grid-cols-1 on mobile for better spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    
                     {/* Image Gallery (Carousel) */}
                    <div className="relative group w-full max-w-md mx-auto md:max-w-none md:mx-0">
                        <div className="bg-brand-primary overflow-hidden rounded-lg relative aspect-[4/5] max-h-[60vh] md:max-h-[600px] w-full" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                            <img 
                                src={allImages[currentImageIndex]} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-white text-black px-4 py-2 uppercase tracking-widest text-xs font-bold rounded-lg">Sold Out</span>
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
                    <div className="py-0 md:py-4 flex flex-col h-full">
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-brand-text mt-1 md:mt-2 leading-tight">{product.name}</h1>
                        <p className="text-2xl md:text-3xl text-brand-secondary font-sans mt-2 md:mt-4 font-bold">${product.price.toFixed(2)}</p>
                        
                        {category && (
                            <div className="mt-4">
                                <span className="text-xs font-bold text-brand-text/50 uppercase tracking-widest">Category</span>
                                <p className="text-brand-text/80">{category.name}</p>
                            </div>
                        )}

                        {product.description && (
                            <div className="mt-4">
                                <span className="text-xs font-bold text-brand-text/50 uppercase tracking-widest">Description</span>
                                <p className="text-brand-text/80 text-lg leading-relaxed mt-1">{product.description}</p>
                            </div>
                        )}

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mt-6 space-y-4">
                                {product.variants.map((v, idx) => {
                                    const rawValues = v.values.split(',').map(s => s.trim());
                                    return (
                                        <div key={idx}>
                                            <span className="text-xs font-bold text-brand-text/50 uppercase tracking-widest block mb-2">{v.name}</span>
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
                                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                                                                selectedVariants[v.name] === opt
                                                                    ? 'bg-brand-secondary text-brand-bg border-brand-secondary'
                                                                    : 'bg-transparent border-brand-text/20 text-brand-text hover:border-brand-secondary'
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
                        <div className="flex flex-col md:flex-row items-stretch gap-4 mt-8 border-t border-brand-text/10 pt-8">
                            <div className={`flex items-center border border-brand-text/20 rounded-lg h-12 w-full md:w-32 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full text-xl text-brand-text/70 hover:bg-brand-primary rounded-l-lg flex items-center justify-center">-</button>
                                <span className="flex-grow h-full flex items-center justify-center text-lg font-bold border-x border-brand-text/20">{quantity}</span>
                                <button onClick={() => setQuantity(q => isUnlimited ? q+1 : Math.min(stock, q + 1))} className="w-10 h-full text-xl text-brand-text/70 hover:bg-brand-primary rounded-r-lg flex items-center justify-center">+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="h-12 w-full bg-brand-secondary text-brand-bg font-medium tracking-wide transition-opacity rounded-lg hover:opacity-90 text-base whitespace-nowrap px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
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
