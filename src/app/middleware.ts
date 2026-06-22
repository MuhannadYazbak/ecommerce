// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const lang = req.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0] || 'en';
//   const res = NextResponse.next();
//   res.cookies.set('lang', lang);
//   return res;
// }

import { NextRequest, NextResponse } from 'next/server';

// 1. Define your supported locales
const locales = ['en', 'he', 'ar'];
const defaultLocale = 'en';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 2. Check if the current pathname is missing a locale prefix
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Determine the preferred language from headers or default
    const acceptLanguage = req.headers.get('Accept-Language');
    let lang = defaultLocale;

    if (acceptLanguage) {
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
      if (locales.includes(preferredLang)) {
        lang = preferredLang;
      }
    }

    // Rewrite the URL to include the locale prefix internally (e.g., / -> /en)
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
    
    const response = NextResponse.redirect(url);
    response.cookies.set('lang', lang);
    return response;
  }

  // If a locale is already present in the URL, just proceed normally
  return NextResponse.next();
}

// 3. Ensure the middleware ignores static assets, images, and API routes
// Ensure the middleware completely ignores static assets, frameworks, and chunks
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (your custom public/images folder)
     * - favicon.ico (favicon file)
     *    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
     */
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};