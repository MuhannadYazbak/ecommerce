import { NextResponse, NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import {  getPool } from '@/utils/db';

export async function GET() {
    try {
        const pool = getPool();

        const [rows]: any = await pool.query('SELECT * FROM itemtable');
        //pool.end();

        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, description,quantity, photo } = body;

    if (!name || !price || !description || !photo) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO itemtable (name, price, description, quantity, photo) VALUES (?, ?, ?, ?, ?)`,
      [name, price, description,quantity, photo]
    );

    return NextResponse.json({ message: 'Item created' }, { status: 201 });
  } catch (err) {
    console.error('Item POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  params: { params: { item_id: string } }
) {
  const itemId = Number(params.params.item_id);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM itemtable WHERE item_id = ?',
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
