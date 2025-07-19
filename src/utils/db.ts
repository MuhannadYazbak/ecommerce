 import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 10,
        });
    }
    console.log('DB_HOST from env:', process.env.DB_HOST);
    return pool;
}