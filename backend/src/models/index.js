const { sequelize } = require('../config/database');
const UserModel = require('./User');
const LanguageModel = require('./Language');
const GenerationModel = require('./Generation');

// Initialize models
const User = UserModel(sequelize);
const Language = LanguageModel(sequelize);
const Generation = GenerationModel(sequelize);

// Define associations

// Language has many Generations
Language.hasMany(Generation, {
  foreignKey: 'languageId',
  as: 'generations',
  onDelete: 'CASCADE'
});

Generation.belongsTo(Language, {
  foreignKey: 'languageId',
  as: 'language'
});

// User has many Generations (optional)
User.hasMany(Generation, {
  foreignKey: 'userId',
  as: 'generations',
  onDelete: 'SET NULL'
});

Generation.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Language,
  Generation
};
