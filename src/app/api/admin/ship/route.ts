 // /src/app/api/admin/ship/route.ts

import { NextRequest } from 'next/server';
import { getPool } from '@/utils/db';
import { UpdateItem } from '@/types/item';
import { NextResponse } from 'next/server';
import { getTranslation } from '@/utils/i18nBackend';


export async function PUT(req: NextRequest) {
  const t = getTranslation(req)
  const updates: UpdateItem[] = await req.json();
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ message: `${t.invalidPayload}`}, { status: 400 });
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
        const message = t.StockUpdateFailed.replace('{{id}}', String(item.id));
        throw new Error(message);

      }
    }

    await connection.commit();
    return NextResponse.json({ message: `${t.stockUpdatedSuccessfully}` }, { status: 200 });
  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { message: `${t.transactionFailed}`, error: error.message },
      { status: 500 }
    );
}
//   } finally {
//     connection.end();
//   }
}