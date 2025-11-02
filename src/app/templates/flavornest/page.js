'use client';
import { useState, useEffect } from 'react';
import { businessData as initialBusinessData } from './data.js'; // Import the data

// --- Reusable UI Components (No changes needed here) ---

const Header = ({ business, cartCount, onCartClick }) => (
    <header className="bg-brand-bg/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-brand-primary">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <img src={business.logo} alt={`${business.name} Logo`} className="h-12 w-12 rounded-full border-2 border-brand-primary shadow-sm" />
                <h1 className="text-2xl font-bold text-brand-secondary font-serif">{business.name}</h1>
            </div>
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

const MenuItem = ({ item, cartQuantity, increaseQuantity, decreaseQuantity }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-2xl font-bold text-brand-secondary font-serif">{item.name}</h3>
            <p className="text-brand-text mt-2 flex-grow">{item.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-bold text-brand-secondary">₹{item.price}</p>
                <p className="text-sm text-gray-500">{item.unit}</p>
            </div>
            <div className="mt-6 w-full">
                {cartQuantity > 0 ? (
                    <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button onClick={() => decreaseQuantity(item.id)} className="px-4 py-2 text-brand-secondary hover:bg-brand-primary transition-colors font-bold">-</button>
                            <span className="px-4 py-2 border-x border-gray-300 font-bold text-lg">{cartQuantity}</span>
                            <button onClick={() => increaseQuantity(item.id)} className="px-4 py-2 text-brand-secondary hover:bg-brand-primary transition-colors font-bold">+</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => increaseQuantity(item.id)} className="w-full btn btn-primary py-2 rounded-lg">Add to Cart</button>
                )}
            </div>
        </div>
    </div>
);


const CartModal = ({ isOpen, onClose, cart, menuData, updateCart, business }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menuData.find(p => p.id == id);
        return sum + (item ? item.price * qty : 0);
    }, 0);

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        if (totalItems === 0) {
            alert("Your cart is empty!");
            return;
        }
        setIsSubmitting(true);

        let message = `Hi ${business.name}! I would like to place an order:\n\n`;
        Object.entries(cart).forEach(([itemId, quantity]) => {
            const item = menuData.find(p => p.id == itemId);
            if (item) {
                message += `*${item.name}* (x${quantity}) - ₹${item.price * quantity}\n`;
            }
        });
        message += `\n*Total: ₹${totalPrice}*\n\n`;
        message += `*My Details:*\n`;
        message += `Name: ${customerName}\n`;
        message += `Phone: ${customerPhone}\n`;
        message += `Address/Pickup: ${customerAddress}\n\n`;
        message += `Please confirm my order. Thank you!`;

        const whatsappUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        updateCart({});
        onClose();
        alert("Redirecting to WhatsApp to finalize your order!");
    };

    return (
        <div className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 invisible'}`} onClick={onClose}>
            <div className={`modal-content bg-white w-full max-w-lg rounded-lg shadow-2xl p-6 md:p-8 transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-brand-secondary font-serif">Your Order</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {totalItems === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        Object.entries(cart).map(([itemId, quantity]) => {
                             const item = menuData.find(p => p.id == itemId);
                             if (!item) return null;
                             return (
                                <div key={item.id} className="flex justify-between items-center text-brand-text">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mr-4">
                                            <button onClick={() => updateCart({ ...cart, [itemId]: cart[itemId] - 1 || undefined })} className="px-2 py-1 text-brand-secondary hover:bg-brand-primary transition-colors">-</button>
                                            <span className="px-3 py-1 border-x border-gray-300 font-semibold">{quantity}</span>
                                            <button onClick={() => updateCart({ ...cart, [itemId]: (cart[itemId] || 0) + 1 })} className="px-2 py-1 text-brand-secondary hover:bg-brand-primary transition-colors">+</button>
                                        </div>
                                        <span className="font-bold w-20 text-right">₹{item.price * quantity}</span>
                                    </div>
                                </div>
                             )
                        })
                    )}
                </div>

                {totalItems > 0 && (
                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center font-bold text-lg text-brand-secondary">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-brand-secondary font-serif mt-6 mb-3">Delivery Details</h4>
                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                            <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Full Name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary" />
                            <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="WhatsApp Number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary" />
                            <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} rows="3" placeholder="Full Address or 'Pickup'" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-secondary focus:border-brand-secondary"></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-3 rounded-lg text-lg flex items-center justify-center space-x-2 disabled:bg-gray-400">
                                <span>{isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Page Component ---

export default function FlavorNestPage() {
    
    const [businessData] = useState(initialBusinessData); // Use the imported data
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem('flavorNestCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const updateCartAndLocalStorage = (newCart) => {
        const cleanedCart = Object.fromEntries(
            Object.entries(newCart).filter(([, qty]) => qty > 0)
        );
        setCart(cleanedCart);
        localStorage.setItem('flavorNestCart', JSON.stringify(cleanedCart));
    }

    const handleIncreaseQuantity = (itemId) => {
        const newCart = { ...cart, [itemId]: (cart[itemId] || 0) + 1 };
        updateCartAndLocalStorage(newCart);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleDecreaseQuantity = (itemId) => {
        const newCart = { ...cart, [itemId]: (cart[itemId] || 1) - 1 };
        updateCartAndLocalStorage(newCart);
    };

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    if (!businessData) {
        return <div className="flex h-screen items-center justify-center text-brand-secondary font-serif text-xl">Loading FlavorNest...</div>;
    }
    
    return (
        <div className="antialiased font-sans bg-brand-bg text-brand-text">
            
            <Header 
                business={{ name: businessData.name, logo: businessData.logo, navigation: businessData.navigation }} 
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />

            <main>
                <section id="home" className="relative pt-16 md:pt-24 pb-16">
                    <div className="absolute inset-0 bg-brand-primary opacity-50"></div>
                    <div className="container mx-auto px-6 text-center relative">
                        <h2 className="text-4xl md:text-6xl font-bold text-brand-secondary leading-tight font-serif">{businessData.hero.title}</h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto">{businessData.hero.subtitle}</p>
                        <a href="#menu" className="mt-8 inline-block btn btn-primary px-8 py-3 rounded-full text-lg">{businessData.hero.cta}</a>
                    </div>
                </section>

                <section id="about" className="py-16">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-brand-secondary font-serif">{businessData.about.title}</h3>
                            <p className="mt-4 leading-relaxed">{businessData.about.text}</p>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img src={businessData.logo} alt={`${businessData.name} Logo Large`} className="h-48 w-48 rounded-full shadow-xl border-4 border-white" />
                        </div>
                    </div>
                </section>

                <section id="menu" className="py-16 bg-brand-primary">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-brand-secondary mb-12 font-serif">{businessData.menu.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {businessData.menu.items.map(item => (
                                <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    cartQuantity={cart[item.id] || 0}
                                    increaseQuantity={handleIncreaseQuantity}
                                    decreaseQuantity={handleDecreaseQuantity}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section id="reviews" className="py-16">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-brand-secondary mb-12 font-serif">{businessData.reviews.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {businessData.reviews.items.map((review, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-brand-primary">
                                    <p className="italic">"{review.text}"</p>
                                    <p className="mt-4 font-bold text-brand-secondary text-right">- {review.author}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-brand-secondary text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>{businessData.footer.copyright} | Made By <a href={businessData.footer.madeByLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary transition-colors">{businessData.footer.madeBy}</a></p>
                    <p className="mt-2">{businessData.footer.socialText} <a href={businessData.footer.socialLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary transition-colors">Instagram</a></p>
                </div>
            </footer>

            <CartModal 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                menuData={businessData.menu.items}
                updateCart={updateCartAndLocalStorage}
                business={{ name: businessData.name, whatsappNumber: businessData.whatsappNumber }}
            />
            
            <div className={`fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Item added to cart!
            </div>
        </div>
    );
}