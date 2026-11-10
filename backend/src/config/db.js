const { Pool } = require('pg');
const { DB } = require('./env');

const pool = new Pool({
  host: DB.host,
  port: DB.port,
  database: DB.database,
  user: DB.user,
  password: DB.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
});

async function initDb(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DB] Connecting to PostgreSQL at ${DB.host}:${DB.port}/${DB.database} (attempt ${attempt}/${retries})...`);
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            phone VARCHAR(50),
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS animals (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            species VARCHAR(100) NOT NULL,
            breed VARCHAR(100),
            gender VARCHAR(50),
            age VARCHAR(50),
            color VARCHAR(100),
            status VARCHAR(50) DEFAULT 'found',
            location TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            contact_name VARCHAR(255),
            contact_phone VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('[DB] Schema initialized successfully: tables `users` and `animals` are ready.');
        return;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(`[DB] Failed to connect/initialize database: ${err.message}`);
      if (attempt < retries) {
        console.log(`[DB] Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.warn('[DB] Could not connect to PostgreSQL. The app will continue running, but DB queries will fail until DB is accessible.');
      }
    }
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDb,
};
