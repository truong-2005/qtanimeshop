import React, { createContext, useState, useEffect } from 'react';
import cartApi from '../api/cartApi';
import tokenService from '../services/tokenService';

export const CartContext = createContext();

const GUEST_CART_KEY = 'guestCart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => !!tokenService.getAccessToken();

  // Load cart initially
  const loadCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn()) {
        const response = await cartApi.getMyCart();
        // API returns list of CartResponse
        setCartItems(response || []);
      } else {
        const localCart = localStorage.getItem(GUEST_CART_KEY);
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    
    // Sync cart when login state changes
    const handleLoginChange = () => {
      loadCart();
    };
    window.addEventListener('storage', handleLoginChange);
    window.addEventListener('auth-logout', handleLoginChange);
    return () => {
      window.removeEventListener('storage', handleLoginChange);
      window.removeEventListener('auth-logout', handleLoginChange);
    };
  }, []);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      if (isLoggedIn()) {
        // product is usually passed as object or id
        const productId = typeof product === 'object' ? product.id : product;
        await cartApi.addToCart({ productId, quantity });
        await loadCart();
      } else {
        // Guest cart local logic
        const existingItemIdx = cartItems.findIndex((item) => item.productId === product.id);
        let updatedItems = [...cartItems];

        if (existingItemIdx > -1) {
          updatedItems[existingItemIdx].quantity += quantity;
          updatedItems[existingItemIdx].totalPrice = updatedItems[existingItemIdx].quantity * updatedItems[existingItemIdx].price;
        } else {
          updatedItems.push({
            cartItemId: Date.now(), // Mock ID
            productId: product.id,
            productName: product.name,
            thumbnail: product.thumbnail,
            price: product.price,
            quantity: quantity,
            totalPrice: product.price * quantity,
          });
        }
        setCartItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      if (isLoggedIn()) {
        await cartApi.updateQuantity(cartItemId, quantity);
        await loadCart();
      } else {
        const updatedItems = cartItems.map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = quantity;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.price,
            };
          }
          return item;
        });
        setCartItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    setLoading(true);
    try {
      if (isLoggedIn()) {
        await cartApi.removeItem(cartItemId);
        await loadCart();
      } else {
        const updatedItems = cartItems.filter((item) => item.cartItemId !== cartItemId);
        setCartItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn()) {
        await cartApi.clearCart();
        setCartItems([]);
      } else {
        setCartItems([]);
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartTotal,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
