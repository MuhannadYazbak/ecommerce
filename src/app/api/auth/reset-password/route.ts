import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { getPool } from '@/utils/db';
import crypto from 'crypto'

export async function PUT(req: Request) {
    console.log("DB Connection:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
    try {
        const { token, password } = await req.json();
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Database connection (make sure env variables are set)
        const pool = getPool();
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        console.log('Token from URL:', tokenHash);
        const [rows] = await pool.query(
            `SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used = false AND expires_at > NOW()`,
            [tokenHash]
        ) as [Array<{ user_id: number }>, any];
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }
        const user_id = rows[0].user_id

        // Insert into the database
        await pool.query(
            `update usertable set password = ? where id = ?  `,
            [hashedPassword, user_id]
        );
        await pool.query(
            `UPDATE password_reset_tokens SET used = true WHERE token_hash = ?`,
            [tokenHash]
        );

        //pool.end();

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error Occurred:", error);
        return NextResponse.json({ error: `Server error: ${error}` }, { status: 500 });

    }
}