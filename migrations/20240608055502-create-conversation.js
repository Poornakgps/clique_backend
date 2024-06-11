'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('conversations', {
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
    await queryInterface.dropTable('conversations');
  }
};
