import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'he', 'ar'];
const defaultLocale = 'en';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. HARD BLOCKER: If it's a framework asset, api route, or static public file, skip IMMEDIATELY.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Check if the current pathname is missing a locale prefix
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const acceptLanguage = req.headers.get('Accept-Language');
    let lang = defaultLocale;

    if (acceptLanguage) {
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
      if (locales.includes(preferredLang)) {
        lang = preferredLang;
      }
    }

    // 💡 THE CRITICAL FIX: Use NextResponse.rewrite instead of NextResponse.redirect
    // This tells Vercel's edge network to route the page internally to the local folder 
    // without executing a hard browser-level URL redirect that breaks chunk paths.
    const url = new URL(`/${lang}${pathname === '/' ? '' : pathname}`, req.url);
    
    const response = NextResponse.rewrite(url);
    response.cookies.set('lang', lang);
    return response;
  }

  return NextResponse.next();
}

// 3. Strict Matcher to catch clean routes only
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};