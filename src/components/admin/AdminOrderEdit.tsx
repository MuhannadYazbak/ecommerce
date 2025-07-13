'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BackButton from '../ui/BackButton';
import { Order } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import { UpdateItem } from '@/types/item';

export default function OrderEdit() {
    const router = useRouter();
    const [order, setOrder] = useState<Order>();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();
    const [form, setForm] = useState({
        order_id: null as number | null,
        user_id: 0,
        total_amount: 0,
        items_json: [] as any[],
        created_at: new Date() as Date | string,
        status: '',
        address_id: null as number | null
    });
    const [updates, setUpdates] = useState<UpdateItem[]>([]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: form.status,
                    userId: user?.id,
                    name: user?.name,
                    total: form.total_amount,
                    items: form.items_json,
                    date: new Date(),
                }),
            })
            if (!res.ok) {
                const body = await res.json()
                throw new Error(body.error || 'Update failed')
            }
            //router.push('/admin/items')
            console.log(`order ${form.order_id} submitted with values ${form.status}`);
            const ship = await fetch('/api/admin/ship', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            console.log('Shipping email.... ', ship);
            router.back();
        } catch (err: any) {
            console.error(err)
            alert(err.message)
        }
    }
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/admin/orders/${id}`)
                if (!res.ok) throw new Error('Item not found')
                const data: Order = await res.json()
                setOrder(data);
                setForm({
                    order_id: data.order_id ?? null,
                    user_id: data.user_id ?? 0,
                    total_amount: data.total_amount ?? 0,
                    items_json: data.items_json ?? [],
                    created_at: data.created_at ?? new Date(),
                    status: data.status ?? '',
                    address_id: data.address_id ?? null,
                });
            } catch (err) {
                console.error(err)
                router.replace('/admin/items')  // back to list if not found
            } finally {
                setLoading(false)
            }
        }
        load()
    }, []);
    useEffect(() => {
        if (form.items_json && Array.isArray(form.items_json)) {
            const parsedUpdates: UpdateItem[] = form.items_json.map((item: any) => ({
                id: item.id,
                shipped: item.quantity || 0, // adjust logic depending on your structure
            }));
            setUpdates(parsedUpdates);
        }
    }, [form.items_json]);


    return (
        <main className='container w-full p-6'>
            <header id='order heading' className='flex justify-center'>
                <h1 className='text-2xl font-bold text-blue-600' aria-label='order heading'>{order?.order_id} Edit</h1>
            </header>
            {loading ? <div className="animate-pulse text-gray-500">Loading order...</div> :
                <section className='flex flex-col w-full space-y-4'>
                    <h2 className='justify-center'>order {order?.order_id} Details</h2>
                    <form id='order form' className='flex flex-col space-y-4' onSubmit={handleSubmit}>
                        <div className="flex flex-row items-center space-x-2 px-4 py-2">
                            <label htmlFor="order_id">Order ID</label>
                            <input disabled type='number' id='order_id' name='order_id' value={form.order_id ?? ''} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="flex flex-row items-center space-x-2 px-4 py-2">
                            <label htmlFor="user">User Id</label>
                            <input disabled type='text' id='uder_id' name='user_id' value={form.user_id} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="flex flex-row items-center space-x-2 px-4 py-2">
                            <label htmlFor="total_amount">Total Amount</label>
                            <input disabled type='number' id='total_amount' name='total_amount' value={form.total_amount} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="flex flex-row items-center space-x-2 px-4 py-2">
                            <label htmlFor="status">Status</label>
                            <input type='text' id='status' name='status' value={form.status} onChange={(e) => handleChange(e)} className='text-sm underline cursor-help relative group' />
                            <span className='absolute hidden group-hover:block bg-white shadow-md p-2 rounded z-10'>please use Processing | Shipped | Delivered | Cancelled </span>
                        </div>
                        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"> Update </button>
                    </form>
                </section>}
            <nav className='flex justify-center w-full' role='Go Back'>
                <BackButton />
            </nav>
        </main>
    )
}