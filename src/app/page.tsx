import HomeLanding from '@/components/landing/Homelanding';
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
    title: t.metadata.landingTitle,
    description: t.metadata.landingDescription,
    keywords: [
      'TechMart', 'ecommerce', 'personalized shopping', 'تيك مارت', 'تسوق الكتروني', 'تجربة تسوق ملائمة شخصيا', 'טקמארט', 'אתר קניות', 'חווית קניות מותאמת אישית'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.landingTitle,
      description: t.metadata.landingDescription,
      url: "https://techmart.com/",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/"
    }

  };
}

export default function HomePage(){
  return <HomeLanding />
}