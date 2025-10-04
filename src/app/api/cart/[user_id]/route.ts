import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
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

    return NextResponse.json({ message: `${t.cartCleared}`});
  } catch (err) {
    console.error('💥 Delete error:', err);
    return NextResponse.json({ error: `${t.serverError}`}, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  const userId = Number((await params).user_id)
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM cart_items where user_id = ?',[userId]);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: `${t.failedToFetchCart}` }, { status: 500 });
  }
}