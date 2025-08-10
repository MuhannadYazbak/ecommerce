//src/app/api/admin/orders/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';
import { Order } from '@/types/order';
import { sendOrderShippedtNotification } from '@/utils/mail';


export async function GET(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  const orderId = Number(params.id);
  console.log(`Hello admin, editing order ${orderId}`);

  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT * FROM ordertable WHERE order_id = ?',
      [orderId]
    );

    if (!rows.length) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]); // send single order
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = Number(params.id)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }

  const body = await request.json()
  const { status, userId, name, total, items, date } = body

  if (
    typeof status !== 'string'
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  try {
    const pool = getPool()
    const [result] = await pool.query(
      `UPDATE ordertable 
         SET status = ?
       WHERE order_id = ?`,
      [status, orderId]
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    try {
      const res = await fetch(`${process.env.BASE_URL}/api/admin/join/${orderId}`, {
  method: 'GET',
});
const data = await res.json();
      const { fullname, email, status, items_json, total_amount, created_at} = data;
      await sendOrderShippedtNotification({ orderId,fullname, email, status, items_json, total_amount, created_at });
      console.log('✅ Email sent');
    } catch (emailErr) {
      console.error('❌ Email failed:', emailErr);
    }
    return NextResponse.json({ message: 'Item updated' })
  } catch (err) {
    console.error('Update item error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}