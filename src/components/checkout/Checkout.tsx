'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import BackButton from '@/components/ui/BackButton';

export default function Checkout() {
  const { clearCart, cartTotal, cartItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  const { t, i18n } = useTranslation();
  const token = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  const itemsToCheckout = selectedIds.length > 0
    ? cartItems.filter(item => selectedIds.includes(item.item_id))
    : cartItems;

  const [addressForm, setAddressForm] = useState({
    city: '',
    street: '',
    postalcode: ''
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const raw = searchParams.get('selected');
    const ids = raw
      ?.split(',')
      .map(id => Number(id))
      .filter(id => !isNaN(id)) || [];

    setSelectedIds(ids);
  }, []);

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
      // 1. Submit address
      const addressRes = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const addressData = await addressRes.json();
     // const addressId = Number(addressData.id);
     const addressId = Number(addressData.id || addressData.address_id || addressData.insertId);

      // 2. Calculate total
      const calculatedTotal = itemsToCheckout.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      );

      const sanitizedItems = itemsToCheckout.map(item => ({
        id: Number(item.item_id),
        name: String(item.name),
        price: Number(item.price),
        quantity: Number(item.quantity),
        photo: String(item.photo),
      }));

      // 3A. CASH ON DELIVERY FLOW
      if (paymentMethod === 'cod') {
        const orderPayload = {
          user_id: Number(user.id),
          total_amount: Number(calculatedTotal),
          items_json: JSON.stringify(sanitizedItems),
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          status: 'Pending Delivery',
          payment_method: 'COD',
          address_id: Number(addressId),
          name: user.fullname,
        };

        const orderRes = await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (!orderRes.ok) {
          alert('Order placement failed. Try again.');
          return;
        }

        alert('Order placed successfully via Cash On Delivery! 🎉');
        clearCart();
        router.push(`/${locale}/home`);
        return;
      }

      // 3B. STRIPE PAYMENT FLOW
      // 1. Create a "Pending Payment" order in the database first
      const orderPayload = {
        user_id: Number(user.id),
        total_amount: Number(calculatedTotal),
        items_json: sanitizedItems,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: 'Pending Payment',
        payment_method: 'Stripe',
        address_id: Number(addressId),
        name: user.fullname,
      };

      const orderRes = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      
      // Catches id, order_id, or insertId depending on your SQL response format
      const createdOrderId = orderData.id || orderData.order_id || orderData.insertId;

      if (!orderRes.ok || !createdOrderId) {
        console.error('❌ Place Order API Error:', orderData);
        alert(`Database Error: ${orderData.error || orderData.message || 'Could not save order'}`);
        return;
      }

      // 2. Pass the extracted order ID to the payment microservice
      const microserviceUrl = process.env.NEXT_PUBLIC_PAYMENTS_MICROSERVICE_URL || 'http://localhost:8001';

      const stripeItems = sanitizedItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const checkoutRes = await fetch(`${microserviceUrl}/api/v1/subscriptions/create-cart-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': String(user.id),
        },
        body: JSON.stringify({
          order_id: Number(createdOrderId),
          items: stripeItems,
          currency: 'usd',
          success_url: `${window.location.origin}/${locale}/home`,
          cancel_url: `${window.location.origin}/${locale}/checkout`,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.checkout_url) {
        alert('Could not initialize payment session. Try again.');
        return;
      }

      // 3. Clear local cart and redirect to Stripe
      clearCart();
      window.location.href = checkoutData.checkout_url;

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
        <h1 className="text-3xl font-bold mb-4">{t('checkout')}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selector */}
        <section className="border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">{t('paymentMethod') || 'Payment Method'}</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={() => setPaymentMethod('stripe')}
              />
              <span className="font-medium">Credit / Debit Card (Stripe)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <span className="font-medium">Cash On Delivery (COD)</span>
            </label>
          </div>
        </section>

        {/* Address Section */}
        <section aria-labelledby="address-form-heading" className="space-y-4">
          <h2 id="address-form-heading" className="text-xl font-semibold mb-2">
            {t('addressInfo')}
          </h2>
          <button
            type="button"
            onClick={handleLocateMe}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
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
            className="w-full border px-3 py-2 rounded"
          />
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {paymentMethod === 'stripe' ? 'Proceed to Stripe Payment' : 'Place Order (COD)'}
        </button>
      </form>

      <nav className='flex w-full justify-center mt-4'>
        <BackButton />
      </nav>
    </main>
  );
}