'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Cart() {
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
        <main className="p-6 max-w-3xl mx-auto">
            <header id='cart-heading' aria-labelledby='cart-heading'>
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Your Cart</h1>
            </header>

            {cartItems.length === 0 ? (
                <section>
                    <p>Your cart is currently empty.</p>
                    <button className='bg-silver text-blue-600 rounded hover:bg-gray-300' onClick={() => router.back()}>Back</button>
                </section>
            ) : (
                <>
                    <section role='list' className="space-y-4">
                        {cartItems.map(((item,index) => (
                            <li key={`${item.id}-${index}`} role='listitem' className="border p-4 rounded shadow flex justify-between items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleItem(item.id)}
                                />
                                <article>
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: {item.price.toFixed(2)}₪</p>
                                </article>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:underline transition-all duration-300 ease-in-out hover:shadow-md"
                                >
                                    Remove
                                </button>
                            </li>
                        )))}
                    </section>

                    <section className="mt-6 text-right">
                        <p className="text-xl font-semibold">Total: {total.toFixed(2)}₪</p>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white rounded mr-3' disabled={selectedItems.length === 0} onClick={() => handleCheckout()}>
                            Checkout Selected
                        </button>         
                    </section>
                    <footer className='w-full justify-center'>
                        <button className='bg-silver text-blue-600 rounded hover:bg-gray-300' onClick={() => router.back()}>Back</button>
                    </footer>

                </>
            )}
        </main>
    );
};