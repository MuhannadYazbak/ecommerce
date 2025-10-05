import Register from '@/components/register/Register';
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
    title: t.metadata.registerTitle,
    description: t.metadata.registerDescription,
    keywords: [
      'TechMart', 'ecommerce', 'register', 'تيك مارت', 'تسوق الكتروني', 'تسجيل', 'טקמארט', 'אתר קניות', 'הרשמה'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.registerTitle,
      description: t.metadata.registerDescription,
      url: "https://techmart.com/register",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/register"
    }

  };
}

export default function RegisterPage() {
  return <Register />;
}