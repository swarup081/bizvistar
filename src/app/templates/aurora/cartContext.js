'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { businessData } from './data.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('diamondbdCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diamondbdCart', JSON.stringify(cartItems));
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
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { id: product.id, quantity: quantity }];
      }
    });
    triggerToast();
  };
  
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
        return prevItems.filter(item => item.id !== productId);
      } else {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const cartDetails = useMemo(() => {
    return cartItems.map(cartItem => {
      const product = businessData.allProducts.find(p => p.id === cartItem.id);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    }).filter(Boolean);
  }, [cartItems]);

  const subtotal = useMemo(() => cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartDetails]);
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping for luxury?
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const value = {
    cartItems, cartDetails, cartCount, subtotal, shipping, total, isCartOpen, showToast,
    addToCart, addItem, increaseQuantity, decreaseQuantity, removeFromCart, openCart, closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);