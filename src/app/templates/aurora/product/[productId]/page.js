'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import { ProductCard } from '../../components.js';
import { fetchSuggestedProducts } from '@/app/actions/recommendations';

export default function ProductPage() {
    const { productId } = useParams();
    const { businessData, websiteId } = useTemplateContext();
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);
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
                    .filter(p => String(p.category) === String(product.category) && String(p.id) !== String(product.id))
                    .slice(0, 4);
                 setRelatedProducts(local);
             }
        };
        loadSuggestions();
    }, [product, websiteId, businessData.allProducts]);

    if (!product) return <div className="py-20 text-center">Product not found</div>;

    const handleAddToCart = () => {
        addToCart({ ...product, selectedVariants }, qty);
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
        <div className="bg-[var(--color-bg)] w-full max-w-full overflow-hidden overflow-x-hidden min-h-screen">
            <div className="container mx-auto px-6 py-12 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-8 md:mt-0 items-start">
                    
                    {/* Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-50 aspect-[3/4] relative overflow-hidden max-h-[60vh] md:max-h-[600px] w-full max-w-md mx-auto md:max-w-none md:mx-0">
                            <img src={selectedImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-white text-black px-4 py-2 uppercase tracking-widest text-xs font-bold">Sold Out</span>
                                </div>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 justify-center md:justify-start">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-14 h-14 shrink-0 border border-gray-200 ${selectedImage === img ? 'ring-1 ring-black' : 'opacity-70'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[7vw] md:text-4xl font-serif mb-2 md:mb-4 leading-tight">{product.name}</h1>
                        <p className="text-[5vw] md:text-2xl font-light mb-4 text-[#D4A373]">${product.price.toFixed(2)}</p>

                        {/* Headers */}
                        {category && (
                            <div className="mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Category</h3>
                                <p className="text-sm md:text-base">{category.name}</p>
                            </div>
                        )}

                        {product.description && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6 space-y-4">
                                {product.variants.map((v, idx) => {
                                    const options = v.values.split(',').map(s => s.trim());
                                    return (
                                        <div key={idx}>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{v.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleVariantChange(v.name, opt)}
                                                        className={`px-3 py-1 border text-xs uppercase tracking-wider transition-all ${
                                                            selectedVariants[v.name] === opt
                                                                ? 'bg-black text-white border-black'
                                                                : 'border-gray-300 text-gray-600 hover:border-black'
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
                        
                        <div className="flex flex-col md:flex-row gap-4 mb-4 mt-4">
                            <div className={`flex border border-gray-300 w-full md:w-32 h-12 items-center ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                                <button onClick={() => setQty(Math.max(1, qty-1))} className="w-10 h-full hover:bg-gray-100 flex items-center justify-center">-</button>
                                <span className="flex-grow flex items-center justify-center font-bold">{qty}</span>
                                <button onClick={() => setQty(isUnlimited ? qty+1 : Math.min(stock, qty+1))} className="w-10 h-full hover:bg-gray-100 flex items-center justify-center">+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-grow h-12 bg-[#0F1C23] text-white text-sm uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-gray-200">
                        <h2 className="text-[6vw] md:text-3xl font-serif text-center mb-8 md:mb-16">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} item={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
