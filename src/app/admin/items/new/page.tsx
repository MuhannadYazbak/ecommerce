'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AddItemPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    photo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      photo: form.photo,
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('✅ Item added successfully');
        router.push('/admin/items');
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.error}`);
      }
    } catch (err) {
      console.error('🔥 Submit error:', err);
    }
  };

  if (!user || user.role !== 'admin') {
    return <p className="text-red-600">⛔ Access denied. Admins only.</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="mb-2 p-2 w-full border" />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} type="number" className="mb-2 p-2 w-full border" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="mb-2 p-2 w-full border" />
      <input name="photo" placeholder="Photo URL" value={form.photo} onChange={handleChange} className="mb-2 p-2 w-full border" />
      <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Create Item</button><br/>
      <button className='mt-4 bg-blue-600 hover:bg-blue-700 text-white' onClick={()=>router.back()}>Back</button>
    </div>
  );
}