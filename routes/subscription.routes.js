import { Router } from 'express';
import {
  cancelSubscription, createSubscription, getAllSubscriptions, getSubscriptionDetails,
  getUpcomingRenewals, getUserSubscriptions, updateSubscription
} from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/:id', getSubscriptionDetails);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, updateSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);

export default subscriptionRouter;