'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/BackButton';
import { sendCheckoutNotification } from '@/utils/mail';
import { NextResponse } from 'next/server';

export default function Checkout() {
  const { clearCart, cartTotal, cartItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;
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
  const [addressForm, setAddressForm] = useState({
    city: '',
    street: '',
    postalcode: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('User Not Logged in!');
      return;
    }

    // 1️⃣ First, submit address
    const addressRes = await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressForm),
    });

    const addressData = await addressRes.json();
    console.log('addressData = ', addressData);
    const addressId = addressData.id; // assuming your API returns the new address ID

    // 2️⃣ Then continue with payment
    const paymentRes = await fetch(`${process.env.MOCKOON_URL}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        total: itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: itemsToCheckout,
      }),
    });

    const paymentResult = await paymentRes.json();
    if (paymentRes.ok) {
      alert('Payment successful! 🎉');
      clearCart();
      router.push('/home');
    } else {
      alert('Payment failed. Try again.');
    }

    // 3️⃣ Finally, place the order with address ID
    await fetch('/api/place-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        name: user.name,
        total: itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: itemsToCheckout,
        date: new Date(),
        addressId, // 🎯 send it to associate with the order
      }),
    });
  };
  const handleLocateMe = async () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    const res = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${latitude}&lon=${longitude}&format=json`
    );

    const data = await res.json();

    if (data.address) {
      const { city, road, postcode } = data.address;
      setAddressForm({
        city: city || '',
        street: road || '',
        postalcode: postcode || '',
      });
    } else {
      alert('Could not retrieve address from location.');
    }
  }, () => {
    alert('Permission denied or location unavailable.');
  });
};

  return (
    <main className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <header className='flex w-full justify-center'>
        <h1 className="text-3xl font-bold mb-4" aria-labelledby='checkout-heading'>Checkout</h1>
      </header>
      <section aria-labelledby="payment-form-heading" className='flex flex-col w-full justify-center border-dotted border-black'>
        <h2 id="payment-form-heading" className="text-xl font-semibold mb-2">
          Payment Information
        </h2>
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
          {/**new Address form */}
          <section aria-labelledby="address-form-heading" className='flex flex-col w-full space-y-4 justify-center border-dotted border-black'>
            <h2 id="address-form-heading" className="text-xl font-semibold mb-2">
              Address Information
            </h2>
            <button
              onClick={handleLocateMe}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Use My Location
            </button>

            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={handleAddressChange}
              placeholder="City"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="street"
              value={addressForm.street}
              onChange={handleAddressChange}
              placeholder="Street Name or number"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="postalcode"
              value={addressForm.postalcode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
              required
              className="w-1/2 border px-3 py-2 rounded"
            />
          </section>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Pay Now
          </button>
        </form>
      </section>
      <nav className='flex w-full justify-center' aria-label='Go Back' role='back'>
        <BackButton />
      </nav>

    </main>
  );
}