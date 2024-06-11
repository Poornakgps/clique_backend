'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate({ User, Comment }) {
            this.belongsTo(User, { foreignKey: 'userId', as: 'author' });
            this.hasMany(Comment, { foreignKey: 'postId', as: 'postComments' }); // Changed 'comments' to 'postComments'
            this.belongsToMany(User, { through: 'likes', as: 'likedBy' }); // Ensure consistency with User model
        }

        toJSON() {
            return { ...this.get(), id: undefined };
        }
    }

    Post.init(
      {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            // primaryKey: true
        },
        images:{
            type: DataTypes.ARRAY(DataTypes.TEXT), // Changed to ARRAY of string data t,
            allowNull: true
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: [],
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'posts',
        modelName: 'Post',
        timestamps: true
      }
    );
    return Post;
}
