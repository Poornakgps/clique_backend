'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      conversationId: {
        type: DataTypes.INTEGER,  // Ensure this matches the UUID type in Conversation
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      media: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true
      },
      call: {
        type: DataTypes.JSON,
        allowNull: true
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
    await queryInterface.dropTable('messages');
  }
};
