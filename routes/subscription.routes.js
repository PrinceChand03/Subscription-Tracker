import { Router } from 'express';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send('GET all subscriptions'));

subscriptionRouter.get('/:id', (req, res) => res.send('GET subscription details'));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send('UPDATE subscription'));

subscriptionRouter.delete('/:id', (req, res) => res.send('DELETE subscription'));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send('CANCEL subscription'));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send('GET upcoming renewals'));

export default subscriptionRouter;