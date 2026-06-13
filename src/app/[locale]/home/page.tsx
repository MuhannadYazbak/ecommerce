import LoggedInHome from '@/components/home/Home';
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
    title: t.metadata.homeTitle,
    description: t.metadata.homeDescription,
    keywords: [
      'TechMart', 'personalized shopping', 'wish list', 'tech deals','user profile','best tech', 'تيك مارت', 'تجربة شراء شخصية', 'قائمة الأمنيات', 'صفقات تقنية','واجهة المستخدم','افضل التقنيات', 'טקמארט', 'חוויה קנייה מותאמת', 'רשימת המשאלות', 'הצעות טכניות','פרופיל המשתמש','טכנולוגיות חדשניות'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.homeTitle,
      description: t.metadata.homeDescription,
      url: "https://techmart.com/home",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/home"
    }

  };
}

export default function HomePage() {
  return <LoggedInHome />;
}