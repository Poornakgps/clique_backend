'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate({ User, Post }) {
            this.belongsTo(User, { foreignKey: 'userId', as: 'commenter' });
            this.belongsTo(Post, { foreignKey: 'postId', as: 'postComments' }); // Ensure consistency with Post model
        }

        toJSON() {
            return { ...this.get(), id: undefined };
        }
    }

    Comment.init(
      {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tag: {
            type: DataTypes.JSON // Assuming tag details are stored as JSON
        },
        replyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'comments',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        likes: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            defaultValue: []
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
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'posts',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
      },
      {
        sequelize,
        tableName: 'comments',
        modelName: 'Comment',
        timestamps: true
      }
    );
    return Comment;
}
