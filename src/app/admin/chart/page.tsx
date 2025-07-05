'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ChartData } from '@/components/BarChart'


const OrderBarChart = dynamic(() => import('@/components/BarChart'));

export default function ChartPage() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/chart') // ← Replace with your actual chart API route
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Chart data fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📊 Orders Overview</h1>
      {loading ? <p>Loading chart...</p> : <OrderBarChart data={data} />}
    </div>
  );
}