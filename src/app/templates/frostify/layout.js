'use client';
import { useState, useEffect } from 'react';
import { businessData as initialBusinessData } from './data.js';
import { Header, Footer } from './components.js';
import { CartProvider, useCart } from './cartContext.js'; // Reuse generic context
import { TemplateContext } from './templateContext.js';
import { Editable } from '@/components/editor/Editable';
import { X } from 'lucide-react';

function CartLayout({ children, serverData }) {
    const [businessData, setBusinessData] = useState(serverData || initialBusinessData);
    const { isCartOpen, closeCart, cartDetails, total, removeFromCart } = useCart();

    useEffect(() => {
        if (serverData) return;
        let parentPath = '';
        try { parentPath = window.parent.location.pathname; } catch (e) {}
        const isEditor = parentPath.startsWith('/editor/');
        
        if (isEditor) {
             const handleMessage = (event) => {
                if (event.data.type === 'UPDATE_DATA') setBusinessData(event.data.payload);
            };
            window.addEventListener('message', handleMessage);
            window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
            return () => window.removeEventListener('message', handleMessage);
        }
    }, [serverData]);

    return (
        <TemplateContext.Provider value={{ businessData, setBusinessData }}>
            <style jsx global>{`
                /* Fonts matching the reference image */
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Quicksand:wght@300;400;500;600;700&display=swap');
                
                :root {
                    /* --- FROSTIFY PALETTE (Purple/Violet Theme) --- */
                    --color-bg: #FFFFFF;         
                    --color-primary: #592E4F;    /* Deep Plum/Purple */
                    --color-secondary: #9E5A85;  /* Lighter Mauve */
                    --color-accent: #DFA8B7;     /* Pinkish Accent */
                    --color-surface: #F9F4F6;    /* Light Gray/Pink tint */
                    
                    /* --- FONTS --- */
                    --font-serif: 'DM Serif Display', serif;
                    --font-sans: 'Quicksand', sans-serif;
                }

                body {
                    font-family: var(--font-sans);
                    color: var(--color-primary);
                    background-color: var(--color-bg);
                    overflow-x: hidden;
                }

                h1, h2, h3, h4, h5, h6 {
                    font-family: var(--font-serif);
                }
                
                .wavy-separator {
                    width: 100%;
                    height: 50px;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23592E4F' fill-opacity='1' d='M0,160L60,165.3C120,171,240,181,360,176C480,171,600,149,720,138.7C840,128,960,128,1080,144C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            `}</style>

            <div className="antialiased min-h-screen flex flex-col relative">
                <Header />
                <main className="flex-grow pt-24">{children}</main>
                <Editable focusId="footer"><Footer /></Editable>

                {/* Cart Drawer (Standard) */}
                <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isCartOpen ? 'visible' : 'invisible'}`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeCart} />
                    <div className={`absolute right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-2xl transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        {/* Cart Content Here (Simulated for brevity) */}
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-serif text-[var(--color-primary)]">Your Basket</h2>
                                <button onClick={closeCart}><X /></button>
                            </div>
                            {/* ... Cart items logic ... */}
                        </div>
                    </div>
                </div>
            </div>
        </TemplateContext.Provider>
    );
}

export default function FrostifyLayout({ children, serverData }) {
    return <CartProvider><CartLayout serverData={serverData}>{children}</CartLayout></CartProvider>;
}