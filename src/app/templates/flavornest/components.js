'use client';
import { useCart } from './cartContext.js';
import { useTemplateContext } from './templateContext.js'; // <-- 1. IMPORT THE CONTEXT

// --- Header Component ---
export const Header = ({ business, cartCount, onCartClick }) => (
    <header className="bg-brand-bg/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-brand-primary">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/templates/flavornest" className="flex items-center space-x-3">
                <img src={business.logo} alt={`${business.logoText} Logo`} className="h-12 w-12 rounded-full border-2 border-brand-primary shadow-sm" />
                <h1 className="text-2xl font-bold text-brand-secondary font-serif">{business.logoText}</h1>
            </a>
            <nav className="hidden md:flex space-x-8">
                {business.navigation.map(navItem => (
                    <a key={navItem.href} href={navItem.href} className="inactive-nav hover:active-nav transition-colors">{navItem.label}</a>
                ))}
            </nav>
            <button onClick={onCartClick} className="btn btn-primary px-4 py-2 rounded-full flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H4.72l-.38-1.52A1 1 0 003 1z" /><path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                <span>{cartCount}</span>
            </button>
        </div>
    </header>
);

// --- Product Card Component (CORRECTED & REDESIGNED) ---
export const ProductCard = ({ item }) => {
    const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
    
    // --- THIS IS THE FIX ---
    // It now correctly reads the array-based cart
    const cartQuantity = cartItems.find(i => i.id === item.id)?.quantity || 0;
    // --- END OF FIX ---

    const stock = item.stock !== undefined ? item.stock : 10;
    const isOutOfStock = stock === 0;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-brand-primary/50">
            
            {/* Image (No longer a link) */}
            <div className="block aspect-h-1 aspect-w-1 h-48 relative">
                <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} />
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-gray-800/80 text-white px-3 py-1 text-xs font-bold uppercase rounded">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-grow">
                {/* Title (No longer a link) */}
                <h3 className="text-base md:text-xl font-bold text-brand-secondary font-serif truncate">
                    {item.name}
                </h3>
                <p className="text-brand-text text-xs md:text-sm mt-2 flex-grow line-clamp-2">
                    {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                </p>
                <div className="mt-3 flex justify-between items-center">
                    <p className="text-base md:text-lg font-bold text-brand-secondary">₹{item.price}</p>
                    <p className="text-xs md:text-sm text-gray-500">{item.unit}</p>
                </div>
                <div className="mt-4 w-full">
                    {isOutOfStock ? (
                         <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-xs md:text-sm font-bold cursor-not-allowed">Out of Stock</button>
                    ) : (
                        cartQuantity > 0 ? (
                            <div className="flex items-center justify-center">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 md:px-4 md:py-2 text-brand-secondary hover:bg-brand-primary transition-colors font-bold">-</button>
                                    <span className="px-3 py-1 md:px-4 md:py-2 border-x border-gray-300 font-bold text-sm md:text-base">{cartQuantity}</span>
                                    <button onClick={() => increaseQuantity(item.id)} className="px-3 py-1 md:px-4 md:py-2 text-brand-secondary hover:bg-brand-primary transition-colors font-bold">+</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => increaseQuantity(item.id)} className="w-full btn btn-primary py-2 rounded-lg text-xs md:text-sm">Add to Cart</button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Footer Component ---
// --- 2. UPDATED TO USE CONTEXT & ADDED ID ---
export const Footer = () => {
    // Get businessData from the context
    const { businessData } = useTemplateContext();

    // Guard against data not being loaded yet
    if (!businessData?.footer) {
        return <footer id="contact" className="bg-brand-secondary text-white py-8">...</footer>;
    }

    return (
        <footer id="contact" className="bg-brand-secondary text-white py-8"> {/* <-- ID ADDED */}
            <div className="container mx-auto px-6 text-center">
                <p>{businessData.footer.copyright} | Made By <a href={businessData.footer.madeByLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary transition-colors">{businessData.footer.madeBy}</a></p>
                <p className="mt-2">{businessData.footer.socialText} <a href={businessData.footer.socialLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary transition-colors">Instagram</a></p>
            </div>
        </footer>
    );
};
// --- 3. END OF FOOTER FIX ---

// --- The old WhatsApp CartModal has been removed ---