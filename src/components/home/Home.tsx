'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Item } from '@/types/item';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import BackButton from '../ui/BackButton';
import WishIcon from '../ui/WishIcon';
import DetailsIcon from '../ui/DetailsIcon';
import SoldOut from '../ui/SoldOut';

type SortOption = 'id' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a';
export default function LoggedInHome() {
    const router = useRouter();
    const { user, ready } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [wishedItems, setWishedItems] = useState<number[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>('id');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Adjust this number as needed
    const filteredAndSortedItems = [...items]
        .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortOption) {
                case 'id':
                    return a.id - b.id;
                case 'price-low-high':
                    return a.price - b.price;
                case 'price-high-low':
                    return b.price - a.price;
                case 'name-a-z':
                    return a.name.localeCompare(b.name);
                case 'name-z-a':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

    // Client-side pagination (if loading all items at once):
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

    useEffect(() => {
        if (ready && !user) {
            router.push('/');
        }
    }, [ready, user]);


    useEffect(() => {
        const fetchItems = async () => {
            const res = await fetch(`/api/items?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await res.json();
            setItems(data);
        };
        fetchItems();
    }, []);

    if (!ready) return null; // Wait until auth check is ready
    const handleViewItem = (id: number) => {
        router.push(`/items/${id}`);
    };
    const addWish = async (item: any) => {
        try {
            const res = await fetch('/api/wish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    item_id: item.id,
                    item_name: item.name,
                }),
            });
            console.log('wish client response = ', res);
            setWishedItems(prev => [...prev, item.id]);

        } catch (err) {
            console.error('🔥 Payment error:', err);
            alert('Something went wrong.');
        }
    };
    return (
        <main className=' max-w-xl mx-auto' >

            <header className="flex justify-start items-center pb-3">
                <h1 className="md:text-3xl font-bold mb-4 text-center">
                    Welcome to Your TechMart Dashboard
                </h1>
            </header>
            <section className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <input
                    type="text"
                    placeholder="Search products..."
                    aria-label='search keyword'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64"
                />
                <div className="relative w-full sm:w-48">
                    <select
                        aria-label='sort results'
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                    >
                        <option value="id">Item ID</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="name-a-z">Name: A to Z</option>
                        <option value="name-z-a">Name: Z to A</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
                <nav aria-label="User actions" className="flex gap-4" role='cart&wish'>
                    <button aria-label='Orders History' className='bg-yellow-500 hover:bg-yellow-600 text-white rounded ml-4' onClick={() => router.push('/orders')}>Orders History</button>
                    <button aria-label='WishList' className='bg-green-300 hover:bg-green-500 text-black rounded ml-4' onClick={() => router.push('/wish')}>Wishlist</button>
                </nav>
            </section>
            {currentItems.length > 0 ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentItems.map((item, index) => (
                        <article key={`${item.id}-${index}`} className="relative border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition-transform hover:scale-105">
                            {item.quantity === 0 ? <SoldOut /> : ''}
                            <div className="flex aspect-[16/9] overflow-hidden">
                                <Image
                                    width={300}
                                    height={200}
                                    loading='lazy'
                                    src={item.photo}
                                    alt={item.name}
                                    className="w-full object-contain bg-white p-2 rounded"
                                />

                            </div>
                            <h2 className="font-semibold">{item.name}</h2>
                            {/* <p className="text-gray-600 mb-2">{item.description}</p> */}
                            <p className="text-blue-600 font-bold text-lg">₪{item.price}</p>
                            <nav className='flex flex-row h-auto w-full'>
                                <button
                                    onClick={() => handleViewItem(item.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                >
                                    View Details<DetailsIcon />
                                </button>
                                <button
                                    className={`ml-4 px-1 py-1 rounded ${wishedItems.includes(item.id)
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-400 hover:bg-gray-500 text-red'
                                        }`}
                                    onClick={() => addWish(item)}
                                >
                                    {wishedItems.includes(item.id) ? 'Wished' : 'Wish'} <WishIcon />
                                </button>
                            </nav>
                        </article>
                    ))}
                </section>
            ) : (
                <section className="text-center text-gray-500 mt-6">
                    <p>No items found for "{searchQuery}". Try another keyword.</p>
                </section>
            )}

            {totalPages > 1 && (
                <div className='mt-8 flex justify-center'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: SetStateAction<number>) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </div>
            )}
            <footer className='flex w-full justify-center mt-4'>
                <BackButton />
            </footer>
        </main>
    );
}