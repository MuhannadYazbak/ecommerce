import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get('date'); // expecting YYYY-MM-DD format

  if (!selectedDate) {
    return NextResponse.json({ message: 'Missing date parameter' }, { status: 400 });
  }

  const query = `
    SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(jt.item, '$.name')) AS item_name,
      SUM(JSON_EXTRACT(jt.item, '$.quantity')) AS total_quantity
    FROM ordertable,
         JSON_TABLE(items_json, '$[*]' COLUMNS (
           item JSON PATH '$'
         )) AS jt
    WHERE DATE(created_at) = ?
    GROUP BY item_name;
  `;

  try {
    const pool = await getPool();
    const [rows] = await pool.query<RowDataPacket[]>(query, [selectedDate]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Failed to fetch item data' }, { status: 500 });
  }
}