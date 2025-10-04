// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket} from 'mysql2'
import { Order } from '@/types/order';
import { getTranslation } from '@/utils/i18nBackend';

export async function GET(request: Request) {
  const t = getTranslation(request)
  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT * FROM ordertable ORDER BY created_at DESC'
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(`${t.databaseError}:`, error);
    return NextResponse.json({ message: `${t.orderFetchFailed}` }, { status: 500 });
  }
}