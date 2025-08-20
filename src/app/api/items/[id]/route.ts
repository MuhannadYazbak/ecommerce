import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM itemtable WHERE id = ?', [id]);
    const item = Array.isArray(rows) ? rows[0] : null;

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const itemId = Number(context.params.id);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM itemtable WHERE id = ?',
      [itemId]
    );

    if ((result as any).affectedRows === 0) {
      console.warn(`🧨 No item found to delete for item_id=${itemId}`);
      return NextResponse.json({ message: 'No item found to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item removed' });
  } catch (err) {
    console.error('💥 Delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  
  const itemId = Number(params.id)
  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  const body = await request.json()
  const { name, description, price, photo, quantity } = body

  if (
    price <= 0 ||
    quantity < 0 ||
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof photo !== 'string' ||
    typeof quantity !== 'number'
  ) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  try {
    const pool = getPool()
    const [result] = await pool.query(
      `UPDATE itemtable 
         SET name = ?, description = ?, price = ?, photo = ?, quantity = ?
       WHERE id = ?`,
      [name, description, price, photo, quantity, itemId]
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Item updated' })
  } catch (err) {
    console.error('Update item error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
