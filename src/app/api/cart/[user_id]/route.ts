import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import en from '@/locales/en/translation.json';
import ar from '@/locales/ar/translation.json';
import he from '@/locales/he/translation.json';

export const runtime = "nodejs";

const translations = { en, ar, he };
type LangCode = keyof typeof translations;

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  // 1. Parse the incoming language header dynamically
  const langHeader = req.headers.get('Accept-Language') || 'en';
  const currentLang = (['en', 'ar', 'he'].includes(langHeader) ? langHeader : 'en') as LangCode;
  const t = translations[currentLang];

  const userId = Number((await params).user_id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: `${t.invalidParam}` }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );

    if ((result as any).affectedRows === 0) {
      console.warn(`🧨 No items found to delete for user_id=${userId}`);
      return NextResponse.json({ message: `${t.itemDeleteFailed}` }, { status: 404 });
    }

    return NextResponse.json({ message: `${t.cartCleared}` });
  } catch (err) {
    console.error('💥 Delete error:', err);
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  // 1. Get the raw header string
  const rawLangHeader = req.headers.get('Accept-Language') || 'en';
  
  // 2. Clean it up! Split by commas/hyphens and isolate the primary code (e.g., "he-IL" -> "he")
  const parsedLang = rawLangHeader.split(',')[0].split('-')[0].toLowerCase();
  
  // 3. Match against your valid application parameters
  const currentLang = (['en', 'ar', 'he'].includes(parsedLang) ? parsedLang : 'en') as LangCode;
  const t = translations[currentLang];

  const userId = Number((await params).user_id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: `${t.invalidParam}` }, { status: 400 });
  }

  try {
    const pool = getPool();
    
    const query = `
      SELECT 
        ci.id,
        ci.user_id,
        ci.item_id,
        ci.quantity,
        ci.price,
        it.name AS name
      FROM cart_items ci
      JOIN item_translations it ON ci.item_id = it.item_id
      WHERE ci.user_id = ? AND it.language_code = ?
    `;

    // 4. Send the sanitized code ("he", "ar", or "en") down to MySQL
    const [rows] = await pool.query(query, [userId, currentLang]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('💥 Fetch cart error:', err);
    return NextResponse.json({ error: `${t.failedToFetchCart}` }, { status: 500 });
  }
}