import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/utils/db'
import { Address } from '@/types/address';
import { getTranslation } from '@/utils/i18nBackend';
 
export async function POST(req: NextRequest) {
  const t = getTranslation(req)
  try {
    const { city, street, postalcode } = await req.json();

    if (!city || !street || !postalcode) {
      return NextResponse.json({ error: t.invalidPayload }, { status: 400 });
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
    console.error(`${t.addressError}:`, err)
    return NextResponse.json({ error: t.checkoutError}, { status: 500 })
  }
}