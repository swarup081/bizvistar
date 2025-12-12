'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('frostify_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('frostify_cart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (product) => {
        setCart((prev) => {
            const currentQty = prev[product.id] ? prev[product.id].quantity : 0;
            return {
                ...prev,
                [product.id]: { ...product, quantity: currentQty + 1 }
            };
        });
        setIsCartOpen(true);
    };

    const removeItem = (productId) => {
        setCart((prev) => {
            const newCart = { ...prev };
            delete newCart[productId];
            return newCart;
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => {
            const item = prev[productId];
            if (!item) return prev;
            const newQty = item.quantity + delta;
            if (newQty <= 0) {
                const newCart = { ...prev };
                delete newCart[productId];
                return newCart;
            }
            return { ...prev, [productId]: { ...item, quantity: newQty } };
        });
    };

    const cartDetails = Object.values(cart);
    const cartCount = cartDetails.reduce((acc, item) => acc + item.quantity, 0);
    const total = cartDetails.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            cartDetails, 
            cartCount, 
            total, 
            addItem, 
            removeItem, 
            updateQuantity,
            isCartOpen,
            openCart: () => setIsCartOpen(true),
            closeCart: () => setIsCartOpen(false)
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);