// src/app/api/navbar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { RowDataPacket } from 'mysql2'

export async function GET(request: NextRequest) {
    console.log('Navbar called')
    try {
        const pool = await getPool();
        const language = request.headers.get('Accept-Language')?.split('-')[0] || 'en';
        const id = request.headers.get('id');
        console.log('Using language:', language);
        const [translatedUser] = await pool.query<RowDataPacket[]>(
            `SELECT name from user_translations where user_id = ? and language_code = ?`,
            [id, language]
        );
        return NextResponse.json(translatedUser[0] || {});
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ message: 'Failed to fetch translated user' }, { status: 500 });
    }
}