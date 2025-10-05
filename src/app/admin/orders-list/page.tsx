import AdminOrderslist from "@/components/admin/AdminOrderslist";
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
    title: t.metadata.ordersListTitle,
    description: t.metadata.ordersListDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'orders list', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'قائمة الطلبيات', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'רשימת ההזמנות', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: t.metadata.ordersListTitle,
      description: t.metadata.ordersListDescription,
      url: "https://techmart.com/admin/items/orders-list",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/admin/items/orders-list"
    }

  };
}

export default function AdminOrderslistPage(){
  return <AdminOrderslist />
}