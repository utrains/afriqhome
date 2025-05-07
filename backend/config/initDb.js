const fs = require('fs');
const path = require('path');
const pool = require('./db');

const initDb = async () => {
  try {
    // Read the SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'create_tables.sql'), 'utf8');
    
    // Execute the SQL commands
    await pool.query(sql);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initDb(); 