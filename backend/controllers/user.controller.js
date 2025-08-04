// Required modules
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// GET all users
const getUsers = async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
        });

        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// GET single user by ID
const getUser = async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// CREATE a new user
const createUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// UPDATE a user (only if it's the user's own profile)
const updateUser = async(req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.id !== req.user.id) {
            return res.status(403).json({ success: false, message: "You can only update your own profile" });
        }

        // Optional: If password is being updated, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.update(req.body);

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE a user (only own account)
const deleteUser = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.destroy();

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Exporting all functions using module.exports
module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};