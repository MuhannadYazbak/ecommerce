'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/cartItem';
import { CartContextType } from '@/types/cartContextType';
import { useAuth } from '@/context/AuthContext';


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = async (id: number) => {
    // Remove from frontend first
    setCartItems(prev => prev.filter(i => i.id !== id));

    // Find the corresponding item to extract item_id
    const item = cartItems.find(i => i.id === id);
    if (!item || !user) return;

    try {
      await fetch(`/api/cart/${user.id}/${item.id}`, {
        method: 'DELETE'
      });
      console.log(`🗑️ Deleted item (item_id: ${item.id}) for user ${user.id}`);
    } catch (err) {
      console.error('❌ Failed to delete from backend:', err);
    }
  };


  const clearCart = async () => {
    setCartItems([]);

    if (!user) return;

    try {
      await fetch(`/api/cart/${user.id}`, {
        method: 'DELETE'
      });
      console.log(`🧹 Cleared cart for user ${user.id}`);
    } catch (err) {
      console.error('❌ Failed to clear cart on backend:', err);
    }
  };

  return (
    <CartContext.Provider
  value={{
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
  }}
>
  {children}
</CartContext.Provider>

    // <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
    //   {children}
    // </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};