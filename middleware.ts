import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptLang = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
  const lang = acceptLang.split('-')[0]; // Normalize 'he-IL' → 'he'

  const pathname = request.nextUrl.pathname;

  // If no locale prefix, redirect to one
  if (!pathname.startsWith(`/${lang}`)) {
    return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
  }

  return NextResponse.next();
}