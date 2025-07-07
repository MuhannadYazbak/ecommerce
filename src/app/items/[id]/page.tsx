import type { Metadata } from 'next';
import ItemView from '@/components/itemview/ItemById';

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const res = await fetch(`http://localhost:3000/api/items/${params.id}`);
    const item = await res.json();
    console.log('Metadata response: ', item);

    // Check for error in response
    const hasError = item?.error;
    const name = !hasError && item.name ? item.name : `Item #${params.id}`;
    const description = !hasError && item.description
      ? item.description
      : `Explore item #${params.id} at TechMart.`;

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

export default function ItemPage({ params }: Params) {
  return <ItemView itemId={params.id} />;
}