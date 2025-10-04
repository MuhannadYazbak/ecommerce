import { NextRequest, NextResponse } from 'next/server'
import { sendCheckoutNotification } from '@/utils/mail'
import { getPool } from '@/utils/db'
import { getTranslation } from '@/utils/i18nBackend';


export async function POST(req: NextRequest) {
  const t = getTranslation(req)
  try {
    const { user_id, total_amount, items_json, created_at,status, address_id, name } = await req.json();

    if (
  !user_id ||
  typeof user_id !== 'number' ||
  !Array.isArray(items_json) ||
  items_json.length === 0 
  // !items.every(item =>
  //   typeof item.id === 'number' &&
  //   typeof item.name === 'string' &&
  //   typeof item.price === 'number' &&
  //   typeof item.quantity === 'number' &&
  //   typeof item.photo === 'string'
  // )
) {
  console.error(`${t.invalidCartItemStructure}`, items_json);
  return NextResponse.json({ error: `${t.invalidCartItemStructure}` }, { status: 400 });
}
    //const body = await req.json()
    console.log("📥 Received order payload:", { user_id, total_amount, items_json, created_at,status, address_id })
    const pool = getPool()
    const res = await pool.query(
      'INSERT INTO ordertable (user_id, total_amount, items_json, created_at, status, address_id) VALUES (?, ?, ?, ?,?,?)',
      [user_id, total_amount, JSON.stringify(items_json),created_at,status, address_id]
    )
    console.log('Insert order res: ', res);
    // try {
    //   console.log("📧 Calling sendCheckoutNotification...")
    //   await sendCheckoutNotification({ user_id, name, total_amount, items_json, created_at });
    //   console.log('✅ Email sent');
    // } catch (emailErr) {
    //   console.error('❌ Email failed:', emailErr);
    // }
    void sendCheckoutNotification({ user_id, name, total_amount, items_json, created_at })
    .then(() => console.log(`${t.emailSent}`))
    .catch(emailErr => console.error(`${t.emailFailed}`, emailErr));

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`${t.checkoutError}:`, err)
    return NextResponse.json({ error: `${t.checkoutError}` }, { status: 500 })
  }
}