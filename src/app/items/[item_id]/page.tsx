import type { Metadata } from 'next';
import ItemView from '@/components/itemview/ItemById';
import { headers } from 'next/headers';
import { getTranslationByLang } from '@/utils/i18nBackend';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ item_id: string }> };


export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const requestHeaders = await headers();
  const acceptLang = requestHeaders.get('accept-language') || 'en';
  const lang = acceptLang.split(',')[0].split('-')[0];
  const t = getTranslationByLang(lang);
  const id = (await params).item_id;
  const res = await fetch(`${process.env.BASE_URL}/api/items/${id}`, {
    headers: {
      'Accept-Language': lang
    }
  })
  const item = await res.json();

  if (process.env.SKIP_DB === 'true') {
    const mockItem = {
      name: t.metadata.mockName,
      description: t.metadata.mockDescription, // ✅ Translated mock description
    };

    return {
      title: `${t.techMart} | ${mockItem.name}`,
      description: mockItem.description,
      keywords: [mockItem.name, t.metadata.keywords].join(', '),
    };
  }

  try {
    const hasError = item?.error;
    const name = !hasError && item.name ? item.name : `${t.metadata.fallbackName} #${id}`;
    const description = !hasError && item.description
      ? item.description
      : `${t.metadata.fallbackDescription} #${id}`;

    return {
      title: `${t.techMart} | ${name}`,
      description: description,
      keywords: [name, t.metadata.keywords].join(', '),
    };
  } catch (err) {
    console.error("Failed to fetch item metadata:", err);
    return {
      title: `${t.techMart} | ${t.metadata.notFoundTitle}`,
      description: t.metadata.notFoundDescription,
      keywords: [t.metadata.notFoundTitle, t.metadata.keywords].join(', '),
    };
  }
}

export default async function ItemPage({ params }: Params) {
  return <ItemView itemId={(await params).item_id} />;
}