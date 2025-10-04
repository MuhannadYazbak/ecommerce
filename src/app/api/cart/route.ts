import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { getTranslation } from '@/utils/i18nBackend';

export async function POST(req: NextRequest) {
  const t = getTranslation(req)
  try {
    const body = await req.json();
    const { user_id, item_id, role, name, price, photo, quantity } = body;

    if (!user_id || role === 'guest'){
      console.log('Guest No DB for cart')
      return NextResponse.json({message: `${t.guestClientSideOnly}`},{status: 200})
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO cart_items (user_id, item_id, name, price, photo, quantity)
   VALUES (?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [user_id, item_id, name, price, photo, quantity]
    );

    return NextResponse.json({ message: `${t.itemAddedSuccessfully}` }, { status: 201 });
  } catch (err) {
    console.error('Cart POST error:', err);
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  const t = getTranslation(req)
  try {
    const pool = getPool();
    const language = req.headers.get('Accept-Language')
    const [rows] = await pool.query('SELECT * FROM cart_items');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: `${t.failedToFetchCart}` }, { status: 500 });
  }
}
