// // /src/app/api/admin/ship/route.ts

import { NextRequest } from 'next/server';
import { getPool } from '@/utils/db';
import { UpdateItem } from '@/types/item';
import { NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const updates: UpdateItem[] = await req.json();

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ message: 'Invalid update payload' }, { status: 400 });
  }

  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();

    for (const item of updates) {
      const [result]: any = await connection.query(
        'UPDATE itemtable SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [item.shipped, item.id, item.shipped]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Item ID ${item.id} failed: insufficient stock or invalid ID.`);
      }
    }

    await connection.commit();
    return NextResponse.json({ message: 'Stock updated successfully' }, { status: 200 });
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { message: 'Transaction failed', error: error.message },
      { status: 500 }
    );
}
//   } finally {
//     connection.end();
//   }
}