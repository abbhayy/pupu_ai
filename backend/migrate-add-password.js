const { Sequelize } = require('sequelize');
require('dotenv').config();

// Set SSL for Postgres
if (!process.env.PGSSLMODE) {
  process.env.PGSSLMODE = 'require';
}
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

async function migrateDatabase() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Check if password column exists
    const result = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='users' AND column_name='password'
    `);

    if (result[0].length === 0) {
      // Password column doesn't exist, add it
      console.log('Adding password column to users table...');
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'temp_password_change_me'
      `);
      console.log('✅ Password column added successfully');
    } else {
      console.log('✅ Password column already exists');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateDatabase();
