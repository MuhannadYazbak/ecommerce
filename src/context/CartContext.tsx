'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/cartItem';
import { CartContextType } from '@/types/cartContextType';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation'; // 1. Import useParams

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { user, guest } = useAuth();
  const activeUser = user || guest;
  const [cartReady, setCartReady] = useState(false);

  // 2. Extract the current active locale path parameters
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  useEffect(() => {
    const hydrateCart = async () => {
      if (user) {
        try {
          // 3. Pass the locale as a header so the backend API knows which translation to query
          const res = await fetch(`/api/cart/${activeUser?.id}`, {
            headers: {
              'Accept-Language': locale,
            },
          });
          const data = await res.json();
          setCartItems(
            data.map((item: { price: any }) => ({
              ...item,
              price: Number(item.price),
            }))
          );
          console.log(`🛒 Hydrated cart (${locale}) from backend:`, data);
        } catch (err) {
          console.error('❌ Failed to fetch cart from backend:', err);
        } finally {
          setCartReady(true);
        }
      } else if (guest) {
        // If it's a guest cart, we look up localStorage
        const stored = localStorage.getItem('guestCart');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setCartItems(parsed);
            console.log('🛒 Hydrated cart from localStorage:', parsed);
          } catch {
            console.error('❌ Failed to parse guestCart');
          }
        }
        setCartReady(true);
      }
    };

    hydrateCart();
    // 4. Added 'locale' here! Whenever the language changes, re-run this hydration.
  }, [user, guest, locale]); 

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (guest) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, guest]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.item_id === item.item_id);
      const updated = existing
        ? prev.map(i =>
            i.item_id === item.item_id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        : [...prev, item];
      console.log('🛒 Updated cartItems:', updated);
      return updated;
    });
  };

  const removeFromCart = async (id: number) => {
    setCartItems(prev => {
      const item = prev.find(i => i.item_id === id);
      if (!item) return prev;

      if (user) {
        fetch(`/api/cart/${user.id}/${item.item_id}`, {
          method: 'DELETE',
        }).catch(err => {
          console.error('❌ Failed to delete from backend:', err);
        });
      }

      return prev.filter(i => i.item_id !== id);
    });
  };

  const clearCart = async () => {
    setCartItems([]);

    if (user) {
      try {
        await fetch(`/api/cart/${user.id}`, {
          method: 'DELETE',
        });
        console.log(`🧹 Cleared cart for user ${user.id}`);
      } catch (err) {
        console.error('❌ Failed to clear cart on backend:', err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartReady,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};