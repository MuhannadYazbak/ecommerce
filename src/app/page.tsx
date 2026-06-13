// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPageFallback() {
  // Gracefully fall back to the default locale path
  redirect('/en');
}