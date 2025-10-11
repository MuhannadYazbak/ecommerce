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
    enName: '',
    enDescription: '',
    arName: '',
    arDescription: '',
    heName: '',
    heDescription: '',
    price: '',
    quantity: '',
    photo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      enName: form.enName,
      price: parseFloat(form.price),
      enDescription: form.enDescription,
      quantity: Number(form.quantity),
      photo: form.photo,
      arName: form.arName,
      arDescription: form.arDescription,
      heName: form.heName,
      heDescription: form.heDescription,
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
    return <p role='adminOnly' className="text-red-600">{t('adminOnly')}</p>;
  }

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  }

  return (
    <main className="container w-full h-fit max-w-lg mx-auto p-6" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <header className='flex w-full justify-center' id='new item heading'>
        <h1 className="text-2xl font-bold mb-4 text-indigo-500" aria-label='new item heading'>{t('addNewItem')}</h1>
      </header>
      <section className='form flex-col border-solid h-full'>
        <h2 className='text-1l font-semibold'>{t('itemDetails')}</h2>
        {/* <>
          <Carousel arrows infinite={true} className='text-white leading-4 text-center bg-indigo-500 mb-5'>

            <div>English
              <Card>
                <input role='enName' name="enName" placeholder={t('name')} value={form.enName} onChange={handleChange} className="mb-2 p-2 w-full border" required />
                <textarea role='enDescription' name="enDescription" placeholder={t('description')} value={form.enDescription} onChange={handleChange} className="mb-2 p-2 w-full border" />
              </Card>
            </div>
            <div>Arabic
              <Card>
                <input role='arName' name="arName" placeholder={t('name')} value={form.arName} onChange={handleChange} className="mb-2 p-2 w-full border" required />
                <textarea role='arDescription' name="arDescription" placeholder={t('description')} value={form.arDescription} onChange={handleChange} className="mb-2 p-2 w-full border" />
              </Card>
            </div>
            <div>Hebrew
              <Card>
                <input role='heName' name="heName" placeholder={t('name')} value={form.heName} onChange={handleChange} className="mb-2 p-2 w-full border" required />
                <textarea role='heDescription' name="heDescription" placeholder={t('description')} value={form.heDescription} onChange={handleChange} className="mb-2 p-2 w-full border" />
              </Card>
            </div>
          </Carousel>
        </> */}
        <input role='enName' name="enName" placeholder={t('name')} value={form.enName} onChange={handleChange} className="mb-2 p-2 w-full border" required />
        <textarea role='enDescription' name="enDescription" placeholder={t('description')} value={form.enDescription} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <input role='arName' name="arName" placeholder={t('name')} value={form.arName} onChange={handleChange} className="mb-2 p-2 w-full border" required />
        <textarea role='arDescription' name="arDescription" placeholder={t('description')} value={form.arDescription} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <input role='heName' name="heName" placeholder={t('name')} value={form.heName} onChange={handleChange} className="mb-2 p-2 w-full border" required />
        <textarea role='heDescription' name="heDescription" placeholder={t('description')} value={form.heDescription} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <input role='price' name="price" placeholder={t('price')} value={form.price} onChange={handleChange} type="number" className="mb-2 p-2 w-full border" required />
        <input role='quantity' name="quantity" placeholder={t('quantity')} value={form.quantity} onChange={handleChange} className="mb-2 p-2 w-full border" required />
        <input role='photo' name="photo" placeholder={t('photoURL')} value={form.photo} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <button role='addNewItem' onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{t('addNewItem')} <CreateNewItemIcon /></button>
      </section>
      <nav className='p-2'>
        <BackButton />
      </nav>
    </main>
  );
}
