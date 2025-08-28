import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export function getPool() {
  if (process.env.NODE_ENV === 'test') {
    throw new Error('❌ DB connection attempted in test mode');
  }

  if (!process.env.DB_HOST) {
    throw new Error('❌ DB_HOST is undefined');
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    });
  }

  console.log('✅ DB_HOST from env:', process.env.DB_HOST);
  return pool;
}

//  import mysql from 'mysql2/promise';

// let pool: mysql.Pool;

// export function getPool() {
//     if (!pool) {
//         pool = mysql.createPool({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME,
//             connectionLimit: 10,
//         });
//     }
//     console.log('DB_HOST from env:', process.env.DB_HOST);
//     return pool;
// }