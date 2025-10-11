import AdminEditItem from "@/components/admin/AdminEditItem";
import { headers } from 'next/headers';
import { getTranslationByLang } from '@/utils/i18nBackend';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ item_id: string }> };

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const requestHeaders = await headers()
  const acceptLang = requestHeaders.get('accept-language') || 'en'
  console.log('acceptLang: ', acceptLang); 
  const lang = acceptLang.split(',')[0].split('-')[0];
  const t = getTranslationByLang(lang);
  const item_id = (await params).item_id
  const res = await fetch(`${process.env.BASE_URL}/api/items/${item_id}`, {
    headers: {
      'Accept-Language': lang
    }
  })
  const item = await res.json();
  
  return {
    title: `${t.metadata.editItemTitle} | ${item.name}`,
    description: t.metadata.editItemDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'manage products', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'التحكم بالمنتجات', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'ניהול המוצרים', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: `${t.metadata.editItemTitle} ${item_id}`,
      description: t.metadata.editItemDescription,
      url: `https://techmart.com/admin/items/${item_id}`,
      siteName: 'TechMart'
    },
    alternates: {
      canonical: `https://techmart.com/admin/items/${item_id}`
    }

  };
}

export default function AdminEditItemPage(){
  return <AdminEditItem />
}