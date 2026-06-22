// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';

// Define your supported languages cleanly
const locales = ['en', 'he', 'ar'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 💡 NEXT.JS 16 CORE RULE: Instantly bypass static assets, public folder items, and database APIs
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Determine user language preferences safely
  const acceptLang = request.headers.get('Accept-Language')?.split(',')[0] || defaultLocale;
  const lang = acceptLang.split('-')[0]; // Normalize 'he-IL' → 'he' or 'ar-EG' → 'ar'

  // If the path doesn't start with a localized prefix, route to it
  if (!pathname.startsWith(`/${lang}`)) {
    return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
  }

  return NextResponse.next();
}

// Ensure the Next.js 16 proxy matcher catches all routes except core engine scripts
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};