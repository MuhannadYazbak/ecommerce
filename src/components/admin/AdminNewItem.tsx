'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/ui/BackButton';
import CreateNewItemIcon from '@/components/ui/CreateNewIcon';
import { Card, Carousel } from 'antd';

export default function AddItem() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
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
      quantity: Number(form.quantity),
      photo: form.photo,
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept-Language': i18n.language.split('-')[0] || 'en' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('Form payload:', form);
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
    return <p className="text-red-600">{t('adminOnly')}</p>;
  }

    // const onChange = (currentSlide: number) => {
    //   console.log(currentSlide);
    // }

    return (
      <main className="max-w-lg mx-auto p-6" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
        <header className='flex w-full justify-center' id='new item heading'>
          <h1 className="text-2xl font-bold mb-4 text-indigo-500" aria-label='new item heading'>{t('addNewItem')}</h1>
        </header>
        <section className='form border-solid'>
          <h2 className='text-1l font-semibold'>{t('itemDetails')}</h2>
            <Card id='en'>
              <input name="name" placeholder={t('name')} value={form.name} onChange={handleChange} className="mb-2 p-2 w-full border" required />
              <textarea name="description" placeholder={t('description')} value={form.description} onChange={handleChange} className="mb-2 p-2 w-full border" />
            </Card>
            {/* <Card id='ar'>
              <input name="name" placeholder={t('name')} value={form.name} onChange={handleChange} className="mb-2 p-2 w-full border" required />
              <textarea name="description" placeholder={t('description')} value={form.description} onChange={handleChange} className="mb-2 p-2 w-full border" />
            </Card>
            <Card id='he'>
              <input name="name" placeholder={t('name')} value={form.name} onChange={handleChange} className="mb-2 p-2 w-full border" required />
              <textarea name="description" placeholder={t('description')} value={form.description} onChange={handleChange} className="mb-2 p-2 w-full border" />
            </Card> */}
          
          <input name="price" placeholder={t('price')} value={form.price} onChange={handleChange} type="number" className="mb-2 p-2 w-full border" required />
          <input name="quantity" placeholder={t('quantity')} value={form.quantity} onChange={handleChange} className="mb-2 p-2 w-full border" required />
          <input name="photo" placeholder={t('photoURL')} value={form.photo} onChange={handleChange} className="mb-2 p-2 w-full border" />
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{t('addNewItem')} <CreateNewItemIcon /></button>
        </section>
        <nav className='p-2'>
          <BackButton />
        </nav>
      </main>
    );
  }
