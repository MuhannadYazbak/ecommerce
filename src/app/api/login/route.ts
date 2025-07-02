import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { getPool } from '@/utils/db';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        console.log("Login Request Received:", email, password);
        console.log("Fetching User from Database...");

        // Database connection
        const pool = getPool();

        // Retrieve user by email
        const [rows]: any = await pool.query(
            `SELECT * FROM usertable WHERE email = ?`,
            [email]
        );

        //pool.end();
        console.log("User Found:", rows.length > 0 ? rows[0] : "None");
        // If user is not found, return error
        if (rows.length === 0) {
            console.log("Login attempt with unregistered email:", email);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Compare password
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Incorrect password attempt for:", email);
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET as string;
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '2h' });

        return NextResponse.json({ token, id: user.id,name: user.fullname, role:user.role }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Server error, please try again later' }, { status: 500 });
    }
}