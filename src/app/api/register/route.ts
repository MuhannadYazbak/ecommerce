import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { getPool } from '@/utils/db';

export async function POST(req: Request) {
    console.log("DB Connection:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
    try {
        const { fullname, email, dateOfBirth, password } = await req.json();
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Database connection (make sure env variables are set)
        const pool =  getPool();

        // Insert into the database
        await pool.query(
            `INSERT INTO usertable (fullname, email, dateOfBirth, password) VALUES (?, ?, ?, ?)`,
            [fullname, email, dateOfBirth, hashedPassword]
        );

        //pool.end();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        //return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
        console.error("Error Occurred:", error);
        return NextResponse.json({ error: `Server error: ${error}` }, { status: 500 });

    }
}