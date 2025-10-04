import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { getTranslation } from '@/utils/i18nBackend';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const t = getTranslation(req)
  const mockItem = {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    price: 1100,
    description: 'Great High-end Android phone with 200MP camera and S Pen.',
    photo: '/images/s24ultra.jpg',
    quantity: 1
  };

  if (process.env.SKIP_DB === 'true') {
    return NextResponse.json(mockItem, { status: 200 });
  }

  try {
    const pool = getPool();
    const language = await req.headers.get('Accept-Language')?.split(',')[0] || 'en'
    //const [rows] = await pool.query('SELECT * FROM itemtable WHERE id = ?', [id]);
    const [rows] = await pool.query(
      `SELECT 
         i.id,
         i.price,
         i.quantity,
         i.photo,
         t.name,
         t.description
       FROM itemtable i
       JOIN item_translations t ON i.id = t.item_id
       WHERE i.id =? and t.language_code = ?`,
      [id,language])
    const item = Array.isArray(rows) ? rows[0] : null;

    if (!item) {
      return NextResponse.json({ error: `${t.notFound}` }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const itemId = Number((await context.params).id);
  const t = getTranslation(request)
  if (isNaN(itemId)) {
    return NextResponse.json({ error: `${t.invalidParam}` }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM itemtable WHERE id = ?',
      [itemId]
    );

    if ((result as any).affectedRows === 0) {
      console.warn(`🧨 ${t.itemDeleteFailed} for item_id=${itemId}`);
      return NextResponse.json({ message: `${t.itemDeleteFailed}` }, { status: 404 });
    }

    return NextResponse.json({ message: `${t.itemDeleted}` });
  } catch (err) {
    console.error(`${t.deleteError}:`, err);
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const t = getTranslation(request)
  const itemId = Number((await params).id)
  if (isNaN(itemId)) {
    return NextResponse.json({ error: `${t.invalidItemID}` }, { status: 400 })
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
    return NextResponse.json({ error: `${t.badRequest}` }, { status: 400 })
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
      return NextResponse.json({ error: `${t.notFound}` }, { status: 404 })
    }

    return NextResponse.json({ message: `${t.itemUpdated}` })
  } catch (err) {
    console.error(`${t.itemUpdateError}`, err)
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 })
  }
}
