import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'he', 'ar'];
const defaultLocale = 'en';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 💡 HARD GUARD: Force absolute bypass for any Next.js core framework files,
  // chunks, static assets, or files with extensions before checking locales.
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

    const url = req.nextUrl.clone();
    url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
    
    const response = NextResponse.redirect(url);
    response.cookies.set('lang', lang);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};