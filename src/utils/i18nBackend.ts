import en from '@/locales/en/translation.json';
import ar from '@/locales/ar/translation.json';
import he from '@/locales/he/translation.json';
import { NextRequest } from 'next/server';

const translations = { en, ar, he };
export type LangCode = keyof typeof translations;

export function getTranslation(req: Request | NextRequest) {
  const lang = req.headers.get('Accept-Language')?.split('-')[0] as LangCode;
  return translations[lang] || translations['en'];
}

export function getTranslationByLang(lang: string) {
  const code = lang.split('-')[0] as LangCode;
  return translations[code] || translations['en'];
}
