import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';
import { Order, OrderItem } from '@/types/order';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const languageCode = request.headers.get('Accept-Language')?.split(',')[0]?.trim() || 'en';

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

    // const enrichedOrders = await Promise.all(rows.map(async (order) => {
    //   const items: OrderItem[] = JSON.parse(order.items_json.toString());

    //   const enrichedItems = await Promise.all(items.map(async (item) => {
    //     const [translationRows] = await pool.query<RowDataPacket[]>(
    //       'SELECT name FROM item_translations WHERE item_id = ? AND language_code = ?',
    //       [item.id, languageCode]
    //     );

    //     return {
    //       ...item,
    //       name: translationRows[0]?.name || item.name
    //     };
    //   }));

    //   return {
    //     ...order,
    //     items_json: order.items_json,
    //     items: enrichedItems
    //   };
    // }));

    return NextResponse.json(rows.map(order => ({...order, items_json: order.items_json})));
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}