const { sequelize } = require('../config/database');

async function addPasswordColumn() {
  try {
    // Check if password column already exists
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('users');
    
    if (tableDescription.password) {
      console.log('✅ Password column already exists');
      return;
    }

    // Add password column
    await sequelize.query(`
      ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';
    `);

    console.log('✅ Password column added to users table');
  } catch (error) {
    console.error('❌ Error adding password column:', error.message);
  }
}

module.exports = addPasswordColumn;
