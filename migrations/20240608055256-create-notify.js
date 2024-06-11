'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('notifies', {
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      recipients: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
      },
      url: {
        type: DataTypes.STRING
      },
      text: {
        type: DataTypes.TEXT
      },
      content: {
        type: DataTypes.TEXT
      },
      image: {
        type: DataTypes.TEXT
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('notifies');
  }
};
