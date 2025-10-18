import { NextResponse, NextRequest } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '@/utils/db';
import { getTranslation } from '@/utils/i18nBackend';

export async function GET(request: NextRequest) {
  const t = getTranslation(request)
  try {
    const pool = getPool();
    //const [rows]: any = await pool.query('SELECT * FROM itemtable');
    const language = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
    console.log('Using Language: ', language)
    const [rows]: [RowDataPacket[], any] = await pool.query(
      `SELECT 
         i.id,
         i.price,
         i.quantity,
         i.photo,
         t.name,
         t.description
       FROM itemtable i
       JOIN item_translations t ON i.id = t.item_id
       WHERE t.language_code = ?`,
      [language]
    );


    // Inject mock data if DB is skipped and rows are empty
    if ((process.env.SKIP_DB === 'true' || process.env.NODE_ENV === 'test') && rows.length === 0) {
      console.warn('⚠️ Injecting mock items in test mode');
      const mockItems = [
        { id: 1, name: 'iPhone 15 Pro', price: 1199.00, quantity: 1, photo: '/images/iphone15pro.jpg', description: '' },
        { id: 4, name: 'MacBook Air M3', price: 1299.00, quantity: 2, photo: '/images/mackbook.jpg', description: '' }
      ];
      return NextResponse.json(mockItems, { status: 200 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: `${t.itemFetchFailed}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const t = getTranslation(req);
  try {
    const body = await req.json();
    const {
      enName, enDescription,
      arName, arDescription,
      heName, heDescription,
      price, quantity, photo
    } = body;

    if (!enName || !enDescription || !price || !photo) {
      return NextResponse.json({ error: `${t.missingFields}` }, { status: 400 });
    }

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Insert into itemtable using English version
      const [result] = await conn.execute(
        `INSERT INTO itemtable (name, price, description, quantity, photo) VALUES (?, ?, ?, ?, ?)`,
        [enName, price, enDescription, quantity, photo]
      );
      const itemId = (result as ResultSetHeader).insertId;

      // Insert translations
      const translations = [
        { lang: 'en', name: enName, description: enDescription },
        { lang: 'ar', name: arName, description: arDescription },
        { lang: 'he', name: heName, description: heDescription }
      ];

      for (const { lang, name, description } of translations) {
        await conn.query(
          `INSERT INTO item_translations (item_id, language_code, name, description) VALUES (?, ?, ?, ?)`,
          [itemId, lang, name, description]
        );
      }

      await conn.commit();
      return NextResponse.json({ message: `${t.itemCreated}` }, { status: 201 });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Item POST error:', err);
    return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
  }
}

// export async function DELETE(req: NextRequest) {
//   const t = getTranslation(req);
//   try {
//     const body = await req.json();
//     const { item_id } = body;

//     if (!item_id) {
//       return NextResponse.json({ error: `${t.missingFields}` }, { status: 400 });
//     }

//     const pool = getPool();
//     const conn = await pool.getConnection();

//     try {
//       await conn.beginTransaction();

//       // Delete translations first
//       await conn.query(
//         `DELETE FROM item_translations WHERE item_id = ?`,
//         [item_id]
//       );

//       // Then delete the item
//       await conn.query(
//         `DELETE FROM itemtable WHERE id = ?`,
//         [item_id]
//       );

//       await conn.commit();
//       return NextResponse.json({ message: `${t.itemDeleted}` }, { status: 200 });
//     } catch (err) {
//       await conn.rollback();
//       throw err;
//     } finally {
//       conn.release();
//     }
//   } catch (err) {
//     console.error('Item DELETE error:', err);
//     return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
//   }
// }
