'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Wishlist } from '@/types/wish';
import BackButton from '@/components/ui/BackButton';
import TrashIcon from '../ui/TrashIcon';

export default function WishList() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/wish?userId=${user?.id}`);
        //console.log('Raw response = ', response.text());
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch wishlist');
        }

        const data = await response.json();
        //console.log('data = ',data);
        setWishlist(Array.isArray(data) ? data : []);
        console.log('Wishlist fetched:', Array.isArray(data) ? data : []);
        console.log('Wishlist for ',user?.id,' ',user?.name, ' is: ',wishlist);
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
        <h1>You must be logged in to view your wishlist.</h1>
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
    <main className="container mx-auto px-4 py-8">
      <header className='flex w-full justify-center' id='wish-heading'>
        <h1 className="text-3xl font-bold mb-6" aria-label='wish-heading' >Your Wishlist</h1>
      </header>
      
      {wishlist.length === 0 ? (
        <section className='relative'>
        <h2 className="text-center text-gray-600 italic">
          Looks like you're not wishing for anything yet. Start browsing and add your favorites!
        </h2>
        </section>
      ) : (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold mb-4">You have {wishlist.length} item(s) wished</h2>
          {wishlist.map((item,index) => (
            
            <article key={`${item.item_id}-${index}`} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.item_name}</h3>
                  <p className="text-sm text-gray-500">
                    Added on {new Date(item.wished_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p className="font-bold">Item ID: {item.item_id}</p>
                <button className='bg-green-400 hover:bg-green-600 text-white rounded mr-4' onClick={()=>router.push(`/items/${item.item_id}`)}>View/Purchase</button>
                <button className='bg-red-400 hover:bg-red-600 text-white' onClick={()=>handleRemove(item.item_id)}>remove <TrashIcon /></button>
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