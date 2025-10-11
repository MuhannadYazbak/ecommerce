'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../ui/BackButton';
import TrashIcon from '../ui/TrashIcon';

export default function Cart() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user, guest } = useAuth();
    const activeUser = user || guest
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.item_id));
    const total = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    useEffect(() => {
        console.log("📦 selectedItems:", selectedItems);
    }, [selectedItems]);

    const toggleItem = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };
    const handleCheckout = async () => {
        if (selectedItems.length === 0 || !activeUser?.id) return;

        try {
            const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.item_id));
            console.log('Items to Checkout: ', itemsToCheckout)
            if (selectedItems.length === 0) {
                alert("Please select at least one item before checkout.");
                return;
            }

            router.push(`/checkout?selected=${selectedItems.join(',')}`);
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    if (!activeUser) return <p className="p-4">Please log in to view your cart.</p>;

    return (
        <main className="p-6 max-w-3xl mx-auto" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
            <header id='cart-heading' aria-labelledby='cart-heading'>
                <h1 className="text-3xl font-bold text-blue-600 mb-4">{t('yourCartTitle')}</h1>
            </header>

            {cartItems.length === 0 ? (
                <section role='empty cart'>
                    <p>{t('emptyCart')}</p>
                </section>
            ) : (
                <>
                    <ul role='list' className="space-y-4">
                        {cartItems.map(((item, index) => (
                            <li key={`${item.item_id} -${index}`} role='listitem' className="border p-4 rounded shadow flex justify-between items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.item_id)}
                                    onChange={() => {
                                        setSelectedItems(prev =>
                                            prev.includes(item.item_id)
                                                ? prev.filter(id => id !== item.item_id)
                                                : [...prev, item.item_id]
                                        );
                                    }}

                                />
                                <article>
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p>{t('quantity')}: {item.quantity}</p>
                                    <p>{t('price')}: {Number(item.price).toFixed(2)}₪</p>
                                </article>
                                <button
                                    onClick={() => removeFromCart(item.item_id)}
                                    className="text-red-500 hover:underline transition-all duration-300 ease-in-out hover:shadow-md"
                                    role='removeFromCart'
                                >
                                    {t('remove')} <TrashIcon />
                                </button>
                            </li>
                        )))}
                    </ul>

                    <section className="mt-6 text-right">
                        <p className="text-xl font-semibold">{t('total')}: {total.toFixed(2)}₪</p>
                        <button id='checkout' className='bg-blue-500 hover:bg-blue-600 text-white rounded mr-3' disabled={selectedItems.length === 0} onClick={() => handleCheckout()}>
                            {t('checkoutSelected')}
                        </button>
                    </section>


                </>
            )}
            <footer className='w-full justify-center'>
                <BackButton />
            </footer>
        </main>
    );
};