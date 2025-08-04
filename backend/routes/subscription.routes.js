const router = require('express').Router();

const {
    cancelSubscription,
    createSubscription,
    deleteSubscription,
    getAllSubscriptions,
    getSubscriptionDetails,
    getUpcomingRenewals,
    getUserSubscriptions,
    updateSubscription,
} = require('../controllers/subscription.controller');

const authorize = require('../middlewares/auth.middleware');

// 🔐 Auth-protected routes
router.get('/user/:id', authorize, getUserSubscriptions);
router.post('/', authorize, createSubscription);
router.put('/:id', authorize, updateSubscription);
router.delete('/:id', authorize, deleteSubscription);
router.put('/:id/cancel', authorize, cancelSubscription);


// 📅 Public routes
router.get('/upcoming-renewals', getUpcomingRenewals);
router.get('/', getAllSubscriptions);

// ❗️Place this last to avoid conflicting with /user/:id
router.get('/:id', getSubscriptionDetails);

module.exports = router;