'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import BackButton from '@/components/ui/BackButton';

const ItemsPieChart = dynamic(() => import('@/components/PieChart'), { ssr: false });

export default function AdminPieChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate.toString());
  const { user } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation()

  useEffect(() => {
    fetch(`/api/admin/pie?date=${selectedDate}`) 
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Chart data fetch failed:', err))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  if (!user || user.role !== 'admin') {
    return <p role='adminOnly' className="text-red-600">{t('adminOnly')}</p>;
  }

  return (
    <main className="container p-6" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <header className='flex w-full justify-center'>
        <h1 className="text-2xl font-semibold mb-4 text-indigo-500">🥧 {t('adminPieChartTitle')}</h1>
      </header>
      <nav className='flex flex-row space-x-4'>
      <BackButton />
      <input type='date' className='border -[3pt] border-solid border-black' value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)}/>
      <h2 role='showingPieFor'>{t('showingFor')} ${selectedDate}</h2>
      </nav>
      {loading ? <p role='loading'>{t('loading')}</p> : <ItemsPieChart data={data} />}
    </main>
  );
}