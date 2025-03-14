import { Router } from 'express';
import { cancelSubscription, createSubscription, getAllSubscriptions, getUpcomingRenewals, getUserSubscriptions } from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/:id', (req, res) => res.send('GET subscription details'));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send('UPDATE subscription'));

subscriptionRouter.delete('/:id', (req, res) => res.send('DELETE subscription'));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);

export default subscriptionRouter;