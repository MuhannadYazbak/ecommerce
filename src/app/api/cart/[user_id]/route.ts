import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';


export async function DELETE(req: NextRequest, { params }: { params: { user_id: string } }) {
  const userId = Number(params.user_id);


  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid parameter' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );

    if ((result as any).affectedRows === 0) {
      console.warn(`🧨 No items found to delete for user_id=${userId}`);
      return NextResponse.json({ message: 'No item found to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cart Cleared' });
  } catch (err) {
    console.error('💥 Delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}