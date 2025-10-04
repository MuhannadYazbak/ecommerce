// src/app/api/top5/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2'
import { getTranslation } from '@/utils/i18nBackend';

export async function GET(request: Request) {
  const t = getTranslation(request)
  console.log('Top 5 called')
  try {
    const pool = await getPool();
    const [rows] = await pool.query<(RowDataPacket)[]>(
      'SELECT items_json FROM ordertable ORDER BY created_at DESC'
    );
    console.log('items_json raw: ', rows);
    const itemIds = new Set(rows
      .flatMap(row => row.items_json)
      .map(item => item.id));

    const language = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
    console.log('Using language:', language);
    const idList = Array.from(itemIds).join(',');
    const [translatedItems] = await pool.query<RowDataPacket[]>(
      `SELECT 
     i.id,
     i.price,
     i.photo,
     t.name,
     t.description
   FROM itemtable i
   JOIN item_translations t ON i.id = t.item_id
   WHERE t.language_code = ? AND i.id IN (${idList})`,
      [language]
    );
    console.log('Translated Items: ', translatedItems)
    const top5TranslatedItems = translatedItems.slice(0,5)
    return NextResponse.json(top5TranslatedItems);
  } catch (error) {
    console.error(`${t.databaseError}`, error);
    return NextResponse.json({ message: `${t.orderFetchFailed}`}, { status: 500 });
  }
}