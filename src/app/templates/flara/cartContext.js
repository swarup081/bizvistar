'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { businessData } from './data.js'; // Import data to find products

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // e.g., [{ id: 1, quantity: 2 }]
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('flaraCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('flaraCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Update quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Add new item
        return [...prevItems, { id: product.id, quantity: quantity }];
      }
    });
    triggerToast();
  };
  
  // Simple function to add a single item (quantity 1)
  const addItem = (product) => {
    addToCart(product, 1);
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem.quantity === 1) {
        // Remove item
        return prevItems.filter(item => item.id !== productId);
      } else {
        // Decrease quantity
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // --- Derived State (Calculated from cartItems) ---

  // Get total number of items in cart
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Get full product details for items in cart
  const cartDetails = useMemo(() => {
    return cartItems.map(cartItem => {
      const product = businessData.allProducts.find(p => p.id === cartItem.id);
      return {
        ...product,
        quantity: cartItem.quantity,
      };
    }).filter(Boolean); // Filter out any undefined products
  }, [cartItems]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartDetails]);
  
  // Example shipping (you can make this dynamic)
  const shipping = subtotal > 0 ? 50 : 0;
  
  const total = useMemo(() => {
    return subtotal + shipping;
  }, [subtotal, shipping]);


  const value = {
    cartItems,
    cartDetails,
    cartCount,
    subtotal,
    shipping,
    total,
    isCartOpen,
    showToast,
    addToCart,
    addItem, // Export new function
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    openCart,
    closeCart,
    clearCart: () => setCartItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to easily use the cart context
export const useCart = () => {
  return useContext(CartContext);
};