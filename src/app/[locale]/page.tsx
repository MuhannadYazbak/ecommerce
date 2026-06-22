// src/app/[locale]/page.tsx
import HomeLanding from '@/components/landing/Homelanding';
import { headers } from 'next/headers';
import { getTranslationByLang } from '@/utils/i18nBackend';


export const dynamic = 'force-dynamic';

// 1. Inform Next.js which paths are statically safe to generate
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'he' },
    { locale: 'ar' }
  ];
}

export async function generateMetadata() {
  const requestHeaders = await headers();
  const acceptLang = requestHeaders.get('accept-language') || 'en';
  console.log('acceptLang: ', acceptLang); 
  const lang = acceptLang.split(',')[0].split('-')[0];
  const t = getTranslationByLang(lang);
  
  return {
    title: t.metadata?.landingTitle || "TechMart",
    description: t.metadata?.landingDescription || "Your one-stop shop for gadgets!",
    keywords: [
      'TechMart', 'ecommerce', 'personalized shopping', 'تيك مارت', 'تسوق الكتروني', 'تجربة تسوق ملائمة شخصيا', 'טקמארט', 'אתר קניות', 'חווית קניות מותאמת אישית'
    ].join(', '),
    robots: { index: true, follow: true },
    openGraph : {
      title: t.metadata?.landingTitle || "TechMart",
      description: t.metadata?.landingDescription || "Your one-stop shop for gadgets!",
      url: "https://techmart.com/",
      siteName: 'TechMart'
    },
    alternates: { canonical: "https://techmart.com/" }
  };
}

// 2. Accept params as a Promise (Mandatory in Next.js 16)
type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  // Unwrapping the locale parameter safely from the router promise
  const { locale } = await params;
  console.log("Current routed locale target:", locale);

  return <HomeLanding />;
}