'use client';
import { useState } from 'react';
import { useCart } from './cartContext.js';
import { useTemplateContext } from './templateContext.js';
import Link from 'next/link';
import { ShoppingBag, Instagram, Facebook, Twitter, ChevronDown, ChevronRight, ChevronLeft, Store } from 'lucide-react';

// --- CUSTOM SVG SEPARATOR (The "Icing" Drip) ---
export const WavySeparatorTop = ({ fill = "#592E4F" }) => (
    <div className="w-full overflow-hidden leading-none rotate-180">
        <svg 
            className="relative block w-[calc(100%+1.3px)] h-[70px] md:h-[100px]" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
        >
            <path 
                d="M0,0 V40 
                   C150,100 280,20 400,60 
                   C520,100 600,10 720,50 
                   C840,90 950,20 1050,60 
                   C1120,90 1160,70 1200,50 
                   V0 Z" 
                fill={fill} 
            />
        </svg>
    </div>
);
export const WavySeparatorBottom = ({ fill = "#592E4F" }) => (
    <div className="w-full overflow-hidden leading-none">
        <svg 
            className="relative block w-[calc(100%+1.3px)] h-[70px] md:h-[100px]" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
        >
            <path 
                d="M0,0 
                   V30 
                   C80,60 160,90 260,50 
                   C380,10 480,90 600,60 
                   C720,30 820,100 940,50 
                   C1040,10 1120,60 1200,40 
                   V0 Z" 
                fill={fill} 
            />
        </svg>
    </div>
);

// --- HEADER ---
export const Header = () => {
    const { businessData } = useTemplateContext();
    const { cartCount, openCart } = useCart();

    return (
        <header className="fixed top-0 w-full z-50 bg-white overflow-hidden shadow-sm">
            {/* Top Banner */}
            <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-[0.2em] text-center py-2">
                • {businessData.hero.badge || "Made with Love"} • {businessData.hero.badge || "Made with Love"} • {businessData.hero.badge || "Made with Love"} •
            </div>
            
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Left: SHOP Button (Prominent UI) */}
                <div className="flex gap-2">
                    <Link 
                        href="/templates/frostify/shop" 
                        className="flex items-center gap-2 bg-[var(--color-secondary)] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all shadow-md transform hover:scale-105"
                    >
                        <Store size={14} />
                        Shop 
                    </Link>
                </div>

                {/* Center: Logo */}
                <Link href="/templates/frostify" className="text-4xl font-serif text-[var(--color-primary)] absolute left-1/2 -translate-x-1/2">
                    {businessData.name}
                </Link>

                {/* Right: Cart Button (Preserved Menu Style) */}
                <button 
                    onClick={openCart} 
                    className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[var(--color-secondary)] transition"
                >
                    Cart
                    {cartCount > 0 && <span>({cartCount})</span>}
                </button>
            </div>
        </header>
    );
};

// --- SPECIALTY CARD (Unique Shape from Image) ---
export const SpecialtyCard = ({ title, shapeClass = "rounded-t-[30px]" }) => {
    const parts = title.split(' '); 
    
    return (
        <div className={`aspect-square bg-[#F9F4F6] ${shapeClass} flex flex-col items-center justify-center text-center p-6 hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer group shadow-sm overflow-hidden`}>
            <h3 className="font-serif text-2xl text-[var(--color-primary)] leading-tight group-hover:scale-105 transition-transform">
                {parts[0]} <br/> {parts.slice(1).join(' ')}
            </h3>
        </div>
    );
};

// --- PRODUCT CARD (Reusable) ---
export const ProductCard = ({ item }) => {
    const { addItem } = useCart();
    const stock = item.stock !== undefined ? item.stock : 10;
    const isOutOfStock = stock === 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!isOutOfStock) {
            addItem(item);
        }
    };

    return (
        <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-pink-50 h-full flex flex-col">
            <Link href={`/templates/frostify/product/${item.id}`} className="block flex-grow-0">
                <div className="aspect-[4/5] overflow-hidden relative bg-[#F9F4F6]">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                    />
                     {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-[var(--color-primary)]/80 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-4 md:p-5 text-center flex flex-col items-center gap-2 flex-grow">
                <Link href={`/templates/frostify/product/${item.id}`} className="flex-grow">
                    <h3 className="font-serif text-sm md:text-lg text-[var(--color-primary)] hover:text-[var(--color-secondary)] tracking-wide">{item.name}</h3>
                </Link>
                <p className="text-[var(--color-secondary)] font-bold text-sm md:text-lg">${item.price.toFixed(2)}</p>
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`mt-auto w-full py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                        isOutOfStock
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]'
                    }`}
                >
                    {isOutOfStock ? (
                         'No Stock'
                    ) : (
                        <><ShoppingBag size={14} /> Add to Cart</>
                    )}
                </button>
            </div>
        </div>
    );
};

// --- FAQ ACCORDION ---
export const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-[#Fdf4f8] rounded-full mb-3 overflow-hidden border border-transparent">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-4 flex justify-between items-center text-left bg-[#fceef5] hover:bg-[#fae1ed] transition-colors"
            >
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">{question}</span>
                <ChevronDown className={`w-4 h-4 text-[var(--color-primary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ${isOpen ? 'max-h-32 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
                <p className="px-8 text-sm text-[var(--color-primary)]/80 font-medium">{answer}</p>
            </div>
        </div>
    );
};

// --- FOOTER ---
export const Footer = () => {
    const { businessData } = useTemplateContext();
    
    return (
        <footer className="relative bg-[var(--color-primary)] text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full -translate-y-[99%] pointer-events-none">
                <WavySeparatorBottom fill="#592E4F" />
            </div>

            <div className="container mx-auto px-6 pt-10 pb-10 text-center relative z-10">
                <h2 className="text-4xl font-serif mb-2">Contact us</h2>
                
                <div className="mt-16 text-left max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-medium opacity-80">
                    <div>
                        <p className="font-bold uppercase tracking-widest mb-2 opacity-100">Opening Hours:</p>
                        <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
                        <p>Saturday: 9:00 AM – 4:00 PM</p>
                        <p>Sunday: Closed</p>
                    </div>
                    <div>
                        <p className="font-bold uppercase tracking-widest mb-2 opacity-100">Contact:</p>
                        <p>Phone: +1 (123) 456-7890</p>
                        <p>Email: bakery@example.com</p>
                    </div>
                </div>

                <div className="mt-12 flex justify-center gap-4 text-[10px] opacity-60">
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
                        <Instagram className="w-3 h-3" />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
                        <Facebook className="w-3 h-3" />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
                        <Twitter className="w-3 h-3" />
                    </div>
                </div>
                
                <p className="text-[10px] mt-4 opacity-50">{businessData.footer.copyright}</p>
            </div>
        </footer>
    );
};