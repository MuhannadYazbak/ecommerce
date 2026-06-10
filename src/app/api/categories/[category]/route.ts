import { NextResponse, NextRequest } from 'next/server';
import { getPool } from '@/utils/db';
import { getTranslation } from '@/utils/i18nBackend';
export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ category: string }> }) {
  const t = getTranslation(request)
  const { category } = await context.params
  try {
    const pool = getPool();
    const language = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
    console.log('Using Language: ', language)
    //const [rows] = await pool.query('SELECT * FROM itemtable WHERE category = ?', [category]);
    const [rows] = await pool.query(
      `SELECT 
         i.id,
         i.price,
         i.quantity,
         i.category,
         i.photo,
         t.name,
         t.description
       FROM itemtable i
       JOIN item_translations t ON i.id = t.item_id
       WHERE i.category =? and t.language_code = ?`,
      [category,language])
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: `${t.itemFetchFailed}` }, { status: 500 });
  }
}