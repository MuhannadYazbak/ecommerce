import Cart from '@/components/cart/Cart';
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
    title: t.metadata.cartTitle,
    description: t.metadata.cartDescription,
    keywords: [
      'TechMart', 'تيك مارت', 'טקמארט',
      'cart', 'عربة تسوق', 'סל קניות',
      'manage your items before secured checkout',
      'تحكم بمنتجاتك قبل الانتقال الى عملية الشراء الآمنة',
      'תשלוט במוצרים שלך לפני מעבר לתהליך רכשיה מאובטח'
    ].join(', ')

  };
}

export default function CartPage() {
  return <Cart />;
}
