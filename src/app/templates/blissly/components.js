'use client';
import { useCart } from './cartContext.js';
import { useTemplateContext } from './templateContext.js'; // <-- 1. IMPORT THE CONTEXT

// --- Reusable SVG Icons ---
export const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#F5A623]">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.83 4.426 4.894.71c.848.124 1.186 1.158.57 1.753l-3.54 3.45.836 4.874c.144.843-.735 1.49-1.493 1.099L10 16.54l-4.389 2.296c-.758.39-1.637-.256-1.493-1.099l.836-4.874-3.54-3.45c-.616-.595-.278-1.629.57-1.753l4.894-.71L9.132 2.884Z" clipRule="evenodd" />
    </svg>
);

export const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg>
);

export const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.211-1.01-.56-1.368l-1.928-1.928a2.25 2.25 0 0 0-3.182 0l-1.17 1.17-1.414-1.414 1.17-1.17a2.25 2.25 0 0 0 0-3.182L9.118 5.66c-.358-.358-.852-.56-1.368-.56H6.375a2.25 2.25 0 0 0-2.25 2.25Z" />
    </svg>
);

export const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

export const MapPinIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

export const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-brand-text/40 hover:text-brand-text transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
export const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-brand-text/40 hover:text-brand-text transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

// Cart Icon
export const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
);


// --- Header Component (Adapted for Cart) ---
export const Header = ({ business, cartCount, onCartClick }) => (
    <header className="bg-brand-bg sticky top-0 z-40 w-full font-sans border-b border-brand-primary/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            {/* Left Nav */}
            <nav className="hidden md:flex items-center gap-6">
                {business.navigation.map(navItem => (
                    <a key={navItem.label} href={navItem.href} className="text-sm font-medium tracking-wide text-brand-text hover:opacity-70 transition-opacity">
                        {navItem.label}
                    </a>
                ))}
            </nav>
            
            {/* Center Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <a href="/templates/blissly" className="text-3xl font-bold text-brand-text tracking-wider font-serif">
                    {business.logoText}
                </a>
            </div>
            
             {/* Right Nav & Icons */}
            <div className="flex-1 flex justify-end items-center gap-6">
                 <a href={business.headerButton.href} className="hidden lg:inline-block bg-brand-secondary text-brand-bg px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    {business.headerButton.text}
                </a>
                <button onClick={onCartClick} className="relative text-brand-text hover:text-brand-secondary transition-colors">
                    <CartIcon />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    </header>
);

// --- Product Card Component (MODIFIED) ---
export const ProductCard = ({ item, templateName }) => {
    const { addItem } = useCart();
    // --- 2. GET DATA FROM CONTEXT ---
    const { businessData } = useTemplateContext();

    const stock = item.stock !== undefined ? item.stock : 10;
    const isOutOfStock = stock === 0;
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!isOutOfStock) {
            addItem(item);
        }
    };
    
    // --- 3. FIND CATEGORY FROM CONTEXT DATA ---
    const category = businessData.categories.find(c => c.id === item.category);

    return (
        // Add border, rounded, overflow-hidden, and shadow for a cleaner "card" look
        <div className="group h-full flex flex-col border border-brand-primary/50 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md bg-white">
            
            {/* 1. Image */}
            <a href={`/templates/${templateName}/product/${item.id}`} className="block aspect-[4/5] bg-brand-primary overflow-hidden relative">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
                    onError={(e) => e.target.src = 'https://placehold.co/600x750/CCCCCC/909090?text=Image+Missing'}
                />
                 {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-brand-text/80 text-brand-bg px-3 py-1 text-xs font-bold uppercase tracking-widest rounded">Out of Stock</span>
                    </div>
                )}
            </a>
            
            {/* 2. Content Area (flex-grow to push buttons to bottom) */}
            <div className="p-3 md:p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    {/* 4. DISPLAY CATEGORY NAME */}
                    {category && (
                        <p className="text-brand-text/60 text-xs md:text-sm">{category.name}</p>
                    )}
                    <h4 className="text-sm md:text-xl font-bold text-brand-text font-serif mt-1 truncate">
                        <a href={`/templates/${templateName}/product/${item.id}`} className="hover:text-brand-secondary">{item.name}</a>
                    </h4>
                    <p className="text-brand-secondary text-sm md:text-lg font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>

                {/* 3. Actions (Always visible) */}
                <div className="mt-3 md:mt-4 space-y-2">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`w-full px-4 py-2 md:py-2.5 font-semibold text-xs md:text-sm rounded-md transition-opacity ${
                            isOutOfStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-brand-secondary text-brand-bg hover:opacity-90'
                        }`}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Footer Component (Corrected) ---
export const Footer = () => {
    // --- 1. GET DATA FROM CONTEXT ---
    const { businessData } = useTemplateContext();

    // --- 2. ADD A GUARD ---
    // This prevents the "cannot read 'footer'" error during initial load or state mismatch
    if (!businessData?.footer) {
        return <footer id="contact" className="py-20 pb-12 bg-brand-bg text-brand-text border-t border-brand-primary/50"></footer>;
    }

    // --- 3. USE GUARDED ACCESS (?. optional chaining) ---
    return (
        <footer id="contact" className="py-20 pb-12 bg-brand-bg text-brand-text border-t border-brand-primary/50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Column 1: Subscribe & Contact */}
                    <div>
                        <h4 className="text-lg font-bold font-serif mb-4">{businessData.footer.promoTitle}</h4>
                        <form className="flex mb-6">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full bg-brand-primary border border-brand-secondary/30 py-3 px-4 text-brand-text placeholder:text-brand-text/50 focus:ring-0 focus:border-brand-secondary outline-none rounded-l-md"
                            />
                            <button 
                                type="submit" 
                                className="px-4 py-3 bg-brand-secondary text-brand-bg font-semibold text-sm rounded-r-md hover:opacity-90"
                            >
                                <ArrowRightIcon className="ml-0" />
                            </button>
                        </form>
                        <ul className="space-y-2 text-brand-text/80 text-sm">
                            <li className="flex items-center"><PhoneIcon /> {businessData.footer.contact?.phone}</li>
                            <li className="flex items-center"><EmailIcon /> {businessData.footer.contact?.email}</li>
                        </ul>
                    </div>

                    {/* Column 2: Page Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">Page Links</h4>
                        <ul className="space-y-3 text-sm">
                            {businessData.footer.links?.pages?.map(link => (
                                <li key={link.name}>
                                    <a href={link.url} className="text-brand-text/70 hover:text-brand-text transition-colors">{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column 3: Utility Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">Utility Links</h4>
                        <ul className="space-y-3 text-sm">
                            {businessData.footer.links?.utility?.map(link => (
                                <li key={link.name}>
                                    <a href={link.url} className="text-brand-text/70 hover:text-brand-text transition-colors">{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Location */}
                    <div>
                        <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider">{businessData.footer.location?.title}</h4>
                        <p className="text-brand-text/70 text-sm mb-4 flex">
                            <MapPinIcon className="flex-shrink-0 mt-1"/>
                            <span>{businessData.footer.location?.address}</span>
                        </p>
                        <h5 className="text-sm font-semibold mt-6 mb-2 uppercase tracking-wider">Opening hours</h5>
                        <p className="text-brand-text/70 text-sm whitespace-pre-line">{businessData.footer.location?.hours}</p>
                    </div>
                </div>

                {/* Bottom Footer Bar */}
                <div className="text-center border-t border-brand-primary/50 mt-16 pt-8 text-sm">
                    <p className="text-brand-text/70">{businessData.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
};