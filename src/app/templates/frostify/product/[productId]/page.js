'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';

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

    const allImages = [product.image, ...(product.additional_images || [])].filter(Boolean);

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
                    {/* Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-[#F9F4F6] rounded-2xl overflow-hidden shadow-lg aspect-square relative max-h-[60vh] md:max-h-[600px] w-full max-w-md mx-auto md:max-w-none md:mx-0">
                            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-lg">Sold Out</span>
                                </div>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 justify-center md:justify-start">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-[var(--color-secondary)]' : 'border-transparent opacity-70'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
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
                                    const options = v.values.split(',').map(s => s.trim());
                                    return (
                                        <div key={idx}>
                                            <span className="text-xs font-bold text-[var(--color-primary)]/50 uppercase tracking-widest block mb-2">{v.name}</span>
                                            <div className="flex flex-wrap gap-2">
                                                {options.map(opt => (
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
                                                ))}
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
