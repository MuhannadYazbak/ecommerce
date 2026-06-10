import { NextResponse, NextRequest } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '@/utils/db';
import { getTranslation } from '@/utils/i18nBackend';
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const t = getTranslation(request)
    try {
        const pool = getPool();
        const language = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
        console.log('Using Language: ', language)
        const [rows]: [RowDataPacket[], any] = await pool.query(`SELECT distinct category from itemtable`);
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: `${t.itemFetchFailed}` }, { status: 500 });
    }
}