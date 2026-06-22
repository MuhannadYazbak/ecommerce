import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 💡 THE PRODUCTION FIX: Completely skip internal Next.js assets, public images, and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // Skips files like .png, .jpg, .css
  ) {
    return NextResponse.next();
  }

  const acceptLang = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
  const lang = acceptLang.split('-')[0]; // Normalize 'he-IL' → 'he'

  // If no locale prefix, redirect to one safely
  if (!pathname.startsWith(`/${lang}`)) {
    return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
  }

  return NextResponse.next();
}

// 💡 Guard your middleware paths strictly
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};