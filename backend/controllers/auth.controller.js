// Required modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';


// SIGN UP: Register a new user
const signUp = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields.",
            });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully ",
            username: newUser,
            data: {
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error.message,
        });
    }
};

// SIGN IN: Login existing user
const signIn = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password.",
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Sign-in failed",
            error: error.message,
        });
    }
};

// SIGN OUT: Log out user
const signOut = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            message: "Successfully logged out",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message,
        });
    }
};

// Exporting the functions
module.exports = {
    signUp,
    signIn,
    signOut,
};