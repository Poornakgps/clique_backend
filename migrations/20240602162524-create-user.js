'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      story: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null // Default profile picture file name
      },
      followers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming follower IDs are stored as integers
        allowNull: true,
        defaultValue: []
      },
      following: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming following IDs are stored as integers
        allowNull: true,
        defaultValue: []
      },
      saved: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming saved item IDs are stored as integers
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    // await queryInterface.removeConstraint('UserFollowers', 'UserFollowers_followingId_fkey');
    // await queryInterface.removeConstraint('UserFollowers', 'UserFollowers_followerId_fkey');
    await queryInterface.dropTable('UserFollowers');
    await queryInterface.dropTable('users');
  }
};