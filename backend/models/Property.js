const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

class Property {
  static async initialize() {
    try {
      // Check if properties table exists
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'properties'
        );
      `);

      if (!result.rows[0].exists) {
        // Read and execute the SQL file
        const sql = fs.readFileSync(path.join(__dirname, '../config/create_tables.sql'), 'utf8');
        await pool.query(sql);
        console.log('Properties table created successfully');
      }
    } catch (error) {
      console.error('Error initializing properties table:', error);
      throw error;
    }
  }

  static async create(propertyData) {
    try {
      await this.initialize();
      
      const query = `
        INSERT INTO properties (
          user_id, title, description, location, price, type, status,
          bedrooms, bathrooms, area, features, images, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING *
      `;
      
      const values = [
        propertyData.user,
        propertyData.title,
        propertyData.description,
        JSON.stringify(propertyData.location),
        propertyData.price,
        propertyData.type,
        propertyData.status || 'active',
        propertyData.bedrooms || 0,
        propertyData.bathrooms || 0,
        propertyData.area || 0,
        propertyData.features || [],
        propertyData.images || []
      ];

      const result = await pool.query(query, values);
      
      const property = result.rows[0];
      property.location = JSON.parse(property.location);
      return property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      await this.initialize();
      
      const query = 'SELECT * FROM properties ORDER BY created_at DESC';
      console.log('Executing query:', query);
      const result = await pool.query(query);
      console.log('Query result:', result.rows);
      
      return result.rows.map(property => {
        // Handle location field - try to parse as JSON, if fails use as string
        let location;
        try {
          location = JSON.parse(property.location);
        } catch (e) {
          // If parsing fails, create a location object with the string value
          location = {
            country: property.location,
            city: '',
            address: '',
            landmark: ''
          };
        }

        return {
          ...property,
          location
        };
      });
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      await this.initialize();
      
      const query = 'SELECT * FROM properties WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const property = result.rows[0];
      // Handle location field - try to parse as JSON, if fails use as string
      try {
        property.location = JSON.parse(property.location);
      } catch (e) {
        // If parsing fails, create a location object with the string value
        property.location = {
          country: property.location,
          city: '',
          address: '',
          landmark: ''
        };
      }
      return property;
    } catch (error) {
      console.error('Error getting property:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      await this.initialize();
      const query = `
        SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM properties p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding property by id:', error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      await this.initialize();
      const query = `
        SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM properties p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error finding properties by user id:', error);
      throw error;
    }
  }

  static async findAllActive() {
    try {
      await this.initialize();
      const query = `
        SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM properties p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = 'active'
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error finding active properties:', error);
      throw error;
    }
  }

  static async update(id, propertyData) {
    try {
      await this.initialize();
      const query = `
        UPDATE properties
        SET title = $1,
            description = $2,
            location = $3,
            price = $4,
            type = $5,
            status = $6,
            bedrooms = $7,
            bathrooms = $8,
            area = $9,
            features = $10,
            images = $11,
            updated_at = NOW()
        WHERE id = $12
        RETURNING *
      `;

      const values = [
        propertyData.title,
        propertyData.description,
        propertyData.location,
        propertyData.price,
        propertyData.type,
        propertyData.status,
        propertyData.bedrooms,
        propertyData.bathrooms,
        propertyData.area,
        propertyData.features,
        propertyData.images,
        id
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await this.initialize();
      const query = 'DELETE FROM properties WHERE id = $1';
      await pool.query(query, [id]);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  static async addImages(id, images) {
    try {
      await this.initialize();
      const query = `
        UPDATE properties
        SET images = array_cat(images, $1),
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [images, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding images to property:', error);
      throw error;
    }
  }
}

module.exports = Property; 