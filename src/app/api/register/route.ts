import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { getPool } from '@/utils/db';
import { getTranslation } from '@/utils/i18nBackend';

export async function POST(req: Request) {
    const t = getTranslation(req)
    console.log("DB Connection:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
    try {
        const { enName, arName, heName, email, dateOfBirth, password } = await req.json();
        const language = await req.headers.get('Accept-Language')?.split(',')[0] || 'en';
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //parsing the date into YYYY-mm-dd
        const date = new Date(dateOfBirth).toISOString().split('T')[0];


        // Database connection (make sure env variables are set)
        const pool = getPool();

        // Insert into the database
        const [userResult] = await pool.execute<mysql.ResultSetHeader>(
            `INSERT INTO usertable (fullname, email, dateOfBirth, password) VALUES (?, ?, ?, ?)`,
            [enName, email, date, hashedPassword]
        );
        const userId = userResult.insertId;
        const safeEnName = enName ?? null;
        const safeArName = arName ?? null;
        const safeHeName = heName ?? null;

        console.log('Registering: ',{ userId, enName, arName, heName, email, dateOfBirth })

        await pool.query(
            `INSERT INTO user_translations (user_id, language_code, name) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
            [userId, 'en', safeEnName, userId, 'ar', safeArName, userId, 'he', safeHeName]
        );

        return NextResponse.json({ message: `${t.userRegistered}` }, { status: 201 });
    } catch (error) {
        //return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
        console.error(`${t.userRegisterFailed}:`, error);
        return NextResponse.json({ error: `${t.userRegisterFailed}: ${error}` }, { status: 500 });

    }
}