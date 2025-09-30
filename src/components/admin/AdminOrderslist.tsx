'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/order";
import BackButton from "@/components/ui/BackButton";

export default function AdminOrderslist() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders', {
                headers: {
                    'Accept-Language': i18n.language || 'en'
                }
            });
            console.log('Response = ', response);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
    return <p className="text-red-600">{t('adminOnly')}</p>;
  }

    return (
        <main className="container justify-center p-6" dir={i18n.language === 'en' ? 'ltr': 'rtl'}>
            <header className="flex w-full justify-center">
                <h1 className="text-2xl font-semibold mb-4 text-indigo-500">{t('adminOrdersListTitle')}</h1>
            </header>

            {loading ? (
                <p className="animate-pulse text-gray-500">{t('loading')}</p>
            ) : (
                <section className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-md" dir={i18n.language === 'en' ? 'ltr': 'rtl'}>
                        <thead className="bg-gray-100">
                            <tr >
                                <th className="px-4 py-2 text-center">{t('orderID')}</th>
                                <th className="px-4 py-2 text-center">{t('userID')}</th>
                                <th className="px-4 py-2 text-center">{t('totalAmount')}</th>
                                <th className="px-4 py-2 text-center">{t('items')}</th>
                                <th className="px-4 py-2 text-center">{t('createdAt')}</th>
                                <th className="px-4 py-2 text-center">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_id} className="border-t border-gray-200 hover:bg-gray-50" onClick={()=>router.push(`/admin/orders/${order.order_id}`)}>
                                    <td className="px-4 py-2 text-center">{order.order_id}</td>
                                    <td className="px-4 py-2 text-center">{order.user_id}</td>
                                    <td className="px-4 py-2 text-center">${order.total_amount}</td>
                                    <td className="px-4 py-2 text-center relative group">
                                        <span className="text-sm underline cursor-help">{t('items')}</span>
                                        <div className="absolute hidden group-hover:block bg-white shadow-md p-2 rounded z-10">
                                            {order.items_json.map((item: any, idx: number) => (
                                                // <div key={idx}>{item.name} x{item.quantity}</div>
                                                 <div key={idx}>{t('tooltip.itemEntry', { name: item.name, quantity: item.quantity })}</div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-4 py-2 text-center">{new Date(order.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-2 text-center capitalize">{t(`orderStatus.${order.status}`)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <nav className="flex w-full justify-center">
            <BackButton />
            </nav>
        </main>
    );
}