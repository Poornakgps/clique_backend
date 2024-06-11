'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPassword extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }

  UserPassword.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uuid'
        },
        onDelete: 'CASCADE'
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Password must have a password hash' },
          notEmpty: { msg: 'Password hash must not be empty' },
          len: [7, 60],
        }
      }
    },
    {
      sequelize,
      tableName: 'user_password',
      modelName: 'UserPassword',
      timestamps: true
    }
  );

  return UserPassword;
};
