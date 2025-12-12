'use client';
import { useState } from 'react';
import { useCart } from './cartContext.js';
import { useTemplateContext } from './templateContext.js';
import Link from 'next/link';
import { ShoppingBag, Instagram, Facebook, Twitter, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

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
            {/* Irregular dripping path matching the screenshot */}
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
            {/* Irregular dripping path matching the screenshot */}
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
// --- HEADER (Centered Logo, "Made with Love" banner) ---
export const Header = () => {
    const { businessData } = useTemplateContext();
    const { cartCount, openCart } = useCart();

    return (
        <header className="fixed top-0 w-full z-50 bg-white overflow-hidden">
            {/* Top Banner */}
            <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-[0.2em] text-center py-2">
                • {businessData.hero.badge || "Made with Love"} • {businessData.hero.badge || "Made with Love"} • {businessData.hero.badge || "Made with Love"} •
            </div>
            
            <div className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-100">
                {/* Socials / Left */}
                <div className="flex gap-2 text-[var(--color-primary)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-80 transition cursor-pointer">
                        <Instagram className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-80 transition cursor-pointer">
                        <Facebook className="w-4 h-4" />
                    </div>
                </div>

                {/* Logo (Centered) */}
                <Link href="/templates/frostify" className="text-4xl font-serif text-[var(--color-primary)]">
                    {businessData.name}
                </Link>

                {/* Menu / Right */}
                <button onClick={openCart} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[var(--color-secondary)] transition">
                    Menu
                    {cartCount > 0 && <span>({cartCount})</span>}
                </button>
            </div>
        </header>
    );
};

// --- SPECIALTY CARD (Unique Shape from Image) ---
// Shape: Rounded top-left and top-right, or specific custom radius
export const SpecialtyCard = ({ title, shapeClass = "rounded-t-[30px]" }) => {
    // Splits title into two lines for style if needed
    const parts = title.split(' '); 
    
    return (
        <div className={`aspect-square bg-[#F9F4F6] ${shapeClass} flex flex-col items-center justify-center text-center p-6 hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer group shadow-sm overflow-hidden`}>
            <h3 className="font-serif text-2xl text-[var(--color-primary)] leading-tight group-hover:scale-105 transition-transform">
                {parts[0]} <br/> {parts.slice(1).join(' ')}
            </h3>
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
          
            {/* Top Wavy Decor */}
            <div className="absolute top-0 left-0 w-full -translate-y-[99%] pointer-events-none">
                <WavySeparatorBottom fill="#592E4F" />
            </div>

            <div className="container mx-auto px-6 pt-10 pb-10 text-center relative z-10">
                <h2 className="text-4xl font-serif mb-2">Contact us</h2>
                
                {/* Form Simulation (Visual Only) */}
                <div className="max-w-lg mx-auto mt-8 space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold ml-2">Name *</label>
                            <input type="text" className="w-full bg-white rounded-full px-4 py-2 text-[var(--color-primary)] focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold ml-2">Email *</label>
                            <input type="email" className="w-full bg-white rounded-full px-4 py-2 text-[var(--color-primary)] focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold ml-2">Message *</label>
                        <textarea className="w-full bg-white rounded-2xl px-4 py-2 text-[var(--color-primary)] focus:outline-none h-24" />
                    </div>
                    <div className="text-center">
                        <button className="bg-[var(--color-accent)] text-[var(--color-primary)] px-10 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                            Submit
                        </button>
                    </div>
                </div>

                {/* Info */}
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
            
            {/* Bottom Wavy Decor (Upside down white wave for page end effect if needed) */}
          
        </footer>
        
    );
};