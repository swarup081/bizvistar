'use client';
import { useState } from 'react';
import { useCart } from './cartContext.js';
import { useTemplateContext } from './templateContext.js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, Star } from 'lucide-react';

// --- ICONS ---
export const FeatureIcon = ({ name, size = 32 }) => {
    const icons = {
        fast_shipping: <path d="M5 12h14M12 5l7 7-7 7" />,
        card: <rect x="2" y="5" width="20" height="14" rx="2" />,
        certified: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
        ecology: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {icons[name] || icons.fast_shipping}
        </svg>
    );
};

// --- HEADER (Matches Eglanto Layout) ---
export const Header = () => {
    const { businessData } = useTemplateContext();
    const { cartCount, openCart } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            setScrolled(window.scrollY > 20);
        });
    }

    return (
        <header className={`${scrolled ? "fixed bg-white/70 backdrop-blur-md shadow-sm py-4" : "absolute py-8"} top-0 left-0 w-full z-50 px-6 lg:px-16 transition-all duration-300`}>
            <div className="max-w-[1920px] mx-auto flex justify-between items-center">
                
                {/* LEFT: Navigation Links */}
                <nav className="hidden lg:flex items-center gap-10">
                    {['Home', 'Shop'].map((item) => (
                        <Link 
                            key={item} 
                            href={item === 'Home' ? '/templates/aurora' : `/templates/aurora/${item.toLowerCase()}`}
                            className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                                (item === 'Home' && pathname === '/templates/aurora') ||
                                (item === 'Shop' && pathname.startsWith('/templates/aurora/shop'))
                                    ? 'text-[#0F1C23] border-b-2 border-[#0F1C23] pb-1'
                                    : 'text-gray-500 hover:text-[#0F1C23]'
                            }`}
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* CENTER: Logo */}
                <Link href="./templates/aurora" className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
                   
                    <span className="font-serif text-3xl text-[#0F1C23] tracking-tight font-medium">
                        {businessData.name}
                    </span>
                </Link>

                {/* RIGHT: Icons */}
                <div className="flex items-center gap-8 text-[#0F1C23]">
       
                    <button onClick={openCart} className="hover:scale-110 transition-transform relative">
                        <ShoppingBag size={22} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4A373] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

// --- PRODUCT CARD ---
export const ProductCard = ({ item }) => {
    const { addItem } = useCart();
    const stock = item.stock !== undefined ? item.stock : 10;
    const isOutOfStock = stock === 0;

    return (
        <div className="group cursor-pointer flex flex-col gap-5">
            <div className="relative overflow-hidden aspect-[3/4] bg-[#F5F5F5]">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
                />
                 {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="bg-[#0F1C23]/80 text-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">Out of Stock</span>
                    </div>
                )}
                {/* Mobile: Static position below image or always visible?
                    User requested "hover not possible". Making it visible on mobile via media query.
                */}
                <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-500
                    ${isOutOfStock ? 'hidden' : 'opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0'}`}
                >
                    <button 
                        onClick={(e) => { e.preventDefault(); if(!isOutOfStock) addItem(item); }}
                        disabled={isOutOfStock}
                        className="w-full bg-white/90 backdrop-blur-sm text-[#0F1C23] py-3 md:py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#0F1C23] hover:text-white transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className="text-center">
                <h3 className="font-serif text-sm md:text-lg text-[#0F1C23] leading-tight mb-2 group-hover:text-[#D4A373] transition-colors">{item.name}</h3>
                <span className="text-xs md:text-sm font-medium text-gray-500 tracking-wide">${item.price}</span>
            </div>
        </div>
    );
};

// --- NEWSLETTER CTA (Exact "An Invitation" Design) ---
export const NewsletterCTA = ({ data }) => {
    return (
        <section className="py-32 bg-[#0B1215] relative overflow-hidden text-white flex items-center justify-center">
            
            {/* Double Border Frame for Luxury Feel */}
            <div className="absolute inset-6 border border-[#D4A373] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-8 border border-[#D4A373] opacity-10 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                <div className="flex flex-col items-center">
                     {/* Top Tag */}
                     <span className="text-[#D4A373] text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
                        An Invitation
                     </span>
                     
                     {/* Main Heading */}
                     <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
                        {data.title || "Unlock Exclusive Access"}
                     </h2>
                     
                     {/* Description Text */}
                     <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-16">
                        {data.text || "Sign up to receive invitations to private viewings, early access to new collections, and expert advice on building your jewelry heirloom."}
                     </p>
                </div>

                {/* Minimalist Input Form */}
                <div className="max-w-md mx-auto relative flex flex-col items-center gap-8">
                    <input 
                        type="email" 
                        placeholder={data.placeholder || "Enter your email address"}
                        className="w-full bg-transparent border-b border-[#D4A373]/30 py-4 px-2 text-center text-white placeholder-gray-600 focus:border-[#D4A373] focus:outline-none transition-colors text-sm font-light tracking-wide"
                    />
                    <button className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4A373] hover:text-white transition-colors border border-[#D4A373] px-12 py-4 hover:bg-[#D4A373]/10 mt-4">
                        {data.buttonText || "Join the List"}
                    </button>
                </div>
            </div>
        </section>
    );
};

