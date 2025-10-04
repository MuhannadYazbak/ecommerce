import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/utils/db'
import { getTranslation } from '@/utils/i18nBackend';


export async function POST(req: NextRequest) {
  const t = getTranslation(req)
  try {
    const { user_id, item_id, item_name } = await req.json();
    if (!user_id) {
      return NextResponse.json({ error: `${t.invalidPayload}`}, { status: 400 });
    }

    const pool = getPool()
    const res = await pool.query(
      'INSERT INTO wishtable (user_id, item_id, item_name) VALUES (?, ?, ?)',
      [user_id,item_id,item_name]
    )
    console.log('WishList res: ', res);

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`${t.checkoutError}:`, err)
    return NextResponse.json({ error: `${t.wishlistFailed}` }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const t = getTranslation(req)  
  const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const language_code = req.headers.get('Accept-Language')?.split('-')[0] || 'en'
    if (!userId) {
        return NextResponse.json(
            { error: `${t.userIDRequired}` },
            { status: 400 }
        );
    }

    try {
        const pool = getPool();
        // Note: The result structure depends on your database driver
        const [rows] = await pool.query('SELECT * FROM wishtable WHERE user_id = ?', [userId]);
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error(`${t.databaseError}:`, error);
        return NextResponse.json(
            { error: `${t.wishlistFetchFailed}`},
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
  const t = getTranslation(req)
  try {
    const { user_id, item_id } = await req.json();

    if (!user_id || !item_id) {
      return NextResponse.json({ error: `${t.invalidPayload}`}, { status: 400 });
    }

    const pool = getPool();
    const res = await pool.query(
      'DELETE FROM wishtable WHERE user_id = ? AND item_id = ?',
      [user_id, item_id]
    );

    console.log('Deleted item res:', res);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`${t.itemDeleteFailed}`, error);
    return NextResponse.json({ error: `${t.itemDeleteFailed}` }, { status: 500 });
  }
}