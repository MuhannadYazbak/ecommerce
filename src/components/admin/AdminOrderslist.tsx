'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import BackButton from "@/components/ui/BackButton";

export default function AdminOrderslist() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders');
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
    return (
        <main className="container p-6">
            <header className="flex w-full justify-center">
                <h1 className="text-2xl font-semibold mb-4">TechMart Admin Orders List</h1>
            </header>

            {loading ? (
                <p className="animate-pulse text-gray-500">Loading orders...</p>
            ) : (
                <section className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-md">
                        <thead className="bg-gray-100">
                            <tr >
                                <th className="px-4 py-2 text-left">Order ID</th>
                                <th className="px-4 py-2 text-left">User ID</th>
                                <th className="px-4 py-2 text-left">Total Amount</th>
                                <th className="px-4 py-2 text-left">Items</th>
                                <th className="px-4 py-2 text-left">Created At</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_id} className="border-t border-gray-200 hover:bg-gray-50" onClick={()=>router.push(`/admin/orders/${order.order_id}`)}>
                                    <td className="px-4 py-2">{order.order_id}</td>
                                    <td className="px-4 py-2">{order.user_id}</td>
                                    <td className="px-4 py-2">${order.total_amount}</td>
                                    <td className="px-4 py-2 relative group">
                                        <span className="text-sm underline cursor-help">Items</span>
                                        <div className="absolute hidden group-hover:block bg-white shadow-md p-2 rounded z-10">
                                            {order.items_json.map((item: any, idx: number) => (
                                                <div key={idx}>{item.name} x{item.quantity}</div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-2 capitalize">{order.status}</td>
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