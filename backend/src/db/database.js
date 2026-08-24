import pg from 'pg';
import { config } from '../config/config.js';

const { Pool } = pg;

// Initialize PostgreSQL connection pool
export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let isPostgresConnected = false;

// Test database connection on startup
export async function testDbConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    client.release();
    isPostgresConnected = true;
    console.log(`✅ [Database] PostgreSQL connected successfully at: ${result.rows[0].current_time}`);
    return true;
  } catch (err) {
    isPostgresConnected = false;
    console.error(`❌ [Database Error] Could not connect to PostgreSQL at ${config.databaseUrl}: ${err.message}`);
    // In production or strict mode, connection failure should not be silenced
    if (config.nodeEnv === 'production') {
      throw new Error(`[Database Error] Failed to connect to PostgreSQL: ${err.message}`);
    }
    return false;
  }
}

export function isDbConnected() {
  return isPostgresConnected;
}

// Database query executor (Throws 503 if database connection is unavailable)
export async function query(text, params = []) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    const dbErr = new Error(`Error de base de datos: ${err.message}`);
    dbErr.statusCode = 503;
    dbErr.originalError = err;
    throw dbErr;
  }
}
