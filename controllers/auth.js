
const db = require('../models');
const User = db.User;
const UserPassword = db.UserPassword;
const bcrypt = require('bcryptjs'); // Updated to bcryptjs
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

function imageToBase64(filePath) {
    // Read the image file as a Buffer
    const buffer = fs.readFileSync(filePath);

    // Convert the buffer to a Base64 string
    const base64String = buffer.toString('base64');

    return base64String;
}

const auth = {
    register: async (req, res) => {
        try {
            const fullName = req.body.fullName;
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const gender = req.body.gender;

            // Assuming req.files is an array of file paths
            const imagePaths = req.files.map(file => file.path);
            const basePath = __dirname; // Assuming your script resides in the base directory
            
            const relativeImagePaths = imagePaths.map(filePath => {
                const relativePath = path.relative(basePath, filePath);
                return relativePath.startsWith('..') ? filePath : relativePath;
            });

            // res.send(relativeImagePaths);
            const avatar = imageToBase64(relativeImagePaths[0]);
            

            let newUserName = username.toLowerCase().replace(/ /g, '');

            const existingUserName = await User.findOne({ where: { username: newUserName } });

            if (existingUserName) return res.status(400).json({ msg: 'This username already exists.' });

            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) return res.status(400).json({ msg: 'This email already exists.' });

            if (password.length <= 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

            const passwordHash = password // await bcrypt.hash(password, 12);

            const newUser = await User.create({
                fullName,
                username: newUserName,
                email,
                gender,
                avatar
            });

            const store_Password = await UserPassword.create({
                userId: newUser.id,
                passwordHash: passwordHash
            })

            const accessToken = createAccessToken({ id: newUser.id });
            const refreshToken = createRefreshToken({ id: newUser.id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.json({
                msg: 'Registration Successful!',
                accessToken,
                user: {
                    fullName: newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    gender: newUser.gender,
                    avatar: newUser.avatar // Assuming you have an avatar field in your User model
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Server Error' });
        }
    },

    login: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ msg: 'This email does not exist.' });

            // console.log(user.username)
            const user_password = await UserPassword.findOne({ where: { userId: user.id } });
            // console.log(user_password.passwordHash)

            // const isMatch = await bcrypt.compare(password, user_password.passwordHash);
            const isMatch = (user_password.passwordHash == password);
            if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' });

            const accessToken = createAccessToken({ id: user.id });
            const refreshToken = createRefreshToken({ id: user.id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.json({
                msg: 'Login Successful!',
                accessToken,
                user: {
                    // id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    avatar: user.avatar // Assuming you have an avatar field in your User model
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Server Error' });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/api/refresh_token' });
            return res.json({ msg: 'Logged out!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Server Error' });
        }
    },

    generateAccessToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(400).json({ msg: 'Please log in first.' });

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) return res.status(400).json({ msg: 'Please log in first.' });

                const user = await User.findByPk(decoded.id);
                // console.log(decoded.id)
                if (!user) return res.status(400).json({ msg: 'User does not exist.' });

                const accessToken = createAccessToken({ id: decoded.id });

                res.json({
                    accessToken,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email,
                        gender: user.gender,
                        avatar: user.avatar // Assuming you have an avatar field in your User model
                    }
                });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Server Error' });
        }
    }
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = auth;
