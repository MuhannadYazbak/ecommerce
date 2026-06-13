import ForgotPassword from '@/components/forgotPassword/forgotPassword';
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
    title: t.metadata.forgotPasswordTitle,
    description: t.metadata.forgotPasswordDescription,
    keywords: [
      'TechMart', 'personalized shopping', 'reset password', 'forgot password', 'تيك مارت', 'تجربة شراء شخصية', 'استرجاع كلمة السر', 'نسيت كلمة السر', 'טקמארט', 'חוויה קנייה מותאמת', 'שחזור סיסמה', 'שכחתי סיסמה'
    ].join(', '),
    robots: {
      index: true,
      follow: true,
    },
    openGraph : {
      title: t.metadata.forgotPasswordTitle,
      description: t.metadata.forgotPasswordDescription,
      url: "https://techmart.com/forgotPassword",
      siteName: 'TechMart'
    },
    alternates: {
      canonical: "https://techmart.com/forgotPassword"
    }

  };
}

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}