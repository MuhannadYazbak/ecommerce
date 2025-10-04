import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';
import { Order } from '@/types/order';
import { getTranslation } from '@/utils/i18nBackend';

export async function GET(request: Request) {
  const t = getTranslation(request)
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const languageCode = request.headers.get('Accept-Language')?.split(',')[0]?.trim() || 'en';

  if (!userId) {
    return NextResponse.json(
      { message: `${t.userIDRequired}` },
      { status: 400 }
    );
  }

  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT * FROM ordertable WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return NextResponse.json(rows.map(order => ({...order, items_json: order.items_json})));
  } catch (error) {
    console.error(`${t.databaseError}:`, error);
    return NextResponse.json(
      { message: `${t.orderFetchFailed}` },
      { status: 500 }
    );
  }
}