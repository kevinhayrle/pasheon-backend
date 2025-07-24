require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

let sslConfig;
try {
  sslConfig = {
    ca: fs.readFileSync('ca.pem') // Make sure ca.pem is in root folder
  };
} catch (err) {
  console.error('❌ Could not load ca.pem:', err.message);
  process.exit(1);
}

const pool = mysql.createPool({
  host: 'pasheon-pasheonn.f.aivencloud.com',
  port: 17313,
  user: 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: 'pasheon_db',
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool
module.exports = pool;

// OPTIONAL: Health check function (you can call this manually in app.js if needed)
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to Pasheon DB via pool');
    conn.release();
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err.message);
  }
}

// Not called automatically anymore