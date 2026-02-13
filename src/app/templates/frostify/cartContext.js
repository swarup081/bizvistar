'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTemplateContext } from './templateContext.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // [{ id: 1, quantity: 2, selectedVariants: { Size: 'M' } }]
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { businessData } = useTemplateContext();

  useEffect(() => {
    const savedCart = localStorage.getItem('avenixCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('avenixCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const getProductStock = (productId) => {
    const product = businessData?.allProducts?.find(p => p.id === productId);
    return product?.stock !== undefined ? product.stock : Infinity;
  };

  // Helper to create a unique key for items with variants
  const getVariantKey = (variants) => {
    if (!variants || Object.keys(variants).length === 0) return '';
    return JSON.stringify(variants);
  };

  const addToCart = (product, quantity) => {
    const currentStock = getProductStock(product.id);
    const variants = product.selectedVariants || {};
    const variantKey = getVariantKey(variants);

    setCartItems(prevItems => {
      // Find item matching ID AND Variants
      const existingItemIndex = prevItems.findIndex(item =>
        item.id === product.id && getVariantKey(item.selectedVariants) === variantKey
      );

      if (existingItemIndex > -1) {
          const existingItem = prevItems[existingItemIndex];
          if (existingItem.quantity + quantity > currentStock) {
              alert(`Cannot add more. Only ${currentStock} left in stock.`);
              return prevItems;
          }

          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity
          };
          return newItems;
      } else {
          // Add new item with variants
          if (quantity > currentStock) {
              alert(`Cannot add more. Only ${currentStock} left in stock.`);
              return prevItems;
          }
          return [...prevItems, { id: product.id, quantity: quantity, selectedVariants: variants }];
      }
    });

    triggerToast();
  };
  
  const addItem = (product) => {
    addToCart(product, 1);
  };

  const increaseQuantity = (itemId, variantKey) => {
    // Note: passed 'itemId' might be the product ID.
    // We need to differentiate if we have multiple variants of same product.
    // For simplicity in the UI list, we often map index or unique ID.
    // But here we rely on the component knowing specific items.

    // Actually, typical cart UI iterates `cartDetails`. We should pass index or unique composite ID.
    // Let's assume the UI calls this with just ID, which is ambiguous if variants exist.
    // To fix, we should update the UI to pass the variantKey too, or index.

    // FIX: Update `increaseQuantity` to accept index or find by logic.
    // For now, let's look for exact match if variantKey is passed, or just first match (fallback).

    const currentStock = getProductStock(itemId);

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId && (!variantKey || getVariantKey(item.selectedVariants) === variantKey)) {
             if (item.quantity >= currentStock) return item;
             return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };

  const decreaseQuantity = (itemId, variantKey) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId && (!variantKey || getVariantKey(item.selectedVariants) === variantKey)) {
             return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId, variantKey) => {
    setCartItems(prevItems => prevItems.filter(item =>
        !(item.id === itemId && (!variantKey || getVariantKey(item.selectedVariants) === variantKey))
    ));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // --- Derived State ---

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const cartDetails = useMemo(() => {
    if (!businessData || !businessData.allProducts) return [];

    return cartItems.map(cartItem => {
      const product = businessData.allProducts.find(p => p.id === cartItem.id);
      if (!product) return null;
      return {
        ...product,
        quantity: cartItem.quantity,
        selectedVariants: cartItem.selectedVariants || {},
        variantKey: getVariantKey(cartItem.selectedVariants || {})
      };
    }).filter(Boolean);
  }, [cartItems, businessData]);

  const subtotal = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartDetails]);
  
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
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    openCart,
    closeCart,
    clearCart, // Added this
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  return useContext(CartContext);
};
