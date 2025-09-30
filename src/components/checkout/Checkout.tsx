'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import BackButton from '@/components/ui/BackButton';
import { sendCheckoutNotification } from '@/utils/mail';
import { NextResponse } from 'next/server';

export default function Checkout() {
  const { clearCart, cartTotal, cartItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const token = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;
  //const searchParams = new URLSearchParams(window.location.search);
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const itemsToCheckout = selectedIds.length > 0
    ? cartItems.filter(item => selectedIds.includes(item.item_id))
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const raw = searchParams.get('selected');
    console.log("🔍 selected param raw:", raw);

    const ids = raw
      ?.split(',')
      .map(id => Number(id))
      .filter(id => !isNaN(id)) || [];

    console.log("🧾 parsed selectedIds:", ids);
    setSelectedIds(ids);
  }, []);


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

    try {
      // 1️⃣ Submit address
      const addressRes = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const addressData = await addressRes.json();
      const addressId =Number(addressData.id);

      // 2️⃣ Calculate total
      const cartTotal = itemsToCheckout.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // 3️⃣ Send payment request
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_MOCKOON_URL}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          items: itemsToCheckout,
        }),
      });
      const paymentResult = await paymentRes.json();

      if (!paymentRes.ok || !paymentResult.success) {
        alert('Payment failed. Try again.');
        return;
      }

      // 4️⃣ Place the order
      console.log("🧮 cartTotal:", cartTotal, typeof cartTotal);
      const sanitizedItems = itemsToCheckout.map(item => ({
        id: Number(item.item_id),
        name: String(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
        photo: String(item.photo),
      }));
      const orderPayload = {
        user_id: Number(user.id),
        total_amount: Number(cartTotal),
        items_json: sanitizedItems,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: 'Processing',
        address_id: Number(addressId),
        name: user.fullname,
      };

      const orderRes = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      console.log('orderRes at /place-order is ',orderRes)
      const orderResult = await orderRes.json();

      if (!orderRes.ok || orderResult.error) {
        alert('Order placement failed. Try again.');
        return;
      }

      // 5️⃣ Final success flow
      alert('Payment successful! 🎉');
      clearCart();
      router.push('/home');
    } catch (err) {
      console.error('❌ Checkout error:', err);
      alert('Something went wrong. Please try again.');
    }
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
    <main className="max-w-md mx-auto mt-10 p-6 border rounded shadow" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <header className='flex w-full justify-center'>
        <h1 className="text-3xl font-bold mb-4" aria-labelledby='checkout-heading'>{t('checkout')}</h1>
      </header>
      <section aria-labelledby="payment-form-heading" className='flex flex-col w-full justify-center border-dotted border-black'>
        <h2 id="payment-form-heading" className="text-xl font-semibold mb-2">
          {t('paymentInfo')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t('nameOnCard')}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder={t('cardNumber')}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex space-x-2">
            <input
              type="text"
              name="expiryMonth"
              value={form.expiryMonth}
              onChange={handleChange}
              placeholder={t('month')}
              required
              className="w-1/2 border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="expiryYear"
              value={form.expiryYear}
              onChange={handleChange}
              placeholder={t('year')}
              required
              className="w-1/2 border px-3 py-2 rounded"
            />
          </div>
          <input
            type="text"
            name="cvv"
            value={form.cvv}
            onChange={handleChange}
            placeholder={t('cvv')}
            required
            className="w-full border px-3 py-2 rounded"
          />
          {/**new Address form */}
          <section aria-labelledby="address-form-heading" className='flex flex-col w-full space-y-4 justify-center border-dotted border-black'>
            <h2 id="address-form-heading" className="text-xl font-semibold mb-2">
              {t('addressInfo')}
            </h2>
            <button
              onClick={handleLocateMe}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              {t('useMyLocation')}
            </button>

            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={handleAddressChange}
              placeholder={t('city')}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="street"
              value={addressForm.street}
              onChange={handleAddressChange}
              placeholder={t('street')}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="postalcode"
              value={addressForm.postalcode}
              onChange={handleAddressChange}
              placeholder={t('postalCode')}
              required
              className="w-1/2 border px-3 py-2 rounded"
            />
          </section>

          <button
            type="submit"
            id='pay-now'
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {t('payNow')}
          </button>
        </form>
      </section>
      <nav className='flex w-full justify-center' aria-label='Go Back' role='back'>
        <BackButton />
      </nav>

    </main>
  );
}