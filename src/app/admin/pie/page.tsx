'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ItemsPieChart = dynamic(() => import('@/components/PieChart'), { ssr: false });

export default function ChartPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/pie?date=${selectedDate}`) 
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Chart data fetch failed:', err))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🥧 Purchased Items Breakdown</h1>
      <button className='bg-blue-400 hover:bg-blue-500 text-white rounded mr-10' onClick={()=>router.back()}>Back</button>
      <input type='date' className='border -[3pt] border-solid border-black' value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)}/>
      <h2>showing pie for ${selectedDate}</h2>
      {loading ? <p>Loading chart...</p> : <ItemsPieChart data={data} />}
    </div>
  );
}