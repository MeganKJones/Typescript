import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a connection pool
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

async function testConnection() {
  try {
    const res = await pool.query('SELECT * FROM books');
    console.log(res.rows);
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

testConnection();
