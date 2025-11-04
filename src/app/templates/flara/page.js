'use client';
import { useState, useEffect } from 'react';
import { businessData as initialBusinessData } from './data.js';

// --- Reusable SVG Icons ---
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);
const ShippingIcon = () => (
    // This component now contains the actual candle icon
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 opacity-80"
      viewBox="0 0 100 140" // Keeps the candle's proportions
      fill="none"
      stroke="currentColor"
      strokeWidth="2" // Matches the stroke width from your component
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Glass Jar */}
      <ellipse cx="50" cy="25" rx="40" ry="10" />
      <path d="M 10 25 L 10 115" />
      <path d="M 90 25 L 90 115" />
      <path d="M 10 115 A 40 10 0 0 0 90 115" />
      <path d="M 8 122 A 42 10 0 0 0 92 122" />
      
      {/* Wax */}
      <path d="M 12 45 A 38 8 0 0 0 88 45" />
      
      {/* Wick */}
      <line x1="50" y1="45" x2="50" y2="28" />
      
      {/* Flame */}
      <g>
        <path d="M 50 30 Q 46 22 50 10 Q 54 22 50 30 Z" />
        <path d="M 50 27 Q 48.5 22 50 16" />
      </g>
    </svg>
  );

// --- Reusable UI Components ---

const Header = ({ business, cartCount, onCartClick }) => (
    <header className="bg-brand-bg/90 backdrop-blur-sm sticky top-0 z-40 w-full">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
            <a href="#home" className="text-3xl font-bold text-brand-text font-serif tracking-wider">
                {business.logoText}
            </a>
            <nav className="hidden md:flex space-x-10">
                {business.navigation.map(navItem => (
                    <a key={navItem.href} href={navItem.href} className="inactive-nav hover:text-brand-secondary transition-colors text-sm font-medium tracking-widest uppercase">{navItem.label}</a>
                ))}
            </nav>
            <div className="flex items-center space-x-6">
                
                <button onClick={onCartClick} className="relative text-brand-text hover:text-brand-secondary">
                    <CartIcon />
                    <span className="absolute -top-2 -right-2 bg-brand-secondary text-brand-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                </button>
            </div>
        </div>
    </header>
);

const ProductCard = ({ item }) => (
    <div className="group text-center h-full flex flex-col justify-between">
        <a href="#" className="block bg-brand-primary  overflow-hidden relative aspect-[4/5] h-80">
            <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => e.target.src = 'https://placehold.co/600x750/CCCCCC/909090?text=Image+Missing'}
            />
        </a>
        <h3 className="text-xl font-serif font-medium text-brand-text mt-5">{item.name}</h3>
        {item.category && <p className="text-brand-text opacity-60 text-sm mt-1">{item.category}</p>}
        <p className="text-brand-text font-medium text-base mt-1">₹{item.price.toFixed(2)}</p>
    </div>
);

