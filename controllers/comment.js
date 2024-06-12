const { Op } = require('sequelize');
const { Comment, Post } = require('../models'); // Import Sequelize models
const path = require('path');
const fs = require('fs');
const sequelize  = Comment.sequelize;

const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const postId = req.body.postId;
            const content = req.body.content;
            const tag = req.body.tag;
            const replyId = req.body.replyId;


            // postId = Number(postId)
            const post = await Post.findByPk(postId);
            if (!post) return res.status(400).json({ msg: "This post does not exist." });

            const postUserId = post.userId;

            if (replyId) {
                const cm = await Comment.findOne({
                    where: { 
                        id: replyId, 
                        postId: postId,
                     }
                });
                if (!cm) return res.status(400).json({ msg: "This comment does not exist." });
            }

            const newComment = await Comment.create({
                userId: req.user.id,
                content,
                tag,
                replyId: replyId || null,
                postId
            });

            res.json({ newComment });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateComment: async (req, res) => {
        try {
            // const { content } = req.body;
            const content = req.body.content;

            await Comment.update(
                { content },
                { where: { id: req.params.id, userId: req.user.id } }
            );

            res.json({ msg: 'Update Success!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await Comment.findOne({
                where: {
                    id: req.params.id,
                    likes: {
                        [Op.contains]: [req.user.id]
                    }
                }
            });
            if (comment) return res.status(400).json({ msg: "You liked this comment." });

            await Comment.update(
                { likes: sequelize.fn('array_append', sequelize.col('likes'), req.user.id) },
                { where: { id: req.params.id } }
            );

            res.json({ msg: 'Liked Comment!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    unLikeComment: async (req, res) => {
        try {
            await Comment.update(
                { likes: sequelize.fn('array_remove', sequelize.col('likes'), req.user.id) },
                { where: { id: req.params.id } }
            );

            res.json({ msg: 'Unliked Comment!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const comment = await Comment.findOne({
                where: {
                    id: req.params.id,
                    [Op.or]: [{ userId: req.user.id }]
                }
            });
            if (!comment) return res.status(400).json({ msg: "Comment not found." });

            await Comment.destroy({ where: { id: req.params.id } });

            res.json({ msg: 'Deleted Comment!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = commentCtrl;
