const { Sequelize } = require('sequelize');

// Parse DATABASE_URL or use default
const databaseUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/code_copilot';

// Detect database dialect from URL
let dialect = 'mysql';
if (databaseUrl.includes('postgresql')) {
  dialect = 'postgres';
} else if (databaseUrl.includes('mysql')) {
  dialect = 'mysql';
} else if (databaseUrl.includes('sqlite')) {
  dialect = 'sqlite';
}

// Create Sequelize instance
const sequelize = new Sequelize(databaseUrl, {
  dialect: dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // Enable SSL/TLS for Postgres in all environments (cloud providers require this)
  dialectOptions: dialect === 'postgres' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false  // Allow self-signed certs; use proper CA in production
    }
  } : {}
});

module.exports = { sequelize };
