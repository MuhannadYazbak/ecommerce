import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, item_id, role, name, price, photo, quantity } = body;

    if (!user_id || role === 'guest'){
      console.log('Guest No DB for cart')
      return NextResponse.json({message: 'Guest cart is handled client-side only'},{status: 200})
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO cart_items (user_id, item_id, name, price, photo, quantity)
   VALUES (?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [user_id, item_id, name, price, photo, quantity]
    );

    // await pool.query(
    //   `INSERT INTO cart_items (user_id, item_id, name, price, photo, quantity)
    //    VALUES (?, ?, ?, ?, ?, ?)`,
    //   [user_id, item_id, name, price, photo, quantity]
    // );

    return NextResponse.json({ message: 'Item added to cart' }, { status: 201 });
  } catch (err) {
    console.error('Cart POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM cart_items');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
