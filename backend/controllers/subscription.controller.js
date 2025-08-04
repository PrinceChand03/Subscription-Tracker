const Subscription = require('../models/subscription.model');
const { Op } = require('sequelize');

// Create a subscription
const createSubscription = async(req, res, next) => {
    try {
        console.log('📦 Request body:', req.body);
        console.log('🔐 Authenticated user:', req.user);

        const subscription = await Subscription.create({
            ...req.body,
            userId: req.user.id, // check if this exists!
        });

        res.status(201).json({ success: true, data: subscription });
    } catch (e) {
        console.error('❌ Sequelize error:', e); // detailed error
        res.status(500).json({ message: e.message, error: e });
    }
};


// Get all subscriptions for a user
const getUserSubscriptions = async(req, res, next) => {
    try {
        if (req.user.id != req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.findAll({
            where: { userId: req.params.id },
        });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};

// Cancel a subscription (soft delete or status update)
const cancelSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        if (subscription.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        subscription.status = 'cancelled';
        await subscription.save();

        res.status(200).json({ success: true, message: 'Subscription cancelled' });
    } catch (e) {
        next(e);
    }
};

// Get all subscriptions (admin-level or general)
const getAllSubscriptions = async(req, res, next) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};

// Get subscriptions with future renewal dates
const getUpcomingRenewals = async(req, res, next) => {
    try {
        const now = new Date();
        const upcoming = await Subscription.findAll({
            where: {
                renewalDate: {
                    [Op.gte]: now
                },
            },
        });

        res.status(200).json({ success: true, data: upcoming });
    } catch (e) {
        next(e);
    }
};

// Get one subscription
const getSubscriptionDetails = async(req, res, next) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};

// Update subscription
const updateSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        if (subscription.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        Object.assign(subscription, req.body);
        await subscription.save();

        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};

// Delete subscription
const deleteSubscription = async(req, res, next) => {
    try {
        const rowsDeleted = await Subscription.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (rowsDeleted === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found or unauthorized',
            });
        }

        res.status(200).json({ success: true, message: 'Subscription deleted' });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    createSubscription,
    getUserSubscriptions,
    cancelSubscription,
    getAllSubscriptions,
    getUpcomingRenewals,
    getSubscriptionDetails,
    updateSubscription,
    deleteSubscription,
};