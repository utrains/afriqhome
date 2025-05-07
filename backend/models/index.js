const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

const initModel = (model) => {
  return model(sequelize);
};

const User = initModel(require('./User'));
const Property = initModel(require('./Property'));

// Define associations
User.associate({ Property });
Property.associate({ User });

module.exports = {
  sequelize,
  User,
  Property,
}; 