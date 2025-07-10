// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket} from 'mysql2'
import { Order } from '@/types/order';

export async function GET(request: Request) {
  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT * FROM ordertable ORDER BY created_at DESC'
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}