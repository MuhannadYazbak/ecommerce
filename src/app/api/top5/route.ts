// src/app/api/top5/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket} from 'mysql2'

export async function GET(request: Request) {
  try {
    const pool = await getPool();
    const [rows] = await pool.query<(RowDataPacket)[]>(
      'SELECT items_json FROM ordertable ORDER BY created_at DESC limit 5'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}