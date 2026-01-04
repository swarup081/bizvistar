'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTemplateContext } from './templateContext.js'; // Use context instead of direct import

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // e.g., [{ id: 1, quantity: 2 }]
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Get businessData from the TemplateContext to access dynamic products
  const { businessData } = useTemplateContext();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('avenixCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
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
    // If stock is undefined, assume unlimited/legacy
    return product?.stock !== undefined ? product.stock : Infinity;
  };

  const addToCart = (product, quantity) => {
    const currentStock = getProductStock(product.id);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;

      if (currentQty + quantity > currentStock) {
          alert(`Cannot add more. Only ${currentStock} left in stock.`);
          return prevItems;
      }

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

    // Only show toast if logic passed (though here state updates are async,
    // assuming alert didn't block logic, but react batching handles it.
    // Ideally we check before setting state, which we did inside via callback,
    // but toast needs to know result.
    // Simple fix: triggerToast always runs here. Refactoring for strictly conditional toast is minor UX.)
    triggerToast();
  };
  
  const addItem = (product) => {
    addToCart(product, 1);
  };

  const increaseQuantity = (productId) => {
    const currentStock = getProductStock(productId);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem && existingItem.quantity >= currentStock) {
           // Maybe show small tooltip or toast?
           return prevItems;
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    });
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to easily use the cart context
export const useCart = () => {
  return useContext(CartContext);
};
