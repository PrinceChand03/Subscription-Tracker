const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/mysql.js');
const User = require('./user.model.js');

const Subscription = sequelize.define('Subscription', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currency: {
        type: DataTypes.ENUM('USD', 'EUR'),
        defaultValue: 'EUR',
    },
    frequency: {
        type: DataTypes.ENUM('giornaliera', 'settimanale', 'mensile', 'annua'),
    },
    category: {
        type: DataTypes.ENUM(
            'entertainment',
            'technology',
            'finance',
            'music',
            'movies',
            'news',
            'sports',
            'lifestyle',
            'education',
            'kids',
            'other'
        ),
        allowNull: false,
    },

    paymentMethod: {
        type: DataTypes.ENUM('paypal', 'mastercard', 'esewa', 'khalti', 'ime pay'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'cancelled', 'expired'),
        defaultValue: 'active',
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    renewalDate: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
});

// Association
Subscription.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

module.exports = Subscription;