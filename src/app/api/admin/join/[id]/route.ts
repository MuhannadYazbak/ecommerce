//src/app/api/admin/join/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';
import { Order } from '@/types/order';
import { getTranslation } from '@/utils/i18nBackend';


export async function GET(request: NextRequest, context: {params: Promise<{id: string}>}): Promise<NextResponse> {
  const { params } = context;
  const t = getTranslation(request)
  const orderId = Number((await params).id);
  console.log(`join on ${orderId}`);

  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT ordertable.*, usertable.fullname, usertable.email FROM ordertable join usertable on ordertable.user_id = usertable.id  WHERE order_id = ?',
      [orderId]
    );

    if (!rows.length) {
      return NextResponse.json({ message: `${t.orderNotFound}` }, { status: 404 });
    }
    console.log('join returned ',rows[0]);
    return NextResponse.json(rows[0]); // send single order
  } catch (error) {
    console.error(`${t.databaseError}:`, error);
    return NextResponse.json({ message: `${t.serverError}` }, { status: 500 });
  }
}