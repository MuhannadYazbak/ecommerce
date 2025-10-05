import AdminDashboard from "@/components/admin/AdminDashboard";
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
    title: t.metadata.itemsTitle,
    description: t.metadata.itemsDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'manage products', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'التحكم بالمنتجات', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'ניהול המוצרים', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: t.metadata.itemsTitle,
      description: t.metadata.itemsDescription,
      url: "https://techmart.com/admin/items/",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/admin/items/"
    }

  };
}

export default function AdminDashboardPage(){
  return <AdminDashboard />
}