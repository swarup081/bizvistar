'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { businessData as initialBusinessData } from './data.js';
import { Header, Footer } from './components.js';
import { CartProvider, useCart } from './cartContext.js';
import { TemplateContext } from './templateContext.js';
import { Editable } from '@/components/editor/Editable';

function CartLayout({ children }) {
    const [businessData, setBusinessData] = useState(initialBusinessData); 
    const router = useRouter(); 
    
    const { 
        cartCount, 
        isCartOpen, 
        closeCart, 
        openCart, 
        cartDetails, 
        subtotal,
        increaseQuantity,
        decreaseQuantity,
        showToast
    } = useCart();

    useEffect(() => {
        // --- THEME LOGIC ---
        document.body.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add(`theme-${businessData.theme.colorPalette}`);

        // --- NEW CONTEXT-AWARE LOGIC ---
        let parentPath = '';
        try {
            // Check if we are in an iframe and get parent URL
            parentPath = window.parent.location.pathname;
        } catch (e) {
            // Not in an iframe (e.g., live site)
        }

        const isEditor = parentPath.startsWith('/editor/');
        const isPreview = parentPath.startsWith('/preview/');
        const isLiveSite = !isEditor && !isPreview;

        if (isEditor) {
            // --- 1. We are in the EDITOR's iframe ---
            const handleMessage = (event) => {
                if (event.data.type === 'UPDATE_DATA') {
                    setBusinessData(event.data.payload);
                }
                if (event.data.type === 'SCROLL_TO_SECTION') {
                    const element = document.getElementById(event.data.payload.sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                if (event.data.type === 'CHANGE_PAGE') {
                    router.push(event.data.payload.path);
                }
            };
            window.addEventListener('message', handleMessage);
            window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
            return () => window.removeEventListener('message', handleMessage);
        
        } else if (isPreview) {
            // --- 2. We are in the PREVIEW's iframe ---
            // Load data directly from the editor's localStorage key
            const editorDataKey = `editorData_flara`; // Template-specific key
            const savedData = localStorage.getItem(editorDataKey);
            
            if (savedData) {
                try {
                    setBusinessData(JSON.parse(savedData));
                } catch (e) {
                    console.error("Error parsing preview data", e);
                }
            }
        
        } else if (isLiveSite) {
            // --- 3. We are on the LIVE site (or local dev) ---
            // Fallback to basic startup info
            const storedStoreName = localStorage.getItem('storeName');
            if (storedStoreName) {
                setBusinessData(prevData => ({
                    ...prevData,
                    name: storedStoreName,
                    logoText: storedStoreName,
                    footer: {
                        ...prevData.footer,
                        copyright: `© ${new Date().getFullYear()} ${storedStoreName}. All RightsReserved`
                    }
                }));
            }
        }
        // --- END OF NEW LOGIC ---

        return () => {
            document.body.classList.remove(`theme-${businessData.theme.colorPalette}`);
        };
    }, [businessData.theme.colorPalette, router]);

    const createFontVariable = (fontName) => {
        if (!fontName) return '';
        return `var(--font-${fontName.toLowerCase().replace(/[\s_]+/g, '-')})`;
    };
    
    const fontVariables = {
        '--font-heading': createFontVariable(businessData.theme.font.heading),
        '--font-body': createFontVariable(businessData.theme.font.body),
    };

    const themeClassName = `theme-${businessData.theme.colorPalette}`;
    
    return (
        <TemplateContext.Provider value={{ businessData, setBusinessData }}>
            <div 
              className={`antialiased bg-brand-bg text-brand-text ${themeClassName} font-sans`}
              style={fontVariables}
            >
                <Editable focusId="global">
                    {businessData.announcementBar && (
                        <div className="text-center py-2 text-sm bg-brand-primary text-brand-text">
                            {businessData.announcementBar}
                        </div>
                    )}
                </Editable>
                
                <Header 
                    business={{ logoText: businessData.logoText, navigation: businessData.navigation }} 
                    cartCount={cartCount}
                    onCartClick={openCart} 
                />

                <main>
                    {children}
                </main>
                
                <Editable focusId="footer">
                    <Footer /> 
                </Editable>

                {isCartOpen && (
                    <div className="modal fixed inset-0 bg-gray-900/50 flex justify-end z-50" onClick={closeCart}>
                        <div className="bg-white w-full max-w-md h-full p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center border-b border-brand-primary/20 pb-4">
                                <h2 className="text-2xl font-serif font-bold text-brand-text">Your Cart ({cartCount})</h2>
                                <button onClick={closeCart} className="text-3xl text-brand-text/50 hover:text-brand-text">&times;</button>
                            </div>
                            
                            {cartDetails.length === 0 ? (
                                <div className="flex-grow flex flex-col items-center justify-center">
                                    <p className="text-brand-text/70 mt-4 text-center py-8">Your cart is currently empty.</p>
                                    <a 
                                        href={`/templates/flara/shop`}
                                        onClick={closeCart}
                                        className="w-full text-center inline-block bg-brand-primary text-brand-text px-6 py-3 font-semibold uppercase tracking-wider"
                                    >
                                        Continue Shopping
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-grow py-4 space-y-4 overflow-y-auto">
                                        {cartDetails.map(item => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-brand-primary" />
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-brand-text">{item.name}</h3>
                                                    <p className="text-sm text-brand-text/70">₹{item.price.toFixed(2)}</p>
                                                    <div className="flex items-center border border-brand-text/30 w-fit mt-2">
                                                        <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 text-lg text-brand-text/70 hover:bg-brand-primary">-</button>
                                                        <span className="w-8 h-8 flex items-center justify-center text-sm font-bold">{item.quantity}</span>
                                                        <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 text-lg text-brand-text/70 hover:bg-brand-primary">+</button>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-brand-text">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-brand-primary/20 pt-4 space-y-2">
                                        <div className="flex justify-between text-brand-text/80 font-medium">
                                            <span>Subtotal</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-brand-text/60">Shipping & taxes calculated at checkout.</p>
                                        <a 
                                            href={`/templates/flara/checkout`}
                                            onClick={closeCart}
                                            className="mt-4 w-full text-center inline-block bg-brand-secondary text-brand-bg px-6 py-3 font-semibold uppercase tracking-wider"
                                        >
                                            Go to Checkout
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                
                <div className={`fixed bottom-8 right-8 z-50 bg-brand-text text-brand-bg px-5 py-3 shadow-lg transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
                    Item added to cart!
                </div>
            </div>
        </TemplateContext.Provider>
    );
}

export default function FlaraLayout({ children }) {
    return (
        <CartProvider>
            <CartLayout>{children}</CartLayout>
        </CartProvider>
    );
}