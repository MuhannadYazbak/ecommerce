// src/app/page.tsx
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'; // 💡 Prevents static pre-rendering glitches!

export default function RootPageFallback() {
  redirect('/en'); // Default landing locale
}