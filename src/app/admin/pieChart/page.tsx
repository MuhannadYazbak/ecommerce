import AdminPieChart from "@/components/admin/AdminPieChart";
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
    title: t.metadata.pieChartTitle,
    description: t.metadata.pieChartDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'pie chart', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'رسم فطيرة بياني', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'גרף פיי', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: t.metadata.pieChartTitle,
      description: t.metadata.pieChartDescription,
      url: "https://techmart.com/admin/pie",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/admin/pie"
    }

  };
}

export default function AdminPieChartPage(){
  return <AdminPieChart />
}