'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Item } from '@/types/item';
import { useAuth } from '@/context/AuthContext';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import TrashIcon from '@/components/ui/TrashIcon';
import DetailsIcon from '@/components/ui/DetailsIcon';
import BackButton from '@/components/ui/BackButton';
import SoldOut from '../ui/SoldOut';
import { TranslatedItem } from '@/types/translatedItem';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { item } = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  //const [totalPages, setTotalPages] = useState(5);
  const [itemsPerPage] = useState(6);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [refreshTrigger, setRefreshTrigger] = useState(0)

   useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setCurrentPage(1);
  }, [items.length]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    console.log('FETCHING ITEMS !!!')
    fetchItems();
    console.log('Items: ', items)
  }, [user, refreshTrigger, currentPage, i18n.language]);
  

  const fetchItems = async (page = currentPage) => {
    console.log('Sending Accept-Language:', i18n.language);
    const res = await fetch(`/api/items?page=${page}&limit=${itemsPerPage}`,{
      headers: {
        'Accept-Language': i18n.language.split('-')[0] || 'en'
      }
    });
    const data = await res.json();
    setItems(data);
  };
  const handleViewItem = (id: number) => {
    router.push(`/admin/items/${id}`);
  };

  const changeLanguage = (lng: 'en' | 'ar' | 'he') => {
    i18n.changeLanguage(lng);
  };
  const ItemDelete = async (id: number) => {

    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      });
      console.log(`🗑️ Deleted item (item_id: ${id})`);
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error('❌ Failed to delete from backend:', err);
    }
  };
  const ItemUpdate = async (id: number) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT'
      });
      console.log('Updating item');
      fetchItems();
    } catch (err) {
      console.error('❌ Failed to update item: ', err)
    }
  }

  if (!user || user.role !== 'admin') {
    return <p className="text-red-600">{t('adminOnly')}</p>;
  }
  
  return (
    <main className='p-6 container' dir={i18n.language === 'en' ? 'ltr': 'rtl'}>
      <header className='flex justify-center w-full'>
        <h1 className="text-4xl font-bold text-indigo-500">{t('adminDashboard')}</h1>
      </header>
      <nav className='flex flex-row space-x-2'>
        <button role='addNewItem' className='mb-4 ml-4 bg-green-600 hover:bg-green-800 text-white rounded' onClick={() => router.push('/admin/items/new')}>{t('addNewItem')}</button>
        <button role='ordersList' className='mb-4 ml-4 bg-purple-300 hover:bg-purple-400 text-white rounded' onClick={() => router.push('/admin/orders-list')}>{t('ordersList')}</button>
        <button role='barChart' className='mb-4 ml-4 bg-orange-400 hover:bg-orange-500 text-black rounded' onClick={() => router.push('/admin/chart')}>{t('barChart')}</button>
        <button role='pieChart' className='mb-4 ml-4 bg-pink-400 hover:bg-pink-500 text-white rounded' onClick={() => router.push('/admin/pieChart')}>{t('pieChart')}</button>
        <button role='byFullName' className='mb-4 ml-4 bg-indigo-400 hover:bg-indigo-500 text-white rounded' onClick={() => router.push('/admin/byFullname')}>{t('byFullName')}</button>
      </nav>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentItems.map((item, index) => (
          <article
            id='item-article'
            key={`${item.id}-${index}`}
            className={item.quantity > 0 ? "border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition-transform hover:scale-105" : "border rounded-lg shadow-md p-4 bg-gray-400 hover:shadow-xl"}
          >
            {item.quantity === 0 ? <SoldOut /> : ''}
            <figcaption className="aspect-[16/9] overflow-hidden">
              <Image
                width={300}
                height={300}
                loading='lazy'
                src={item.photo}
                alt={item.name}
                className="w-full h-60 object-contain bg-white p-2 rounded"
              />

            </figcaption>
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-blue-600 font-bold text-lg">{item.price}₪</p>
            <p className='font-italic text-lg'>{t('quantity')}: {item.quantity}</p>
            <div role='itemButtons' className='flex flex-row-reverse space-x-reverse space-x-2'>
              <button
                onClick={() => ItemDelete(item.id)}
                className="mt-2 bg-blue-600 hover:bg-red-700 text-white px-3 py-1 rounded" role='deleteItem'
              >
                {t('deleteItem')} <TrashIcon />
              </button>
              <button
                onClick={() => handleViewItem(item.id)}
                className="ml-5 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded" role='viewItem'
              >
                {t('viewItem')} <DetailsIcon />
              </button>
            </div>
          </article>
        ))}
      </section>
      <section className='flex w-full justify-center'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Add any admin-specific page change logic
          }}
          className="mt-4"
        />
      </section>
      <nav className='flex w-full justify-center pt-1'>
        <BackButton />
      </nav>
    </main>
  );
}