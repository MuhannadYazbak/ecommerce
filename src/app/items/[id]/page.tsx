'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Item } from '@/types/item';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ItemDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!item) return;

    const payload = {
      user_id: user?.id,
      item_id: item.id,
      name: item.name,
      price: item.price,
      photo: item.photo,
      quantity,
    };

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        console.log('✅ Item added to cart (server):', result);

        // 🧠 Update client-side cart context
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          photo: item.photo,
        });

        // Optional: feedback
        // e.g. toast.success("Item added to cart!")
      } else {
        console.error('❌ Error adding to cart:', result.error);
      }
    } catch (err) {
      console.error('🔥 API call failed:', err);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch item:', res.status, errorText);
        return;
      }

      try {
        const data = await res.json();
        setItem(data);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };

    if (id) fetchItem();
  }, [id]);

  if (!item) return <p>Loading item...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <img src={item.photo} alt={item.name} className="w-80 my-4" />
      <p>{item.description}</p>
      <p className="text-blue-600 font-bold text-xl mt-2">${item.price}</p>
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          –
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Add to Cart
      </button>
      <div>
        <button style={{ color: 'blue', backgroundColor: 'silver', margin: '10px' }} onClick={() => router.back()}>Back</button></div>
    </div>
  );
}