// --- Main Page Component ---
export default function CandleaPage() {
    
    const [businessData, setBusinessData] = useState(initialBusinessData); 
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    useEffect(() => {
        const storedStoreName = localStorage.getItem('storeName');
        if (storedStoreName) {
            setBusinessData(prevData => ({
                ...prevData,
                name: storedStoreName,
                logoText: storedStoreName,
                footer: {
                    ...prevData.footer,
                    copyright: `© ${new Date().getFullYear()} ${storedStoreName}. All Rights Reserved`
                }
            }));
        }
    }, []); 

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    // --- Dynamic Theme Logic ---
    const createFontVariable = (fontName) => {
        const formattedName = fontName.toLowerCase().replace(' ', '-');
        return `var(--font-${formattedName})`;
    };
    
    const fontVariables = {
        '--font-heading': createFontVariable(businessData.theme.font.heading),
        '--font-body': createFontVariable(businessData.theme.font.body),
    };

    const themeClassName = `theme-${businessData.theme.colorPalette}`;
    
    return (
        <div 
          className={`antialiased bg-brand-bg text-brand-text ${themeClassName}`}
          style={fontVariables}
        >
            <div className="text-center py-2 text-sm bg-brand-primary text-brand-text">
                Free shipping on all order of ₹899 or more
            </div>
            <Header 
                business={{ logoText: businessData.logoText, navigation: businessData.navigation }} 
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />

            <main>
                {/* --- Hero Section (FIXED: Point 2) --- */}
                <section id="home" className="container mx-auto px-6 py-20 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Text is now on the LEFT */}
                        <div className="flex flex-col gap-6 md:pr-10 text-center md:text-left items-center md:items-start">
                            <h1 className="text-5xl md:text-7xl font-bold text-brand-text leading-tight font-serif">{businessData.hero.title}</h1>
                            <p className="text-lg text-brand-text opacity-70 max-w-md">{businessData.hero.subtitle}</p>
                           <a 
                                href="#shop"
                                className="mt-4 inline-flex items-center gap-3 btn btn-secondary px-8 py-3 text-base font-medium tracking-wider uppercase border border-brand-secondary text-brand-text hover:bg-brand-secondary hover:text-brand-bg transition-all duration-300"
                            >
                                <span>{businessData.hero.cta}</span>
                                <ArrowRightIcon />
                            </a>
                        </div>
                        {/* Image is now on the RIGHT */}
                        <div className="flex justify-center">
                            {/* Image is rounded on the BOTTOM-LEFT */}
                            <div className="w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-bl-[150px] rounded-tr-[150px] overflow-hidden">
                                <img 
                                    src={businessData.hero.image} 
                                    alt="Hero Candle" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                
             {/* --- Info Bar (UPDATED for dynamic, infinite scroll) --- */}
             <section className="py-6 bg-brand-bg border-y border-brand-primary/20 overflow-hidden">
                    <div className="flex whitespace-nowrap">
                        <div className="flex marquee items-center">
                            {/* Content is rendered once */}
                            {businessData.infoBar.map((text, i) => (
                                <div key={i} className="flex items-center justify-center gap-4 mx-8">
                                    <ShippingIcon />
                                    <p className="font-medium text-brand-text opacity-80 text-lg">{text}</p>
                                </div>
                            ))}
                            {/* Content is duplicated for a seamless loop */}
                            {businessData.infoBar.map((text, i) => (
                                <div key={`dup-${i}`} className="flex items-center justify-center gap-4 mx-8" aria-hidden="true">
                                    <ShippingIcon />
                                    <p className="font-medium text-brand-text opacity-80 text-lg">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Feature Section 1 (Screenshot 1) --- */}
                <section id="about" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="flex justify-center">
                             <img 
                                src={businessData.feature1.image} 
                                alt="Crafting warmth" 
                                className="w-full max-w-md lg:max-w-lg aspect-square object-cover"
                            />
                        </div>
                        <div className="md:pl-10 text-center md:text-left items-center md:items-start flex flex-col">
                            <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight font-serif">{businessData.feature1.title}</h2>
                            <p className="text-lg text-brand-text opacity-70 mt-6 max-w-lg">{businessData.feature1.text}</p>
                            <p className="text-base text-brand-text opacity-70 mt-4 max-w-lg">{businessData.feature1.subtext}</p>
                            <a 
                                href="#about"
                                className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-4 py-2 "
                            >
                                <span>{businessData.feature1.cta}</span>
                                <ArrowRightIcon />
                            </a>
                        </div>
                    </div>
                </section>
                
                {/* --- Collection Section (Screenshot 2) --- */}
                <section id="collection" className="py-24 bg-brand-bg">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-bold text-brand-text font-serif">{businessData.collection.title}</h2>
                            <a href="#shop" className="inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-4 py-2 ">
                                <span>See All</span>
                                <ArrowRightIcon />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {businessData.collection.items.map(item => (
                                <a href="#" key={item.id} className="group relative block overflow-hidden shadow-lg aspect-[4/5]">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <h3 className="absolute bottom-6 left-6 text-3xl font-bold text-white font-serif">{item.name}</h3>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* --- Best Sellers (Screenshot 2/3) --- */}
                <section id="shop" className="py-24 bg-brand-bg">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-bold text-brand-text mb-16 font-serif">{businessData.bestSellers.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 items-stretch">
                            {businessData.bestSellers.items.map(item => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item}
                                />
                            ))}
                        </div>
                        <a 
                            href="#shop"
                            className="mt-16 inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-6 py-3 "
                        >
                            <span>Shop Now</span>
                            <ArrowRightIcon />
                        </a>
                    </div>
                </section>

                {/* --- Feature Section 2 (FIXED: Point 4) --- */}
                <section className="py-24 overflow-hidden bg-brand-bg">
                     <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:items-end">
                        <div className="relative">
                            <div className="w-full aspect-[4/5] rounded-t-full overflow-hidden">
                                <img 
                                    src={businessData.feature2.image1} 
                                    alt="Peaceful scents"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-base text-brand-text opacity-70 mt-8 max-w-md">{businessData.feature2.subtext}</p>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="md:pl-10">
                                <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight font-serif">{businessData.feature2.title}</h2>
                                <p className="text-lg text-brand-text opacity-70 mt-6 max-w-lg">{businessData.feature2.text}</p>

                                <img 
                                    src={businessData.feature2.image2}
                                    alt="Calming candle"
                                    className="w-full max-w-xs h-auto  object-cover mt-8"
                                />
                            </div>
                        </div>
                    </div>
                </section>

               

                {/* --- Blog (Screenshot 4) --- */}
                <section id="blog" className="py-24 bg-brand-primary">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-bold text-brand-text font-serif">{businessData.blog.title}</h2>
                            <a href="#" className="inline-flex items-center gap-2 font-semibold text-brand-text hover:text-brand-bg border border-brand-text hover:bg-brand-secondary transition-all duration-300 px-4 py-2 ">
                                <span>See All</span>
                                <ArrowRightIcon />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {businessData.blog.items.map(post => (
                                <div key={post.title} className="group">
                                    <a href="#" className="block overflow-hidden aspect-video bg-brand-bg">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </a>
                                    <div className="mt-4">
                                        <p className="text-sm text-brand-text opacity-60 uppercase tracking-wider">{post.date}</p>
                                        <h3 className="text-xl font-serif font-medium text-brand-text mt-2"><a href="#" className="hover:text-brand-secondary">{post.title}</a></h3>
                                        <p className="text-brand-text opacity-70 mt-2">{post.text}</p>
                                        <a href="#" className="inline-block mt-4 font-semibold text-brand-text text-sm  underline-offset-4">Read more →</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* --- Footer (Screenshot 5) --- */}
          <footer className="bg-brand-text text-brand-bg pt-20 pb-10">
    <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
                <h3 className="text-3xl font-serif mb-4">{businessData?.footer?.promoTitle || "Stay Updated"}</h3>
                <p className="text-lg text-brand-bg/70 mb-4">{businessData?.footer?.subscribeTitle || "Subscribe for latest offers"}</p>
              <form className="relative w-full mt-4">
                  <div className="flex items-end space-x-4">
                      {/* Input and Icon Wrapper */}
                      <div className="relative flex-grow">
                         
                          <input 
                              type="email" 
                              placeholder="Enter your email address" 
                              className="w-full bg-transparent border-0 border-b-2 border-brand-bg/40 py-3 pl-0 text-base text-brand-bg placeholder:text-brand-bg/60 focus:ring-0 focus:border-brand-bg transition-colors duration-300 outline-none"
                          />
                      </div>
                      <button 
                          type="submit" 
                          className="px-8 py-3 bg-brand-bg text-brand-text font-semibold text-base  hover:bg-brand-secondary hover:text-brand-bg transition-colors"
                      >
                          Subscribe
                      </button>
                  </div>
              </form>
            </div>

            <div>
                <h4 className="text-lg font-bold font-serif mb-4 uppercase tracking-wider">About</h4>
                <ul className="space-y-2">
                    {businessData?.footer?.links?.about?.map(link => (
                        <li key={link.name}>
                            <a href={link.url} className="text-brand-bg/70 hover:text-brand-bg">{link.name}</a>
                        </li>
                    )) || <li>No links available</li>}
                </ul>
            </div>

            <div>
                <h4 className="text-lg font-bold font-serif mb-4 uppercase tracking-wider">Categories</h4>
                <ul className="space-y-2">
                    {businessData?.footer?.links?.categories?.map(link => (
                        <li key={link.name}>
                            <a href={link.url} className="text-brand-bg/70 hover:text-brand-bg">{link.name}</a>
                        </li>
                    )) || <li>No links available</li>}
                </ul>
            </div>

            <div>
                <h4 className="text-lg font-bold font-serif mb-4 uppercase tracking-wider">Get Help</h4>
                <ul className="space-y-2">
                    {businessData?.footer?.links?.getHelp?.map(link => (
                        <li key={link.name}>
                            <a href={link.url} className="text-brand-bg/70 hover:text-brand-bg">{link.name}</a>
                        </li>
                    )) || <li>No links available</li>}
                </ul>
            </div>
        </div>

        <div className="text-center border-t border-brand-bg/20 mt-16 pt-8">
            <p className="text-brand-bg/70">{businessData?.footer?.copyright || "© 2025 Candlea. All Rights Reserved"}</p>
        </div>
    </div>
</footer>

            {/* --- Cart Modal (Remains the same) --- */}
            {isCartOpen && (
                <div className="modal fixed inset-0 bg-gray-900/50 flex justify-end z-50" onClick={() => setIsCartOpen(false)}>
                    {/* ... (cart JSX remains the same) ... */}
                </div>
            )}
        </div>
    );
}