import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/otherServices';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isStudent } = useAuth();
  const [cart, setCart]       = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isStudent) return;
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isStudent]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (bookId, quantity = 1) => {
    try {
      const data = await cartService.addToCart(bookId, quantity);
      setCart(data);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      const data = await cartService.updateItem(itemId, quantity);
      setCart(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const data = await cartService.removeItem(itemId);
      setCart(data);
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCart(prev => ({ ...prev, items: [], totalAmount: 0, totalItems: 0 }));
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, []);

  const cartCount = cart?.totalItems || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
