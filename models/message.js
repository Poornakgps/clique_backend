'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate({ User, Conversation }) {
            this.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
            this.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
        }
    }

    Message.init(
      {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        conversationId: {
            type: DataTypes.INTEGER,  // Ensure this matches the UUID type in Conversation
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        media: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'messages',
        modelName: 'Message',
        timestamps: true
      }
    );
    return Message;
}
