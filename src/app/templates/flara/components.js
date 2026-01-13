'use client';
import { useCart } from './cartContext.js';
import { useTemplateContext } from './templateContext.js'; 

// --- Reusable SVG Icons ---
export const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
export const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);
export const ShippingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 opacity-80"
      viewBox="0 0 100 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="50" cy="25" rx="40" ry="10" />
      <path d="M 10 25 L 10 115" />
      <path d="M 90 25 L 90 115" />
      <path d="M 10 115 A 40 10 0 0 0 90 115" />
      <path d="M 8 122 A 42 10 0 0 0 92 122" />
      <path d="M 12 45 A 38 8 0 0 0 88 45" />
      <line x1="50" y1="45" x2="50" y2="28" />
      <g>
        <path d="M 50 30 Q 46 22 50 10 Q 54 22 50 30 Z" />
        <path d="M 50 27 Q 48.5 22 50 16" />
      </g>
    </svg>
  );


// --- Header Component (FIXED) ---
export const Header = ({ business, cartCount, onCartClick }) => {
    const { basePath } = useTemplateContext();

    return (
        <header className="bg-brand-bg/90 backdrop-blur-sm sticky top-0 z-40 w-full">
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                <a href={basePath || "/"} className="text-3xl font-bold text-brand-text font-serif tracking-wider">
                    {business.logoText}
                </a>
                <nav className="hidden md:flex space-x-10">
                    {business.navigation.map(navItem => (
                        <a 
                          key={navItem.href} 
                          href={navItem.href.startsWith('#') ? navItem.href : `${basePath}${navItem.href.replace('/templates/flara', '')}`} 
                          className="inactive-nav hover:text-brand-secondary transition-colors text-sm font-medium tracking-widest uppercase"
                        >
                            {navItem.label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center space-x-6">
                    <button onClick={onCartClick} className="relative text-brand-text hover:text-brand-secondary">
                        <CartIcon />
                        {cartCount > 0 && (
                             <span className="absolute -top-2 -right-2 bg-brand-secondary text-brand-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

// --- Product Card Component (FIXED) ---
export const ProductCard = ({ item, templateName }) => { // templateName is actually not needed here
    const { addItem } = useCart();
    const { businessData, basePath } = useTemplateContext(); 
    
    // Default stock to 0 if undefined, assuming check is needed
    const stock = item.stock !== undefined ? item.stock : 10; // Fallback to 10 if not specified to avoid breaking existing demos
    const isOutOfStock = stock === 0;

    const handleAddToCart = (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (!isOutOfStock) {
            addItem(item);
        }
    };
    
    const category = businessData.categories.find(c => c.id === item.category);

    return (
        <div className="group text-center h-full flex flex-col justify-between border border-transparent hover:border-brand-primary/50 transition-all p-2 ">
            <div>
                <a href={`${basePath}/product/${item.id}`} className="block bg-brand-primary overflow-hidden relative aspect-[4/5] h-64 md:h-80 ">
                    <img 
                        src={item.image || 'https://placehold.co/600x750/CCCCCC/909090?text=Image+Missing'} 
                        alt={item.name} 
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                        onError={(e) => e.target.src = 'https://placehold.co/600x750/CCCCCC/909090?text=Image+Missing'}
                    />
                     {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/70 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">Out of Stock</span>
                        </div>
                    )}
                </a>
                <div className="mt-3 md:mt-5 px-1">
                    <h3 className="text-sm md:text-xl font-serif font-medium text-brand-text truncate">
                        <a href={`${basePath}/product/${item.id}`} className="hover:text-brand-secondary">
                            {item.name}
                        </a>
                    </h3>
                    {category && (
                        <p className="text-brand-text opacity-60 text-xs md:text-sm mt-1">{category.name}</p>
                    )}
                    <p className="text-brand-text font-medium text-sm md:text-base mt-1">₹{item.price.toFixed(2)}</p>
                </div>
            </div>

            <div className="mt-3 md:mt-4 px-1 space-y-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pb-2">
                 <a 
                    href={`${basePath}/product/${item.id}`}
                    className="w-full text-center block bg-brand-primary text-brand-text px-2 py-2 md:px-4 md:py-2.5 font-semibold text-xs md:text-sm hover:bg-brand-primary/80 transition-colors "
                >
                    View Details
                </a>
                <button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full text-center block px-2 py-2 md:px-4 md:py-2.5 font-semibold text-xs md:text-sm transition-opacity ${
                        isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-brand-secondary text-brand-bg hover:opacity-80'
                    }`}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};


// --- Footer Component (FIXED) ---
export const Footer = () => {
    const { businessData, basePath } = useTemplateContext();

    const resolveLink = (url) => {
        if (!url || url.startsWith('#') || url.startsWith('http')) return url;
        return url.replace('/templates/flara', basePath || '');
    };

    return (
     <footer id="contact" className="bg-brand-text text-brand-bg pt-20 pb-10">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-2">
                    <h3 className="text-3xl font-serif mb-4">{businessData?.footer?.promoTitle || "Stay Updated"}</h3>
                    <p className="text-lg text-brand-bg/70 mb-4">{businessData?.footer?.subscribeTitle || "Subscribe for latest offers"}</p>
                  <form className="relative w-full mt-4">
                      <div className="flex items-end space-x-4">
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
                                <a href={resolveLink(link.url)} className="text-brand-bg/70 hover:text-brand-bg">{link.name}</a>
                            </li>
                        )) || <li>No links available</li>}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold font-serif mb-4 uppercase tracking-wider">Categories</h4>
                    <ul className="space-y-2">
                        {businessData?.footer?.links?.categories?.map(link => (
                            <li key={link.name}>
                                <a href={resolveLink(link.url)} className="text-brand-bg/70 hover:text-brand-bg">{link.name}</a>
                            </li>
                        )) || <li>No links available</li>}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold font-serif mb-4 uppercase tracking-wider">Get Help</h4>
                    <ul className="space-y-2">
                        {businessData?.footer?.links?.getHelp?.map(link => (
                            <li key={link.name}>
                                <a href={resolveLink(link.url)} className="text-brand-bg/70 hover:text-brand-bg">{link.name}</a>
                            </li>
                        )) || <li>No links available</li>}
                    </ul>
                </div>
            </div>

            <div className="text-center border-t border-brand-bg/20 mt-16 pt-8">
                <p className="text-brand-bg/70">{businessData?.footer?.copyright || "© 2026 Candlea. All Rights Reserved"}</p>
            </div>
        </div>
    </footer>
    );
};