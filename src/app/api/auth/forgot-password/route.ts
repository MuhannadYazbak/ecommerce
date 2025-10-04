import { NextResponse } from 'next/server';
import { getPool } from '@/utils/db';
import { User } from '@/types/user';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/utils/mail';
import { getTranslation } from '@/utils/i18nBackend';

export async function POST(req: Request) {
    const t = getTranslation(req)
    try {
        const { email } = await req.json();
        console.log("Forgot Password Request Received:", email);
        console.log("Looking email up from Database...");

        // Database connection
        const pool = getPool();

        // Retrieve user by email
        const [rows]: any = await pool.query(
            `SELECT * FROM usertable WHERE email = ?`,
            [email]
        );

        //pool.end();
        console.log("Email Found:", rows.length > 0 ? rows[0] : "None");
        // If user is not found, return error
        if (rows.length === 0) {
            console.log("Unregistered email:", email);
            return NextResponse.json({ error: `${t.emailNotFound}` }, { status: 404 });
        }

        // Generate JWT token
        const user: User = rows[0]
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expires_at = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used) VALUES (?, ?, ?, ?)`,
            [user.id, tokenHash, expires_at, false]
        );
        const resetLink = `${process.env.BASE_URL}/auth/reset-password/${rawToken}`;
        console.log('Retrieved user = ', user);
        const res = await sendPasswordResetEmail(user.email, user.fullname, resetLink);
        console.log('PasswordResetEmail res : ',res);
        return NextResponse.json({
            message: `${t.emailSent}`
        }, { status: 200 });

    } catch (error) {
        console.error(`${t.passwordResetError}:`, error);
        return NextResponse.json({ error: `${t.serverError}` }, { status: 500 });
    }
}