// --- TESTIMONIAL SLIDER ---
export const TestimonialSlider = ({ data }) => {
    const [index, setIndex] = useState(0);
    const item = data.items[index];

    return (
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-12">Client Reviews</h2>
            
            <div className="relative bg-white p-12 lg:p-20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-2xl">
                <div className="absolute top-10 left-10 text-6xl font-serif text-[#D4A373] opacity-20">“</div>
                
                <div className="flex flex-col items-center animate-fade-in">
                    <div className="flex gap-1 text-[#D4A373] mb-8">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                    </div>
                    
                    <blockquote className="text-2xl md:text-4xl font-serif text-[#0F1C23] leading-snug mb-10 max-w-3xl">
                        "{item.quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-serif text-xl italic text-[#D4A373]">
                            {item.author.charAt(0)}
                        </div>
                        <div className="text-left">
                            <cite className="not-italic block text-xs font-bold uppercase tracking-[0.2em] text-[#0F1C23]">
                                {item.author}
                            </cite>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                {item.location}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                    {data.items.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-[#0F1C23] w-6' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- INSTAGRAM FEED ---
export const InstagramFeed = ({ data }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-12 px-4">
                <div>
                    <span className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-2 block">Social Media</span>
                    <h2 className="text-4xl font-serif text-[#0F1C23]">{data.title}</h2>
                </div>
                <a href="#" className="text-xs font-bold uppercase tracking-widest border-b border-[#0F1C23] pb-1 hover:text-[#D4A373] hover:border-[#D4A373] transition-colors">
                    {data.handle}
                </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
                {data.images.map((img, i) => (
                    <div key={i} className="aspect-square relative group overflow-hidden cursor-pointer">
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Heart className="text-white fill-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- FAQ ACCORDION ---
export const FAQAccordion = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 flex justify-between items-center text-left hover:text-[#D4A373] transition-colors group"
            >
                <span className="text-xl font-serif text-[#0F1C23] pr-8 group-hover:text-[#D4A373] transition-colors">{question}</span>
                <span className={`text-2xl font-light text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'max-h-48 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 font-light leading-relaxed max-w-2xl text-lg">{answer}</p>
            </div>
        </div>
    );
};

// --- FOOTER ---
export const Footer = () => {
    const { businessData } = useTemplateContext();
    return (
        <footer className="bg-[#EBE5DF] pt-24 pb-12">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-serif font-bold mb-6 text-[#0F1C23]">{businessData.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">{businessData.footer.description}</p>
                    </div>
                    
                    <div className="col-span-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#0F1C23]">Explore</h4>
                        <ul className="space-y-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                            {businessData.footer.links.main.map(link => (
                                <li key={link.name}><a href={link.url} className="hover:text-[#0F1C23] transition-colors">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>
                    
                     <div className="col-span-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#0F1C23]">Legal</h4>
                        <ul className="space-y-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                             {businessData.footer.links.utility.map(link => (
                                <li key={link.name}><a href={link.url} className="hover:text-[#0F1C23] transition-colors">{link.name}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1">
                         <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-[#0F1C23]">Stay Updated</h4>
                         <p className="text-xs text-gray-500 mb-4">{businessData.footer.subscribe.title}</p>
                         <div className="flex border-b border-gray-400 pb-2">
                             <input type="email" placeholder="Email Address" className="bg-transparent flex-grow text-xs outline-none placeholder-gray-500 text-[#0F1C23]" />
                             <button className="text-[10px] font-bold uppercase tracking-widest hover:text-[#D4A373] transition-colors">{businessData.footer.subscribe.cta}</button>
                         </div>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-300 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    <p>{businessData.footer.copyright}</p>
                    <p>Designed by BizVistar</p>
                </div>
            </div>
        </footer>
    );
};