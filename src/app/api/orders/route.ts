// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket} from 'mysql2'
import { Order } from '@/types/order';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
  'SELECT * FROM ordertable WHERE user_id = ? ORDER BY created_at DESC',
  [userId]
);


    //return NextResponse.json(rows);
    return NextResponse.json(rows.map(order => ({
  ...order,
  items_json: JSON.stringify(order.items_json) // or whatever the parsed value is
})));
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}