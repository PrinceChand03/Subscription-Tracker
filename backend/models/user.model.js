const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/mysql.js');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: { msg: 'User Name is required' },
            notEmpty: { msg: 'User Name cannot be empty' },
            len: {
                args: [2, 50],
                msg: 'User Name must be between 2 and 50 characters',
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'This email is already registered',
        },
        validate: {
            notNull: { msg: 'User Email is required' },
            isEmail: { msg: 'Please enter a valid email address' },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'User Password is required' },
            len: {
                args: [6],
                msg: 'Password must be at least 6 characters long',
            },
        },
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;