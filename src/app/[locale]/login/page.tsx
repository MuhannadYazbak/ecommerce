import Login from '@/components/login/Login';
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
    title: t.metadata.loginTitle,
    description: t.metadata.loginDescription,
    keywords: [
      'TechMart', 'personalized shopping', 'ecommerce', 'login', 'تيك مارت', 'تجربة شراء شخصية', 'تسوق الكتروني', 'دخول', 'טקמארט', 'חוויה קנייה מותאמת', 'אתר קניות', 'התחברות'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.loginTitle,
      description: t.metadata.loginDescription,
      url: "https://techmart.com/login",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/login"
    }

  };
}

export default function LoginPage(){
  return <Login />
}