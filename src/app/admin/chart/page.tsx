import AdminBarChart from "@/components/admin/AdminBarChart";
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
    title: t.metadata.barChartTitle,
    description: t.metadata.barChartDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'bar chart', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'رسم اعمدة بياني', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'גרף ברים', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: t.metadata.barChartTitle,
      description: t.metadata.barChartDescription,
      url: "https://techmart.com/admin/chart",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/admin/chart"
    }

  };
}

export default function AdminBarChartPage(){
  return <AdminBarChart />
}