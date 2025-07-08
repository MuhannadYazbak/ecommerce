'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ChartData } from '@/components/BarChart'
import BackButton from '@/components/ui/BackButton';


const OrderBarChart = dynamic(() => import('@/components/BarChart'));

export default function AdminBarChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/chart') // ← Replace with your actual chart API route
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Chart data fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container p-6">
      <header>
        <h1 className="text-2xl font-semibold mb-4">📊 Orders by Date Bar Chart</h1>
      </header>
      <nav>
        <BackButton />
      </nav>
      {loading ? <p>Loading chart...</p> : <OrderBarChart data={data} />}
    </main>
  );
}