'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { businessData as initialBusinessData } from './data.js';
import { Header, Footer, CartIcon } from './components.js';
import { CartProvider, useCart } from './cartContext.js';

// Inner component to access cart context
function CartLayout({ children }) {
    const [businessData, setBusinessData] = useState(initialBusinessData); 
    const router = useRouter(); // Initialize router
    
    const { 
        cartCount, 
        isCartOpen, 
        closeCart, 
        openCart, 
        cartDetails, 
        subtotal,
        shipping,
        total,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        showToast
    } = useCart();

    useEffect(() => {
        // Set fonts
        document.body.style.fontFamily = `'${businessData.theme.font.body}', sans-serif`;
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // Apply kalam font, but keep existing style (no italic override)
            heading.style.fontFamily = `'${businessData.theme.font.heading}', serif`;
        });

        // --- DYNAMIC DATA LOGIC ---
        const isEditor = window.self !== window.top;

        if (isEditor) {
            // We are inside the editor iframe
            const handleMessage = (event) => {
                if (event.data.type === 'UPDATE_DATA') {
                    setBusinessData(event.data.payload);
                }
                if (event.data.type === 'CHANGE_PAGE') {
                    router.push(event.data.payload.path);
                }
            };
            window.addEventListener('message', handleMessage);

            // Tell the parent editor that the iframe is ready to receive data
            window.parent.postMessage({ type: 'IFRAME_READY' }, '*');

            return () => window.removeEventListener('message', handleMessage);
        
        } else {
            // We are on the live site
            const storedStoreName = localStorage.getItem('storeName');
            
            if (storedStoreName) {
                setBusinessData(prevData => ({
                    ...prevData,
                    name: storedStoreName,
                    logoText: storedStoreName,
                    footer: {
                        ...prevData.footer,
                        copyright: `© ${new Date().getFullYear()} ${storedStoreName}. All RightsReserved.`
                    }
                }));
            }
        }
        // --- END DYNAMIC DATA LOGIC ---


        return () => {
            headings.forEach(heading => heading.style.fontFamily = '');
            document.body.style.fontFamily = '';
        };
    }, [businessData.theme.font.body, businessData.theme.font.heading, router]); // Added router

    const createFontVariable = (fontName) => `var(--font-${fontName.toLowerCase().replace(/ /g, '-')})`;
    
    const fontVariables = {
        '--font-heading': createFontVariable(businessData.theme.font.heading),
        '--font-body': createFontVariable(businessData.theme.font.body),
    };

    const themeClassName = `theme-${businessData.theme.colorPalette}`;
    
    return (
        <div 
          className={`antialiased bg-brand-bg text-brand-text ${themeClassName} font-sans`}
          style={fontVariables}
        >
            <Header 
                business={{ 
                    logoText: businessData.logoText, 
                    navigation: businessData.navigation,
                    headerButton: businessData.headerButton 
                }} 
                cartCount={cartCount}
                onCartClick={openCart}
            />

            <main>
                {children}
            </main>
            
            <Footer businessData={businessData} />

            {/* --- Cart Modal (Blissly Style) --- */}
            {isCartOpen && (
                <div className="modal fixed inset-0 bg-black/50 flex justify-end z-50" onClick={closeCart}>
                    <div className="bg-brand-bg w-full max-w-lg h-full p-8 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b border-brand-primary pb-4">
                            <h2 className="text-2xl font-serif font-medium text-brand-text">Your Cart ({cartCount})</h2>
                            <button onClick={closeCart} className="text-3xl text-brand-text/50 hover:text-brand-text">&times;</button>
                        </div>
                        
                        {cartDetails.length === 0 ? (
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <p className="text-brand-text/70 text-center py-8">Your cart is empty.</p>
                                <a 
                                    href="/templates/blissly/shop"
                                    onClick={closeCart}
                                    className="w-full text-center inline-block bg-brand-primary border border-brand-text/10 text-brand-text px-6 py-3 font-medium rounded-lg"
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow py-6 space-y-6 overflow-y-auto">
                                    {cartDetails.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <a href={`/templates/blissly/product/${item.id}`} className="block w-20 h-24 bg-brand-primary rounded-lg overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </a>
                                            <div className="flex-grow">
                                                <a href={`/templates/blissly/product/${item.id}`} className="font-serif font-bold text-lg text-brand-text hover:text-brand-secondary">{item.name}</a>
                                                <p className="text-sm text-brand-text/60 mt-1">${item.price.toFixed(2)}</p>
                                                <div className="flex items-center border border-brand-text/20 w-fit mt-2 rounded-md">
                                                    <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 text-lg text-brand-text/70 hover:bg-brand-primary rounded-l-md">-</button>
                                                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold">{item.quantity}</span>
                                                    <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 text-lg text-brand-text/70 hover:bg-brand-primary rounded-r-md">+</button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-sans font-medium text-brand-text">${(item.price * item.quantity).toFixed(2)}</p>
                                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-brand-text/50 hover:text-brand-secondary mt-1">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-brand-primary pt-6 space-y-4">
                                    <div className="flex justify-between text-brand-text/80 font-medium">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-brand-text/80 font-medium">
                                        <span>Shipping</span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-brand-text font-bold text-xl border-t border-brand-primary pt-4 mt-4">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <a 
                                        href="/templates/blissly/checkout"
                                        onClick={closeCart}
                                        className="mt-4 w-full text-center inline-block bg-brand-secondary text-brand-bg px-6 py-4 font-medium tracking-wide rounded-lg"
                                    >
                                        Proceed to Checkout
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {/* --- Add to Cart Toast --- */}
            <div className={`fixed bottom-8 right-8 z-50 bg-brand-text text-brand-bg px-5 py-3 shadow-lg transition-all duration-300 rounded-lg ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
                Item added to cart!
            </div>
        </div>
    );
}

// Wrap the layout in the provider
export default function BlisslyLayout({ children }) {
    return (
        <CartProvider>
            <CartLayout>{children}</CartLayout>
        </CartProvider>
    );
}