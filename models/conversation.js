'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    
    class Conversation extends Model {
        static associate({ User, Message }) {
            this.belongsToMany(User, { through: 'UserConversations', foreignKey: 'conversationId', as: 'participants' });
            this.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
        }

        toJSON() {
            return { ...this.get(), id: undefined };
        }
    }

    Conversation.init(
      {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            // defaultValue: DataTypes.UUIDV4,
            // primaryKey: true,
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
        tableName: 'conversations',
        modelName: 'Conversation',
        timestamps: true
      }
    );
    return Conversation;
}
