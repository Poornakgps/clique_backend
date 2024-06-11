const { Op } = require('sequelize');
const { Post, Comment, User, UserFollowers } = require('../models');
const path = require('path');
const fs = require('fs');
const sequelize = Post.sequelize;

function imageToBase64(filePath) {
    // Read the image file as a Buffer
    const buffer = fs.readFileSync(filePath);

    // Convert the buffer to a Base64 string
    const base64String = buffer.toString('base64');

    return base64String;
}

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const offset = (page - 1) * limit;
        this.query = {
            ...this.query,
            offset,
            limit
        };
        return this;
    }
}


const post = {
    createPost: async (req, res) => {
        try {
            const { body } = req.body;
            
            const imagePaths = req.files.map(file => file.path);
            const basePath = __dirname; 
    
            const relativeImagePaths = imagePaths.map(filePath => {
                const relativePath = path.relative(basePath, filePath);
                return relativePath.startsWith('..') ? filePath : relativePath;
            });
    
            // Convert all relative image paths to base64 strings
            const imagePromises = relativeImagePaths.map(async filePath => {
                try {
                    const base64Image = await imageToBase64(filePath);
                    return base64Image;
                } catch (err) {
                    console.error(`Error converting image ${filePath} to base64:`, err);
                    throw err;
                }
            });
    
            const base64Images = await Promise.all(imagePromises);
    
            const newPost = await Post.create({
                body,
                images: base64Images, 
                userId: req.user.id
            });
    
            res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost.get(),
                    user: req.user
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getPosts: async (req, res) => {
        try {

            const followingRecords = await UserFollowers.findAll({
                where: { followerId: req.user.id },
                attributes: ['followingId']
            });

            const followingIds = followingRecords.map(record => record.followingId);

            followingIds.push(req.user.id);

            let query = await Post.findAll({
                where: {
                    userId: {
                        [Op.in]: followingIds
                    }
                },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['username', 'fullName', 'followers', 'avatar'] 
                    },
                    {
                        model: Comment,
                        as: 'postComments',
                        include: {
                            model: User,
                            as: 'commenter',
                            attributes: { exclude: ['password'] }
                        }
                    }
                ]
            });
            
            const features = new APIfeatures(query, req.query).paginating();

            const posts = await features.query;
            
            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: err.message });
        }
    },

    updatePost: async (req, res) => {
        try {
            // const { content, images } = req.body;
            const body = req.body.body;

            const imagePaths = req.files.map(file => file.path);
            const basePath = __dirname; 
    
            const relativeImagePaths = imagePaths.map(filePath => {
                const relativePath = path.relative(basePath, filePath);
                return relativePath.startsWith('..') ? filePath : relativePath;
            });
    
            // Convert all relative image paths to base64 strings
            const imagePromises = relativeImagePaths.map(async filePath => {
                try {
                    const base64Image = await imageToBase64(filePath);
                    return base64Image;
                } catch (err) {
                    console.error(`Error converting image ${filePath} to base64:`, err);
                    throw err;
                }
            });
    
            const base64Images = await Promise.all(imagePromises);

            const images = base64Images;

            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(400).json({ msg: 'This post does not exist.' });
            }

            post.body = body;
            post.images = images;

            await post.save();

            const updatedPost = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['avatar', 'username', 'fullName']
                    },
                    {
                        model: Comment,
                        as: 'postComments',
                        include: {
                            model: User,
                            as: 'commenter',
                            attributes: { exclude: ['password'] }
                        }
                    }
                ]
            });

            res.json({
                msg: "Updated Post!",
                newPost: updatedPost
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    likePost: async (req, res) => {
        try {
            // res.send(req.user)
            const post = await Post.findOne({
                where: {
                    id: req.params.id,
                    likes: {
                        [Op.contains]: [req.user.id]
                    }
                }
            });
            
            if (post) {
                return res.status(400).json({ msg: "You liked this post." });
                
            }
    
            // Update the post to add the user's ID to the 'likes' array
            await Post.update({
                likes: sequelize.fn('array_append', sequelize.col('likes'), req.user.id)
            }, {
                where: {
                    id: req.params.id
                }
            });
    
            // Send a simple response indicating success
            res.json({ msg: 'Liked Post!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    

    unLikePost: async (req, res) => {
        try {
            await Post.update({
                likes: sequelize.fn('array_remove', sequelize.col('likes'), req.user.id)
            }, {
                where: {
                    id: req.params.id
                },
                returning: true
            });

            res.json({ msg: 'UnLiked Post!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getUserPosts : async (req, res) => {
        try {
            const features = new APIfeatures(
                await Post.findAll({
                    where: { userId: req.params.id },
                    order: [['createdAt', 'DESC']]
                }),
                req.query
            ).paginating();
    
            const posts = await features.query;
    
            res.json({
                posts,
                result: posts.length
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getPost: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['avatar', 'username', 'fullName', 'followers']
                    },
                    {
                        model: Comment,
                        as: 'postComments',
                        include: {
                            model: User,
                            as: 'commenter',
                            attributes: { exclude: ['password'] }
                        }
                    }
                ]
            });

            if (!post) {
                return res.status(400).json({ msg: 'This post does not exist.' });
            }

            res.json({ post });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getPostsDiscover : async (req, res) => {
        try {
            // Get following list of the current user
            following  = await UserFollowers.findAll({
                where: { followerId: req.user.id }
            });
            req.user.following = following;

            if (!Array.isArray(req.user.following)) {
                return res.status(400).json({ msg: "Following list is not an array" });
            }
    
            // Combine following user IDs and current user's ID
            const followingIds = req.user.following.map(followingUser => followingUser.followingId);
            const newArr = [...followingIds, req.user.id];
            const num = req.query.num || 9;

    
            // Find posts from users not in the newArr list
            const posts = await Post.findAll({
                where: {
                    userId: {
                        [Op.notIn]: newArr
                    }
                },
                order: sequelize.random(),
                limit: Number(num)
            });
    
            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findOne({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            });

            if (!post) {
                return res.status(400).json({ msg: 'This post does not exist.' });
            }

            await Comment.destroy({
                where: {
                    postId: post.id
                }
            });

            await post.destroy();

            res.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post.get(),
                    user: req.user
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    savePost : async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
    
            if (user.saved.includes(req.params.id)) {
                return res.status(400).json({ msg: "You saved this post." });
            }

            // check if post id is valid
            const post = await Post.findByPk(req.params.id);
            if (!post) {
                return res.status(400).json({ msg: "This post does not exist." });
            }
    
            // Update the user to add the post ID to the 'saved' array
            await User.update({
                saved: sequelize.fn('array_append', sequelize.col('saved'), req.params.id)
            }, {
                where: {
                    id: req.user.id
                }
            });
    
            res.json({ msg: 'Saved Post!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    unSavePost : async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id);

            const PostIdtoRemove = Number(req.params.id);
    
            if (!user.saved.includes(PostIdtoRemove)) {
                return res.status(400).json({ msg: "This post is not in your saved list." });
            }
    
            // Update the user to remove the post ID from the 'saved' array
            await User.update({
                saved: sequelize.literal(`array_remove(saved, '${PostIdtoRemove}')`)
            }, {
                where: {
                    id: req.user.id
                }
            });
    
            res.json({ msg: 'UnSaved Post!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(
                await Post.findAll({
                where: {
                    id: { [Op.in]: req.user.saved }
                },
                order: [['createdAt', 'DESC']]
            }), req.query).paginating();

            const savePosts = await features.query;

            res.json({
                savePosts,
                result: savePosts.length
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = post;
