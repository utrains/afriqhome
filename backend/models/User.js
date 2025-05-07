const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

class User {
  static async initialize() {
    try {
      // Check if users table exists
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);

      if (!result.rows[0].exists) {
        // Read and execute the SQL file
        const sql = fs.readFileSync(path.join(__dirname, '../config/create_tables.sql'), 'utf8');
        await pool.query(sql);
        console.log('Users table created successfully');
      }
    } catch (error) {
      console.error('Error initializing users table:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      await this.initialize();
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Name, email, and password are required');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const query = `
        INSERT INTO users (
          name, email, password, phone, role, kyc_status, 
          agency_name, agency_license, agency_address, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING id, name, email, phone, role, kyc_status, 
          agency_name, agency_license, agency_address, created_at
      `;
      
      const values = [
        userData.name,
        userData.email,
        hashedPassword,
        userData.phone || null,
        userData.role || 'user',
        userData.kycStatus || 'pending',
        userData.agency?.name || null,
        userData.agency?.license || null,
        userData.agency?.address || null
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      await this.initialize();
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      await this.initialize();
      const query = 'SELECT id, name, email, phone, role, kyc_status, agency_name, agency_license, agency_address FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async update(id, userData) {
    try {
      await this.initialize();
      const query = `
        UPDATE users
        SET name = $1,
            email = $2,
            phone = $3,
            role = $4,
            kyc_status = $5,
            agency_name = $6,
            agency_license = $7,
            agency_address = $8,
            updated_at = NOW()
        WHERE id = $9
        RETURNING id, name, email, phone, role, kyc_status, agency_name, agency_license, agency_address
      `;

      const values = [
        userData.name,
        userData.email,
        userData.phone,
        userData.role,
        userData.kycStatus,
        userData.agency?.name,
        userData.agency?.license,
        userData.agency?.address,
        id
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

module.exports = User; 