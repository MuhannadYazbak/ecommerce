//src/app/api/admin/join/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';
import { Order } from '@/types/order';
import { ignore } from 'antd/es/theme/useToken';


export async function GET(request: NextRequest, context: { params: { id: string } }): Promise<NextResponse> {
  const { params } = context;
  const orderId = Number(params.id);
  console.log(`join on ${orderId}`);

  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT ordertable.*, usertable.fullname, usertable.email FROM ordertable join usertable on ordertable.user_id = usertable.id  WHERE order_id = ?',
      [orderId]
    );

    if (!rows.length) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    console.log('join returned ',rows[0]);
    return NextResponse.json(rows[0]); // send single order
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}