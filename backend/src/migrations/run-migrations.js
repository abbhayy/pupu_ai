const { sequelize } = require('../models');

/**
 * Migration runner
 * Executes all migrations in order
 */
async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create tables using Sequelize sync
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
