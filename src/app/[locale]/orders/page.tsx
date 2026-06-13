import OrderHistory from "@/components/orders/OrdersHistory";
import { headers } from 'next/headers';
import { getTranslationByLang } from '@/utils/i18nBackend';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const requestHeaders = await headers()
  const acceptLang = requestHeaders.get('accept-language') || 'en'
  console.log('acceptLang: ', acceptLang); 
  const lang = acceptLang.split(',')[0].split('-')[0];
  const t = getTranslationByLang(lang);
  return {
    title: t.metadata.ordersTitle,
    description: t.metadata.ordersDescription,
    keywords: [
      'TechMart', 'orders', 'orders history', 'purchase record', 'تيك مارت', 'طلبيات', 'سجل الطلبيات', 'سجل المشتريات', 'טקמארט', 'הזמנות', 'הסיטוריית ההזמנות', 'רשימת הקניות'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.ordersTitle,
      description: t.metadata.ordersDescription,
      url: "https://techmart.com/orders",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/orders"
    }

  };
}

export default function OrdersHistoryPage() {
  return <OrderHistory />
}