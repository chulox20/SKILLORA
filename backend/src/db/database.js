import pg from 'pg';
import { config } from '../config/config.js';

const { Pool } = pg;

// Initialize PostgreSQL connection pool
export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
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
    console.warn(`⚠️ [Database] Could not connect to PostgreSQL at ${config.databaseUrl} (${err.message}). Running in Resilient Memory Mode for active REST endpoints.`);
    return false;
  }
}

export function isDbConnected() {
  return isPostgresConnected;
}

// Generic query helper with auto-fallback to in-memory store if DB is offline
export async function query(text, params = []) {
  if (isPostgresConnected) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error('PostgreSQL query error:', err.message);
      throw err;
    }
  }
  return { rows: [] };
}
