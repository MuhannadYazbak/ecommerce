'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Order, OrderItem } from '@/types/order';
import BackButton from '@/components/ui/BackButton';

export default function OrderHistory() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${user?.id}`,{
          headers: {
            'Accept-Language': i18n.language.split('-')[0] || 'en'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchOrders();
  }, [user?.id, ready, i18n.language]);

  if (!ready || loading) {
    return (
      <main className="flex justify-center items-center h-64" aria-busy="true">
        <p>{t('loading')}</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center h-64 gap-4" aria-label="Auth Required" >
        <header className='flex w-full justify-center' id='auth-warning-heading' aria-label='auth-warning-heading'>
          <h1 aria-labelledby='must-login'>{t('accessDenied')}</h1>
        </header>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => router.push('/login')}
          aria-label="Navigate to login"
        >
          {t('login')}
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8" dir={i18n.language === 'en' ? 'ltr': 'rtl'}>
      <div className="text-center mb-6" id='orders-heading' aria-label='orders-heading'>
        <h1 className="text-3xl font-bold" id="orders-heading">{t('myOrders')}</h1>
      </div>

      {orders.length === 0 ? (
        <section aria-label="no-orders-heading">
          <h2 id="no-orders-heading" className="text-lg font-medium mb-2">{t('ordersHistory')}</h2>
          <p>{t('noOrders')}</p>
          <nav className="w-full flex justify-center mt-8" aria-label='Go-Back'>
            <BackButton />
          </nav>
        </section>
      ) : (
        <section aria-labelledby="orders-list-heading" className="space-y-6">
          <h2 id="orders-list-heading" className="sr-only">{t('listOfOrders')}</h2>

          {orders.map((order) => {
            let items: OrderItem[] = [];

            try {
              items = Array.isArray(order.items_json)
                ? order.items_json
                : JSON.parse(order.items_json);
            } catch (err) {
              console.error('Failed to parse items_json:', err);
              items = [];
            }

            return (
              <article role='listemitem' key={order.order_id} className="flex-1 border rounded-lg p-4 shadow-sm" aria-label={`Order ${order.order_id}`}>
                <header className="flex w-auto justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{t('order')} #{order.order_id}</h3>
                    <h3 className="font-medium">{t('status')}: {t(`orderStatus.${order.status}`)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="font-bold">{order.total_amount.toFixed(2)}₪</p>
                  
                </header>

                <ul className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="py-2 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {item.photo && (
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span>{item.name} <span className="text-gray-500">(x{item.quantity})</span></span>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(2)}₪</span>
                      
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}

          <nav className="w-full flex justify-center mt-8" aria-label='Go-Back'>
            <BackButton />
          </nav>
        </section>
      )}
    </main>
  );
}
