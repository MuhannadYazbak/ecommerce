'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trans, useTranslation } from 'react-i18next';
import { Wishlist } from '@/types/wish';
import BackButton from '@/components/ui/BackButton';
import TrashIcon from '../ui/TrashIcon';

export default function WishList() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/wish?userId=${user?.id}`, {
          headers: {
            'Accept-Language': i18n.language.split('-')[0] || 'en'
          }
        });
        //console.log('Raw response = ', response.text());
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch wishlist');
        }

        const data = await response.json();
        //console.log('data = ',data);
        setWishlist(Array.isArray(data) ? data : []);
        console.log('Wishlist fetched:', Array.isArray(data) ? data : []);
        console.log('Wishlist for ',user?.id,' ',user?.fullname, ' is: ',wishlist);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user?.id, ready]);

  if (!ready || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center h-64 gap-4">
        <h1>{t('accessDenied')}</h1>
        <button onClick={() => router.push('/login')}>{t('login')}</button>
        <BackButton />
      </main>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">Error: {error}</p>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  const handleRemove = async (itemId: number) => {
  try {
    const response = await fetch('/api/wish', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.id, item_id: itemId }),
    });

    if (!response.ok) throw new Error('Failed to delete');

    setWishlist(prev => prev.filter(item => item.item_id !== itemId));
  } catch (err) {
    console.error('Removal error:', err);
  }
};

  return (
    <main className="container mx-auto px-4 py-8" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}>
      <header className='flex w-full justify-center' id='wish-heading'>
        <h1 className="text-3xl font-bold mb-6" aria-label='wish-heading' >{t('myWishlist')}</h1>
      </header>
      
      {wishlist.length === 0 ? (
        <section className='relative'>
        <h2 aria-label='Empty Wishlist' className="text-center text-gray-600 italic">
          {t('emptyWishlist')}
        </h2>
        </section>
      ) : (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold mb-4">
            <Trans i18nKey="wishCount" values={{ length: wishlist.length }} /></h2>
            {/* You have {wishlist.length} item(s) wished</h2> */}
          {wishlist.map((item,index) => (
            
            <article role='wishlist item' key={`${item.item_id}-${index}`} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.item_name}</h3>
                  <p className="text-sm text-gray-500">
                    {t('addedOn')} {new Date(item.wished_at).toLocaleDateString(i18n.language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p className="font-bold">{t('itemID')}: {item.item_id}</p>
                <button className='bg-green-400 hover:bg-green-600 text-white rounded mr-4' onClick={()=>router.push(`/items/${item.item_id}`)}> {t('viewPurchase')} </button>
                <button className='bg-red-400 hover:bg-red-600 text-white' onClick={()=>handleRemove(item.item_id)}>{t('remove')} <TrashIcon /></button>
              </div>
            </article>
          ))}
        </section>
      )}
      <nav className='flex w-full justify-center'>
        <BackButton />
      </nav>
    </main>
  );
}