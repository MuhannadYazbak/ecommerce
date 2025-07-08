'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import BackButton from '@/components/ui/BackButton';

const ItemsPieChart = dynamic(() => import('@/components/PieChart'), { ssr: false });

export default function AdminPieChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate.toString());
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/pie?date=${selectedDate}`) 
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Chart data fetch failed:', err))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <main className="container p-6">
      <header className='flex w-full justify-center'>
        <h1 className="text-2xl font-semibold mb-4">🥧 Purchased Items Breakdown</h1>
      </header>
      <nav className='flex flex-row space-x-4'>
      <BackButton />
      <input type='date' className='border -[3pt] border-solid border-black' value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)}/>
      <h2>showing pie for ${selectedDate}</h2>
      </nav>
      {loading ? <p>Loading chart...</p> : <ItemsPieChart data={data} />}
    </main>
  );
}