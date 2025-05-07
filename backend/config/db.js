const { Pool } = require('pg');

// Default configuration
const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin', // Make sure this matches your PostgreSQL password
  port: 5432,
};

// Override with environment variables if they exist
const pool = new Pool({
  user: process.env.DB_USER || config.user,
  host: process.env.DB_HOST || config.host,
  database: process.env.DB_NAME || config.database,
  password: process.env.DB_PASSWORD || config.password,
  port: process.env.DB_PORT || config.port,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }
  console.log('Connected to PostgreSQL database');
  release();
});

module.exports = pool; 