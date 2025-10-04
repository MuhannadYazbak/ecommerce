//src/app/api/admin/orders/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2';
import { Order } from '@/types/order';
import { sendOrderShippedtNotification } from '@/utils/mail';
import { getTranslation } from '@/utils/i18nBackend';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { params } = context;
  const t= getTranslation(request)
  const orderId = Number((await params).id);
  console.log(`Hello admin, editing order ${orderId}`);

  try {
    const pool = await getPool();
    const [rows] = await pool.query<(Order & RowDataPacket)[]>(
      'SELECT * FROM ordertable WHERE order_id = ?',
      [orderId]
    );

    if (!rows.length) {
      return NextResponse.json({ message: `${t.orderNotFound}` }, { status: 404 });
    }

    return NextResponse.json(rows[0]); // send single order
  } catch (error) {
    console.error(`${t.databaseError}:`, error);
    return NextResponse.json({ message: `${t.serverError}`}, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const orderId = Number((await params).id)
  const t = getTranslation(request)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: `${t.invalidOrderID}` }, { status: 400 })
  }

  const body = await request.json()
  const { status, userId, name, total, items, date } = body

  if (
    typeof status !== 'string'
  ) {
    return NextResponse.json({ error: `${t.badRequest}` }, { status: 400 })
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
      return NextResponse.json({ error: `${t.notFound}` }, { status: 404 })
    }

    try {
      const res = await fetch(`${process.env.BASE_URL}/api/admin/join/${orderId}`, {
        method: 'GET',
      });
      const data = await res.json();
      const { fullname, email, status, items_json, total_amount, created_at } = data;
      await sendOrderShippedtNotification({ orderId, fullname, email, status, items_json, total_amount, created_at });
      console.log('✅ Email sent');
    } catch (emailErr) {
      console.error(`${t.emailFailed}:`, emailErr);
    }
    return NextResponse.json({ message: `${t.itemUpdated}` })
  } catch (err) {
    console.error(`${t.itemUpdateError}:`, err)
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 })
  }
}