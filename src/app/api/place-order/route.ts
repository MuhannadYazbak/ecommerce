import { NextRequest, NextResponse } from 'next/server'
import { sendCheckoutNotification } from '@/utils/mail'
import { getPool } from '@/utils/db'


export async function POST(req: NextRequest) {

  try {
    const { userId, name, total, items, date } = await req.json();

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const pool = getPool()
    const res = await pool.query(
      'INSERT INTO ordertable (user_id, total_amount, items_json) VALUES (?, ?, ?)',
      [userId, total, JSON.stringify(items)]
    )
    console.log('Insert order res: ', res);
    try {
      await sendCheckoutNotification({ userId, name, total, items, date });
      console.log('✅ Email sent');
    } catch (emailErr) {
      console.error('❌ Email failed:', emailErr);
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}