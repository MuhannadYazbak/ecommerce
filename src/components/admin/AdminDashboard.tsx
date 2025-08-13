'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Item } from '@/types/item';
import { useAuth } from '@/context/AuthContext';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import TrashIcon from '@/components/ui/TrashIcon';
import DetailsIcon from '@/components/ui/DetailsIcon';
import BackButton from '@/components/ui/BackButton';
import SoldOut from '../ui/SoldOut';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { item } = useParams();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
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
    console.log('FETCHING ITEMS !!!')
    fetchItems();
    console.log('Items: ', items)
  }, [user, refreshTrigger]);
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const fetchItems = async (page = currentPage) => {
    const res = await fetch(`/api/items?page=${page}&limit=${itemsPerPage}`);
    const data = await res.json();
    setItems(data);
  };
  const handleViewItem = (id: number) => {
    router.push(`/admin/items/${id}`);
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
  return (
    <main className='p-6 container'>
      <header className='flex justify-center w-full'>
        <h1>Admin Dashboard</h1>
      </header>
      <nav className='flex flex-row space-x-2'>
        <button className='mb-4 ml-4 bg-green-600 hover:bg-green-800 text-white rounded' onClick={() => router.push('/admin/items/new')}>Add New Item</button>
        <button className='mb-4 ml-4 bg-purple-300 hover:bg-purple-400 text-white rounded' onClick={()=>router.push('/admin/orders-list')}>Orders List</button>
        <button className='mb-4 ml-4 bg-orange-400 hover:bg-orange-500 text-black rounded' onClick={()=>router.push('/admin/chart')}>Bar Chart</button>
        <button className='mb-4 ml-4 bg-pink-400 hover:bg-pink-500 text-white rounded' onClick={()=>router.push('/admin/pieChart')}>Pie Chart</button>
      </nav>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentItems.map((item,index) => (
          <article
            id = 'item-article'
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
            <p className='font-italic text-lg'>Quantity: {item.quantity}</p>
            <button
              onClick={() => ItemDelete(item.id)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Delete Item <TrashIcon />
            </button>
            <button
              onClick={() => handleViewItem(item.id)}
              className="ml-5 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              View Item <DetailsIcon />
            </button>
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