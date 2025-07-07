'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/BackButton';
import { sendCheckoutNotification } from '@/utils/mail';

export default function CheckoutPage() {
  const { clearCart, cartTotal, cartItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const selectedIds = searchParams.get('selected')?.split(',').map(id => Number(id)) || [];

  const itemsToCheckout = selectedIds.length > 0
    ? cartItems.filter(item => selectedIds.includes(item.id))
    : cartItems;
  const [form, setForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     // We'll hook this up to the mock payment API soon
  //     console.log('Submitting payment:', form);
  //   };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      //amount: cartTotal, // You can calculate this from cart total
      items: itemsToCheckout,
      total: itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0),
      cardNumber: form.cardNumber,
      cvv: Number(form.cvv),
      expiryMonth: form.expiryMonth,
      expiryYear: form.expiryYear,
    };

    try {
      if (!user) {
        alert('User Not Logged in!')
        return;
      }
      const res = await fetch('http://localhost:3001/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        console.log('✅ Payment success:', result);
        alert('Payment successful! 🎉');


        clearCart();
        router.push('/home'); // or show a success screen
      } else {
        console.error('❌ Payment failed:', result);
        alert('Payment failed. Try again.');
      }
      const res2 = await fetch('/api/place-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.id,
    name: user.name,
    total: itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0),
    items: itemsToCheckout,
  }),
}); console.log('res2 = ',res2);
    } catch (err) {
      console.error('🔥 Payment error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name on Card"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="cardNumber"
          value={form.cardNumber}
          onChange={handleChange}
          placeholder="Card Number"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex space-x-2">
          <input
            type="text"
            name="expiryMonth"
            value={form.expiryMonth}
            onChange={handleChange}
            placeholder="MM"
            required
            className="w-1/2 border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="expiryYear"
            value={form.expiryYear}
            onChange={handleChange}
            placeholder="YYYY"
            required
            className="w-1/2 border px-3 py-2 rounded"
          />
        </div>
        <input
          type="text"
          name="cvv"
          value={form.cvv}
          onChange={handleChange}
          placeholder="CVV"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Pay Now
        </button>
        <footer>
          <BackButton />
        </footer>
      </form>
    </div>
  );
}