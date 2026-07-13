import React, { createContext, useState, useEffect } from 'react';
import cartApi from '../api/cartApi';
import productApi from '../api/productApi';
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
      const productId = typeof product === 'object' ? product.id : product;
      const existingItem = cartItems.find((item) => item.productId === productId);
      const currentCartQty = existingItem ? existingItem.quantity : 0;

      let stock = 999;
      if (typeof product === 'object' && product.quantity !== undefined && product.quantity !== null) {
        stock = product.quantity;
      } else {
        try {
          const prodDetail = await productApi.getById(productId);
          stock = prodDetail?.quantity ?? 999;
        } catch (e) {
          console.error("Không thể lấy thông tin số lượng sản phẩm:", e);
        }
      }

      if (currentCartQty + quantity > stock) {
        alert(`Không thể thêm vào giỏ hàng. Trong kho chỉ còn ${stock} sản phẩm (bạn đã có ${currentCartQty} sản phẩm trong giỏ).`);
        return false;
      }

      if (isLoggedIn()) {
        await cartApi.addToCart({ productId, quantity });
        await loadCart();
      } else {
        // Guest cart local logic
        const existingItemIdx = cartItems.findIndex((item) => item.productId === productId);
        let updatedItems = [...cartItems];

        let guestProduct = typeof product === 'object' ? product : null;
        if (!guestProduct) {
          try {
            guestProduct = await productApi.getById(productId);
          } catch (e) {
            console.error("Failed to fetch product for guest cart:", e);
          }
        }

        const prodName = guestProduct?.name || 'Sản phẩm';
        const prodThumb = guestProduct?.thumbnail || '';
        const prodPrice = guestProduct?.price || 0;

        if (existingItemIdx > -1) {
          updatedItems[existingItemIdx].quantity += quantity;
          updatedItems[existingItemIdx].totalPrice = updatedItems[existingItemIdx].quantity * updatedItems[existingItemIdx].price;
        } else {
          updatedItems.push({
            cartItemId: Date.now(), // Mock ID
            productId: productId,
            productName: prodName,
            thumbnail: prodThumb,
            price: prodPrice,
            quantity: quantity,
            totalPrice: prodPrice * quantity,
          });
        }
        setCartItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
      return true;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const item = cartItems.find((i) => i.cartItemId === cartItemId);
      if (!item) return;

      let stock = 999;
      try {
        const prodDetail = await productApi.getById(item.productId);
        stock = prodDetail?.quantity ?? 999;
      } catch (e) {
        console.error("Không thể lấy thông tin số lượng sản phẩm để cập nhật:", e);
      }

      if (quantity > stock) {
        alert(`Không thể cập nhật số lượng. Trong kho chỉ còn ${stock} sản phẩm.`);
        return;
      }

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
