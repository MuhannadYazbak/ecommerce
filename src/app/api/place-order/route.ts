import { NextRequest, NextResponse } from 'next/server'
import { sendCheckoutNotification } from '@/utils/mail'
import { getPool } from '@/utils/db'
import { getTranslation } from '@/utils/i18nBackend';
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const t = getTranslation(req)
  try {
    // 1. Include payment_method in the destructured body
    const { user_id, total_amount, items_json, created_at, status, payment_method, address_id, name } = await req.json();

    if (
      !user_id ||
      typeof user_id !== 'number' ||
      !Array.isArray(items_json) ||
      items_json.length === 0 
    ) {
      console.error(`${t.invalidCartItemStructure}`, items_json);
      return NextResponse.json({ error: `${t.invalidCartItemStructure}` }, { status: 400 });
    }

    console.log("📥 Received order payload:", { user_id, total_amount, items_json, created_at, status, payment_method, address_id });
    const pool = getPool();

    // 2. Add payment_method to column list and values
    const [result]: any = await pool.query(
      'INSERT INTO ordertable (user_id, total_amount, items_json, created_at, status, payment_method, address_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, total_amount, JSON.stringify(items_json), created_at, status, payment_method || 'Stripe', address_id]
    );

    const orderId = result?.insertId || result?.[0]?.insertId;
    console.log('✅ Inserted Order ID:', orderId);

    void sendCheckoutNotification({ user_id, name, total_amount, items_json, created_at })
      .then(() => console.log(`${t.emailSent}`))
      .catch(emailErr => console.error(`${t.emailFailed}`, emailErr));

    return NextResponse.json({ success: true, id: orderId });
  } catch (err: any) {
    console.error(`${t.checkoutError}:`, err);
    return NextResponse.json({ error: err?.message || `${t.checkoutError}` }, { status: 500 });
  }
}