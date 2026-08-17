// // src/app/api/orders/update-status/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getPool } from '@/utils/db';

// export async function POST(req: NextRequest) {
//   try {
//     const { order_id, payment_status, status, stripe_session_id } = await req.json();

//     if (!order_id) {
//       return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
//     }

//     const pool = getPool();

//     // Adjust column names to match your table (e.g., status, payment_status, payment_method)
//     await pool.query(
//       `UPDATE ordertable 
//        SET status = ?, 
//            payment_status = ?, 
//            payment_method = 'Stripe'
//        WHERE id = ?`,
//       [status || 'Processing', payment_status || 'PAID', order_id]
//     );

//     console.log(`✅ Order #${order_id} updated to ${status || 'Processing'} / ${payment_status || 'PAID'}`);
//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error('❌ Failed to update order status:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { order_id, payment_status, status, stripe_session_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    console.log(`📡 Updating Order #${order_id} | Session: ${stripe_session_id}`);

    const pool = getPool();
    await pool.query(
      `UPDATE ordertable 
       SET status = ?, 
           payment_status = ?, 
           stripe_session_id = ?
       WHERE order_id = ?`,
      [
        status || 'Processing', 
        payment_status || 'PAID', 
        stripe_session_id || null, 
        order_id
      ]
    );

    console.log(`✅ Order #${order_id} marked as PAID with Session ID: ${stripe_session_id}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('❌ Failed to update order status:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}