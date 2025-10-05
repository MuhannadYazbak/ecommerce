import OrderEdit from "@/components/admin/AdminOrderEdit";
import { headers } from 'next/headers';
import { getTranslationByLang } from '@/utils/i18nBackend';
import { Metadata } from "next";
type Params = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const requestHeaders = await headers()
  const acceptLang = requestHeaders.get('accept-language') || 'en'
  console.log('acceptLang: ', acceptLang); 
  const lang = acceptLang.split(',')[0].split('-')[0];
  const t = getTranslationByLang(lang);
  const id = (await params).id
  return {
    title: `${t.metadata.adminOrdersTitle} ${id}`,
    description: t.metadata.adminOrdersDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'order edit', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'تعديل طلبية', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'עדכון הזמנה', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: `${t.metadata.adminOrdersTitle} ${id}`,
      description: t.metadata.adminOrdersDescription,
      url: `https://techmart.com/admin/orders/${id}`,
      siteName: 'TechMart'
    },
    alternates: {
      canonical: `https://techmart.com/admin/orders/${id}`
    }

  };
}

export default function AdminOrderEditPage(){
  return <OrderEdit />
}