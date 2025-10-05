import WishList from "@/components/wish/Wishlist";
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
    title: t.metadata.wishTitle,
    description: t.metadata.wishDescription,
    keywords: [
      'TechMart', 'wishlist', 'saved items','favorites', 'shopping list', 'تيك مارت', 'قائمة الأمنيات', 'المنتجات المحفوظة','المفضلة','لائحة التسوق', 'טקמארט', 'רשימת המשאלות', 'מוצרים שמורים','המועדפים','רשימת קניות'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.wishTitle,
      description: t.metadata.wishDescription,
      url: "https://techmart.com/'wish'",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/wish"
    }

  };
}

export default function WishListPage(){
  return <WishList />
}