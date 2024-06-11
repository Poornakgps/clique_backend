'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    
    class Notify extends Model {
        static associate({ User }) {
            this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
        }

        toJSON() {
            return { ...this.get(), id: undefined, userId: undefined };
        }
    }


    Notify.init(
      {
        id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false
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
      },
      {
        sequelize,
        tableName: 'notifies', // Corrected table name
        modelName: 'Notify', // Corrected model name
      }
    )
    return Notify; // Corrected return value
}
