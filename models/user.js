'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Post, Comment, Message, Conversation }) {
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
      this.belongsToMany(Post, { through: 'likes', as: 'likedPosts' });
      this.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
      this.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
      this.belongsToMany(Conversation, { through: 'UserConversations', foreignKey: 'userId', as: 'conversations' });
      
      
      // Self-referential many-to-many relationships for followers and following
      this.belongsToMany(User, { as: 'followers', through: 'userfollowers', foreignKey: 'followingId' });
      this.belongsToMany(User, { as: 'following', through: 'userfollowers', foreignKey: 'followerId' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have a full name' },
          notEmpty: { msg: 'Full name must not be empty' },
          is: {
            args: /^[a-zA-Z ]+$/,
            msg: 'Full name must only contain letters and spaces',
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'User must have a username' },
          notEmpty: { msg: 'Username must not be empty' },
          len: [6, 100],
          is: {
            args: /^[a-zA-Z0-9_]+$/,
            msg: 'Username must only contain letters, numbers, and underscores',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'User must have an email' },
          notEmpty: { msg: 'Email must not be empty' },
          isEmail: { msg: 'Must be a valid email address' },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'user',
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      story: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 250],
        },
      },
      avatar: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      saved: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );

  return User;
};
