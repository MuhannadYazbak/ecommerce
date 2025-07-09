import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/utils/db'
import { Address } from '@/types/address';
//import { RowDataPacket } from 'mysql2';


export async function POST(req: NextRequest) {

  try {
    const { city, street, postalcode } = await req.json();

    if (!city || !street || !postalcode) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const pool = await getPool()
    const [result] = await pool.query(
      'INSERT INTO address (city, street, postalcode) VALUES (?, ?, ?)',
      [city, street, postalcode]
    )
    console.log('Insert address res: ', result);
    const insertId = (result as any).insertId;
    

    return NextResponse.json({ success: true, id:insertId })
  } catch (err) {
    console.error('address error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}

//export async function GET(request: Request) {
//   const { searchParams} = new URL(request.url);
//   const orderId = searchParams.get('orderId');
//   if (!orderId) {
//     return NextResponse.json(
//       { message: 'Order ID is required' },
//       { status: 400 }
//     );
//   }
//     try {
//     const pool = await getPool();
//     const [rows] = await pool.query<(Address & RowDataPacket)[]>(
//   'SELECT * FROM address WHERE  ORDER BY address_id DESC',
//   [orderId]
// );
//     return NextResponse.json(rows);
//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch addresses' },
//       { status: 500 }
//     );
//   }
// }