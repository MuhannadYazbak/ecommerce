import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/utils/db'



export async function POST(req: NextRequest) {

  try {
    const { user_id, item_id, item_name } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const pool = getPool()
    const res = await pool.query(
      'INSERT INTO wishtable (user_id, item_id, item_name) VALUES (?, ?, ?)',
      [user_id,item_id,item_name]
    )
    console.log('WishList res: ', res);

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'wishlist failed' }, { status: 500 })
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
        return NextResponse.json(
            { error: 'userId query parameter is required' },
            { status: 400 }
        );
    }

    try {
        const pool = getPool();
        // Note: The result structure depends on your database driver
        const [rows] = await pool.query('SELECT * FROM wishtable WHERE user_id = ?', [userId]);
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch wishlist items' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user_id, item_id } = await req.json();

    if (!user_id || !item_id) {
      return NextResponse.json({ error: 'Invalid delete payload' }, { status: 400 });
    }

    const pool = getPool();
    const res = await pool.query(
      'DELETE FROM wishtable WHERE user_id = ? AND item_id = ?',
      [user_id, item_id]
    );

    console.log('Deleted item res:', res);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}