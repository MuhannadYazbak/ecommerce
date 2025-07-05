// src/app/orders/page.tsx
'use client'; // Since we're using hooks and interactivity

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';
import { Order, OrderItem } from '@/types/order';
import { CartItem } from '@/types/cartItem';

export default function OrderHistoryPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return; // Wait for auth to initialize

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${user?.id}`);
        console.log('Response = ',response);
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
  }, [user?.id, ready]);

  if (!ready || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p>You must be logged in to view orders.</p>
        <text className="text-blue-500 hover:underline" onClick={()=>router.push('/login')}>
          Go to Login
        </text>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.order_id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Order # {order.order_id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p className="font-bold">${order.total_amount.toFixed(2)}</p>
              </div>

              <ul className="divide-y">
                {order.items_json.map((item: OrderItem) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <div className="flex items-center gap-3">
                      {item.photo && (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <span>
                        {item.name} <span className="text-gray-500">(x{item.quantity})</span>
                      </span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className='bg-blue-500 hover:bg-blue-600 text-white rounded' onClick={()=>router.back()}>Back</button>
        </div>
      )}
    </div>
  );
}