'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Wishlist } from '@/types/wish';

export default function WishListPage() {
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
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch wishlist');
        }

        const data = await response.json();
        setWishlist(Array.isArray(data) ? data : []);
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
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p>You must be logged in to view your wishlist.</p>
        <button 
          className="text-blue-500 hover:underline"
          onClick={() => router.push('/login')}
        >
          Go to Login
        </button>
      </div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="space-y-6">
          {wishlist.map((item) => (
            <div key={item.item_id} className="border rounded-lg p-4 shadow-sm">
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
                <button className='bg-red-400 hover:bg-red-600 text-white'>remove</button>
              </div>
            </div>
          ))}
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}