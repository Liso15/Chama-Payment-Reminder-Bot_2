const { Pool } = require('pg');
require('dotenv').config(); // To load .env file for local development

// Database connection configuration
// It's recommended to use environment variables for these settings,
// especially in production.
const pool = new Pool({
  user: process.env.DB_USER || 'chama_bot_user', // Default user for the bot
  host: process.env.DB_HOST || 'localhost',        // Or your DB host
  database: process.env.DB_NAME || 'chama_bot_db',   // Default DB name
  password: process.env.DB_PASSWORD || 'chama_secret_password', // Change this!
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('DB_CONFIG: Successfully connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('DB_CONFIG: Unexpected error on idle client', err);
  // process.exit(-1); // Optionally exit if cannot connect, depending on strategy
});

/**
 * Executes a SQL query using a client from the pool.
 * @param {string} text The SQL query string.
 * @param {Array} params The parameters for the SQL query.
 * @returns {Promise<QueryResult>} A promise that resolves with the query result.
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('DB_QUERY:', { text, duration: `${duration}ms`, rowCount: res.rowCount });
    return res;
  } catch (err) {
    console.error('DB_QUERY_ERROR:', { text, error: err.message });
    throw err; // Re-throw the error to be handled by the caller
  }
}

// Function to test the database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("DB_CONFIG: Test connection successful. PostgreSQL version:", client.parameterStatus.server_version);
    client.release();
    return true;
  } catch (error) {
    console.error("DB_CONFIG: Failed to connect to the database for test:", error);
    return false;
  }
}

module.exports = {
  query,
  pool, // Exporting pool directly can be useful for transactions or specific pg features
  testConnection
};

// Example of how to create a .env file for local development:
// DB_USER=your_postgres_user
// DB_PASSWORD=your_postgres_password
// DB_HOST=localhost
// DB_NAME=chama_bot_db
// DB_PORT=5432
//
// TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_PHONE_NUMBER=whatsapp:+14155238886
//
// NODE_ENV=development
// PORT=3000
