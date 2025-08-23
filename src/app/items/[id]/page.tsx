import type { Metadata } from 'next';
import ItemView from '@/components/itemview/ItemById';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/items/${(await params).id}`);
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