// src/app/api/chart/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2'
import { Order } from '@/types/order';
interface ChartSummary extends RowDataPacket {
  order_date: string;
  order_count: number;
}
export async function GET(request: Request) {
    try {
        const pool = await getPool();
        const [rows] = await pool.query<ChartSummary[]>(
            'SELECT DATE(created_at) AS order_date,COUNT(*) AS order_count FROM ordertable GROUP BY DATE(created_at) ORDER BY order_date ASC'
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
    }
}