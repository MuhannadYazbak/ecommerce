import type { Metadata } from 'next';
import ItemView from '@/components/itemview/ItemById';
import { cache } from 'react';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  if (process.env.SKIP_DB === 'true') {
    const mockItem = {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Great High-end Android phone with 200MP camera and S Pen.',
    };

    return {
      title: `TechMart | ${mockItem.name}`,
      description: mockItem.description,
    };
  }
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/items/${(await params).id}`, { cache: 'no-store' });
    const item = await res.json();
    console.log('Metadata response: ', item);

    // Check for error in response
    const hasError = item?.error;
    const name = !hasError && item.name ? item.name : `Item #${(await params).id}`;
    const description = !hasError && item.description
      ? item.description
      : `Explore item #${(await params).id} at TechMart.`;

    return {
      title: `TechMart | ${name}`,
      description: description,
    };
  } catch (err) {
    console.error("Failed to fetch item metadata:", err);
    return {
      title: `TechMart | Item Not Found`,
      description: `Sorry, this item doesn't seem to exist. Please check back later.`,
    };
  }
}

export default async function ItemPage({ params }: Params) {
  return <ItemView itemId={(await params).id} />;
}