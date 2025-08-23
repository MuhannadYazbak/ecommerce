'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Item } from '@/types/item';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import BackButton from '../ui/BackButton';
import SoldOut from '../ui/SoldOut';

type Props = {
    itemId: string;
};


export default function ItemView({ itemId }: Props) {
    const { id } = useParams();
    const { user } = useAuth();
    const [item, setItem] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();
    const { addToCart } = useCart();

    const handleRemove = async (itemId: number) => {
        try {
            const response = await fetch('/api/wish', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user?.id, item_id: itemId }),
            });

            if (!response.ok) throw new Error('Failed to delete');

            //setWishlist(prev => prev.filter(item => item.item_id !== itemId));
        } catch (err) {
            console.error('Removal error:', err);
        }
    };

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
                addToCart({
                    item_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity,
                    photo: item.photo,
                });
                handleRemove(item.id);
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
        <main className="p-6">
            <article aria-labelledby="item-heading" className="max-w-3xl mx-auto">
                <header>
                    <h1 id="item-heading" className="text-2xl font-bold">{item.name}</h1>
                </header>

                <figure className="my-4">
                    <img src={item.photo} alt={`Photo of ${item.name}`} className="w-80 hover:scale-110" />
                    <figcaption id='item-name' className="text-sm text-gray-500 mt-1">Image of {item.name}</figcaption>
                </figure>

                <section aria-label="Description" className='relative'>
                    <p className="mb-2 font-italic">{item.description}</p>
                    <p className="text-blue-600 font-bold text-xl">{item.price}₪</p>
                </section>
                {item.quantity === 0 ? <SoldOut /> : 
                <section aria-label="Purchase Options" className="mt-4 flex" >
                    <div className="flex items-center gap-4">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded">–</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded">+</button>
                    </div>
                    <button
                        onClick = {handleAddToCart}
                        className = "px-3 py-1 ml-4 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                        Add to Cart
                    </button>
                </section>}

                <footer className="mt-6">
                    <BackButton />
                </footer>
            </article>
        </main>
    )
}