const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

// Define Property model
const Property = sequelize.define('Property', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bedrooms: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  bathrooms: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  area: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'available'
  },
  images: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  features: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  agent: {
    type: Sequelize.JSONB,
    allowNull: false
  }
});

async function setupDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models (create tables)
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the setup
setupDatabase(); 