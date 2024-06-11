const db = require("../models");
const { Op } = require('sequelize');
const { get } = require("../routes/auth");

const User = db.User;
const UserFollowers = db.UserFollowers;


const user = {
    getProfile: async (req, res) => {
        try {
            // console.log(req)
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password', 'avatar'] },
                include: [
                    { model: User, as: 'followers', attributes: { exclude: ['avatar'] } },
                    { model: User, as: 'following', attributes: { exclude: ['avatar'] } }
                ]
            });
            // console.log(req.user.id)
            res.json({ user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
    searchUser: async (req, res) => {
        try {
            const users = await User.findAll({
                where: {
                    username: { [Op.iLike]: `%${req.query.username}%` }
                },
                limit: 10,
                attributes: ['fullName', 'username', 'avatar']
            });
            res.json({ users });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    },

    getUser: async (req, res) => {
        try {
          const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
              { model: User, as: 'followers', attributes: { exclude: ['password'] } },
              { model: User, as: 'following', attributes: { exclude: ['password'] } }
            ]
          });
          if (!user) return res.status(404).json({ msg: 'User not found' });
          res.json({ user });
        } catch (err) {
          console.error(err);
          res.status(500).json({ msg: 'Server Error' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const fullName = req.body.fullName;
            const avatar = req.body.avatar;
            console.log(fullName, avatar)
            console.log(req)
            if (!fullName) return res.status(400).json({ msg: 'Please provide your full name' });

            await User.update(
                { avatar, fullName },
                { where: { id: req.user.id } }
            );

            res.json({ msg: 'Update Success!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    },

    follow : async (req, res) => {
        try {
            const userIdToFollow = parseInt(req.params.id, 10);
            const currentUserId = req.user.id;
    
            // Check if the user is trying to follow themselves
            if (userIdToFollow === currentUserId) {
                return res.status(400).json({ msg: 'You cannot follow yourself' });
            }
    
            // Find the user to follow
            const userToFollow = await User.findOne({ where: { id: userIdToFollow } });
            if (!userToFollow) {
                return res.status(400).json({ msg: 'User not found' });
            }
    
            // Check if the current user already follows the target user
            const existingFollow = await UserFollowers.findOne({
                where: {
                    followingId: userIdToFollow,
                    followerId: currentUserId
                }
            });
            if (existingFollow) {
                return res.status(400).json({ msg: 'You already follow this user' });
            }
    
            // Add the follow relationship
            await UserFollowers.create({
                followingId: userIdToFollow,
                followerId: currentUserId
            });
    
            res.json({ msg: 'Follow Success!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
     

    unfollow : async (req, res) => {
        try {
            const userIdToUnfollow = parseInt(req.params.id, 10);
            const currentUserId = req.user.id;
    
            // Check if the user is trying to unfollow themselves
            if (userIdToUnfollow === currentUserId) {
                return res.status(400).json({ msg: 'You cannot unfollow yourself' });
            }
    
            // Find the user to unfollow
            const userToUnfollow = await User.findOne({ where: { id: userIdToUnfollow } });
            if (!userToUnfollow) {
                return res.status(400).json({ msg: 'User not found' });
            }
    
            // Check if the current user follows the target user
            const existingFollow = await UserFollowers.findOne({
                where: {
                    followingId: userIdToUnfollow,
                    followerId: currentUserId
                }
            });
            if (!existingFollow) {
                return res.status(400).json({ msg: 'You do not follow this user' });
            }
    
            // Remove the follow relationship
            await UserFollowers.destroy({
                where: {
                    followingId: userIdToUnfollow,
                    followerId: currentUserId
                }
            });
    
            res.json({ msg: 'Unfollow Success!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
    
    
    suggestionsUser: async (req, res) => {
        try {
            const followingIds = req.user.following.map(user => user.id);
            const users = await User.findAll({
                where: { id: { [Op.notIn]: [...followingIds, req.user.id] } },
                limit: req.query.num || 10,
                attributes: { exclude: ['password'] },
                order: Sequelize.literal('rand()'),
                include: [
                    { model: User, as: 'followers', attributes: { exclude: ['password'] } },
                    { model: User, as: 'following', attributes: { exclude: ['password'] } }
                ]
            });

            res.json({ users, result: users.length });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
};

module.exports = user;