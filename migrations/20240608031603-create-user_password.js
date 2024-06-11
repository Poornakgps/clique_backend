'use strict';

module.exports = {
  async up(queryInterface, DataType) {
    await queryInterface.createTable('user_password', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER
      },
      uuid: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
      },
      userId: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      passwordHash: {
        type: DataType.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataType.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE
      }
    });
  },

  async down(queryInterface, DataType) {
    await queryInterface.dropTable('user_password');
  }
};
