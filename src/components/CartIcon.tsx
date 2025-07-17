'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartIcon() {
  const { cartItems, cartReady } = useCart();
  const { user } = useAuth();
  if (!user || !cartReady) return null;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative w-full">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='h-10 w-10' strokeWidth={1} stroke='black'>
  <circle cx="16.5" cy="18.5" r="1.5"/>
  <circle cx="9.5" cy="18.5" r="1.5"/>
  <path d="M18 16H8a1 1 0 0 1-.958-.713L4.256 6H3a1 1 0 0 1 0-2h2a1 1 0 0 1 .958.713L6.344 6H21a1 1 0 0 1 .937 1.352l-3 8A1 1 0 0 1 18 16zm-9.256-2h8.563l2.25-6H6.944z"/>
</svg>

      {totalItems > 0 && (
        <span aria-label="Cart Items Count"
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
          {totalItems}
        </span>
      )}
    </Link>
  );
}