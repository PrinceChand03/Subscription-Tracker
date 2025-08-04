const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/user.model');

// Middleware to authorize users via JWT
const authorize = async(req, res, next) => {
    try {
        let token;

        // Check if token exists in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Authenticated user:', req.user)

        // Look up user using Sequelize (MySQL)
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }, // Optional: exclude password
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid or expired token',
            error: error.message,
        });
    }
};

module.exports = authorize;