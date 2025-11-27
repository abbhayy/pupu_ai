const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Generation = sequelize.define('Generation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 5000]
      }
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'language_id',
      references: {
        model: 'languages',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'generations',
    timestamps: false,
    indexes: [
      {
        name: 'idx_generations_created_at',
        fields: [{ name: 'created_at', order: 'DESC' }]
      },
      {
        name: 'idx_generations_language_id',
        fields: ['language_id']
      },
      {
        name: 'idx_generations_user_id',
        fields: ['user_id']
      }
    ]
  });

  return Generation;
};
