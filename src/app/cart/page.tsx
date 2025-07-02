'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const toggleItem = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };
    const handleCheckout = async () => {
        if (selectedItems.length === 0 || !user?.id) return;

        try {
            const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));
            console.log('Items to Checkout: ', itemsToCheckout)
            router.push(`/checkout?selected=${selectedItems.join(',')}`);
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    if (!user) return <p className="p-4">Please log in to view your cart.</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div>
                    <p>Your cart is currently empty.</p>
                    <button className='mt-10 bg-blue-500 text-white rounded hover:bg-blue-700' onClick={() => router.push('/home')}>Back</button>
                </div>
            ) : (
                <>
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item.id} className="border p-4 rounded shadow flex justify-between items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleItem(item.id)}
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 text-right">
                        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white rounded mr-3' disabled={selectedItems.length === 0} onClick={() => handleCheckout()}>
                            Checkout Selected
                        </button><br />
                        <button className='mt-10 bg-blue-500 text-white rounded hover:bg-blue-700' onClick={() => router.push('/home')}>Back</button>
                    </div>

                </>
            )}
        </div>
    );
};