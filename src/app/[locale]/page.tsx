import HomeLanding from '@/components/landing/Homelanding';
import { getTranslationByLang } from '@/utils/i18nBackend';

// 💡 Force the page to render dynamically on the server so it can fetch the fresh Aiven DB data
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

// Replace your generateMetadata inside src/app/[locale]/page.tsx completely with this:
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; // Read the actual route folder parameter cleanly!
  const t = getTranslationByLang(locale || 'en');
  
  return {
    title: t.metadata?.landingTitle || "TechMart",
    description: t.metadata?.landingDescription || "Your one-stop shop for gadgets!",
    keywords: [
      'TechMart', 'ecommerce', 'personalized shopping', 'تيك مارت', 'تسوق الكتروني', 'تجربة تسوق ملائمة شخصيا', 'טקמארט', 'אתר קניות', 'חווית קניות מותאמת אישית'
    ].join(', '),
    robots: { index: true, follow: true },
    openGraph: {
      title: t.metadata?.landingTitle || "TechMart",
      description: t.metadata?.landingDescription || "Your one-stop shop for gadgets!",
      url: `https://ecommerce-t7tm.vercel.app/${locale}`,
      siteName: 'TechMart'
    },
    alternates: { canonical: `https://ecommerce-t7tm.vercel.app/${locale}` }
  };
}

export default async function HomePage({ params }: Props) {
  // Unwrapping the locale parameter safely from the router promise
  const { locale } = await params;
  console.log("🚀 Server component successfully routed to locale target:", locale);

  return <HomeLanding />;
}