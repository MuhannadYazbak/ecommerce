import type { Metadata } from 'next';
import ResetPassword from '@/components/reset-password/ResetPassword';
import { headers } from 'next/headers';
import { getTranslationByLang } from '@/utils/i18nBackend';

type Params = { params: Promise<{ tokenId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const requestHeaders = await headers()
    const acceptLang = requestHeaders.get('accept-language') || 'en'
    console.log('acceptLang: ', acceptLang); 
    const lang = acceptLang.split(',')[0].split('-')[0];
    const t = getTranslationByLang(lang);  
  if (process.env.SKIP_DB === 'true') {
    return {
      title: `TechMart | Reset Password ${(await params).tokenId}`,
      description: 'Reset your password securely',
    };
  }
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/metadata/${(await params).tokenId}`);
    if (!res.ok) {
      console.error('Metadata fetch failed:', res.status);
      return { 
        title: t.metadata.resetPasswordTitle,
        description: t.metadata.resetPasswordDescription
       }
    }

    const data = await res.json();
    return {
      title: `${t.metadata.resetPasswordTitle} for ${data.email}`,
      description: t.metadata.resetPasswordDescription,
    };
  } catch (err) {
    console.error('Failed to fetch metadata:', err);
    return { title: t.metadata.registerTitle, description: t.metadata.resetPasswordDescription }; // fallback
  }
}

export default async function ResetPasswordPage({ params }: Params) {
  return <ResetPassword tokenId={(await params).tokenId} />;
}