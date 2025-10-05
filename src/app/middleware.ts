import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const lang = req.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0] || 'en';
  const res = NextResponse.next();
  res.cookies.set('lang', lang);
  return res;
}