import type { Metadata } from 'next';
import ResetPassword from '@/components/reset-password/ResetPassword';
import { cache } from 'react';

type Params = { params: Promise<{ tokenId: string }> };

// export async function generateMetadata({ params }: Params): Promise<Metadata> {
//   if (process.env.SKIP_DB === 'true') {
//     return {
//       title: `TechMart | Reset Password ${(await params).tokenId}`,
//       description: 'Reset your password securely',
//     };
//   }
//   try {
//     const res = await fetch(`${process.env.BASE_URL}/api/auth/reset-password/${(await params).tokenId}`, { cache: 'no-store' });
//     const item = await res.json();
//     console.log('Metadata response: ', item);

//     return {
//       title: `TechMart | Reset Password ${(await params).tokenId}`,
//       description: 'Reset your password securely',
//     };
//   } catch (err) {
//     console.error("Failed to fetch email metadata:", err);
//     return {
//       title: `TechMart | Email Not Found`,
//       description: `Sorry, this email doesn't seem to exist. Please check back later.`,
//     };
//   }
// }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
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
      return { title: 'Reset Password' }; // fallback metadata
    }

    const data = await res.json();
    return {
      title: `Reset Password for ${data.email}`,
      description: 'Securely reset your password',
    };
  } catch (err) {
    console.error('Failed to fetch metadata:', err);
    return { title: 'Reset Password' }; // fallback
  }
}

export default async function ResetPasswordPage({ params }: Params) {
  return <ResetPassword tokenId={(await params).tokenId} />;
}