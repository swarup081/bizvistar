'use client';
import { useContext } from 'react';
import { businessData as initialBusinessData } from './data.js';
import { Header, Footer } from './components.js';
import { CartProvider, useCart } from './cartContext.js';
import { TemplateContext } from './templateContext.js';
import { Editable } from '@/components/editor/Editable';
import AnalyticsTracker from '@/components/dashboard/analytics/AnalyticsTracker';
import { TemplateStateProvider } from '@/lib/templates/TemplateStateProvider';

function FlaraContent({ children, serverData, websiteId }) { // Renamed from CartLayout to avoid confusion
    const { businessData, basePath } = useContext(TemplateContext);
    
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
        <div 
            className={`antialiased bg-brand-bg text-brand-text ${themeClassName} font-sans`}
            style={fontVariables}
        >
            <AnalyticsTracker websiteId={websiteId} />
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
                                    href={`${basePath}/shop`}
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
                                        href={`${basePath}/checkout`}
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
    );
}

export default function FlaraLayout({ children, serverData, websiteId }) {
    return (
        <TemplateStateProvider
            serverData={serverData}
            websiteId={websiteId}
            initialBusinessData={initialBusinessData}
            templateName="flara"
        >
            <CartProvider>
                <FlaraContent>{children}</FlaraContent>
            </CartProvider>
        </TemplateStateProvider>
    );
}
