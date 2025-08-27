// /src/app/api/cart/[user_id]/[item_id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ user_id: string; item_id: string }> }
) {
  const userId = Number((await context.params).user_id);
  const itemId = Number((await context.params).item_id);

  if (isNaN(userId) || isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? AND item_id = ?',
      [userId, itemId]
    );

    if ((result as any).affectedRows === 0) {
      console.warn(`🧨 No item found to delete for user_id=${userId}, item_id=${itemId}`);
      return NextResponse.json({ message: 'No item found to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item removed' });
  } catch (err) {
    console.error('💥 Delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}