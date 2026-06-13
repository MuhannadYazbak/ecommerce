import AdminByFullName from '@/components/admin/AdminByFullName';
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
    title: t.metadata.byfullnameTitle,
    description: t.metadata.byfullnameDescription,
    keywords: [
      'TechMart', 'Admin Dashboard', 'By full name visuals', 'ecommerce analytics','store management','تيك مارت', 'لوحة تحكم الادمين', 'رسوم بيانية للادمين حسب الاسم الكامل', 'تحليل بيانات التسوق الالكتروني', 'ادارة المتجر الالكتروني', 'טקמארט', 'דשבורד של האדמן', 'גרפים לאדמן לפי שם מלא', 'ניתוח נתוני קניות אונליין','ניהול חנות אלקטרונית'
    ].join(', '),
    robots: {
      index: false,
      follow: false,
    },
    openGraph : {
      title: t.metadata.byfullnameTitle,
      description: t.metadata.byfullnameDescription,
      url: "https://techmart.com/admin/byFullname",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/admin/byFullname"
    }

  };
}

export default function AdminByFullNamePage() {
  return <AdminByFullName />;
}