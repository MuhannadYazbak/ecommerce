import Checkout from '@/components/checkout/Checkout';
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
    title: t.metadata.checkoutTitle,
    description: t.metadata.checkoutDescription,
    keywords: [
      'TechMart', 'secure payment', 'checkout', 'online shopping', 'ecommre', 'تيك مارت', 'دفع آمن', 'حساب', 'تسوق الكتروني', 'موقع تسوق', 'טקמארט', 'תשלום מאובטח', 'חיוב', 'קנייה אונליין ', 'אתר קניות'
    ].join(', ')

  };
}

export default function CheckoutPage(){
  return <Checkout />
}